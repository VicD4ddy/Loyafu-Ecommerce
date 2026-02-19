"use client";

import { ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Volver arriba"
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-white border border-primary/20 text-primary rounded-full hidden md:flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all animate-[fadeInUp_0.3s_ease-out]"
        >
            <ChevronUp className="w-5 h-5" />
        </button>
    );
}
