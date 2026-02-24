"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface SettingsContextType {
    settings: Record<string, string>;
    loading: boolean;
    getSetting: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value');

            if (error) {
                // If it's a 42P01 error (undefined_table), it means the user hasn't run the SQL script. 
                // We'll show a more helpful message.
                if (error.code === '42P01') {
                    console.warn('Aviso: La tabla site_settings no existe. Por favor, ejecuta el script SQL de ajustes.');
                } else {
                    console.error('Error loading settings:', error.message || error);
                }
            } else if (data) {
                const settingsMap = data.reduce((acc: Record<string, string>, item: { key: string, value: string }) => ({
                    ...acc,
                    [item.key]: item.value
                }), {});
                setSettings(settingsMap);
            }
            setLoading(false);
        };

        fetchSettings();
    }, [supabase]);

    const getSetting = (key: string) => settings[key] || '';

    return (
        <SettingsContext.Provider value={{ settings, loading, getSetting }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
