'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Project } from '@/lib/models/PageData';
import ImageUpload from '@/components/ImageUpload';
import { EmojiPicker } from '@/components/EmojiPicker';

const ProjectsManager = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [message, setMessage] = useState('');

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: '',
		participants: '',
		duration: '',
		icon: '',
		color: 'bg-blue-500',
		image: '',
		isActive: true,
	});

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		try {
			const response = await fetch('/api/admin/projects');
			console.log('Projects response status:', response.status);
			if (response.ok) {
				const data = await response.json();
				console.log('Projects data:', data);
				setProjects(data);
			} else {
				const errorData = await response.json();
				console.error('Error response:', errorData);
			}
		} catch (error) {
			console.error('Error fetching projects:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			const url = editingProject
				? `/api/admin/projects/${editingProject._id}`
				: '/api/admin/projects';

			const method = editingProject ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setMessage(editingProject ? 'Projekt zaktualizowany!' : 'Projekt dodany!');
				setShowModal(false);
				setEditingProject(null);
				resetForm();
				fetchProjects();
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

	const handleEdit = (project: Project) => {
		setEditingProject(project);
		setFormData({
			title: project.title,
			description: project.description,
			category: project.category,
			participants: project.participants,
			duration: project.duration,
			icon: project.icon,
			color: project.color,
			image: project.image || '',
			isActive: project.isActive,
		});
		setShowModal(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Czy na pewno chcesz usunąć ten projekt?')) return;

		try {
			const response = await fetch(`/api/admin/projects/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setMessage('Projekt usunięty!');
				fetchProjects();
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
			const response = await fetch(`/api/admin/projects/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ isActive: !currentStatus }),
			});

			if (response.ok) {
				setMessage(currentStatus ? 'Projekt przeniesiony do archiwum!' : 'Projekt przywrócony!');
				fetchProjects();
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
			description: '',
			category: '',
			participants: '',
			duration: '',
			icon: '',
			color: 'bg-blue-500',
			image: '',
			isActive: true,
		});
	};

	const openModal = () => {
		setEditingProject(null);
		resetForm();
		setShowModal(true);
	};

	const colorOptions = [
		{ value: 'bg-blue-500', label: 'Niebieski' },
		{ value: 'bg-green-500', label: 'Zielony' },
		{ value: 'bg-purple-500', label: 'Fioletowy' },
		{ value: 'bg-orange-500', label: 'Pomarańczowy' },
		{ value: 'bg-red-500', label: 'Czerwony' },
		{ value: 'bg-pink-500', label: 'Różowy' },
	];

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
					<h1 className="text-3xl font-bold text-gray-900">Zarządzanie projektami</h1>
					<p className="mt-2 text-gray-600">
						Dodawaj, edytuj i zarządzaj projektami wyświetlanymi na stronie
					</p>
				</div>
				<button
					onClick={openModal}
					className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
					<Plus className="h-4 w-4" />
					Dodaj projekt
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

			{/* Active Projects */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Aktywne projekty</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects
						.filter((project) => project.isActive)
						.map((project) => (
							<div
								key={project._id}
								className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-start justify-between mb-4">
									<div className={`p-3 rounded-lg ${project.color} text-white text-2xl`}>
										{project.icon}
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => handleToggleStatus(project._id!, project.isActive)}
											className={`p-2 ${
												project.isActive
													? 'text-orange-400 hover:text-orange-600'
													: 'text-green-400 hover:text-green-600'
											}`}
											title={project.isActive ? 'Przenieś do archiwum' : 'Przywróć z archiwum'}>
											{project.isActive ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
										<button
											onClick={() => handleEdit(project)}
											className="p-2 text-gray-400 hover:text-primary-600"
											title="Edytuj projekt">
											<Edit className="h-4 w-4" />
										</button>
										<button
											onClick={() => handleDelete(project._id!)}
											className="p-2 text-gray-400 hover:text-red-600"
											title="Usuń projekt">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>

								{project.image && (
									<div className="mb-4">
										<img
											src={project.image}
											alt={project.title}
											className="w-full h-32 object-cover rounded-lg"
										/>
									</div>
								)}
								<h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
								<p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

								<div className="space-y-2 text-sm text-gray-500">
									<div className="flex items-center gap-2">
										<span className="font-medium">Kategoria:</span>
										<span>{project.category}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">Uczestnicy:</span>
										<span>{project.participants}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">Czas trwania:</span>
										<span>{project.duration}</span>
									</div>
								</div>

								<div className="mt-4 flex items-center justify-between">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
										{project.isActive ? 'Aktywny' : 'Nieaktywny'}
									</span>
									<div className="flex items-center gap-1">
										{project.isActive ? (
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

			{/* Archive Projects */}
			{projects.filter((project) => !project.isActive).length > 0 && (
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Archiwum projektów</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{projects
							.filter((project) => !project.isActive)
							.map((project) => (
								<div
									key={project._id}
									className="bg-gray-50 rounded-lg border border-gray-200 p-6 opacity-75">
									<div className="flex items-start justify-between mb-4">
										<div className={`p-3 rounded-lg ${project.color} text-white text-2xl`}>
											{project.icon}
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => handleToggleStatus(project._id!, project.isActive)}
												className={`p-2 ${
													project.isActive
														? 'text-orange-400 hover:text-orange-600'
														: 'text-green-400 hover:text-green-600'
												}`}
												title={project.isActive ? 'Przenieś do archiwum' : 'Przywróć z archiwum'}>
												{project.isActive ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</button>
											<button
												onClick={() => handleEdit(project)}
												className="p-2 text-gray-400 hover:text-primary-600"
												title="Edytuj projekt">
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDelete(project._id!)}
												className="p-2 text-gray-400 hover:text-red-600"
												title="Usuń projekt">
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>

									{project.image && (
										<div className="mb-4">
											<img
												src={project.image}
												alt={project.title}
												className="w-full h-32 object-cover rounded-lg"
											/>
										</div>
									)}
									<h3 className="text-lg font-semibold text-gray-700 mb-2">{project.title}</h3>
									<p className="text-gray-500 text-sm mb-4">{project.description}</p>

									<div className="space-y-2 text-sm text-gray-500">
										<div className="flex items-center gap-2">
											<span className="font-medium">Kategoria:</span>
											<span>{project.category}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="font-medium">Uczestnicy:</span>
											<span>{project.participants}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="font-medium">Czas trwania:</span>
											<span>{project.duration}</span>
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
								{editingProject ? 'Edytuj projekt' : 'Dodaj nowy projekt'}
							</h2>

							<form
								onSubmit={handleSubmit}
								className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Tytuł projektu *
										</label>
										<input
											type="text"
											required
											value={formData.title}
											onChange={(e) => setFormData({ ...formData, title: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
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
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Opis projektu *
									</label>
									<textarea
										required
										rows={3}
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Uczestnicy
										</label>
										<input
											type="text"
											value={formData.participants}
											onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Czas trwania
										</label>
										<input
											type="text"
											value={formData.duration}
											onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Ikona (emoji)
										</label>
										<EmojiPicker
											onEmojiSelect={(emoji) => setFormData({ ...formData, icon: emoji })}
											selectedEmoji={formData.icon}
											className="w-full"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Kolor</label>
									<select
										value={formData.color}
										onChange={(e) => setFormData({ ...formData, color: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										aria-label="Wybierz kolor">
										{colorOptions.map((option) => (
											<option
												key={option.value}
												value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Zdjęcie projektu (cover photo)
									</label>
									<ImageUpload
										onImageSelect={(imageUrl) => {
											console.log('Image selected in projects:', imageUrl);
											setFormData({ ...formData, image: imageUrl });
										}}
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
										Projekt aktywny (widoczny na stronie)
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
										{editingProject ? 'Zapisz zmiany' : 'Dodaj projekt'}
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

export default ProjectsManager;
