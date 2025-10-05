'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
	const [pin, setPin] = useState('');
	const [showPin, setShowPin] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ pin }),
			});

			if (response.ok) {
				router.push('/admin');
			} else {
				const data = await response.json();
				setError(data.message || 'Nieprawidłowy PIN');
			}
		} catch (error) {
			setError('Wystąpił błąd podczas logowania');
		} finally {
			setLoading(false);
		}
	};

	const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, ''); // Only digits
		if (value.length <= 11) {
			setPin(value);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
						<Lock className="h-6 w-6 text-primary-600" />
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Panel Administratora
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Wprowadź 11-cyfrowy PIN aby się zalogować
					</p>
				</div>
				<form
					className="mt-8 space-y-6"
					onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="pin"
							className="sr-only">
							PIN
						</label>
						<div className="relative">
							<input
								id="pin"
								name="pin"
								type={showPin ? 'text' : 'password'}
								required
								value={pin}
								onChange={handlePinChange}
								placeholder="Wprowadź 11-cyfrowy PIN"
								className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
							/>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-gray-400" />
							</div>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPin(!showPin)}>
								{showPin ? (
									<EyeOff className="h-5 w-5 text-gray-400" />
								) : (
									<Eye className="h-5 w-5 text-gray-400" />
								)}
							</button>
						</div>
						<p className="mt-1 text-xs text-gray-500">Wprowadzono: {pin.length}/11 cyfr</p>
					</div>

					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<div className="text-sm text-red-700">{error}</div>
						</div>
					)}

					<div>
						<button
							type="submit"
							disabled={loading || pin.length !== 11}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
							{loading ? (
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							) : (
								'Zaloguj się'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AdminLogin;

