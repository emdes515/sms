import { useState } from 'react';
import { useNotifications } from './NotificationSystem';

interface UseAdminSaveOptions {
	onSave: () => Promise<void>;
	disabled?: boolean;
}

export const useAdminSave = ({ onSave, disabled = false }: UseAdminSaveOptions) => {
	const [saving, setSaving] = useState(false);
	const { addNotification } = useNotifications();

	const handleSave = async () => {
		if (disabled || saving) return;

		setSaving(true);
		try {
			await onSave();
			addNotification({
				type: 'success',
				title: 'Zapisano!',
				message: 'Zmiany zostały pomyślnie zapisane',
				duration: 3000,
			});
		} catch (error) {
			addNotification({
				type: 'error',
				title: 'Błąd zapisu',
				message: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania',
				duration: 5000,
			});
		} finally {
			setSaving(false);
		}
	};

	return {
		saving,
		handleSave,
	};
};

