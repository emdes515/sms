# Emoji Picker - Przewodnik

## Przegląd

Emoji Picker to komponent React, który umożliwia łatwe wybieranie emoji w systemie admin. Zastąpił
tradycyjne pola tekstowe w miejscach, gdzie używane są emoji.

## Funkcje

### ✅ **Główne funkcje:**

- **5 kategorii emoji**: Ludzie, Przedmioty, Aktywności, Symbole, Natura
- **Responsywny design**: Dostosowuje się do różnych rozmiarów ekranu
- **Łatwe w użyciu**: Kliknij aby wybrać emoji
- **Integracja z formularzami**: Automatyczne aktualizowanie wartości
- **Animacje**: Płynne przejścia i hover effects
- **Dostępność**: Wsparcie dla screen readerów

## Gdzie jest używany

### 1. **Strona "O nas" (`/admin/about`)**

- **Avatar członków zarządu**: Zastąpiono ImageUpload emoji pickerem
- **Lokalizacja**: Sekcja zarządu → Avatar (emoji)

### 2. **Strona "Projekty" (`/admin/projects`)**

- **Ikona projektu**: Zastąpiono pole tekstowe emoji pickerem
- **Lokalizacja**: Formularz dodawania/edycji projektu → Ikona (emoji)

### 3. **Strona "Dla kogo" (`/admin/target`)**

- **Ikona grup docelowych**: Zastąpiono select emoji pickerem
- **Ikona ogólnych korzyści**: Zastąpiono select emoji pickerem
- **Lokalizacja**:
  - Grupy docelowe → Ikona (emoji)
  - Ogólne korzyści → Ikona (emoji)

## Jak używać

### Podstawowe użycie:

```tsx
import { EmojiPicker } from '@/components/EmojiPicker';

const MyComponent = () => {
	const [selectedEmoji, setSelectedEmoji] = useState('😀');

	return (
		<EmojiPicker
			onEmojiSelect={(emoji) => setSelectedEmoji(emoji)}
			selectedEmoji={selectedEmoji}
			className="w-full"
		/>
	);
};
```

### W formularzu:

```tsx
<EmojiPicker
	onEmojiSelect={(emoji) => setFormData({ ...formData, icon: emoji })}
	selectedEmoji={formData.icon}
	className="w-full"
/>
```

## Kategorie emoji

### 👥 **Ludzie**

- Emoji twarzy i emocji
- Różne typy ludzi
- Zawody i role
- Przykłady: 😀 👨‍💼 👩‍💼 👶 👴

### 🎒 **Przedmioty**

- Ubrania i akcesoria
- Przedmioty codziennego użytku
- Przykłady: 💼 🎒 👓 🕶️ 💍

### ⚽ **Aktywności**

- Sport i rekreacja
- Hobby i zainteresowania
- Przykłady: ⚽ 🏀 🎾 🏓 🎯

### ❤️ **Symbole**

- Serca i emocje
- Znaki i symbole
- Przykłady: ❤️ 💙 ⭐ ✨ 🎉

### 🌱 **Natura**

- Rośliny i kwiaty
- Elementy natury
- Przykłady: 🌱 🌿 🌳 🌸 🌺

## Właściwości komponentu

```tsx
interface EmojiPickerProps {
	onEmojiSelect: (emoji: string) => void; // Callback po wyborze emoji
	selectedEmoji?: string; // Aktualnie wybrane emoji
	className?: string; // Dodatkowe klasy CSS
}
```

## Stylowanie

Komponent używa Tailwind CSS i można go stylować przez:

- **className**: Dodatkowe klasy CSS
- **Responsywność**: Automatycznie dostosowuje się do ekranu
- **Kolory**: Używa kolorów z systemu designu

## Dostępność

- **ARIA labels**: Każdy emoji ma opisowy label
- **Keyboard navigation**: Obsługa klawiatury
- **Screen readers**: Wsparcie dla czytników ekranu
- **Focus management**: Prawidłowe zarządzanie fokusem

## Przykłady użycia w systemie

### 1. **Avatar członka zarządu:**

```tsx
<EmojiPicker
	onEmojiSelect={(emoji) => {
		const newMembers = [...members];
		newMembers[index] = { ...member, image: emoji };
		updateField('management.members', newMembers);
	}}
	selectedEmoji={member.image}
	className="w-full"
/>
```

### 2. **Ikona projektu:**

```tsx
<EmojiPicker
	onEmojiSelect={(emoji) => setFormData({ ...formData, icon: emoji })}
	selectedEmoji={formData.icon}
	className="w-full"
/>
```

### 3. **Ikona grupy docelowej:**

```tsx
<EmojiPicker
	onEmojiSelect={(emoji) => {
		const newGroups = [...targetGroups];
		newGroups[index] = { ...group, icon: emoji };
		updateField('targetGroups', newGroups);
	}}
	selectedEmoji={group.icon}
	className="w-full"
/>
```

## Zalety emoji picker

### ✅ **Dla użytkowników:**

- **Łatwość użycia**: Nie trzeba pamiętać kodów emoji
- **Wizualny wybór**: Widać wszystkie dostępne opcje
- **Kategoryzacja**: Łatwe znajdowanie odpowiedniego emoji
- **Szybkość**: Szybki wybór bez wpisywania

### ✅ **Dla deweloperów:**

- **Reużywalność**: Jeden komponent dla całego systemu
- **Spójność**: Jednolite doświadczenie użytkownika
- **Łatwość integracji**: Prosty API
- **Responsywność**: Działa na wszystkich urządzeniach

## Przyszłe rozszerzenia

- **Więcej kategorii**: Dodanie nowych kategorii emoji
- **Wyszukiwanie**: Możliwość wyszukiwania emoji po nazwie
- **Ulubione**: Zapisywanie często używanych emoji
- **Historia**: Ostatnio używane emoji
- **Custom emoji**: Obsługa własnych emoji

## Uwagi techniczne

- **Performance**: Emoji są ładowane na żądanie
- **Memory**: Optymalizacja pamięci dla dużych list emoji
- **Accessibility**: Pełne wsparcie dla dostępności
- **Cross-browser**: Działa we wszystkich nowoczesnych przeglądarkach

