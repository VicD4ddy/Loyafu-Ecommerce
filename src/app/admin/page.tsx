"use client";

import Link from 'next/link';
import {
    Package,
    Star,
    ArrowRight,
    LayoutGrid,
    TrendingUp,
    Zap,
    Users,
    MessageSquare,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AdminDashboard() {
    const supabase = createSupabaseBrowserClient();
    const [stats, setStats] = useState([
        { label: 'Productos Activos', value: '--', icon: Package, color: 'text-blue-400' },
        { label: 'Visitas Totales', value: '--', icon: TrendingUp, color: 'text-green-400' },
        { label: 'Vistas Únicas', value: '--', icon: Users, color: 'text-yellow-400' },
    ]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            // Fetch Products Count
            const { count: productsCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            // Fetch Total Page Views
            const { count: viewsCount, data: viewsData } = await supabase
                .from('analytics')
                .select('created_at')
                .order('created_at', { ascending: true });

            // Fetch Unique Sessions (approximate)
            const { data: uniqueData } = await supabase
                .from('analytics')
                .select('session_id');

            const uniqueSessions = new Set(uniqueData?.map((d: any) => d.session_id)).size;

            setStats([
                { label: 'Productos Activos', value: productsCount?.toString() || '0', icon: Package, color: 'text-blue-400' },
                { label: 'Visitas Totales', value: viewsCount?.toString() || '0', icon: TrendingUp, color: 'text-green-400' },
                { label: 'Vistas Únicas', value: uniqueSessions.toString() || '0', icon: Users, color: 'text-yellow-400' },
            ]);

            // Process Chart Data (last 7 days)
            if (viewsData) {
                const dayMap: Record<string, number> = {};
                viewsData.forEach((view: any) => {
                    const date = new Date(view.created_at).toLocaleDateString('es-ES', { weekday: 'short' });
                    dayMap[date] = (dayMap[date] || 0) + 1;
                });

                const formattedData = Object.entries(dayMap).map(([day, visits]) => ({
                    day,
                    visits
                })).slice(-7);
                setChartData(formattedData);
            }
        };

        fetchStats();
    }, [supabase]);


    return (
        <div className="max-w-6xl mx-auto">
            {/* Greeting */}
            <div className="mb-12">
                <h1 className="text-4xl font-black text-white font-brand uppercase tracking-tighter italic">Panel de Control</h1>
                <p className="text-[#a8a3b5] mt-2 font-bold uppercase tracking-widest text-xs">Bienvenido de nuevo, Admin</p>
            </div>

            {/* Main Stats and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Stats Columns */}
                <div className="lg:col-span-1 grid grid-cols-1 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[#18131e] border border-white/5 p-6 rounded-[2rem] shadow-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest">En Vivo</span>
                            </div>
                            <p className="text-3xl font-black text-white italic">{stat.value}</p>
                            <p className="text-[#a8a3b5] text-[10px] font-bold uppercase tracking-tight mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Chart Column */}
                <div className="lg:col-span-2 bg-[#18131e] border border-white/5 p-8 rounded-[2rem] shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Tendencia de Visitas</h3>
                            <p className="text-[#6d667c] text-[10px] font-bold uppercase tracking-widest">Últimos 7 días</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Tiempo Real</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6d667c', fontSize: 10, fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1b1622', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                    itemStyle={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}
                                    cursor={{ stroke: 'rgba(236,72,153,0.2)', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Main Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                {[
                    { title: 'Inventario', desc: 'Gestionar productos', icon: Package, color: 'from-blue-600 to-indigo-600', href: '/admin/products' },
                    { title: 'Categorías', desc: 'Gestionar Marcas/Tipos', icon: LayoutGrid, color: 'from-orange-600 to-red-600', href: '/admin/categories' },
                    { title: 'Testimonios', desc: 'Aprobar comentarios', icon: MessageCircle, color: 'from-pink-600 to-rose-600', href: '/admin/testimonials' },
                    { title: 'Destacados', desc: 'Producto de la semana', icon: Star, color: 'from-purple-600 to-pink-600', href: '/admin/featured' },
                    { title: 'Centro FAQ', desc: 'Preguntas Frecuentes', icon: MessageSquare, color: 'from-green-600 to-emerald-600', href: '/admin/faq' }
                ].map((tool) => (
                    <Link key={tool.title} href={tool.href} className="group bg-[#18131e] border border-white/5 rounded-[2rem] p-6 shadow-xl hover:border-primary/20 transition-all">
                        <div className={cn("inline-flex p-3 rounded-xl bg-gradient-to-br mb-4", tool.color)}>
                            <tool.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{tool.title}</h3>
                        <p className="text-[#6d667c] text-[10px] font-bold uppercase tracking-tight">{tool.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Secondary Actions */}
            <div className="bg-[#1b1622] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                        <Settings className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight italic">Ajustes del Sitio</h4>
                        <p className="text-[#6d667c] text-xs">Gestiona tu WhatsApp y configuración global</p>
                    </div>
                </div>
                <Link
                    href="/admin/settings"
                    className="px-8 py-4 bg-primary/10 hover:bg-primary/20 text-primary font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                >
                    Gestionar Ajustes
                </Link>
            </div>
        </div>
    );
}

function Settings(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
