"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ProductModal from '@/components/product/ProductModal';
import WhatsAppFAB from '@/components/ui/WhatsAppFAB';
import Toast from '@/components/ui/Toast';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { usePageTracking } from '@/hooks/usePageTracking';

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    // Track page views
    usePageTracking();

    if (isAdmin) {
        return <main className="min-h-screen bg-background-dark text-white font-sans">{children}</main>;
    }

    return (
        <div className="relative z-10 overflow-x-hidden">
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
    );
}
