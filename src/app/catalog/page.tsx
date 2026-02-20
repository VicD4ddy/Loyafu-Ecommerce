"use client";

import { SlidersHorizontal, ChevronDown, ArrowUpDown, X, Search, LayoutGrid, List } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Suspense } from 'react';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

function CatalogContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(query || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const router = useRouter();
    const ITEMS_PER_PAGE = 12;

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/catalog?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push('/catalog');
        }
    };

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories([category]);
        }
        setCurrentPage(1);
    };

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        const matchesSearch = !query ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(query.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.priceUSD - b.priceUSD;
            case 'price-desc':
                return b.priceUSD - a.priceUSD;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;

        if (totalPages <= maxVisibleButtons) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (currentPage <= 3) {
                buttons.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                buttons.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                buttons.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return buttons.map((btn, index) => (
            <button
                key={index}
                onClick={() => typeof btn === 'number' ? setCurrentPage(btn) : null}
                disabled={typeof btn !== 'number'}
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors",
                    btn === currentPage
                        ? "bg-primary text-white shadow-lg"
                        : typeof btn === 'number'
                            ? "hover:bg-primary/10 text-slate-600"
                            : "text-slate-400 cursor-default"
                )}
            >
                {btn}
            </button>
        ));
    };

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'default', label: 'Más relevantes' },
        { value: 'price-asc', label: 'Precio: menor a mayor' },
        { value: 'price-desc', label: 'Precio: mayor a menor' },
        { value: 'name-asc', label: 'Nombre A-Z' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-16 pb-8">

            {/* Breadcrumbs & Hero */}
            <div className="mb-4 md:mb-6 space-y-1.5">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-1">
                    <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-background-dark">Nuestro Catálogo</h1>
                </div>

                {/* Mobile Tools (Search & Horizontal Categories) */}
                <div className="lg:hidden space-y-2">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar producto, marca..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-primary/15 rounded-xl text-sm font-bold placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => { setSearchTerm(''); router.push('/catalog'); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </form>

                    {/* Horizontal Category Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
                        <button
                            onClick={() => setSelectedCategories([])}
                            className={cn(
                                "px-4 py-1.5 rounded-full font-bold text-[11px] whitespace-nowrap border transition-all shadow-sm",
                                selectedCategories.length === 0
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white border-primary/10 text-slate-600"
                            )}
                        >
                            Todos
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap border transition-all shadow-sm",
                                    selectedCategories.includes(cat)
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-primary/10 text-slate-600"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {query && (
                    <p className="text-sm font-bold text-primary/60 animate-in fade-in slide-in-from-left-4">
                        Resultados para: &ldquo;{query}&rdquo; ({sortedProducts.length})
                    </p>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary/40 mb-4">Categorías</h3>
                        <div className="space-y-2">
                            {CATEGORIES.map((cat) => (
                                <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        className="rounded-full text-primary focus:ring-primary w-5 h-5 border-primary/20"
                                    />
                                    <span className={cn(
                                        "font-bold transition-colors",
                                        selectedCategories.includes(cat) ? "text-primary" : "text-slate-700 group-hover:text-primary"
                                    )}>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>


                {/* Product Grid Area */}
                <div className="flex-1">
                    {/* Sorting Bar */}
                    <div className="hidden md:flex items-center justify-between mb-8">
                        <span className="text-sm font-bold text-primary/40 font-black">Mostrando {paginatedProducts.length} de {sortedProducts.length} productos</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }}
                                className="appearance-none pl-9 pr-10 py-2.5 border border-primary/10 rounded-full font-bold text-sm bg-white cursor-pointer hover:border-primary/30 transition-colors"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
                        </div>
                    </div>

                    {/* Active filters pills (desktop) */}
                    {selectedCategories.length > 0 && (
                        <div className="hidden md:flex items-center gap-2 mb-6 flex-wrap">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtros:</span>
                            {selectedCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full hover:bg-primary/20 transition-colors"
                                >
                                    {cat}
                                    <X className="w-3 h-3" />
                                </button>
                            ))}
                            <button
                                onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
                                className="text-xs font-bold text-red-500 hover:text-red-700 ml-2"
                            >
                                Limpiar todo
                            </button>
                        </div>
                    )}

                    {/* Grid / List */}
                    {paginatedProducts.length > 0 ? (
                        <div className={cn(
                            viewMode === 'grid'
                                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6"
                                : "flex flex-col gap-2"
                        )}>
                            {paginatedProducts.map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-primary/5 rounded-3xl">
                            <p className="text-xl font-bold text-primary/50">No se encontraron productos en esta categoría.</p>
                            <button onClick={() => setSelectedCategories([])} className="mt-4 text-primary font-bold underline">Limpiar filtros</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-primary/10 transition-colors text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                &lt;
                            </button>

                            {renderPaginationButtons()}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-primary/10 transition-colors text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Catalog() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <CatalogContent />
        </Suspense>
    );
}

