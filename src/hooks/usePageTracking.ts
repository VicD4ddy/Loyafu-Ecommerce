"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

// Basic session ID stored in memory/sessionStorage
let sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('loyafu_session_id') : null;
if (typeof window !== 'undefined' && !sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('loyafu_session_id', sessionId);
}

export function usePageTracking() {
    const pathname = usePathname();
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const trackView = async () => {
            // Avoid tracking admin pages
            if (pathname.startsWith('/admin')) return;

            try {
                const { error } = await supabase
                    .from('analytics')
                    .insert({
                        path: pathname,
                        session_id: sessionId
                    });

                if (error) console.error('Tracking error:', error);
            } catch (err) {
                console.error('Tracking failed:', err);
            }
        };

        trackView();
    }, [pathname, supabase]);
}
