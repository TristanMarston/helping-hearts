import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
        <html lang='en'>
            <body className={`${inter.className} bg-background`}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
