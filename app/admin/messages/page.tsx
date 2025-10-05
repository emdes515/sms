'use client';

import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, Trash2, Check, X } from 'lucide-react';
import { ContactMessage } from '@/lib/models/PageData';

const MessagesManager = () => {
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
	const [message, setMessage] = useState('');

	useEffect(() => {
		fetchMessages();
	}, []);

	const fetchMessages = async () => {
		try {
			const response = await fetch('/api/admin/messages');
			if (response.ok) {
				const data = await response.json();
				setMessages(data);
			}
		} catch (error) {
			console.error('Error fetching messages:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (id: string, status: 'new' | 'read' | 'replied') => {
		try {
			const response = await fetch(`/api/admin/messages/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			});

			if (response.ok) {
				setMessage('Status wiadomości zaktualizowany!');
				fetchMessages();
				setTimeout(() => setMessage(''), 3000);
			} else {
				setMessage('Wystąpił błąd podczas aktualizacji statusu');
			}
		} catch (error) {
			setMessage('Wystąpił błąd podczas aktualizacji statusu');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Czy na pewno chcesz usunąć tę wiadomość?')) return;

		try {
			const response = await fetch(`/api/admin/messages/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setMessage('Wiadomość usunięta!');
				fetchMessages();
				setTimeout(() => setMessage(''), 3000);
			} else {
				setMessage('Wystąpił błąd podczas usuwania');
			}
		} catch (error) {
			setMessage('Wystąpił błąd podczas usuwania');
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'new':
				return 'bg-red-100 text-red-800';
			case 'read':
				return 'bg-yellow-100 text-yellow-800';
			case 'replied':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'new':
				return 'Nowa';
			case 'read':
				return 'Przeczytana';
			case 'replied':
				return 'Odpowiedziana';
			default:
				return 'Nieznany';
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Zarządzanie wiadomościami</h1>
				<p className="mt-2 text-gray-600">Przeglądaj i zarządzaj wiadomościami kontaktowymi</p>
			</div>

			{message && (
				<div
					className={`p-4 rounded-lg ${
						message.includes('błąd')
							? 'bg-red-50 text-red-700 border border-red-200'
							: 'bg-green-50 text-green-700 border border-green-200'
					}`}>
					{message}
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Lista wiadomości */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="p-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">
								Wiadomości ({messages.length})
							</h2>
						</div>
						<div className="max-h-96 overflow-y-auto">
							{messages.map((msg) => (
								<div
									key={msg._id}
									className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
										selectedMessage?._id === msg._id ? 'bg-primary-50' : ''
									}`}
									onClick={() => setSelectedMessage(msg)}>
									<div className="flex items-start justify-between mb-2">
										<div className="flex-1">
											<h3 className="text-sm font-medium text-gray-900 truncate">{msg.subject}</h3>
											<p className="text-xs text-gray-500">{msg.name}</p>
										</div>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
												msg.status
											)}`}>
											{getStatusLabel(msg.status)}
										</span>
									</div>
									<p className="text-xs text-gray-600 line-clamp-2">{msg.message}</p>
									<p className="text-xs text-gray-400 mt-1">
										{new Date(msg.createdAt).toLocaleDateString('pl-PL')}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Szczegóły wiadomości */}
				<div className="lg:col-span-2">
					{selectedMessage ? (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200">
							<div className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">
											{selectedMessage.subject}
										</h2>
										<p className="text-sm text-gray-600 mt-1">
											Od: {selectedMessage.name} ({selectedMessage.email})
										</p>
										<p className="text-xs text-gray-500">
											{new Date(selectedMessage.createdAt).toLocaleString('pl-PL')}
										</p>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => handleDelete(selectedMessage._id!)}
											className="p-2 text-gray-400 hover:text-red-600"
											title="Usuń wiadomość">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>

								<div className="mb-6">
									<h3 className="text-sm font-medium text-gray-700 mb-2">Treść wiadomości:</h3>
									<div className="bg-gray-50 rounded-lg p-4">
										<p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
									</div>
								</div>

								<div className="flex gap-3">
									<button
										onClick={() => handleStatusChange(selectedMessage._id!, 'read')}
										className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
											selectedMessage.status === 'read'
												? 'bg-yellow-100 text-yellow-800'
												: 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
										}`}>
										<Eye className="h-4 w-4" />
										Oznacz jako przeczytaną
									</button>
									<button
										onClick={() => handleStatusChange(selectedMessage._id!, 'replied')}
										className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
											selectedMessage.status === 'replied'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
										}`}>
										<Check className="h-4 w-4" />
										Oznacz jako odpowiedzianą
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
							<Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">Wybierz wiadomość</h3>
							<p className="text-gray-600">
								Kliknij na wiadomość z listy, aby zobaczyć jej szczegóły
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessagesManager;
