#!/bin/bash
# Skrypt do wdrożenia aplikacji Teacher Panel na serwer VPS
# Wykonywać KROK PO KROKU, nie wszystko na raz!

echo "========================================="
echo "TEACHER PANEL - Deployment Script"
echo "Subdomena: systemocen.bieda.it"
echo "========================================="
echo ""

# KROK 1: Diagnoza serwera
echo "=== KROK 1: Diagnoza serwera ==="
echo "Node version:"
node --version
echo "NPM version:"
npm --version
echo "Nginx version:"
nginx -v
echo "MySQL version:"
mysql --version
echo "PM2 version:"
pm2 --version || echo "PM2 not installed - will install later"
echo ""

# KROK 2: Instalacja PM2 (jeśli potrzeba)
echo "=== KROK 2: Instalacja PM2 (jeśli potrzeba) ==="
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
else
    echo "PM2 already installed"
fi
echo ""

# KROK 3: Aktualizacja kodu
echo "=== KROK 3: Aktualizacja kodu z GitHub ==="
cd /root/systemocen
git pull origin main
echo ""

# KROK 4: Instalacja zależności
echo "=== KROK 4: Instalacja zależności ==="
echo "Installing backend dependencies..."
cd /root/systemocen/server
npm install

echo "Installing frontend dependencies..."
cd /root/systemocen
npm install
echo ""

# KROK 5: Build frontendu
echo "=== KROK 5: Build frontendu ==="
cd /root/systemocen
npm run build
echo ""

# KROK 6: Utworzenie katalogów
echo "=== KROK 6: Tworzenie katalogów ==="
mkdir -p /root/systemocen/logs
echo "Created logs directory"
echo ""

# KROK 7: Konfiguracja bazy danych
echo "=== KROK 7: Konfiguracja bazy danych ==="
echo "UWAGA: Musisz RĘCZNIE wykonać następujące kroki:"
echo ""
echo "1. Zaloguj się do MySQL:"
echo "   mysql -u root -p"
echo ""
echo "2. Wykonaj następujące komendy SQL:"
echo "   CREATE DATABASE IF NOT EXISTS teacher_panel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "   CREATE USER IF NOT EXISTS 'teacher_panel_user'@'localhost' IDENTIFIED BY 'TWOJE_BEZPIECZNE_HASŁO';"
echo "   GRANT ALL PRIVILEGES ON teacher_panel_db.* TO 'teacher_panel_user'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo "   EXIT;"
echo ""
echo "3. Zaimportuj schemat:"
echo "   mysql -u teacher_panel_user -p teacher_panel_db < /root/systemocen/server/setup_database.sql"
echo ""
echo "Naciśnij Enter gdy zakończysz konfigurację bazy danych..."
read -p ""

# KROK 8: Konfiguracja .env
echo "=== KROK 8: Konfiguracja .env ==="
echo "UWAGA: Musisz RĘCZNIE edytować plik .env w katalogu server/"
echo ""
echo "Edytuj plik:"
echo "   nano /root/systemocen/server/.env"
echo ""
echo "Ustaw następujące wartości:"
echo "   DB_HOST=localhost"
echo "   DB_USER=teacher_panel_user"
echo "   DB_PASSWORD=TWOJE_HASŁO_Z_KROKU_7"
echo "   DB_NAME=teacher_panel_db"
echo "   DB_PORT=3306"
echo "   JWT_SECRET=WYGENERUJ_LOSOWY_STRING_32_ZNAKI"
echo "   PORT=3001"
echo "   NODE_ENV=production"
echo "   CORS_ORIGIN=http://systemocen.bieda.it"
echo ""
echo "Aby wygenerować JWT_SECRET, użyj:"
echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo ""
echo "Naciśnij Enter gdy zakończysz edycję .env..."
read -p ""

# KROK 9: Uruchomienie backendu przez PM2
echo "=== KROK 9: Uruchomienie backendu ==="
cd /root/systemocen
pm2 start ecosystem.config.js
pm2 save
echo ""
echo "Wykonaj komendę którą zwróci poniższe polecenie (jeśli jeszcze nie wykonałeś):"
pm2 startup
echo ""

# KROK 10: Konfiguracja nginx
echo "=== KROK 10: Konfiguracja nginx ==="
echo "Kopiowanie pliku konfiguracyjnego..."
cp /root/systemocen/nginx-config.conf /etc/nginx/sites-available/systemocen.bieda.it

echo "Tworzenie symlinka..."
ln -sf /etc/nginx/sites-available/systemocen.bieda.it /etc/nginx/sites-enabled/

echo "Usuwanie domyślnej konfiguracji..."
rm -f /etc/nginx/sites-enabled/default

echo "Test konfiguracji nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Konfiguracja OK - restart nginx..."
    systemctl restart nginx
else
    echo "BŁĄD w konfiguracji nginx - sprawdź logi!"
fi
echo ""

# KROK 11: Weryfikacja
echo "=== KROK 11: Weryfikacja ==="
echo "Status PM2:"
pm2 status
echo ""
echo "Status nginx:"
systemctl status nginx --no-pager
echo ""
echo "Test lokalny backendu:"
curl http://localhost:3001/ || echo "Backend nie odpowiada!"
echo ""
echo "Test lokalny frontendu:"
curl -I http://localhost || echo "Frontend nie odpowiada!"
echo ""

echo "========================================="
echo "DEPLOYMENT COMPLETED!"
echo "========================================="
echo ""
echo "Sprawdź aplikację w przeglądarce:"
echo "http://systemocen.bieda.it"
echo ""
echo "Przydatne komendy:"
echo "  pm2 logs teacher-panel-backend    # Logi backendu"
echo "  pm2 restart teacher-panel-backend # Restart backendu"
echo "  tail -f /var/log/nginx/systemocen_error.log  # Logi nginx"
echo ""
