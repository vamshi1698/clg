#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <db_backup_file.sql.gz> <uploads_backup_file.tar.gz>"
    echo "Example: $0 /opt/college/backups/db_backup_20231024.sql.gz /opt/college/backups/uploads_backup_20231024.tar.gz"
    exit 1
fi

DB_BACKUP=$1
UPLOADS_BACKUP=$2

echo "⚠️ WARNING: This will overwrite current database and uploads!"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo "🛑 Stopping web container..."
docker-compose stop web

echo "♻️ Restoring database..."
# Drop and recreate database to ensure clean slate
docker exec college_db dropdb -U college_user college_db || true
docker exec college_db createdb -U college_user college_db
gunzip -c "$DB_BACKUP" | docker exec -i college_db psql -U college_user -d college_db

echo "♻️ Restoring uploads..."
# Remove current uploads and extract backup
rm -rf /opt/college/uploads/*
tar -xzf "$UPLOADS_BACKUP" -C /opt/college

echo "🚀 Restarting web container..."
docker-compose start web

echo "✅ Restore completed successfully!"
