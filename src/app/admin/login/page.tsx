"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import Image from 'next/image';
import { Loader2, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        if (data.session) {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/assets/brand/pattern.jpg"
                    alt="Pattern"
                    fill
                    className="object-cover opacity-[0.05]"
                />
            </div>

            <div className="relative z-10 w-full max-w-md bg-[#18131e] p-8 rounded-[2rem] shadow-2xl border border-white/5">
                <div className="flex justify-center mb-8">
                    <Image src="/assets/brand/logo-footer.png" alt="Loyafu Logo" width={80} height={80} className="object-contain drop-shadow-[0_0_15px_rgba(157,51,247,0.3)]" />
                </div>

                <h1 className="text-3xl font-black text-white text-center mb-2 font-brand uppercase tracking-tighter">Panel Central</h1>
                <p className="text-[#a8a3b5] text-center mb-8 text-sm font-medium">Ingresa tus credenciales para administrar Loyafu</p>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#251e30] border border-white/5 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                                placeholder="admin@loyafu.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#251e30] border border-white/5 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-[#a844ff] text-white font-black uppercase tracking-widest py-4 rounded-xl mt-8 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(157,51,247,0.3)] active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar al Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
}
