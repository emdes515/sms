'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Partner } from '@/lib/models/PageData';

const PartnersManager = () => {
	const [partners, setPartners] = useState<Partner[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
	const [message, setMessage] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		type: '',
		description: '',
		logo: '',
		category: '',
		website: '',
		isActive: true,
	});

	useEffect(() => {
		fetchPartners();
	}, []);

	const fetchPartners = async () => {
		try {
			const response = await fetch('/api/admin/partners');
			if (response.ok) {
				const data = await response.json();
				setPartners(data);
			}
		} catch (error) {
			console.error('Error fetching partners:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			const url = editingPartner
				? `/api/admin/partners/${editingPartner._id}`
				: '/api/admin/partners';

			const method = editingPartner ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setMessage(editingPartner ? 'Partner zaktualizowany!' : 'Partner dodany!');
				setShowModal(false);
				setEditingPartner(null);
				resetForm();
				fetchPartners();
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

	const handleEdit = (partner: Partner) => {
		setEditingPartner(partner);
		setFormData({
			name: partner.name,
			type: partner.type,
			description: partner.description,
			logo: partner.logo,
			category: partner.category,
			website: partner.website || '',
			isActive: partner.isActive,
		});
		setShowModal(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Czy na pewno chcesz usunąć tego partnera?')) return;

		try {
			const response = await fetch(`/api/admin/partners/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setMessage('Partner usunięty!');
				fetchPartners();
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

	const resetForm = () => {
		setFormData({
			name: '',
			type: '',
			description: '',
			logo: '',
			category: '',
			website: '',
			isActive: true,
		});
	};

	const openModal = () => {
		setEditingPartner(null);
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
					<h1 className="text-3xl font-bold text-gray-900">Zarządzanie partnerami</h1>
					<p className="mt-2 text-gray-600">
						Dodawaj, edytuj i zarządzaj partnerami wyświetlanymi na stronie
					</p>
				</div>
				<button
					onClick={openModal}
					className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
					<Plus className="h-4 w-4" />
					Dodaj partnera
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

			{/* Partners Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{partners.map((partner) => (
					<div
						key={partner._id}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-2">
									<h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
									{partner.website && (
										<a
											href={partner.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary-600 hover:text-primary-700"
											title="Otwórz stronę internetową">
											<ExternalLink className="h-4 w-4" />
										</a>
									)}
								</div>
								<p className="text-sm text-gray-600 mb-2">{partner.type}</p>
								<p className="text-sm text-gray-500 mb-3">{partner.description}</p>

								<div className="flex items-center gap-2">
									<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
										{partner.category}
									</span>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											partner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
										{partner.isActive ? 'Aktywny' : 'Nieaktywny'}
									</span>
								</div>
							</div>

							<div className="flex gap-2 ml-4">
								<button
									onClick={() => handleEdit(partner)}
									className="p-2 text-gray-400 hover:text-primary-600"
									title="Edytuj partnera">
									<Edit className="h-4 w-4" />
								</button>
								<button
									onClick={() => handleDelete(partner._id!)}
									className="p-2 text-gray-400 hover:text-red-600"
									title="Usuń partnera">
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								{editingPartner ? 'Edytuj partnera' : 'Dodaj nowego partnera'}
							</h2>

							<form
								onSubmit={handleSubmit}
								className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Nazwa partnera *
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
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Typ organizacji *
										</label>
										<input
											type="text"
											required
											value={formData.type}
											onChange={(e) => setFormData({ ...formData, type: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Opis partnera *
									</label>
									<textarea
										required
										rows={3}
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Kategoria *
										</label>
										<input
											type="text"
											required
											value={formData.category}
											onChange={(e) => setFormData({ ...formData, category: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Strona internetowa
										</label>
										<input
											type="url"
											value={formData.website}
											onChange={(e) => setFormData({ ...formData, website: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Logo (ścieżka do pliku)
									</label>
									<input
										type="text"
										value={formData.logo}
										onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
										placeholder="/logos/partner-logo.png"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
										Partner aktywny (widoczny na stronie)
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
										{editingPartner ? 'Zapisz zmiany' : 'Dodaj partnera'}
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

export default PartnersManager;
