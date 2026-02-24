"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
    Save,
    Loader2,
    MessageSquare,
    Globe,
    ShoppingBag,
    Smartphone
} from 'lucide-react';
import { useToastStore } from '@/components/ui/Toast';

export default function SettingsPage() {
    const supabase = createSupabaseBrowserClient();
    const { showToast } = useToastStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Config states
    const [settings, setSettings] = useState<any[]>([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (error) {
            console.error('Error fetching settings:', error);
            showToast('Error cargando configuraciones');
        } else {
            setSettings(data || []);
        }
        setLoading(false);
    };

    const handleUpdateChange = (key: string, newValue: string) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const setting of settings) {
                const { error } = await supabase
                    .from('site_settings')
                    .update({
                        value: setting.value,
                        updated_at: new Date().toISOString()
                    })
                    .eq('key', setting.key);

                if (error) throw error;
            }
            showToast('¡Configuraciones guardadas!');
        } catch (error: any) {
            console.error('Error saving settings:', error);
            showToast(`Error al guardar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="mt-4 text-[#a8a3b5] font-brand uppercase tracking-widest text-xs">Cargando ajustes...</p>
            </div>
        );
    }

    const whatsapp = settings.find(s => s.key === 'whatsapp_number');
    const storeName = settings.find(s => s.key === 'store_name');
    const deliveryMsg = settings.find(s => s.key === 'delivery_message');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-white font-brand uppercase tracking-tighter">Ajustes del Sitio</h1>
                <p className="text-[#a8a3b5] text-sm">Personaliza el contact y comportamiento de la tienda</p>
            </div>

            <div className="grid gap-8">
                {/* WhatsApp Section */}
                <div className="bg-[#18131e] rounded-[2rem] p-8 border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight italic">WhatsApp de Contacto</h2>
                            <p className="text-[#6d667c] text-xs font-bold uppercase tracking-widest">Número donde recibirás los pedidos</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Número de Teléfono (con código de país)</label>
                            <input
                                type="text"
                                value={whatsapp?.value || ''}
                                onChange={(e) => handleUpdateChange('whatsapp_number', e.target.value)}
                                placeholder="Ej: 584240000000"
                                className="w-full bg-[#251e30] border border-white/5 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-green-500/50 transition-all font-bold text-lg"
                            />
                            <p className="text-[10px] text-[#6d667c] pl-1 italic">Usa solo números, sin el símbolo "+".</p>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-[#18131e] rounded-[2rem] p-8 border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Identidad y Mensajes</h2>
                            <p className="text-[#6d667c] text-xs font-bold uppercase tracking-widest">Configuración general de la marca</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Nombre de la Tienda</label>
                            <input
                                type="text"
                                value={storeName?.value || ''}
                                onChange={(e) => handleUpdateChange('store_name', e.target.value)}
                                className="w-full bg-[#251e30] border border-white/5 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-primary/50 transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Mensaje de Pedido</label>
                            <input
                                type="text"
                                value={deliveryMsg?.value || ''}
                                onChange={(e) => handleUpdateChange('delivery_message', e.target.value)}
                                className="w-full bg-[#251e30] border border-white/5 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-primary/50 transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary hover:bg-[#a844ff] text-white font-black uppercase tracking-widest px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_12px_30px_rgba(157,51,247,0.4)] active:scale-[0.97]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Aplicar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
