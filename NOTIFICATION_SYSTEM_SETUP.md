# System Powiadomień - Instrukcja Konfiguracji

## Przegląd Systemu

System powiadomień umożliwia automatyczne wysyłanie emaili do administratora gdy ktoś wyśle
wiadomość przez formularz kontaktowy. System składa się z:

1. **Panel administracyjny** - konfiguracja ustawień powiadomień
2. **API endpoint** - obsługa wysyłania wiadomości
3. **Serwis email** - wysyłanie powiadomień
4. **Baza danych** - przechowywanie wiadomości i ustawień

## Konfiguracja

### 1. Zmienne Środowiskowe

Dodaj następujące zmienne do pliku `.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@example.com
```

### 2. Konfiguracja Gmail (jeśli używasz Gmail)

1. Włącz 2FA na swoim koncie Gmail
2. Wygeneruj hasło aplikacji:
   - Idź do Ustawień Google → Bezpieczeństwo
   - Wybierz "Hasła aplikacji"
   - Wygeneruj nowe hasło dla aplikacji
   - Użyj tego hasła jako `SMTP_PASS`

### 3. Konfiguracja w Panelu Administratora

1. Zaloguj się do panelu administratora
2. Przejdź do sekcji "Powiadomienia" (`/admin/notifications`)
3. Skonfiguruj ustawienia:
   - **Włącz powiadomienia email** - zaznacz checkbox
   - **Email administratora** - wpisz adres email na który mają przychodzić powiadomienia
   - **Temat wiadomości** - dostosuj temat emaila
   - **Szablon wiadomości** - dostosuj treść emaila

### 4. Dostępne Zmienne w Szablonie

W szablonie wiadomości możesz używać następujących zmiennych:

- `{{name}}` - imię nadawcy
- `{{email}}` - email nadawcy
- `{{subject}}` - temat wiadomości
- `{{message}}` - treść wiadomości
- `{{date}}` - data wysłania

## Testowanie Systemu

### 1. Test Podstawowy

Uruchom skrypt testowy:

```bash
node test-notification-system.js
```

### 2. Test Ręczny

1. Otwórz stronę główną aplikacji
2. Przejdź do sekcji kontaktowej
3. Wypełnij i wyślij formularz kontaktowy
4. Sprawdź czy:
   - Wiadomość została zapisana w bazie danych (panel admin → Wiadomości)
   - Email powiadomienia został wysłany (sprawdź skrzynkę odbiorczą)

### 3. Sprawdzenie Logów

Sprawdź logi serwera w konsoli - powinny pojawić się komunikaty o:

- Zapisaniu wiadomości do bazy danych
- Wysłaniu emaila powiadomienia

## Rozwiązywanie Problemów

### Email nie jest wysyłany

1. **Sprawdź zmienne środowiskowe** - upewnij się, że wszystkie zmienne SMTP są poprawnie ustawione
2. **Sprawdź hasło aplikacji** - dla Gmail upewnij się, że używasz hasła aplikacji, nie zwykłego
   hasła
3. **Sprawdź ustawienia w panelu admin** - upewnij się, że powiadomienia są włączone i email
   administratora jest ustawiony
4. **Sprawdź logi** - w konsoli powinny pojawić się komunikaty o błędach

### Wiadomość nie jest zapisywana

1. **Sprawdź połączenie z bazą danych** - upewnij się, że MongoDB jest uruchomione
2. **Sprawdź API endpoint** - przetestuj `/api/public/contact` bezpośrednio
3. **Sprawdź logi** - w konsoli powinny pojawić się komunikaty o błędach

### Błędy w panelu administratora

1. **Sprawdź autoryzację** - upewnij się, że jesteś zalogowany jako administrator
2. **Sprawdź API endpoint** - przetestuj `/api/admin/notifications` bezpośrednio
3. **Sprawdź logi** - w konsoli powinny pojawić się komunikaty o błędach

## Struktura Plików

```
├── app/
│   ├── admin/
│   │   └── notifications/
│   │       └── page.tsx          # Panel konfiguracji powiadomień
│   └── api/
│       ├── admin/
│       │   └── notifications/
│       │       └── route.ts      # API dla ustawień powiadomień
│       └── public/
│           └── contact/
│               └── route.ts     # API dla formularza kontaktowego
├── lib/
│   ├── email.ts                  # Serwis wysyłania emaili
│   └── models/
│       └── PageData.ts          # Modele danych i funkcje bazy danych
└── components/
    └── Contact.tsx               # Komponent formularza kontaktowego
```

## Funkcje Systemu

### Automatyczne Powiadomienia

- Gdy ktoś wyśle wiadomość przez formularz kontaktowy, system automatycznie:
  1. Zapisuje wiadomość w bazie danych
  2. Wysyła email powiadomienia do administratora
  3. Wyświetla potwierdzenie użytkownikowi

### Zarządzanie Wiadomościami

- Wszystkie wiadomości są dostępne w panelu administratora (`/admin/messages`)
- Można oznaczać wiadomości jako przeczytane/odpowiedziane
- Można usuwać wiadomości

### Konfiguracja Powiadomień

- Włączanie/wyłączanie powiadomień
- Konfiguracja adresu email administratora
- Dostosowanie tematu i treści emaila
- Szablon z dynamicznymi zmiennymi
