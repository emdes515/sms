'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { EmojiPicker } from '@/components/EmojiPicker';
import { Event } from '@/lib/models/PageData';
import ImageUpload from '@/components/ImageUpload';

const EventsManager = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const [message, setMessage] = useState('');

	const [formData, setFormData] = useState({
		title: '',
		date: '',
		location: '',
		description: '',
		image: '',
		isActive: true,
	});

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async () => {
		try {
			const response = await fetch('/api/admin/events');
			if (response.ok) {
				const data = await response.json();
				setEvents(data);
			}
		} catch (error) {
			console.error('Error fetching events:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			const url = editingEvent ? `/api/admin/events/${editingEvent._id}` : '/api/admin/events';

			const method = editingEvent ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setMessage(editingEvent ? 'Wydarzenie zaktualizowane!' : 'Wydarzenie dodane!');
				setShowModal(false);
				setEditingEvent(null);
				resetForm();
				fetchEvents();
				setTimeout(() => setMessage(''), 3000);
			} else {
				const errorData = await response.json();
				setMessage(`Błąd: ${errorData.message || 'Wystąpił błąd podczas zapisywania'}`);
			}
		} catch (error) {
			console.error('Submit error:', error);
			setMessage('Wystąpił błąd podczas zapisywania');
		}
	};

	const handleEdit = (event: Event) => {
		setEditingEvent(event);
		setFormData({
			title: event.title,
			date: event.date,
			location: event.location,
			description: event.description,
			image: event.image || '',
			isActive: event.isActive,
		});
		setShowModal(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Czy na pewno chcesz usunąć to wydarzenie?')) return;

		try {
			const response = await fetch(`/api/admin/events/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setMessage('Wydarzenie usunięte!');
				fetchEvents();
				setTimeout(() => setMessage(''), 3000);
			} else {
				const errorData = await response.json();
				setMessage(`Błąd: ${errorData.message || 'Wystąpił błąd podczas usuwania'}`);
			}
		} catch (error) {
			console.error('Delete error:', error);
			setMessage('Wystąpił błąd podczas usuwania');
		}
	};

	const handleToggleStatus = async (id: string, currentStatus: boolean) => {
		try {
			const response = await fetch(`/api/admin/events/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ isActive: !currentStatus }),
			});

			if (response.ok) {
				setMessage(
					currentStatus ? 'Wydarzenie przeniesione do archiwum!' : 'Wydarzenie przywrócone!'
				);
				fetchEvents();
				setTimeout(() => setMessage(''), 3000);
			} else {
				const errorData = await response.json();
				setMessage(`Błąd: ${errorData.message || 'Wystąpił błąd podczas aktualizacji'}`);
			}
		} catch (error) {
			console.error('Toggle status error:', error);
			setMessage('Wystąpił błąd podczas aktualizacji');
		}
	};

	const resetForm = () => {
		setFormData({
			title: '',
			date: '',
			location: '',
			description: '',
			image: '',
			isActive: true,
		});
	};

	const openModal = () => {
		setEditingEvent(null);
		resetForm();
		setShowModal(true);
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
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Zarządzanie wydarzeniami</h1>
					<p className="mt-2 text-gray-600">
						Dodawaj, edytuj i zarządzaj wydarzeniami wyświetlanymi na stronie
					</p>
				</div>
				<button
					onClick={openModal}
					className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
					<Plus className="h-4 w-4" />
					Dodaj wydarzenie
				</button>
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

			{/* Active Events */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Aktywne wydarzenia</h2>
				<div className="space-y-4">
					{events
						.filter((event) => event.isActive)
						.map((event) => (
							<div
								key={event._id}
								className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
											<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Aktywne
											</span>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
											<div>
												<span className="font-medium">Data:</span> {event.date}
											</div>
											<div>
												<span className="font-medium">Lokalizacja:</span> {event.location}
											</div>
										</div>

										{event.image && (
											<div className="mt-3">
												<img
													src={event.image}
													alt={event.title}
													className="w-32 h-20 object-cover rounded-lg"
												/>
											</div>
										)}

										<p className="mt-2 text-gray-600">{event.description}</p>
									</div>

									<div className="flex gap-2 ml-4">
										<button
											onClick={() => handleToggleStatus(event._id!, event.isActive)}
											className={`p-2 ${
												event.isActive
													? 'text-orange-400 hover:text-orange-600'
													: 'text-green-400 hover:text-green-600'
											}`}
											title={event.isActive ? 'Przenieś do archiwum' : 'Przywróć z archiwum'}>
											{event.isActive ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
										<button
											onClick={() => handleEdit(event)}
											className="p-2 text-gray-400 hover:text-primary-600"
											title="Edytuj wydarzenie">
											<Edit className="h-4 w-4" />
										</button>
										<button
											onClick={() => handleDelete(event._id!)}
											className="p-2 text-gray-400 hover:text-red-600"
											title="Usuń wydarzenie">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>

			{/* Archive Events */}
			{events.filter((event) => !event.isActive).length > 0 && (
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Archiwum wydarzeń</h2>
					<div className="space-y-4">
						{events
							.filter((event) => !event.isActive)
							.map((event) => (
								<div
									key={event._id}
									className="bg-gray-50 rounded-lg border border-gray-200 p-6 opacity-75">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-lg font-semibold text-gray-700">{event.title}</h3>
												<span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
													Archiwum
												</span>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
												<div>
													<span className="font-medium">Data:</span> {event.date}
												</div>
												<div>
													<span className="font-medium">Lokalizacja:</span> {event.location}
												</div>
											</div>

											{event.image && (
												<div className="mt-3">
													<img
														src={event.image}
														alt={event.title}
														className="w-32 h-20 object-cover rounded-lg"
													/>
												</div>
											)}

											<p className="mt-2 text-gray-500">{event.description}</p>
										</div>

										<div className="flex gap-2 ml-4">
											<button
												onClick={() => handleToggleStatus(event._id!, event.isActive)}
												className={`p-2 ${
													event.isActive
														? 'text-orange-400 hover:text-orange-600'
														: 'text-green-400 hover:text-green-600'
												}`}
												title={event.isActive ? 'Przenieś do archiwum' : 'Przywróć z archiwum'}>
												{event.isActive ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</button>
											<button
												onClick={() => handleEdit(event)}
												className="p-2 text-gray-400 hover:text-primary-600"
												title="Edytuj wydarzenie">
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDelete(event._id!)}
												className="p-2 text-gray-400 hover:text-red-600"
												title="Usuń wydarzenie">
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			)}

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								{editingEvent ? 'Edytuj wydarzenie' : 'Dodaj nowe wydarzenie'}
							</h2>

							<form
								onSubmit={handleSubmit}
								className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Tytuł wydarzenia *
									</label>
									<input
										type="text"
										required
										value={formData.title}
										onChange={(e) => setFormData({ ...formData, title: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
										<input
											type="date"
											required
											value={formData.date}
											onChange={(e) => setFormData({ ...formData, date: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Lokalizacja *
										</label>
										<input
											type="text"
											required
											value={formData.location}
											onChange={(e) => setFormData({ ...formData, location: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Opis wydarzenia *
									</label>
									<textarea
										required
										rows={3}
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Zdjęcie wydarzenia
									</label>
									<ImageUpload
										onImageSelect={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
										selectedImage={formData.image}
									/>
								</div>

								<div className="flex items-center">
									<input
										type="checkbox"
										id="isActive"
										checked={formData.isActive}
										onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
										className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
									/>
									<label
										htmlFor="isActive"
										className="ml-2 block text-sm text-gray-900">
										Wydarzenie aktywne (widoczne na stronie)
									</label>
								</div>

								<div className="flex justify-end gap-3 pt-4">
									<button
										type="button"
										onClick={() => setShowModal(false)}
										className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
										Anuluj
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
										{editingEvent ? 'Zapisz zmiany' : 'Dodaj wydarzenie'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EventsManager;
