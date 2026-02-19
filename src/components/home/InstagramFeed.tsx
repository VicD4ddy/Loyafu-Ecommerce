'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Play, Layers, Heart, MessageCircle, Calendar, ExternalLink, Sparkles, Zap, Tag } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

interface InstagramUser {
    username: string;
    media_count: number;
    account_type: string;
}

interface InstagramMedia {
    id: string;
    caption: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
    timestamp: string;
}

type FilterType = 'ALL' | 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

const MOCK_USER: InstagramUser = {
    username: 'loyafu.ve',
    media_count: 50,
    account_type: 'BUSINESS'
};

const MOCK_FEED: InstagramMedia[] = [
    {
        id: 'mock-1',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=1000',
        permalink: 'https://instagram.com',
        caption: 'Glow up with our new collection! ✨ #loyafu #skincare #Nuevo',
        timestamp: new Date().toISOString()
    },
    {
        id: 'mock-2',
        media_type: 'VIDEO',
        media_url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1000',
        thumbnail_url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1000',
        permalink: 'https://instagram.com',
        caption: 'Self care sunday vibes 🧖‍♀️ #Relax #SkinTip',
        timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'mock-3',
        media_type: 'CAROUSEL_ALBUM',
        media_url: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=1000',
        permalink: 'https://instagram.com',
        caption: 'Texture tuesday 💧 #Glow #Promo',
        timestamp: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: 'mock-4',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=1000',
        permalink: 'https://instagram.com',
        caption: 'Join the community! Link in bio.',
        timestamp: new Date(Date.now() - 604800000).toISOString()
    }
];

