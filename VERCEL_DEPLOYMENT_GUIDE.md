# Przewodnik wdrażania na Vercel

## Wymagania wstępne

1. **Konto Vercel** - Zarejestruj się na [vercel.com](https://vercel.com)
2. **Konto MongoDB Atlas** - Utwórz darmowe konto na [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Konto Gmail** - Do wysyłania emaili (lub inny dostawca SMTP)

## Krok 1: Przygotowanie bazy danych MongoDB

1. Zaloguj się do MongoDB Atlas
2. Utwórz nowy cluster (wybierz darmową opcję M0)
3. Skonfiguruj dostęp do bazy danych:
   - Dodaj swój adres IP do whitelist
   - Utwórz użytkownika bazy danych
4. Skopiuj connection string - będzie wyglądać tak:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Krok 2: Konfiguracja Gmail (SMTP)

1. Włącz 2FA na swoim koncie Gmail
2. Wygeneruj App Password:
   - Idź do Ustawienia Google → Bezpieczeństwo
   - Wybierz "Hasła aplikacji"
   - Wygeneruj hasło dla "Poczta"
3. Zapisz wygenerowane hasło

## Krok 3: Wdrożenie na Vercel

### Opcja A: Wdrożenie przez GitHub (Zalecane)

1. **Przygotuj repozytorium GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Połącz z Vercel:**
   - Idź na [vercel.com/dashboard](https://vercel.com/dashboard)
   - Kliknij "New Project"
   - Wybierz swoje repozytorium GitHub
   - Kliknij "Import"

### Opcja B: Wdrożenie przez Vercel CLI

1. **Zainstaluj Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Zaloguj się do Vercel:**

   ```bash
   vercel login
   ```

3. **Wdróż projekt:**
   ```bash
   vercel
   ```

## Krok 4: Konfiguracja zmiennych środowiskowych

W dashboard Vercel, przejdź do Settings → Environment Variables i dodaj:

### Wymagane zmienne:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/stowarzyszenie_mloda_sila?retryWrites=true&w=majority
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
SMTP_FROM = your-email@gmail.com
ADMIN_EMAIL = admin@example.com
NEXTAUTH_URL = https://your-domain.vercel.app
NEXTAUTH_SECRET = your-secret-key-here
```

### Generowanie NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

## Krok 5: Inicjalizacja bazy danych

Po wdrożeniu, musisz zainicjalizować bazę danych:

1. **Lokalnie (przed wdrożeniem):**

   ```bash
   npm run init-db
   ```

2. **Lub przez Vercel Functions:**
   - Utwórz endpoint `/api/init-db` do inicjalizacji

## Krok 6: Konfiguracja domeny (opcjonalnie)

1. W Vercel Dashboard → Settings → Domains
2. Dodaj swoją domenę
3. Skonfiguruj DNS u swojego dostawcy

## Krok 7: Testowanie

1. Sprawdź czy strona się ładuje
2. Przetestuj formularz kontaktowy
3. Sprawdź panel administracyjny
4. Przetestuj upload obrazów

## Rozwiązywanie problemów

### Błąd połączenia z MongoDB:

- Sprawdź MONGODB_URI
- Upewnij się, że IP Vercel jest w whitelist MongoDB Atlas
- Dodaj `0.0.0.0/0` do whitelist (mniej bezpieczne, ale działa)

### Błąd wysyłania emaili:

- Sprawdź SMTP credentials
- Upewnij się, że używasz App Password, nie zwykłego hasła
- Sprawdź czy 2FA jest włączone

### Błąd build:

- Sprawdź czy wszystkie dependencies są w package.json
- Upewnij się, że nie ma błędów TypeScript
- Sprawdź logi w Vercel Dashboard

## Optymalizacje

1. **Obrazy:** Użyj Next.js Image component
2. **Caching:** Skonfiguruj odpowiednie nagłówki cache
3. **CDN:** Vercel automatycznie używa globalnego CDN
4. **Monitoring:** Użyj Vercel Analytics

## Bezpieczeństwo

1. **Zmienne środowiskowe:** Nigdy nie commituj .env.local
2. **MongoDB:** Użyj silnych haseł i ogranicz dostęp
3. **SMTP:** Użyj App Passwords zamiast głównego hasła
4. **HTTPS:** Vercel automatycznie zapewnia HTTPS

## Monitoring i logi

- **Vercel Dashboard:** Sprawdź logi deployment
- **Function Logs:** Sprawdź logi API routes
- **MongoDB Atlas:** Monitoruj połączenia i wydajność

## Aktualizacje

Po zmianach w kodzie:

```bash
git add .
git commit -m "Update"
git push
```

Vercel automatycznie wdroży nową wersję.

## Kontakt i wsparcie

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
