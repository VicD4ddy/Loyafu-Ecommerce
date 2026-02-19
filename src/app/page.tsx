import Image from "next/image";
import Link from 'next/link';
import { ArrowRight, Zap, ShoppingBag, MessageCircle, Banknote, Sparkles, DollarSign } from 'lucide-react';
import CombosSection from '@/components/home/CombosSection';
import InstagramFeed from '@/components/home/InstagramFeed';
import Testimonials from '@/components/home/Testimonials';
import { PRODUCTS } from '@/data/products';



export default function Home() {
  // Extract unique categories, filter out empty ones, and normalize
  const categories = Array.from(new Set(PRODUCTS.map(p => p.category))).filter(Boolean);

  return (
    <div className="space-y-8 md:space-y-20">

      {/* Hero Section */}
      <section className="px-6 max-w-7xl mx-auto pt-6 md:pt-32">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 min-h-[400px] md:min-h-[600px] flex items-center p-4 md:p-16 shadow-2xl shadow-primary/10">
          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          {/* Decorative Sticker */}
          <div className="absolute top-10 right-10 w-24 h-24 z-20 hidden lg:block animate-float">
            <Image src="/assets/brand/sticker-02.png" alt="Sticker" width={100} height={100} className="object-contain rotate-12 opacity-80" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center z-10 w-full">
            <div className="space-y-8 text-center md:text-left">
              {/* Hero Content */}
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 text-center md:text-left">
                <h1 className="text-5xl md:text-8xl font-black leading-[0.9] text-background-dark tracking-tighter font-brand">
                  TU MEJOR VERSIÓN <span className="text-primary block md:inline">EMPIEZA HOY</span>
                </h1>
                <p className="text-lg text-background-dark/70 max-w-md font-medium mx-auto md:mx-0">
                  Lleva los productos de belleza esenciales para ti o tu negocio. Te acompañamos a elevar tu pasión al siguiente nivel.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                  <Link href="/catalog" className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/20 flex items-center justify-center">
                    Comprar Ahora
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center mt-4 md:mt-0">
              <div className="relative w-full aspect-square max-w-[450px]">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <Image
                  src="/hero.gif"
                  alt="Hero Animation"
                  fill
                  unoptimized // Important: Keeps the GIF animation playing smoothly
                  className="relative z-10 object-cover rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                />


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-4 md:py-12 bg-white overflow-hidden border-y border-primary/5 relative">
        {/* Gradient Mask for edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee items-center gap-10 md:gap-16 px-4 md:px-16 w-max will-change-transform">
            {[...categories, ...categories, ...categories, ...categories].map((cat, i) => (
              <span
                key={`${cat}-${i}`}
                className="flex-shrink-0 text-2xl md:text-5xl font-black text-primary/40 uppercase italic font-brand tracking-widest"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="py-10 md:py-20 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-background-dark">
              ¿Cómo Comprar?
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Tu pedido listo en 3 simples pasos. Fácil, rápido y seguro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="bg-background-light p-8 rounded-3xl relative group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
                1
              </div>
              <div className="mt-6 space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-background-dark">Llena tu Carrito</h3>
                <p className="text-slate-600 leading-relaxed">
                  Navega por nuestro catálogo y agrega tus productos favoritos. Si quieres precios al mayor, solo cumple con la cantidad mínima de cada producto.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-background-light p-8 rounded-3xl relative group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-white border-2 border-primary text-primary rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                2
              </div>
              <div className="mt-6 space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-background-dark">Envía tu Pedido</h3>
                <p className="text-slate-600 leading-relaxed">
                  Haz clic en "Completar Pedido". Esto abrirá WhatsApp con tu lista detallada. ¡No edites el mensaje para agilizar nuestro proceso!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-background-light p-8 rounded-3xl relative group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                3
              </div>
              <div className="mt-6 space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
                  <Banknote className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-background-dark">Confirma y Paga</h3>
                <p className="text-slate-600 leading-relaxed">
                  Te confirmaremos disponibilidad y total a pagar. Realiza tu pago (Pago Móvil, Zelle o Efectivo), envía el comprobante y ¡listo!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Combos Section */}
      <CombosSection />

      {/* Wholesale Info Section */}
      <section id="wholesale-info" className="py-6 md:py-20 px-4 md:px-6 bg-background-dark relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-primary/20 border border-primary/30 text-primary-light px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                Oportunidad de Negocio
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Emprende con <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary-light">
                Loyafu Beauty
              </span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Ofrecemos márgenes de ganancia competitivos para que inicies o hagas crecer tu negocio de maquillaje. Sin montos mínimos de compra global, solo mínimos por producto.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-light flex-shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Precios Automatizados</h4>
                  <p className="text-slate-400 text-sm">El carrito calcula automáticamente tus precios de mayorista cuando cumples la cantidad mínima (generalmente 3 unidades).</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Catálogo Actualizado</h4>
                  <p className="text-slate-400 text-sm">Productos en tendencia y de alta rotación. <Link href="/catalog" className="text-primary-light hover:underline">Ver catálogo completo</Link>.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                Empezar a Comprar
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src="/assets/home/wholesale_collage.jpg"
                alt="Wholesale Makeup"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-300 relative overflow-hidden">
                        <Image src={`/products/salome-premium-01.png`} width={40} height={40} className="object-cover" alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold ml-2">+50 Emprendedoras</span>
                </div>
                <p className="text-sm text-slate-300">Confían en nosotros para surtir sus negocios cada semana.</p>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-white text-background-dark p-6 rounded-2xl shadow-xl transform rotate-6 animate-float">
              <div className="text-center">
                <span className="block text-3xl font-black text-primary">30%</span>
                <span className="text-sm font-bold uppercase tracking-wider">Margen Promedio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Testimonials */}
      <Testimonials />

    </div>
  );
}
