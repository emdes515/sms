const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/stowarzyszenie_mloda_sila';

async function initializeDatabase() {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		console.log('✅ Połączono z MongoDB');

		const db = client.db('stowarzyszenie_mloda_sila');

		// 1. Utwórz kolekcję users i dodaj admina
		console.log('📝 Tworzenie kolekcji users...');
		const usersCollection = db.collection('users');

		// Sprawdź czy admin już istnieje
		const existingAdmin = await usersCollection.findOne({ username: 'smsadmin' });
		if (!existingAdmin) {
			const bcrypt = require('bcryptjs');
			const hashedPassword = await bcrypt.hash('123456789', 10);

			await usersCollection.insertOne({
				username: 'smsadmin',
				password: hashedPassword,
				role: 'admin',
				createdAt: new Date(),
				lastLogin: null,
			});
			console.log('✅ Utworzono użytkownika admin (smsadmin/123456789)');
		} else {
			console.log('ℹ️  Użytkownik admin już istnieje');
		}

		// 2. Utwórz kolekcję projects i dodaj przykładowe projekty
		console.log('📝 Tworzenie kolekcji projects...');
		const projectsCollection = db.collection('projects');

		const sampleProjects = [
			{
				title: 'Program Młodzieżowy "Aktywni"',
				description:
					'Cykl warsztatów rozwojowych dla młodzieży w wieku 16-25 lat, skupiających się na rozwoju umiejętności miękkich, przedsiębiorczości i aktywizmu społecznego.',
				category: 'Edukacja',
				participants: '30-50 osób',
				duration: '6 miesięcy',
				icon: '🎓',
				color: 'bg-blue-500',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: 'Warsztaty Ekologiczne "Zielona Przyszłość"',
				description:
					'Projekt edukacyjny promujący świadomość ekologiczną wśród młodzieży poprzez praktyczne warsztaty, wycieczki przyrodnicze i akcje społeczne.',
				category: 'Ekologia',
				participants: '20-40 osób',
				duration: '4 miesiące',
				icon: '🌱',
				color: 'bg-green-500',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: 'Cykl Spotkań "Młodzi Liderzy"',
				description:
					'Program rozwoju umiejętności przywódczych i organizacyjnych dla młodych aktywistów społecznych i przyszłych liderów lokalnych społeczności.',
				category: 'Liderstwo',
				participants: '15-25 osób',
				duration: '8 miesięcy',
				icon: '👑',
				color: 'bg-purple-500',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: 'Projekt "Kultura i Tradycja"',
				description:
					'Inicjatywa mająca na celu zachowanie i promocję lokalnych tradycji kulturowych poprzez warsztaty, wystawy i wydarzenia artystyczne.',
				category: 'Kultura',
				participants: '25-35 osób',
				duration: '5 miesięcy',
				icon: '🎭',
				color: 'bg-orange-500',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		// Sprawdź czy projekty już istnieją
		const existingProjects = await projectsCollection.countDocuments();
		if (existingProjects === 0) {
			await projectsCollection.insertMany(sampleProjects);
			console.log('✅ Dodano przykładowe projekty');
		} else {
			console.log('ℹ️  Projekty już istnieją w bazie');
		}

		// 3. Utwórz kolekcję events i dodaj przykładowe wydarzenia
		console.log('📝 Tworzenie kolekcji events...');
		const eventsCollection = db.collection('events');

		const sampleEvents = [
			{
				title: 'Warsztat "Przedsiębiorczość Młodzieżowa"',
				date: '2024-02-15',
				location: 'Centrum Kultury, ul. Główna 10',
				description:
					'Praktyczny warsztat z tworzenia biznesplanów i podstaw przedsiębiorczości dla młodych ludzi.',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: 'Akcja Sprzątania Lasu',
				date: '2024-03-20',
				location: 'Las Miejski, punkt zbiórki: parking przy ul. Leśnej',
				description: 'Wspólna akcja sprzątania terenów leśnych połączona z edukacją ekologiczną.',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: 'Spotkanie z Lokalnymi Liderami',
				date: '2024-04-10',
				location: 'Sala konferencyjna, Ratusz Miejski',
				description: 'Inspirujące spotkanie z lokalnymi liderami społecznymi i politycznymi.',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const existingEvents = await eventsCollection.countDocuments();
		if (existingEvents === 0) {
			await eventsCollection.insertMany(sampleEvents);
			console.log('✅ Dodano przykładowe wydarzenia');
		} else {
			console.log('ℹ️  Wydarzenia już istnieją w bazie');
		}

		// 4. Utwórz kolekcję partners i dodaj przykładowych partnerów
		console.log('📝 Tworzenie kolekcji partners...');
		const partnersCollection = db.collection('partners');

		const samplePartners = [
			{
				name: 'Fundacja "Młodzi dla Społeczeństwa"',
				type: 'Fundacja',
				description:
					'Organizacja pozarządowa wspierająca inicjatywy młodzieżowe i rozwój społeczeństwa obywatelskiego.',
				logo: '/logos/fundacja-mlodzi.png',
				category: 'NGO',
				website: 'https://mlodzidlaspoleczenstwa.pl',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Urząd Miasta',
				type: 'Instytucja Publiczna',
				description:
					'Współpraca z lokalnym samorządem w zakresie wspierania inicjatyw młodzieżowych.',
				logo: '/logos/urzad-miasta.png',
				category: 'Samorząd',
				website: 'https://miasto.pl',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Uniwersytet Lokalny',
				type: 'Uczelnia',
				description: 'Współpraca akademicka w zakresie programów edukacyjnych i badawczych.',
				logo: '/logos/uniwersytet.png',
				category: 'Edukacja',
				website: 'https://uniwersytet.pl',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Firma TechCorp',
				type: 'Przedsiębiorstwo',
				description: 'Partner biznesowy wspierający projekty technologiczne i innowacyjne.',
				logo: '/logos/techcorp.png',
				category: 'Biznes',
				website: 'https://techcorp.pl',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const existingPartners = await partnersCollection.countDocuments();
		if (existingPartners === 0) {
			await partnersCollection.insertMany(samplePartners);
			console.log('✅ Dodano przykładowych partnerów');
		} else {
			console.log('ℹ️  Partnerzy już istnieją w bazie');
		}

		// 5. Utwórz kolekcję contact_messages (pusta na start)
		console.log('📝 Tworzenie kolekcji contact_messages...');
		const messagesCollection = db.collection('contact_messages');

		// Sprawdź czy kolekcja istnieje
		const collections = await db.listCollections({ name: 'contact_messages' }).toArray();
		if (collections.length === 0) {
			await messagesCollection.createIndex({ createdAt: -1 });
			console.log('✅ Utworzono kolekcję contact_messages');
		} else {
			console.log('ℹ️  Kolekcja contact_messages już istnieje');
		}

		console.log('\n🎉 Inicjalizacja bazy danych zakończona pomyślnie!');
		console.log('\n📋 Podsumowanie:');
		console.log('• Użytkownik admin: smsadmin / 123456789');
		console.log('• Kolekcje: users, projects, events, partners, contact_messages');
		console.log('• Przykładowe dane zostały dodane');
	} catch (error) {
		console.error('❌ Błąd podczas inicjalizacji bazy danych:', error);
		throw error;
	} finally {
		await client.close();
	}
}

// Uruchom inicjalizację
if (require.main === module) {
	initializeDatabase()
		.then(() => {
			console.log('\n✅ Skrypt zakończony pomyślnie');
			process.exit(0);
		})
		.catch((error) => {
			console.error('\n❌ Błąd:', error);
			process.exit(1);
		});
}

module.exports = { initializeDatabase };
