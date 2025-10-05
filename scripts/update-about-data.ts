import { MongoClient } from 'mongodb';

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/stowarzyszenie_mloda_sila';

async function updateAboutData() {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		console.log('✅ Połączono z MongoDB');

		const db = client.db('stowarzyszenie_mloda_sila');
		const aboutCollection = db.collection('about_data');

		// Zaktualizuj dane About z pełną listą członków zarządu
		const updatedAboutData = {
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
			updatedAt: new Date(),
		};

		// Zaktualizuj istniejące dane
		const result = await aboutCollection.updateOne({}, { $set: updatedAboutData });

		if (result.modifiedCount > 0) {
			console.log('✅ Zaktualizowano dane About z pełną listą członków zarządu');
		} else {
			console.log('ℹ️  Brak zmian w danych About');
		}

		console.log('\n🎉 Aktualizacja danych zakończona pomyślnie!');
	} catch (error) {
		console.error('❌ Błąd podczas aktualizacji danych:', error);
		throw error;
	} finally {
		await client.close();
	}
}

// Uruchom aktualizację
if (require.main === module) {
	updateAboutData()
		.then(() => {
			console.log('\n✅ Skrypt zakończony pomyślnie');
			process.exit(0);
		})
		.catch((error) => {
			console.error('\n❌ Błąd:', error);
			process.exit(1);
		});
}

export { updateAboutData };
