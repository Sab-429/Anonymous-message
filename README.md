
<img width="1210" height="626" alt="workflow" src="https://github.com/user-attachments/assets/9a608fff-c6a2-4418-b3ae-79a95cd2e6f9" />

## 📦 Tech Stack

### Development

* Next.js (App Router)
* TypeScript
* NextAuth.js
* Resend Email API
* MongoDB Atlas
* Docker & Docker Compose

### Deployment

* AWS EC2 (Ubuntu 22.04)
* Nginx (Reverse Proxy)
* Cloudflare DNS
* Let's Encrypt SSL (Certbot)
* GitHub (SSH authentication)

---

## 1️⃣ Launch EC2 Instance

* OS: **Ubuntu latest(24.04)**
* Instance: ** t3.micro** (free tier)
* Security Group:

  * SSH → `22` 
  * HTTP → `80` 
  * HTTPS → `443`
 all 3 ports can be accesed from anywhere
---

## 2️⃣ Connect to EC2 (Windows – Git Bash)

```bash
cd /c/Users/YourName/path-to-key
chmod 400 key.pem
ssh -i key.pem ubuntu@EC2_PUBLIC_IP
```

---

## 3️⃣ Update System & Install Essentials

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip
```

---

## 4️⃣ Install Docker

```bash
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker
```

Verify:

```bash
docker --version
```

---

## 5️⃣ Install Docker Compose

```bash
sudo apt install docker-compose -y
docker-compose --version
```

---

## 6️⃣ Clone Project from GitHub (SSH)

Generate key:

```bash
ssh-keygen -t ed25519 -C "ec2-deploy"
cat ~/.ssh/id_ed25519.pub
```

➡ Add the key to **GitHub → Settings → SSH Keys**

Clone repo:

```bash
mkdir ~/apps && cd ~/apps
git clone git@github.com:USERNAME/REPOSITORY.git
cd REPOSITORY
```

---

## 7️⃣ Environment Variables Setup

Create `.env`:

```bash
nano .env
```

```env
NODE_ENV=production
NEXTAUTH_URL=https://subdomain.yourdomain.com
DATABASE_URL=###############################
```

Save: **CTRL + O → Enter → CTRL + X**

---

## 8️⃣ Docker Compose Configuration

```yaml
services:
  app:
    build: .
    container_name: project_app
    env_file:
      - .env
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Build & run:

```bash
docker-compose build
docker-compose up -d
```

Check:

```bash
docker ps
```

---

## 9️⃣ Install & Configure Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

Create config:

```bash
sudo nano /etc/nginx/sites-available/yourapp
```

```nginx
server {
    listen 80;
    server_name subdomain.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/yourapp /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔟 Cloudflare DNS Setup

Add record:

```
Type: A
Name: subdomain
Value: EC2_PUBLIC_IP
Proxy: ON
TTL: Auto
```

Verify:

```bash
ping subdomain.yourdomain.com
```

---

## 1️⃣1️⃣ SSL Setup (Let's Encrypt)

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Generate certificate:

```bash
sudo certbot --nginx -d subdomain.yourdomain.com
```

Auto‑renew test:

```bash
sudo certbot renew --dry-run
```

---

## 1️⃣2️⃣ MongoDB Atlas Security

Replace:

```
0.0.0.0/0
```

With:

```
EC2_PUBLIC_IP/32
```

✔ Improves security

---

## 1️⃣3️⃣ Health & Memory Checks

```bash
free -h
docker stats
df -h
```

---

## ✅ Final Checklist

* HTTPS enabled
* HTTP → HTTPS redirect
* Containers healthy
* MongoDB connected
* Nginx active
* Certbot auto‑renew enabled
* Cloudflare resolving correctly

---
