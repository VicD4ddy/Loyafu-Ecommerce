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
  title: 'Loyafu | Glow Up Essentials',
  description: 'Premium personal care products for your best self.',
};

import BottomNav from '@/components/layout/BottomNav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(jakarta.variable, atlane.variable, "font-sans antialiased bg-background-light text-background-dark overflow-x-hidden")}>

        {/* Global Background Pattern Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src="/assets/brand/pattern.jpg"
            alt="Pattern"
            fill
            className="object-cover opacity-[0.15]"
            priority
          />
        </div>

        <div className="relative z-10">
          <Navbar />
          <main className="min-h-screen pt-16 md:pt-4 pb-24 md:pb-20">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <ProductModal />
          <WhatsAppFAB />
          <Toast />
          <ScrollToTop />
        </div>
      </body>
    </html>
  );
}
