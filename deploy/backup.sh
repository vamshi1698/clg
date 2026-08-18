#!/bin/bash
set -e

BACKUP_DIR="/opt/college/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p "$BACKUP_DIR"

echo "💾 Starting database backup..."
docker exec college_db pg_dump -U college_user college_db | gzip > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

echo "📁 Starting uploads backup..."
tar -czf "$BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz" -C /opt/college uploads/

# Optional: Keep only the last 7 backups to save space
ls -tp "$BACKUP_DIR"/db_backup_*.sql.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {} || true
ls -tp "$BACKUP_DIR"/uploads_backup_*.tar.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {} || true

echo "✅ Backup completed successfully!"
