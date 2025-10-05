# System Powiadomień i Przycisku Zapisz - Panel Administratora

## Przegląd

System został zaktualizowany o:

1. **System powiadomień** - powiadomienia wyskakujące z prawej strony z dołu
2. **Stały przycisk zapisz** - przycisk zawsze widoczny w prawym górnym rogu

## Komponenty

### 1. NotificationSystem.tsx

- Główny system powiadomień z kontekstem React
- Obsługuje różne typy powiadomień: success, error, warning, info
- Automatyczne zamykanie po określonym czasie
- Animacje wjazdu/wyjazdu

### 2. FixedSaveButton.tsx

- Stały przycisk zapisz w prawym górnym rogu
- Automatyczne powiadomienia o sukcesie/błędzie
- Animacje i stany ładowania
- Responsywny design

### 3. useAdminSave.ts

- Hook pomocniczy do łatwej integracji
- Automatyczne zarządzanie stanem zapisywania
- Integracja z systemem powiadomień

## Jak używać w nowych stronach admin

### Podstawowa integracja:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { FixedSaveButton } from '@/components/FixedSaveButton';
import { useNotifications } from '@/components/NotificationSystem';

export default function MyAdminPage() {
	const [data, setData] = useState(null);
	const [saving, setSaving] = useState(false);
	const { addNotification } = useNotifications();

	const handleSave = async () => {
		if (!data) return;

		setSaving(true);
		try {
			const response = await fetch('/api/admin/my-endpoint', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Błąd podczas zapisywania');
			}
		} catch (error) {
			throw error; // FixedSaveButton obsłuży powiadomienie o błędzie
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			{/* Twoja zawartość */}

			{/* Stały przycisk zapisz */}
			<FixedSaveButton
				onSave={handleSave}
				disabled={!data}
				saving={saving}
			/>
		</div>
	);
}
```

### Używanie hooka useAdminSave:

```tsx
import { useAdminSave } from '@/components/useAdminSave';

export default function MyAdminPage() {
	const [data, setData] = useState(null);

	const { saving, handleSave } = useAdminSave({
		onSave: async () => {
			// Twoja logika zapisywania
			const response = await fetch('/api/admin/my-endpoint', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Błąd podczas zapisywania');
			}
		},
		disabled: !data,
	});

	return (
		<div>
			{/* Twoja zawartość */}

			<FixedSaveButton
				onSave={handleSave}
				disabled={!data}
				saving={saving}
			/>
		</div>
	);
}
```

## Ręczne dodawanie powiadomień

```tsx
import { useNotifications } from '@/components/NotificationSystem';

const { addNotification } = useNotifications();

// Powiadomienie o sukcesie
addNotification({
	type: 'success',
	title: 'Sukces!',
	message: 'Operacja zakończona pomyślnie',
	duration: 3000,
});

// Powiadomienie o błędzie
addNotification({
	type: 'error',
	title: 'Błąd',
	message: 'Wystąpił błąd podczas operacji',
	duration: 5000,
});

// Powiadomienie informacyjne
addNotification({
	type: 'info',
	title: 'Informacja',
	message: 'To jest powiadomienie informacyjne',
});

// Ostrzeżenie
addNotification({
	type: 'warning',
	title: 'Uwaga',
	message: 'To jest ostrzeżenie',
});
```

## Zaktualizowane strony

Następujące strony zostały już zaktualizowane:

- `/admin/about` - Edycja sekcji "O nas"
- `/admin/hero` - Edytor tekstu głównego
- `/admin/contact` - Edycja sekcji "Kontakt"
- `/admin/target` - Edycja sekcji "Dla kogo"

## Funkcje

### System powiadomień:

- ✅ Powiadomienia z prawej strony z dołu
- ✅ 4 typy: success, error, warning, info
- ✅ Automatyczne zamykanie
- ✅ Animacje wjazdu/wyjazdu
- ✅ Możliwość ręcznego zamknięcia
- ✅ Responsywny design

### Stały przycisk zapisz:

- ✅ Zawsze widoczny w prawym górnym rogu
- ✅ Automatyczne powiadomienia o sukcesie/błędzie
- ✅ Animacje ładowania
- ✅ Stany disabled/saving
- ✅ Responsywny design

## Uwagi techniczne

- System używa React Context do zarządzania stanem
- Powiadomienia są automatycznie usuwane po określonym czasie
- Przycisk zapisz jest pozycjonowany fixed, więc nie przeszkadza w scrollowaniu
- Wszystkie komponenty są w pełni responsywne
- System jest zintegrowany z istniejącym designem Tailwind CSS

