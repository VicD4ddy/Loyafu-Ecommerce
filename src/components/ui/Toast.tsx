"use client";

import { create } from 'zustand';
import { CheckCircle2, ShoppingBag, X, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Toast store
interface ToastState {
    message: string;
    visible: boolean;
    showToast: (message: string) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    message: '',
    visible: false,
    showToast: (message: string) => {
        set({ message, visible: true });
    },
    hideToast: () => set({ visible: false }),
}));

// Toast UI component
export default function Toast() {
    const { message, visible, hideToast } = useToastStore();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (visible) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                hideToast();
            }, 3000); // Slightly longer for premium feel
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [visible, hideToast]);

    if (!visible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] w-fit max-w-[90vw]",
                "animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out"
            )}
        >
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative flex items-center gap-4 bg-white/80 backdrop-blur-2xl border border-primary/20 px-5 py-4 rounded-2xl shadow-2xl shadow-primary/10 transition-all">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary relative overflow-hidden">
                            <ShoppingBag className="w-5 h-5 relative z-10" />
                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <CheckCircle2 className="w-4 h-4 text-green-500 bg-white rounded-full" />
                        </div>
                    </div>

                    <div className="flex flex-col min-w-[180px]">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 leading-none mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Actualización
                        </span>
                        <span className="text-sm font-bold text-background-dark leading-tight">{message}</span>
                    </div>

                    <button
                        onClick={hideToast}
                        className="p-1.5 hover:bg-primary/5 rounded-lg text-primary/30 hover:text-primary transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Progress Bar Timer */}
                    <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/40 animate-toast-progress" />
                    </div>
                </div>
            </div>
        </div>
    );
}
