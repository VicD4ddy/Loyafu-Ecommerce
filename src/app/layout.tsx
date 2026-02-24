import type { Metadata } from 'next';
import Image from 'next/image';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductModal from '@/components/product/ProductModal';
import WhatsAppFAB from '@/components/ui/WhatsAppFAB';
import Toast from '@/components/ui/Toast';
import ScrollToTop from '@/components/ui/ScrollToTop';
import PublicLayoutWrapper from '@/components/layout/PublicLayoutWrapper';
import { SettingsProvider } from '@/context/SettingsContext';

import localFont from 'next/font/local';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const atlane = localFont({
  src: [
    {
      path: './fonts/Atlane-OTF.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-atlane',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://loyafu.com'),
  title: 'Loyafu | Tienda de Maquillaje y Cuidado Personal',
  description: 'Descubre los mejores combos de maquillaje, skincare y accesorios en Venezuela. Ventas al detal y al mayor con envíos a nivel nacional. Tu mejor versión empieza hoy.',
  keywords: 'maquillaje venezuela, skincare caracas, ventas al mayor maquillaje, loyafu, combos de maquillaje, cosméticos, cuidado personal',
  authors: [{ name: 'Loyafu' }],
  openGraph: {
    title: 'Loyafu | Tienda de Maquillaje y Cuidado Personal',
    description: 'Descubre los mejores combos de maquillaje, skincare y accesorios en Venezuela. Ventas al detal y al mayor con envíos a nivel nacional.',
    url: 'https://loyafu.com',
    siteName: 'Loyafu',
    images: [
      {
        url: '/assets/brand/logo-footer.png',
        width: 800,
        height: 600,
        alt: 'Loyafu Logo',
      },
    ],
    locale: 'es_VE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loyafu | Tienda de Maquillaje y Cuidado Personal',
    description: 'Descubre los mejores combos de maquillaje, skincare y accesorios en Venezuela.',
    images: ['/assets/brand/logo-footer.png'],
  },
  icons: {
    icon: '/assets/brand/logo-footer.png',
    apple: '/assets/brand/logo-footer.png',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn(jakarta.variable, atlane.variable, "font-sans antialiased bg-background-light text-background-dark")}>

        {/* Global Background Pattern Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src="/assets/brand/pattern.jpg"
            alt="Pattern"
            fill
            className="object-cover opacity-[0.15]"
            priority
            sizes="100vw"
          />
        </div>

        <SettingsProvider>
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}
