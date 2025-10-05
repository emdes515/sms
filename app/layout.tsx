import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Stowarzyszenie Młoda Siła - Razem budujemy przyszłość',
	description:
		'Stowarzyszenie Młoda Siła to organizacja młodzieżowa, która angażuje młodych ludzi w działania społeczne, rozwój osobisty i budowanie lepszej przyszłości.',
	keywords: 'stowarzyszenie, młodzież, organizacja, wolontariat, rozwój, społeczność',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
