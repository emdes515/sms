'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message: string;
	duration?: number;
}

interface NotificationContextType {
	notifications: Notification[];
	addNotification: (notification: Omit<Notification, 'id'>) => void;
	removeNotification: (id: string) => void;
	clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotifications must be used within a NotificationProvider');
	}
	return context;
};

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = (notification: Omit<Notification, 'id'>) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newNotification: Notification = {
			...notification,
			id,
			duration: notification.duration || 5000,
		};

		setNotifications((prev) => [...prev, newNotification]);

		// Auto remove after duration
		if (newNotification.duration && newNotification.duration > 0) {
			setTimeout(() => {
				removeNotification(id);
			}, newNotification.duration);
		}
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((notification) => notification.id !== id));
	};

	const clearAllNotifications = () => {
		setNotifications([]);
	};

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				addNotification,
				removeNotification,
				clearAllNotifications,
			}}>
			{children}
			<NotificationContainer />
		</NotificationContext.Provider>
	);
};

const NotificationContainer = () => {
	const { notifications, removeNotification } = useNotifications();

	if (notifications.length === 0) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
			{notifications.map((notification) => (
				<NotificationItem
					key={notification.id}
					notification={notification}
					onClose={() => removeNotification(notification.id)}
				/>
			))}
		</div>
	);
};

interface NotificationItemProps {
	notification: Notification;
	onClose: () => void;
}

const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger animation
		setTimeout(() => setIsVisible(true), 10);
	}, []);

	const getIcon = () => {
		switch (notification.type) {
			case 'success':
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case 'error':
				return <AlertCircle className="h-5 w-5 text-red-500" />;
			case 'warning':
				return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
			case 'info':
				return <Info className="h-5 w-5 text-blue-500" />;
			default:
				return <Info className="h-5 w-5 text-blue-500" />;
		}
	};

	const getBackgroundColor = () => {
		switch (notification.type) {
			case 'success':
				return 'bg-green-50 border-green-200';
			case 'error':
				return 'bg-red-50 border-red-200';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200';
			case 'info':
				return 'bg-blue-50 border-blue-200';
			default:
				return 'bg-blue-50 border-blue-200';
		}
	};

	const getTextColor = () => {
		switch (notification.type) {
			case 'success':
				return 'text-green-800';
			case 'error':
				return 'text-red-800';
			case 'warning':
				return 'text-yellow-800';
			case 'info':
				return 'text-blue-800';
			default:
				return 'text-blue-800';
		}
	};

	return (
		<div
			className={`
				transform transition-all duration-300 ease-in-out
				${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
				border rounded-lg shadow-lg p-4 ${getBackgroundColor()}
			`}>
			<div className="flex items-start">
				<div className="flex-shrink-0">{getIcon()}</div>
				<div className="ml-3 flex-1">
					<h4 className={`text-sm font-medium ${getTextColor()}`}>{notification.title}</h4>
					{notification.message && (
						<p className={`mt-1 text-sm ${getTextColor()}`}>{notification.message}</p>
					)}
				</div>
				<button
					onClick={onClose}
					aria-label="Zamknij powiadomienie"
					className={`ml-4 flex-shrink-0 ${getTextColor()} hover:opacity-75 transition-opacity`}>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};
