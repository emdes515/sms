'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Check } from 'lucide-react';
import { useNotifications } from './NotificationSystem';

interface FixedSaveButtonProps {
	onSave: () => Promise<void>;
	disabled?: boolean;
	saving?: boolean;
	className?: string;
}

export const FixedSaveButton = ({
	onSave,
	disabled = false,
	saving = false,
	className = '',
}: FixedSaveButtonProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const { addNotification } = useNotifications();

	const handleSave = async () => {
		if (disabled || saving) return;

		try {
			await onSave();
			setShowSuccess(true);
			addNotification({
				type: 'success',
				title: 'Zapisano!',
				message: 'Zmiany zostały pomyślnie zapisane',
				duration: 3000,
			});
			setTimeout(() => setShowSuccess(false), 2000);
		} catch (error) {
			addNotification({
				type: 'error',
				title: 'Błąd zapisu',
				message: 'Wystąpił błąd podczas zapisywania zmian',
				duration: 5000,
			});
		}
	};

	// Show button when there are changes (you can customize this logic)
	useEffect(() => {
		setIsVisible(true);
	}, []);

	if (!isVisible) return null;

	return (
		<div className={`fixed top-4 right-4 z-40 ${className}`}>
			<button
				onClick={handleSave}
				disabled={disabled || saving}
				className={`
					flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
					transition-all duration-200 ease-in-out
					${
						showSuccess
							? 'bg-green-600 hover:bg-green-700 text-white'
							: 'bg-primary-600 hover:bg-primary-700 text-white'
					}
					${
						disabled || saving
							? 'opacity-50 cursor-not-allowed'
							: 'hover:shadow-xl transform hover:scale-105'
					}
				`}>
				{saving ? (
					<RefreshCw className="h-4 w-4 animate-spin" />
				) : showSuccess ? (
					<Check className="h-4 w-4" />
				) : (
					<Save className="h-4 w-4" />
				)}
				<span className="font-medium">
					{saving ? 'Zapisywanie...' : showSuccess ? 'Zapisano!' : 'Zapisz zmiany'}
				</span>
			</button>
		</div>
	);
};

