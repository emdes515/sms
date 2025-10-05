'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { EmojiPicker } from '@/components/EmojiPicker';
import { Ward } from '@/lib/models/PageData';
import ImageUpload from '@/components/ImageUpload';

const WardsManager = () => {
	const [wards, setWards] = useState<Ward[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingWard, setEditingWard] = useState<Ward | null>(null);
	const [message, setMessage] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		image: '',
		isActive: true,
	});

	useEffect(() => {
		fetchWards();
	}, []);

	const fetchWards = async () => {
		try {
			const response = await fetch('/api/admin/wards');
			if (response.ok) {
				const data = await response.json();
				setWards(data);
			}
		} catch (error) {
			console.error('Error fetching wards:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			const url = editingWard ? `/api/admin/wards/${editingWard._id}` : '/api/admin/wards';
			const method = editingWard ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setMessage(editingWard ? 'Podopieczny zaktualizowany!' : 'Podopieczny dodany!');
				setShowModal(false);
				setEditingWard(null);
				resetForm();
				fetchWards();
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

	const handleEdit = (ward: Ward) => {
		setEditingWard(ward);
		setFormData({
			name: ward.name,
			description: ward.description,
			image: ward.image || '',
			isActive: ward.isActive,
		});
		setShowModal(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Czy na pewno chcesz usunąć tego podopiecznego?')) return;

		try {
			const response = await fetch(`/api/admin/wards/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setMessage('Podopieczny usunięty!');
				fetchWards();
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
			const response = await fetch(`/api/admin/wards/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ isActive: !currentStatus }),
			});

			if (response.ok) {
				setMessage(
					currentStatus ? 'Podopieczny przeniesiony do archiwum!' : 'Podopieczny przywrócony!'
				);
				fetchWards();
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
			name: '',
			description: '',
			image: '',
			isActive: true,
		});
	};

	const openModal = () => {
		setEditingWard(null);
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
					<h1 className="text-3xl font-bold text-gray-900">Zarządzanie podopiecznymi</h1>
					<p className="mt-2 text-gray-600">
						Dodawaj, edytuj i zarządzaj podopiecznymi wyświetlanymi na stronie
					</p>
				</div>
				<button
					onClick={openModal}
					className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
					<Plus className="h-4 w-4" />
					Dodaj podopiecznego
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

			{/* Active Wards */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Aktywni podopieczni</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{wards
						.filter((ward) => ward.isActive)
						.map((ward) => (
							<div
								key={ward._id}
								className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										{ward.image && (
											<div className="mb-4">
												<img
													src={ward.image}
													alt={ward.name}
													className="w-full h-32 object-cover rounded-lg"
												/>
											</div>
										)}
										<h3 className="text-lg font-semibold text-gray-900 mb-2">{ward.name}</h3>
										<p className="text-gray-600 text-sm mb-4 line-clamp-3">{ward.description}</p>
									</div>
									<div className="flex gap-2 ml-4">
										<button
											onClick={() => handleToggleStatus(ward._id!, ward.isActive)}
											className={`p-2 ${
												ward.isActive
													? 'text-orange-400 hover:text-orange-600'
													: 'text-green-400 hover:text-green-600'
											}`}
											title={ward.isActive ? 'Przenieś do archiwum' : 'Przywróć z archiwum'}>
											{ward.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
										<button
											onClick={() => handleEdit(ward)}
											className="p-2 text-gray-400 hover:text-primary-600"
											title="Edytuj podopiecznego">
											<Edit className="h-4 w-4" />
										</button>
										<button
											onClick={() => handleDelete(ward._id!)}
											className="p-2 text-gray-400 hover:text-red-600"
											title="Usuń podopiecznego">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>

								<div className="mt-4 flex items-center justify-between">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											ward.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
										{ward.isActive ? 'Aktywny' : 'Nieaktywny'}
									</span>
									<div className="flex items-center gap-1">
										{ward.isActive ? (
											<Eye className="h-4 w-4 text-green-600" />
										) : (
											<EyeOff className="h-4 w-4 text-gray-400" />
										)}
									</div>
								</div>
							</div>
						))}
				</div>
			</div>

			{/* Archive Wards */}
			{wards.filter((ward) => !ward.isActive).length > 0 && (
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Archiwum podopiecznych</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{wards
							.filter((ward) => !ward.isActive)
							.map((ward) => (
								<div
									key={ward._id}
									className="bg-gray-50 rounded-lg border border-gray-200 p-6 opacity-75">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											{ward.image && (
												<div className="mb-4">
													<img
														src={ward.image}
														alt={ward.name}
														className="w-full h-32 object-cover rounded-lg"
													/>
												</div>
											)}
											<h3 className="text-lg font-semibold text-gray-700 mb-2">{ward.name}</h3>
											<p className="text-gray-500 text-sm mb-4">{ward.description}</p>
										</div>
										<div className="flex gap-2 ml-4">
											<button
												onClick={() => handleToggleStatus(ward._id!, ward.isActive)}
												className={`p-2 ${
													ward.isActive
														? 'text-orange-400 hover:text-orange-600'
														: 'text-green-400 hover:text-green-600'
												}`}
												title={ward.isActive ? 'Przenieś do archiwum' : 'Przywróć z archiwum'}>
												{ward.isActive ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</button>
											<button
												onClick={() => handleEdit(ward)}
												className="p-2 text-gray-400 hover:text-primary-600"
												title="Edytuj podopiecznego">
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDelete(ward._id!)}
												className="p-2 text-gray-400 hover:text-red-600"
												title="Usuń podopiecznego">
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>

									<div className="mt-4 flex items-center justify-between">
										<span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											Archiwum
										</span>
										<div className="flex items-center gap-1">
											<EyeOff className="h-4 w-4 text-gray-400" />
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
								{editingWard ? 'Edytuj podopiecznego' : 'Dodaj nowego podopiecznego'}
							</h2>

							<form
								onSubmit={handleSubmit}
								className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Imię i nazwisko *
									</label>
									<input
										type="text"
										required
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Opis *</label>
									<textarea
										required
										rows={4}
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Zdjęcie podopiecznego
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
										Podopieczny aktywny (widoczny na stronie)
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
										{editingWard ? 'Zapisz zmiany' : 'Dodaj podopiecznego'}
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

export default WardsManager;
