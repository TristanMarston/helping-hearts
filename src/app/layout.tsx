import type { Metadata } from 'next';
import { Inter, Fredoka, Sour_Gummy, Jua, Nunito } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' });
const sourGummy = Sour_Gummy({ weight: ['400', '700', '800'], subsets: ['latin'], display: 'swap', variable: '--font-sour-gummy' });
const jua = Jua({ weight: ['400'], subsets: ['latin'], display: 'swap', variable: '--font-jua' });
const nunito = Nunito({ subsets: ['latin'], display: 'swap', variable: '--font-nunito' });

export const metadata: Metadata = {
    title: 'Helping Hearts',
    description: 'Created and supported by the DPHS Medical Club.',
    icons: {
        icon: [
            {
                url: '/helping-hearts-logo-icon-default.png',
                href: '/helping-hearts-logo-icon-default.png',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className={`${inter.variable} ${fredoka.variable} ${sourGummy.variable} ${jua.variable} ${nunito.variable}`}>
            <body className={`overflow-x-hidden h-dvh w-dvw p-0 bg-background`}>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
