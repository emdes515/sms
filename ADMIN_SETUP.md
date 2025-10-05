# Panel Administratora - Instrukcja Konfiguracji

## Opis

Panel administratora umożliwia zarządzanie treścią strony internetowej Stowarzyszenia Młoda Siła.
Panel jest chroniony 11-cyfrowym PIN-em i umożliwia edycję wszystkich treści wyświetlanych na
stronie.

## Funkcjonalności

### 🔐 Logowanie

- **URL**: `/admin/login`
- **PIN**: 11-cyfrowy kod dostępu
- **Domyślny PIN**: `12345678901`
- **Sesja**: 24 godziny

### 📝 Edycja treści

- **Tekst główny (Hero)**: Edycja tytułu, podtytułu, przycisków i statystyk
- **Projekty**: Dodawanie, edycja i usuwanie projektów
- **Wydarzenia**: Zarządzanie wydarzeniami
- **Partnerzy**: Zarządzanie partnerami
- **Wiadomości**: Przeglądanie wiadomości kontaktowych

## Konfiguracja

### 1. Zmienne środowiskowe

Utwórz plik `.env.local` w głównym katalogu projektu:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/stowarzyszenie_mloda_sila

# Admin Panel Configuration
ADMIN_PIN=12345678901

# Next.js Configuration
NODE_ENV=development
```

### 2. Zmiana PIN-u administratora

Aby zmienić PIN administratora, ustaw zmienną środowiskową `ADMIN_PIN`:

```env
ADMIN_PIN=twoj_nowy_pin_11_cyfr
```

**Ważne**: PIN musi składać się z dokładnie 11 cyfr.

### 3. Inicjalizacja bazy danych

Uruchom skrypt inicjalizacji bazy danych:

```bash
npm run init-db
```

## Dostęp do panelu

1. Przejdź na adres: `http://localhost:3000/admin/login`
2. Wprowadź 11-cyfrowy PIN
3. Zostaniesz przekierowany do panelu administratora

## Struktura panelu

### Dashboard (`/admin`)

- Przegląd statystyk
- Szybkie akcje
- Ostatnie aktywności

### Edycja tekstu głównego (`/admin/hero`)

- Tytuł główny
- Podświetlony tekst
- Podtytuł
- Teksty przycisków
- Statystyki (członkowie, projekty, godziny wolontariatu)

### Zarządzanie projektami (`/admin/projects`)

- Dodawanie nowych projektów
- Edycja istniejących projektów
- Usuwanie projektów
- Aktywacja/deaktywacja projektów

### Zarządzanie wydarzeniami (`/admin/events`)

- Dodawanie nowych wydarzeń
- Edycja istniejących wydarzeń
- Usuwanie wydarzeń
- Aktywacja/deaktywacja wydarzeń

### Zarządzanie partnerami (`/admin/partners`)

- Dodawanie nowych partnerów
- Edycja istniejących partnerów
- Usuwanie partnerów
- Aktywacja/deaktywacja partnerów

### Zarządzanie wiadomościami (`/admin/messages`)

- Przeglądanie wiadomości kontaktowych
- Zmiana statusu wiadomości (nowa/przeczytana/odpowiedziana)
- Usuwanie wiadomości

## Bezpieczeństwo

- Panel jest chroniony middleware'em
- Sesja administratora jest przechowywana w bezpiecznym cookie
- Wszystkie API routes są chronione
- PIN jest weryfikowany po stronie serwera

## Rozwiązywanie problemów

### Problem z logowaniem

1. Sprawdź czy zmienna `ADMIN_PIN` jest ustawiona
2. Upewnij się, że PIN ma dokładnie 11 cyfr
3. Sprawdź czy baza danych jest dostępna

### Problem z bazą danych

1. Upewnij się, że MongoDB jest uruchomione
2. Sprawdź połączenie w zmiennej `MONGODB_URI`
3. Uruchom ponownie skrypt inicjalizacji: `npm run init-db`

### Problem z sesją

1. Wyczyść cookies w przeglądarce
2. Sprawdź czy cookie `admin-session` jest ustawione
3. Spróbuj wylogować się i zalogować ponownie

## Wsparcie

W przypadku problemów z panelem administratora, skontaktuj się z zespołem technicznym.

