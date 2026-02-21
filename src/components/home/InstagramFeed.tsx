'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Play, Layers, Heart, MessageCircle, Calendar, ExternalLink, Sparkles, Zap, Tag, Image as ImageIcon, Bookmark } from 'lucide-react';
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

                {/* Profile Header - Optimized for mobile responsiveness */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-12 mb-8 md:mb-12 border border-slate-100 shadow-2xl animate-in fade-in slide-in-from-top-6 duration-1000 max-w-2xl mx-auto ring-1 ring-slate-200/50 overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-center md:items-start text-center md:text-left">
                        {/* Profile Picture with Instagram Gradient */}
                        <div className="relative flex-shrink-0">
                            <div className="w-28 h-28 md:w-48 md:h-48 rounded-full p-1.5 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-2xl">
                                <div className="w-full h-full rounded-full bg-white p-1">
                                    <div className="w-full h-full rounded-full relative overflow-hidden bg-slate-50 flex items-center justify-center">
                                        <Image
                                            src="/assets/brand/logo-footer.png"
                                            fill
                                            className="object-contain p-0.5"
                                            alt="Loyafu Profile"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info & Bio */}
                        <div className="flex-1 space-y-5 md:space-y-6 w-full min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h3 className="font-extrabold text-background-dark text-2xl md:text-3xl tracking-tighter truncate">loyafu.ve</h3>
                                    <div className="text-[#0095f6] flex items-center justify-center flex-shrink-0">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-3.3-3.3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l1.9 1.9 5.3-5.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-6 6c-.4.4-1 .4-1.4 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <Link
                                    href="https://www.instagram.com/loyafu.ve/"
                                    target="_blank"
                                    className="bg-[#9d33f7] text-white text-sm font-black px-6 md:px-12 py-3 rounded-2xl hover:bg-primary-dark transition-all inline-block w-full md:w-fit shadow-lg shadow-purple-500/20 active:scale-95 whitespace-nowrap"
                                >
                                    Follow
                                </Link>
                            </div>

                            {/* Bio Info with exact icons */}
                            <div className="text-[14px] md:text-[16px] text-background-dark leading-snug space-y-1">
                                <p className="font-extrabold mb-1">Loyafu Beauty | Makeup & Skincare</p>
                                <p className="font-medium flex items-center justify-center md:justify-start gap-2">✨ Tu mejor versión empieza aquí</p>
                                <p className="font-medium flex items-center justify-center md:justify-start gap-2">🌿 Cosmética premium y en tendencia</p>
                                <p className="font-medium flex items-center justify-center md:justify-start gap-2">📦 Envíos a todo el país</p>
                                <Link href="/" className="text-[#00376b] font-bold hover:underline block mt-2 text-base md:text-lg">www.loyafu.ve/</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters - Pill Redesign matching screenshot */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8 md:mb-12">
                    {[
                        { id: 'ALL', label: 'TODOS', icon: Layers },
                        { id: 'IMAGE', label: 'FOTOS', icon: ImageIcon },
                        { id: 'VIDEO', label: 'REELS', icon: Play },
                        { id: 'CAROUSEL_ALBUM', label: 'COLECCIÓN', icon: Bookmark }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id as FilterType)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[11px] font-black transition-all tracking-[0.1em] uppercase shadow-sm",
                                filter === btn.id
                                    ? "bg-[#9d33f7] text-white shadow-xl shadow-purple-500/30 scale-105"
                                    : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-background-dark"
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
                                    <div className="w-full h-full relative">
                                        {post.media_type === 'VIDEO' && !post.thumbnail_url ? (
                                            <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center p-4 text-center">
                                                <Play className="w-8 h-8 text-white/50 mb-2" />
                                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Reel en Instagram</span>
                                            </div>
                                        ) : (
                                            <Image
                                                src={post.media_type === 'VIDEO' ? (post.thumbnail_url || '') : post.media_url}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                alt={post.caption ? post.caption.slice(0, 30) : 'Instagram Post'}
                                                unoptimized
                                            />
                                        )}
                                    </div>

                                    {/* Video / Carousel indicators for mobile visibility */}
                                    <div className="absolute bottom-3 right-3 z-10 md:hidden">
                                        {post.media_type === 'VIDEO' && (
                                            <div className="bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white">
                                                <Play className="w-3 h-3 fill-current" />
                                            </div>
                                        )}
                                        {post.media_type === 'CAROUSEL_ALBUM' && (
                                            <div className="bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white">
                                                <Layers className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>

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
