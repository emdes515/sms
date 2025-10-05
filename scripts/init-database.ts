import { MongoClient, Db } from 'mongodb';

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/stowarzyszenie_mloda_sila';

interface Project {
	title: string;
	description: string;
	category: string;
	participants: string;
	duration: string;
	icon: string;
	color: string;
	image?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface Event {
	title: string;
	date: string;
	location: string;
	description: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface Partner {
	name: string;
	type: string;
	description: string;
	logo: string;
	category: string;
	website?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface Ward {
	name: string;
	description: string;
	image?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface HeroData {
	mainTitle: string;
	highlightedText: string;
	subtitle: string;
	primaryButtonText: string;
	secondaryButtonText: string;
	stats: {
		members: {
			value: string;
			label: string;
		};
		projects: {
			value: string;
			label: string;
		};
		volunteerHours: {
			value: string;
			label: string;
		};
	};
	createdAt: Date;
	updatedAt: Date;
}

async function initializeDatabase() {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		console.log('✅ Połączono z MongoDB');

		const db = client.db('stowarzyszenie_mloda_sila');

		// 1. Utwórz kolekcję projects i dodaj przykładowe projekty
		console.log('📝 Tworzenie kolekcji projects...');
		const projectsCollection = db.collection<Project>('projects');

		// Sprawdź czy projekty już istnieją
		const existingProjects = await projectsCollection.countDocuments();
		if (existingProjects === 0) {
			await projectsCollection.insertMany(sampleProjects);
			console.log('✅ Dodano przykładowe projekty');
		} else {
			console.log('ℹ️  Projekty już istnieją w bazie');
		}

		console.log('📝 Tworzenie kolekcji events...');
		const eventsCollection = db.collection<Event>('events');

		const sampleEvents: Event[] = [
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

		// 3. Utwórz kolekcję wards i dodaj przykładowych podopiecznych
		console.log('📝 Tworzenie kolekcji wards...');
		const wardsCollection = db.collection<Ward>('wards');

		const sampleWards: Ward[] = [
			{
				name: 'Anna Kowalska',
				description:
					'Młoda artystka, która dzięki naszemu wsparciu rozwinęła swoje umiejętności malarskie i zorganizowała pierwszą wystawę swoich prac.',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Michał Nowak',
				description:
					'Uzdolniony programista, który uczestniczył w naszych warsztatach programistycznych i obecnie pracuje w firmie technologicznej.',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Katarzyna Wiśniewska',
				description:
					'Aktywna wolontariuszka, która pomogła w organizacji wielu akcji społecznych i obecnie studiuje na kierunku społecznym.',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Tomasz Zieliński',
				description:
					'Młody przedsiębiorca, który dzięki naszemu mentoringowi założył własną firmę i obecnie zatrudnia innych młodych ludzi.',
				isActive: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const existingWards = await wardsCollection.countDocuments();
		if (existingWards === 0) {
			await wardsCollection.insertMany(sampleWards);
			console.log('✅ Dodano przykładowych podopiecznych');
		} else {
			console.log('ℹ️  Podopieczni już istnieją w bazie');
		}

		// 4. Utwórz kolekcję partners i dodaj przykładowych partnerów
		console.log('📝 Tworzenie kolekcji partners...');
		const partnersCollection = db.collection<Partner>('partners');

		const samplePartners: Partner[] = [
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

		// 6. Utwórz kolekcję hero_data i dodaj domyślne dane
		console.log('📝 Tworzenie kolekcji hero_data...');
		const heroCollection = db.collection<HeroData>('hero_data');

		const defaultHeroData: HeroData = {
			mainTitle: 'Razem budujemy',
			highlightedText: 'przyszłość',
			subtitle:
				'Stowarzyszenie Młoda Siła to miejsce, gdzie młodzi ludzie rozwijają swoje pasje, zdobywają doświadczenie i tworzą pozytywne zmiany w społeczności.',
			primaryButtonText: 'Dołącz do nas',
			secondaryButtonText: 'Zobacz nasze działania',
			stats: {
				members: {
					value: '500+',
					label: 'Aktywnych członków',
				},
				projects: {
					value: '50+',
					label: 'Zrealizowanych projektów',
				},
				volunteerHours: {
					value: '1000+',
					label: 'Godzin wolontariatu',
				},
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Sprawdź czy dane Hero już istnieją
		const existingHero = await heroCollection.countDocuments();
		if (existingHero === 0) {
			await heroCollection.insertOne(defaultHeroData);
			console.log('✅ Dodano domyślne dane Hero');
		} else {
			console.log('ℹ️  Dane Hero już istnieją w bazie');
		}

		// 7. Utwórz kolekcję about_data i dodaj domyślne dane
		console.log('📝 Tworzenie kolekcji about_data...');
		const aboutCollection = db.collection('about_data');

		const defaultAboutData = {
			title: 'O nas',
			description:
				'Stowarzyszenie Młoda Siła to organizacja młodzieżowa, która od 2015 roku aktywnie działa na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.',
			mission: {
				title: 'Nasza misja',
				description:
					'Wierzymy, że młodzi ludzie mają nieograniczony potencjał do tworzenia pozytywnych zmian. Naszym celem jest stworzenie przestrzeni, gdzie mogą rozwijać swoje umiejętności, zdobywać doświadczenie i budować lepszą przyszłość dla siebie i swojej społeczności.',
			},
			values: [
				{
					title: 'Cel',
					description: 'Rozwijamy potencjał młodych ludzi i budujemy silną społeczność',
					icon: 'Target',
				},
				{
					title: 'Wspólnota',
					description: 'Tworzymy przestrzeń, gdzie każdy może znaleźć swoje miejsce',
					icon: 'Users',
				},
				{
					title: 'Pasja',
					description: 'Działamy z entuzjazmem i zaangażowaniem w to, co robimy',
					icon: 'Heart',
				},
				{
					title: 'Innowacja',
					description: 'Szukamy nowych rozwiązań i kreatywnych podejść',
					icon: 'Lightbulb',
				},
				{
					title: 'Jakość',
					description: 'Stawiamy na wysokie standardy we wszystkich naszych działaniach',
					icon: 'Award',
				},
				{
					title: 'Współpraca',
					description: 'Wierzymy w siłę zespołu i wzajemnego wsparcia',
					icon: 'Users2',
				},
			],
			achievements: {
				title: 'Nasze osiągnięcia',
				description:
					'Dzięki zaangażowaniu naszych członków i wsparciu partnerów udało nam się zrealizować wiele wartościowych projektów',
				stats: [
					{ value: '8+', label: 'Lat działalności' },
					{ value: '500+', label: 'Aktywnych członków' },
					{ value: '50+', label: 'Zrealizowanych projektów' },
					{ value: '15+', label: 'Partnerów współpracujących' },
				],
			},
			management: {
				title: 'Zarząd',
				description:
					'Poznaj nasz zespół zarządzający, który z pasją i zaangażowaniem kieruje działalnością stowarzyszenia',
				members: [
					{
						name: 'Anna Kowalska',
						position: 'Prezes',
						description:
							'Absolwentka psychologii społecznej, od 5 lat zaangażowana w rozwój młodzieży',
						image: '👩‍💼',
						experience: '5 lat doświadczenia',
						education: 'Psychologia społeczna UW',
					},
					{
						name: 'Michał Nowak',
						position: 'Wiceprezes',
						description:
							'Specjalista ds. projektów edukacyjnych, koordynator programów mentoringowych',
						image: '👨‍💼',
						experience: '4 lata doświadczenia',
						education: 'Pedagogika UJ',
					},
					{
						name: 'Katarzyna Wiśniewska',
						position: 'Sekretarz',
						description: 'Odpowiedzialna za administrację i współpracę z partnerami zewnętrznymi',
						image: '👩‍💻',
						experience: '3 lata doświadczenia',
						education: 'Zarządzanie SGH',
					},
					{
						name: 'Piotr Zieliński',
						position: 'Skarbnik',
						description: 'Kontroler finansowy, odpowiedzialny za budżet i sprawozdawczość',
						image: '👨‍💻',
						experience: '6 lat doświadczenia',
						education: 'Finanse i rachunkowość',
					},
					{
						name: 'Magdalena Krawczyk',
						position: 'Członek Zarządu',
						description: 'Koordynatorka projektów społecznych i wolontariatu',
						image: '👩‍🎓',
						experience: '4 lata doświadczenia',
						education: 'Socjologia UW',
					},
					{
						name: 'Tomasz Lewandowski',
						position: 'Członek Zarządu',
						description: 'Specjalista ds. technologii i innowacji w edukacji',
						image: '👨‍🔬',
						experience: '3 lata doświadczenia',
						education: 'Informatyka PW',
					},
				],
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Sprawdź czy dane About już istnieją
		const existingAbout = await aboutCollection.countDocuments();
		if (existingAbout === 0) {
			await aboutCollection.insertOne(defaultAboutData);
			console.log('✅ Dodano domyślne dane About');
		} else {
			console.log('ℹ️  Dane About już istnieją w bazie');
		}

		console.log('\n🎉 Inicjalizacja bazy danych zakończona pomyślnie!');
		console.log('\n📋 Podsumowanie:');
		console.log(
			'• Kolekcje: projects, events, wards, partners, contact_messages, hero_data, about_data'
		);
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

export { initializeDatabase };