export default function InstagramFeed() {
    const [user, setUser] = useState<InstagramUser | null>(null);
    const [posts, setPosts] = useState<InstagramMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('ALL');

    useEffect(() => {
        const fetchInstagramFeed = async () => {
            try {
                const res = await fetch('/api/instagram/feed');
                if (!res.ok) throw new Error('Failed to fetch from internal API');

                const data = await res.json();

                if (data.user) {
                    setUser(data.user);
                }
                if (data.data) {
                    setPosts(data.data);
                }
            } catch (error) {
                console.error("Instagram fetch error:", error);
                // Fallback to mocks on error
                setUser(MOCK_USER);
                setPosts(MOCK_FEED);
            } finally {
                setLoading(false);
            }
        };

        fetchInstagramFeed();
    }, []);

    const filteredPosts = useMemo(() => {
        if (filter === 'ALL') return posts.slice(0, 4);
        return posts.filter(p => p.media_type === filter).slice(0, 4);
    }, [posts, filter]);

    const formatRelativeTime = (isoString: string) => {
        const now = new Date();
        const past = new Date(isoString);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Ahora';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)}d`;
        return past.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' });
    };

    const extractHashtags = (caption: string) => {
        if (!caption) return [];
        const matches = caption.match(/#[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+/g);
        return matches ? matches.map(h => h.slice(1)) : [];
    };

    const getBadgeFromHashtags = (hashtags: string[]) => {
        const lowercaseHashtags = hashtags.map(h => h.toLowerCase());
        if (lowercaseHashtags.includes('nuevo')) return { label: 'Nuevo', color: 'bg-blue-500', icon: Sparkles };
        if (lowercaseHashtags.includes('promo')) return { label: 'Promo', color: 'bg-amber-500', icon: Zap };
        if (lowercaseHashtags.includes('tip') || lowercaseHashtags.includes('tutorial')) return { label: 'Tip', color: 'bg-emerald-500', icon: Tag };
        return null;
    };

    return (
        <section className="bg-brand-pattern bg-cover bg-center py-8 md:py-20 px-4 md:px-6 relative after:absolute after:inset-0 after:bg-white/95 after:backdrop-blur-[2px]">
            <div className="max-w-7xl mx-auto relative z-10">

                {/* Profile Header - Redesigned matching screenshot */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-12 mb-8 md:mb-12 border border-primary/10 shadow-xl animate-in fade-in slide-in-from-top-6 duration-1000 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start text-center md:text-left">
                        {/* Profile Picture */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                                <div className="w-full h-full rounded-full bg-white p-0.5">
                                    <div className="w-full h-full rounded-full relative overflow-hidden bg-slate-50 flex items-center justify-center">
                                        <Instagram className="w-8 h-8 md:w-16 md:h-16 text-primary/10" />
                                        <Logo className="absolute inset-0 w-full h-full p-4 md:p-7" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info & Stats Container */}
                        <div className="flex-1 space-y-6">
                            {/* Top row: Username & Link */}
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <Link
                                    href="https://www.instagram.com/loyafu.ve/"
                                    target="_blank"
                                    className="flex items-center justify-center md:justify-start gap-2 hover:opacity-80 transition-opacity"
                                >
                                    <h3 className="font-black text-background-dark text-xl md:text-2xl tracking-tight">loyafu.ve</h3>
                                    <div className="bg-[#0095f6] rounded-full p-0.5 shadow-sm">
                                        <svg viewBox="0 0 24 24" className="w-3 h-3 md:w-3.5 md:h-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                        </svg>
                                    </div>
                                </Link>
                                <Link
                                    href="https://www.instagram.com/loyafu.ve/"
                                    target="_blank"
                                    className="bg-primary text-white text-sm font-bold px-6 py-1.5 rounded-lg hover:bg-primary-dark transition-colors inline-block w-fit mx-auto md:mx-0"
                                >
                                    Seguir
                                </Link>
                            </div>

                            {/* Middle row: Stats */}
                            <div className="flex items-center justify-center md:justify-start gap-8 md:gap-12 border-y md:border-none py-4 md:py-0 border-primary/5">
                                <div className="flex flex-col md:flex-row md:items-center md:gap-1.5">
                                    <span className="text-base md:text-lg font-black text-background-dark">{user?.media_count || 50}</span>
                                    <span className="text-[10px] md:text-sm text-slate-500 md:text-background-dark/70 font-medium">publicaciones</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-1.5">
                                    <span className="text-base md:text-lg font-black text-background-dark">14,1k</span>
                                    <span className="text-[10px] md:text-sm text-slate-500 md:text-background-dark/70 font-medium">seguidores</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-1.5">
                                    <span className="text-base md:text-lg font-black text-background-dark">1.000</span>
                                    <span className="text-[10px] md:text-sm text-slate-500 md:text-background-dark/70 font-medium">seguidos</span>
                                </div>
                            </div>

                            {/* Bottom row: Bio Info */}
                            <div className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed max-w-md">
                                <p className="font-bold text-background-dark block mb-1">Loyafu Beauty | Makeup & Skincare</p>
                                <p>✨ Tu mejor versión empieza aquí</p>
                                <p>🌿 Cosmética premium y en tendencia</p>
                                <p>📦 Envíos a todo el país</p>
                                <Link href="/" className="text-blue-900 font-bold hover:underline block mt-2">www.loyafu.ve/</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters - Redesigned as Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8 md:mb-12">
                    {[
                        { id: 'ALL', label: 'TODOS', icon: Layers },
                        { id: 'IMAGE', label: 'FOTOS', icon: MessageCircle },
                        { id: 'VIDEO', label: 'REELS', icon: Play },
                        { id: 'CAROUSEL_ALBUM', label: 'COLECCIÓN', icon: Layers }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id as FilterType)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-[11px] font-black transition-all tracking-[0.1em] uppercase shadow-sm",
                                filter === btn.id
                                    ? "bg-[#9d33f7] text-white shadow-lg shadow-purple-500/30 scale-105"
                                    : "bg-white text-background-dark/40 border border-slate-200 hover:border-primary/40 hover:text-primary"
                            )}
                        >
                            <btn.icon className={cn("w-4 h-4", filter === btn.id && "fill-current")} />
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Feed Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "aspect-[9/16] rounded-2xl bg-slate-200 animate-pulse",
                                    i % 2 !== 0 && "md:translate-y-6"
                                )}
                            />
                        ))
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => {
                            const hashtags = extractHashtags(post.caption);
                            const badge = getBadgeFromHashtags(hashtags);

                            return (
                                <Link
                                    key={post.id}
                                    href={post.permalink}
                                    target="_blank"
                                    className={cn(
                                        "aspect-[9/16] rounded-2xl overflow-hidden relative group block bg-slate-100 animate-fadeInUp shadow-md",
                                        index % 2 !== 0 && "md:translate-y-6"
                                    )}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Image
                                        src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={post.caption ? post.caption.slice(0, 30) : 'Instagram Post'}
                                        unoptimized
                                    />

                                    {/* Badges */}
                                    {badge && (
                                        <div className={cn(
                                            "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider z-20 shadow-lg",
                                            badge.color
                                        )}>
                                            <badge.icon className="w-3 h-3" />
                                            {badge.label}
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                                        <div className="flex items-center justify-between mb-3 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-primary-light" />
                                                {formatRelativeTime(post.timestamp)}
                                            </div>
                                            <ExternalLink className="w-3 h-3" />
                                        </div>

                                        <p className="text-white text-[11px] font-bold line-clamp-2 leading-relaxed mb-3">
                                            {post.caption || 'Ver en Instagram'}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                                            {hashtags.slice(0, 2).map((h, i) => (
                                                <span key={i} className="text-[9px] font-black text-primary-light uppercase">#{h}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Media Type Indicators */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                                        {post.media_type === 'VIDEO' && (
                                            <div className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white border border-white/20 shadow-xl">
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                            </div>
                                        )}
                                        {post.media_type === 'CAROUSEL_ALBUM' && (
                                            <div className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white border border-white/20 shadow-xl">
                                                <Layers className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center grayscale opacity-50">
                            <Layers className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p className="font-bold text-slate-400">No hay publicaciones de este tipo aún.</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 md:mt-24 text-center">
                    <div className="inline-block p-1 rounded-full bg-slate-100 border border-slate-200">
                        <Link
                            href="https://www.instagram.com/loyafu.ve/"
                            target="_blank"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-background-dark text-white rounded-full font-black text-sm hover:bg-primary transition-all shadow-2xl active:scale-[0.98] group"
                        >
                            <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            VER TODO EL FEED
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
