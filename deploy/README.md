# Deployment Instructions

Follow these steps to deploy your Next.js application to your Ubuntu VPS.

## 1. Local Build and Transfer

### Build the Docker Image
In your project root (on your local machine), build the Next.js Docker image:
```bash
docker build -t college-app:latest .
```

### Save the Image to a Tarball
Save the image to a file so it can be transferred:
```bash
docker save -o college-app.tar college-app:latest
```

### Transfer Files to VPS
Copy the required files to your VPS using `scp`:
```bash
scp -r deploy/ college-app.tar user@your-vps-ip:/opt/college/
```

*(Note: Ensure the target directory `/opt/college` exists and your user has write permissions, or use a temp directory and move them on the VPS).*

## 2. VPS Initial Setup

SSH into your VPS and perform the initial setup:
```bash
ssh user@your-vps-ip
```

### Folder Structure
Ensure the folder structure is in place:
```bash
sudo mkdir -p /opt/college/uploads
sudo mkdir -p /opt/college/backups
sudo chown -R $USER:$USER /opt/college
```

### Firewall (UFW) Configuration
Only expose standard HTTP/HTTPS ports and SSH.
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
# Ensure port 3000 is NOT exposed publicly (or only locally)
sudo ufw enable
```

### Environment Variables
Copy `.env.example` to `.env` in the `/opt/college` directory and fill in your secrets.
```bash
cp /opt/college/.env.example /opt/college/.env
nano /opt/college/.env
```

## 3. Starting the Application

Once your `.env` is configured and `college-app.tar` is inside `/opt/college`:
```bash
cd /opt/college
bash deploy.sh
```
This script will load your docker image, stop any old containers gracefully, bring up the new ones via `docker-compose.yml`, and clean up old images.

## 4. Nginx Reverse Proxy Setup

Nginx will run natively on your VPS to proxy requests to Docker (localhost:3000) and handle SSL.

1. Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

2. Copy the configuration:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/college
sudo ln -s /etc/nginx/sites-available/college /etc/nginx/sites-enabled/
```

3. Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 5. SSL / Let's Encrypt

Install Certbot for Nginx:
```bash
sudo apt install certbot python3-certbot-nginx
```

Obtain a certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

*Note: Certbot will automatically modify your Nginx configuration to add the SSL certificates. Make sure you comment/uncomment the relevant sections in `nginx.conf` if you're configuring it manually.*

## 6. Scripts Overview

- `deploy.sh`: Use this every time you upload a new `college-app.tar` to update your application with zero data loss.
- `backup.sh`: Run this (or set it in a cron job) to backup PostgreSQL and the `/opt/college/uploads` directory to `/opt/college/backups`.
- `restore.sh`: Use this if you need to restore your DB and uploads from a previous backup tarball.

**Example Backup Cron Job:**
```bash
# Run daily at 2 AM
0 2 * * * /opt/college/backup.sh >> /opt/college/backup.log 2>&1
```
