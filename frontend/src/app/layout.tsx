import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'scrapUndo — AI-Powered Doorstep Scrap Collection in Kerala',
  description: 'Photograph scrap, get instant AI price estimates, locate nearby verified scrap shops in Kochi, Palakkad, Malappuram & Thrissur, and get cash at your doorstep.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'scrapUndo',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D1117',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-scrap-bg text-scrap-light flex flex-col antialiased selection:bg-scrap-primary selection:text-black">
        <Providers>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
