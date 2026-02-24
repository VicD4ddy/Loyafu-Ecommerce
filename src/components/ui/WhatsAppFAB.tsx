"use client";

import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function WhatsAppFAB() {
    const { getSetting } = useSettings();
    const whatsappNumber = getSetting('whatsapp_number') || '584244096534';

    return (
        <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full hidden md:flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 active:scale-95 transition-all group"
        >
            <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 hidden md:block bg-background-dark text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                ¿Necesitas ayuda? 💬
            </span>
        </a>
    );
}
