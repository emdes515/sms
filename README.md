# Stowarzyszenie Młoda Siła - Landing Page

Nowoczesna strona internetowa dla Stowarzyszenia Młoda Siła zbudowana w Next.js 14 z TypeScript i
Tailwind CSS.

## 🚀 Funkcjonalności

- **Responsywny design** - optymalizacja dla wszystkich urządzeń
- **One-page layout** - płynne przewijanie między sekcjami
- **Nowoczesny UI** - wykorzystanie Tailwind CSS i Framer Motion
- **Formularz kontaktowy** - funkcjonalny formularz z walidacją
- **Smooth scrolling** - płynne przejścia między sekcjami
- **SEO friendly** - optymalizacja dla wyszukiwarek

## 📋 Sekcje strony

1. **Hero** - Główne hasło, statystyki, CTA
2. **O nas** - Misja, wartości, osiągnięcia
3. **Nasze działania** - Projekty i inicjatywy
4. **Dla kogo** - Grupy docelowe i korzyści
5. **Współpraca** - Partnerzy i możliwości współpracy
6. **Kontakt** - Formularz i dane kontaktowe

## 🛠️ Technologie

- **Next.js 14** - React framework z App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animacje
- **Lucide React** - Ikony
- **Responsive Design** - Mobile-first approach

## 🚀 Instalacja i uruchomienie

1. **Zainstaluj zależności:**

   ```bash
   npm install
   ```

2. **Uruchom serwer deweloperski:**

   ```bash
   npm run dev
   ```

3. **Otwórz w przeglądarce:**
   ```
   http://localhost:3000
   ```

## 📱 Responsywność

Strona jest w pełni responsywna i zoptymalizowana dla:

- 📱 Telefonów (320px+)
- 📱 Tabletów (768px+)
- 💻 Laptopów (1024px+)
- 🖥️ Desktopów (1280px+)

## 🎨 Personalizacja

### Kolory

Główne kolory można zmienić w `tailwind.config.js`:

- Primary: Niebieski (#0ea5e9)
- Secondary: Fioletowy (#d946ef)

### Treści

Wszystkie treści można łatwo edytować w komponentach:

- `components/Hero.tsx` - Sekcja główna
- `components/About.tsx` - O nas
- `components/Projects.tsx` - Projekty
- `components/Target.tsx` - Dla kogo
- `components/Partners.tsx` - Partnerzy
- `components/Contact.tsx` - Kontakt

## 📦 Build i deploy

```bash
# Build dla produkcji
npm run build

# Uruchom wersję produkcyjną
npm start
```

## 🔧 Konfiguracja

### SEO

Meta tagi można edytować w `app/layout.tsx`:

- Title
- Description
- Keywords

### Formularz kontaktowy

Formularz w `components/Contact.tsx` wymaga integracji z:

- Email service (np. EmailJS, SendGrid)
- Backend API
- Database

## 📄 Licencja

Projekt stworzony dla Stowarzyszenia Młoda Siła.

## 🤝 Wsparcie

W przypadku pytań lub problemów, skontaktuj się z zespołem deweloperskim.
