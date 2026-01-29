# 🚀 Checklist Wdrożenia - Teacher Panel

**Subdomena:** systemocen.bieda.it  
**Serwer:** srv45.mikr.us (89.67.203.2)

## ✅ Przygotowanie (PRZED wdrożeniem)

- [ ] DNS dla systemocen.bieda.it wskazuje na 89.67.203.2
- [ ] Masz hasło do MySQL root
- [ ] Jesteś zalogowany na serwer jako root

## 📋 Kroki Wdrożenia

### 1️⃣ Upload plików konfiguracyjnych na serwer

```bash
# Z lokalnego komputera
scp ecosystem.config.js root@srv45.mikr.us:/root/systemocen/
scp nginx-config.conf root@srv45.mikr.us:/root/systemocen/
scp server-deployment-commands.sh root@srv45.mikr.us:/root/systemocen/
```

### 2️⃣ Na serwerze VPS - uruchom skrypt

```bash
# Zaloguj się na serwer
ssh root@srv45.mikr.us

# Przejdź do katalogu projektu
cd /root/systemocen

# Nadaj uprawnienia wykonywania
chmod +x server-deployment-commands.sh

# Uruchom skrypt
./server-deployment-commands.sh
```

### 3️⃣ Podczas wykonywania skryptu

Skrypt poprosi Cię o:

**A) Konfigurację bazy danych MySQL**

```sql
mysql -u root -p

CREATE DATABASE IF NOT EXISTS teacher_panel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'teacher_panel_user'@'localhost' IDENTIFIED BY 'BEZPIECZNE_HASŁO';
GRANT ALL PRIVILEGES ON teacher_panel_db.* TO 'teacher_panel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schematu
mysql -u teacher_panel_user -p teacher_panel_db < /root/systemocen/server/setup_database.sql
```

**B) Edycję pliku .env**

```bash
nano /root/systemocen/server/.env
```

Ustaw:
```env
DB_HOST=localhost
DB_USER=teacher_panel_user
DB_PASSWORD=[HASŁO_Z_PUNKTU_A]
DB_NAME=teacher_panel_db
DB_PORT=3306
JWT_SECRET=[WYGENERUJ_PONIŻSZĄ_KOMENDĄ]
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://systemocen.bieda.it
```

Generowanie JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Weryfikacja

Po zakończeniu skryptu:

```bash
# Sprawdź status
pm2 status
systemctl status nginx

# Sprawdź logi
pm2 logs teacher-panel-backend --lines 50
tail -f /var/log/nginx/systemocen_error.log
```

### 5️⃣ Test w przeglądarce

Otwórz: **http://systemocen.bieda.it**

## 🔧 Przydatne Komendy

```bash
# Backend
pm2 logs teacher-panel-backend    # Zobacz logi
pm2 restart teacher-panel-backend # Restart
pm2 stop teacher-panel-backend    # Stop
pm2 delete teacher-panel-backend  # Usuń z PM2

# nginx
systemctl status nginx
systemctl restart nginx
nginx -t  # Test konfiguracji

# Logi
tail -f /var/log/nginx/systemocen_error.log
tail -f /var/log/nginx/systemocen_access.log
tail -f /root/systemocen/logs/err.log
tail -f /root/systemocen/logs/out.log

# Testy lokalne
curl http://localhost:3001/
curl http://localhost/
```

## 🔄 Aktualizacja Aplikacji (Future)

```bash
cd /root/systemocen
git pull origin main
cd server && npm install && cd ..
npm install
npm run build
pm2 restart teacher-panel-backend
```

## ❗ Troubleshooting

### Backend nie startuje
```bash
pm2 logs teacher-panel-backend
# Sprawdź czy MySQL działa
systemctl status mysql
# Sprawdź czy port 3001 nie jest zajęty
netstat -tulpn | grep 3001
```

### Nginx zwraca 502 Bad Gateway
```bash
# Backend nie działa - sprawdź PM2
pm2 status
pm2 logs teacher-panel-backend
```

### Nie można połączyć z bazą
```bash
# Test połączenia
mysql -u teacher_panel_user -p teacher_panel_db
# Sprawdź czy dane w .env są poprawne
cat /root/systemocen/server/.env
```

---

**🎯 Po wykonaniu wszystkich kroków aplikacja powinna być dostępna pod adresem http://systemocen.bieda.it**
