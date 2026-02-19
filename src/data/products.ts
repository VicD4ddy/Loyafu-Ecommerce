import { Product } from "@/store/useCartStore";

export const PRODUCTS: Product[] = [
    // --- Salome Makeup ---
    {
        id: 'salome-1',
        name: 'Polvo suelto Premium Oil Free Salome',
        priceUSD: 10.50,
        description: 'Mayor: $7.42 (a partir de 2 unidades). Tonos variados.',
        category: 'Salome Makeup',
        image: '/products/salome-premium-01.png',
        images: ['/products/salome-premium-01.png', '/products/salome-premium-swatches.jpg'],
        wholesalePrice: 7.42,
        wholesaleMin: 2
    },
    {
        id: 'salome-2',
        name: 'Polvo suelto Salome',
        priceUSD: 7.00,
        description: 'Mayor: $4.78 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-loose-01.png',
        images: ['/products/salome-loose-01.png', '/products/salome-loose-swatches.png'],
        wholesalePrice: 4.78,
        wholesaleMin: 3
    },
    {
        id: 'salome-3',
        name: 'Polvo compacto doble función Salome',
        priceUSD: 6.50,
        description: 'Mayor: $4.48 (a partir de 3 unidades). Todos los tonos disponibles.',
        category: 'Salome Makeup',
        image: '/products/salome-compacto-doble.jpg',
        wholesalePrice: 4.48,
        wholesaleMin: 3
    },
    {
        id: 'salome-4',
        name: 'Polvo compacto sencillo Salome',
        priceUSD: 4.00,
        description: 'Mayor: $2.72 (a partir de 3 unid). Todos los tonos. Cobertura excelente, acabado matte.',
        category: 'Salome Makeup',
        image: '/products/salome-compacto-sencillo.jpg',
        wholesalePrice: 2.72,
        wholesaleMin: 3
    },
    {
        id: 'salome-5',
        name: 'Base de vidrio (gotero) Salome',
        priceUSD: 6.00,
        description: '',
        category: 'Salome Makeup',
        image: '/products/salome-base-gotero-02.png',
        images: ['/products/salome-base-gotero-02.png', '/products/salome-base-gotero-01.jpg'],
    },
    {
        id: 'salome-6',
        name: 'Base Velvet Fundation Salome',
        priceUSD: 3.00,
        description: '💜 Promo: 2 x $5.00. Cobertura media constructible.',
        category: 'Salome Makeup',
        image: '/products/salome-velvet-foundation.png',
        images: ['/products/salome-velvet-foundation.png', '/products/salome-velvet-swatches.png'],
        wholesalePrice: 2.50,
        wholesaleMin: 2
    },
    {
        id: 'salome-7',
        name: 'Base matte libre de aceites Salome',
        priceUSD: 9.50,
        description: 'Mayor: $6.69 (a partir de 3 unidades). Tonos variados. Acabado matte.',
        category: 'Salome Makeup',
        image: '/products/salome-base-matte-01.png',
        images: ['/products/salome-base-matte-01.png', '/products/salome-base-matte-swatches.png'],
        wholesalePrice: 6.69,
        wholesaleMin: 3
    },
    {
        id: 'salome-8',
        name: 'Corrector Premium Salome',
        priceUSD: 9.00,
        description: 'Mayor: $6.39 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-corrector-premium.png',
        wholesalePrice: 6.39,
        wholesaleMin: 3
    },
    {
        id: 'salome-9',
        name: 'Corrector hidratante efecto lifting Salome',
        priceUSD: 9.00,
        description: 'Mayor: $6.39 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-corrector-lifting-01.png',
        images: ['/products/salome-corrector-lifting-01.png', '/products/salome-corrector-lifting-swatches.png'],
        wholesalePrice: 6.39,
        wholesaleMin: 3
    },
    {
        id: 'salome-10',
        name: 'Rimel Sencillo Salome',
        priceUSD: 6.00,
        description: 'Mayor: $4.19 (a partir de 3 unidades). Ambos disponibles (cepillo doble función o normal).',
        category: 'Salome Makeup',
        image: 'https://placehold.co/600x400.png?text=Salome+Rimel',
        wholesalePrice: 4.19,
        wholesaleMin: 3
    },
    {
        id: 'salome-11',
        name: 'Rimel máster lash Salome',
        priceUSD: 6.00,
        description: 'Mayor: $4.19 (a partir de 3 unidades). Definición y longitud.',
        category: 'Salome Makeup',
        image: 'https://placehold.co/600x400.png?text=Rimel+Master',
        wholesalePrice: 4.19,
        wholesaleMin: 3
    },
    {
        id: 'salome-12',
        name: 'Rimel dúo Salome',
        priceUSD: 8.00,
        description: 'Mayor: $5.66 (a partir de 3 unidades). Doble cepillo para máximo volumen.',
        category: 'Salome Makeup',
        image: 'https://placehold.co/600x400.png?text=Rimel+Duo',
        wholesalePrice: 5.66,
        wholesaleMin: 3
    },
    {
        id: 'salome-13',
        name: 'Rubor líquido Salome',
        priceUSD: 7.50,
        description: 'Mayor: $5.22 (a partir de 3 unidades, uno de cada tono).',
        category: 'Salome Makeup',
        image: '/products/salome-rubor-liquido.png',
        images: ['/products/salome-rubor-liquido.png', '/products/salome-rubor-liquido-swatches.png'],
        wholesalePrice: 5.22,
        wholesaleMin: 3
    },
    {
        id: 'salome-14',
        name: 'Paleta de rubor Salome',
        priceUSD: 9.50,
        description: 'Mayor: $6.69 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-paleta-rubor.jpg',
        wholesalePrice: 6.69,
        wholesaleMin: 3
    },
    {
        id: 'salome-15',
        name: 'Rubor sencillo Salome',
        priceUSD: 6.50,
        description: 'Mayor: $4.48 (a partir de 3 unidades, tonos variados).',
        category: 'Salome Makeup',
        image: '/products/salome-rubor-sencillo.png',
        images: ['/products/salome-rubor-sencillo.png', '/products/salome-rubor-sencillo-tonos.jpg'],
        wholesalePrice: 4.48,
        wholesaleMin: 3
    },
    {
        id: 'salome-16',
        name: 'Rubor premium Salome',
        priceUSD: 6.00,
        description: 'Precio único: $6.00.',
        category: 'Salome Makeup',
        image: '/products/salome-rubor-premium.png',
        images: ['/products/salome-rubor-premium.png', '/products/salome-rubor-premium-tonos.jpg'],
    },
    {
        id: 'salome-17',
        name: 'Paleta de contorno, rubor e iluminador Salome',
        priceUSD: 8.50,
        description: 'Mayor: $5.95 (a partir de 3 unidades, una de cada tono).',
        category: 'Salome Makeup',
        image: '/products/salome-paleta-trio.png',
    },
    {
        id: 'salome-18',
        name: 'Contorno en crema Salome',
        priceUSD: 8.50,
        description: 'Mayor: $5.95 (a partir de 3 unidades, uno de cada tono).',
        category: 'Salome Makeup',
        image: '/products/salome-contorno-crema.png',
    },
    {
        id: 'salome-19',
        name: 'Barra de contorno Salome',
        priceUSD: 7.50,
        description: 'Mayor: $5.22 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-barra-contorno.jpg',
    },
    {
        id: 'salome-20',
        name: 'Paleta de contorno x4 Salome',
        priceUSD: 9.50,
        description: 'Mayor: $6.69 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-paleta-contorno-x4.png',
    },
    {
        id: 'salome-21',
        name: 'Sacapuntas doble Salome',
        priceUSD: 2.50,
        description: 'Mayor: $1.54 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-sacapuntas.png',
    },
    {
        id: 'salome-22',
        name: 'Lápiz Jumbo Vegano Salome',
        priceUSD: 4.00,
        description: 'Mayor: $3.01 (a partir de 3 unidades). Consultar combinaciones.',
        category: 'Salome Makeup',
        image: '/products/salome-jumbo-vegano.jpg',
        images: ['/products/salome-jumbo-vegano.jpg', '/products/salome-jumbo-vegano-swatches.png'],
    },
    {
        id: 'salome-23',
        name: 'Lápiz Jumbo Matte Salome',
        priceUSD: 3.00,
        description: 'Mayor: $2.28 (a partir de 3 unidades, tonos variados).',
        category: 'Salome Makeup',
        image: '/products/salome-jumbo-matte.png',
        images: ['/products/salome-jumbo-matte.png', '/products/salome-jumbo-matte-swatches.png'],
    },

    {
        id: 'salome-24',
        name: 'Lip dúo Salome',
        priceUSD: 4.19,
        description: 'Mayor: $4.19 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-lip-duo.png',
    },
    {
        id: 'salome-25',
        name: 'Labial Sencillo Salome',
        priceUSD: 4.00,
        description: 'Mayor: $3.01 (a partir de 3 unidades). Consultar combinaciones.',
        category: 'Salome Makeup',
        image: '/products/salome-labial-sencillo.png',
        images: ['/products/salome-labial-sencillo.png', '/products/salome-labial-sencillo-swatches.png'],
    },
    {
        id: 'salome-26',
        name: 'Labial imantado Salome',
        priceUSD: 5.50,
        description: 'Mayor: $3.75 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-labial-imantado.png',
        images: ['/products/salome-labial-imantado.png', '/products/salome-labial-imantado-swatches.png'],
    },
    {
        id: 'salome-27',
        name: 'Labial matte Salome',
        priceUSD: 4.50,
        description: 'Mayor: $3.01 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-labial-matte.jpg',
        images: ['/products/salome-labial-matte.jpg', '/products/salome-labial-matte-swatches.png'],
    },
    {
        id: 'salome-28',
        name: 'Brillo mágico Salome',
        priceUSD: 4.00,
        description: 'Mayor: $3.01 (a partir de 3 unidades, una de cada tono).',
        category: 'Salome Makeup',
        image: '/products/salome-brillo-magico.png',
        images: ['/products/salome-brillo-magico.png', '/products/salome-brillo-magico-swatches.png'],
    },
    {
        id: 'salome-29',
        name: 'Delineador de líquido Salome',
        priceUSD: 6.00,
        description: 'Mayor: $4.19 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-delineador-liquido.png',
    },
    {
        id: 'salome-30',
        name: 'Delineador de plumón Negro Salome',
        priceUSD: 6.00,
        description: 'Mayor: $4.19 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-delineador-plumon.png',
    },

    {
        id: 'salome-31',
        name: 'Delineador de plumón Marrón Salome',
        priceUSD: 6.00,
        description: 'Mayor: $4.19 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-delineador-plumon-marron.png',
    },
    {
        id: 'salome-32',
        name: 'Lápiz blanco de ojos Salome',
        priceUSD: 4.00,
        description: 'Mayor: $3.01 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-lapiz-blanco.png',
    },
    {
        id: 'salome-33',
        name: 'Lápiz negro en gel Salome',
        priceUSD: 4.00,
        description: 'Mayor: $3.01 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-lapiz-gel-negro.png',
    },
    {
        id: 'salome-34',
        name: 'Lápiz retráctil Salome',
        priceUSD: 6.50,
        description: 'Mayor: $4.48 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-lapiz-retractil.png',
        images: ['/products/salome-lapiz-retractil.png', '/products/salome-lapiz-retractil-swatches.jpg'],
    },

    {
        id: 'salome-35',
        name: 'Sombra de Cejas x2 Salome',
        priceUSD: 7.50,
        description: 'Mayor: $5.22 (a partir de 2 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-sombra-cejas-x2.png',
        images: ['/products/salome-sombra-cejas-x2.png', '/products/salome-sombra-cejas-x2-swatches.png'],
        wholesalePrice: 5.22,
        wholesaleMin: 2
    },
    {
        id: 'salome-36',
        name: 'Pomada de Cejas Premium Salome',
        priceUSD: 7.50,
        description: 'Mayor: $5.22 (a partir de 3 unidades, uno de cada tono).',
        category: 'Salome Makeup',
        image: '/products/salome-pomada-cejas-premium.png',
        images: ['/products/salome-pomada-cejas-premium.png', '/products/salome-pomada-cejas-premium-tonos.png'],
        wholesalePrice: 5.22,
        wholesaleMin: 3
    },

    {
        id: 'salome-37',
        name: 'Gel fijador de cejas Salome',
        priceUSD: 7.00,
        description: 'Mayor: $4.78 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-gel-fijador-cejas.png',
        wholesalePrice: 4.78,
        wholesaleMin: 3
    },
    {
        id: 'salome-38',
        name: 'Agua micelar Salome',
        priceUSD: 10.50,
        description: 'Mayor: $7.42 (a partir de 2 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-agua-micelar.png',
        wholesalePrice: 7.42,
        wholesaleMin: 2
    },
    {
        id: 'salome-39',
        name: 'Fijador Salome',
        priceUSD: 9.50,
        description: 'Mayor: $6.69 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-fijador-maquillaje.png',
        wholesalePrice: 6.69,
        wholesaleMin: 3
    },
    {
        id: 'salome-40',
        name: 'Paleta 18 tonos Salome',
        priceUSD: 12.50,
        description: 'Mayor: $8.89 (a partir de 2 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-paleta-18-tonos.png',
        wholesalePrice: 8.89,
        wholesaleMin: 2
    },

    {
        id: 'salome-41',
        name: 'Paleta 12 tonos Salome',
        priceUSD: 6.00,
        description: 'Precio único: $6.00.',
        category: 'Salome Makeup',
        image: '/products/salome-paleta-12-tonos.jpg',
    },
    {
        id: 'salome-42',
        name: 'Pestañas Corridas Salome',
        priceUSD: 4.00,
        description: 'Mayor: $2.72 (a partir de 3 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-pestanas-corridas.png',
        wholesalePrice: 2.72,
        wholesaleMin: 3
    },
    {
        id: 'salome-43',
        name: 'Pestañas corridas prest. negra Salome',
        priceUSD: 2.50,
        description: 'Mayor: $1.54 (a partir de 3 unidades). Variadas: 40, 111 y 155 o 40, 135 y 155.',
        category: 'Salome Makeup',
        image: '/products/salome-pestanas-pres-negra.png',
        wholesalePrice: 1.54,
        wholesaleMin: 3
    },
    {
        id: 'salome-44',
        name: 'Kit de pestañas x5 Salome',
        priceUSD: 5.00,
        description: 'Mayor: $3.75 (a partir de 3 unidades, variadas).',
        category: 'Salome Makeup',
        image: '/products/salome-kit-pestanas-x5.png',
        wholesalePrice: 3.75,
        wholesaleMin: 3
    },
    {
        id: 'salome-45',
        name: 'Fijador matte Salome',
        priceUSD: 11.50,
        description: 'Mayor: $8.16 (a partir de 2 unidades).',
        category: 'Salome Makeup',
        image: '/products/salome-fijador-matte.png',
        wholesalePrice: 8.16,
        wholesaleMin: 2
    },

    // --- Dolce Bella ---
    {
        id: 'dolce-1',
        name: 'Polvo compacto sencillo Dolce Bella',
        priceUSD: 3.50,
        description: 'Mayor: $2.64 (a partir de 3 unidades). Tonos variados.',
        category: 'Dolce Bella',
        image: '/products/dolce-bella-polvo-sencillo-01.jpg',
        images: ['/products/dolce-bella-polvo-sencillo-01.jpg', '/products/dolce-bella-polvo-sencillo-02.jpg'],
        wholesalePrice: 2.64,
        wholesaleMin: 3
    },
    {
        id: 'dolce-2',
        name: 'Polvo compacto con filtro solar Dolce Bella',
        priceUSD: 3.50,
        description: 'Mayor: $2.64 (a partir de 3 unidades).',
        category: 'Dolce Bella',
        image: '/products/dolce-bella-polvo-solar-01.jpg',
        images: ['/products/dolce-bella-polvo-solar-01.jpg', '/products/dolce-bella-polvo-solar-02.png'],
        wholesalePrice: 2.64,
        wholesaleMin: 3
    },
    {
        id: 'dolce-3',
        name: 'Corrector Barra Dolce Bella',
        priceUSD: 0.00, // Consultar precio
        description: 'Consultar precio.',
        category: 'Dolce Bella',
        image: '/products/dolce-bella-corrector-barra-01.jpg',
        images: ['/products/dolce-bella-corrector-barra-01.jpg', '/products/dolce-bella-corrector-barra-swatches.jpg'],
    },
    {
        id: 'dolce-4',
        name: 'Rubor Individual Dolce Bella',
        priceUSD: 3.50,
        description: 'Mayor: $2.64 (a partir de 3 unidades). Tonos variados.',
        category: 'Dolce Bella',
        image: '/products/dolce-bella-rubor-individual.jpg',
        wholesalePrice: 2.64,
        wholesaleMin: 3
    },
    {
        id: 'dolce-5',
        name: 'Rubor Degrade Dolce Bella',
        priceUSD: 6.50,
        description: 'Mayor: $4.76 (a partir de 3 unidades). Tonos variados.',
        category: 'Dolce Bella',
        image: '/products/dolce-bella-rubor-degrade.jpg',
        wholesalePrice: 4.76,
        wholesaleMin: 3
    },
    {
        id: 'dolce-6',
        name: 'Primer hidratante Dolce Bella',
        priceUSD: 10.00,
        description: 'Mayor: $7.11 (a partir de 2 unidades).',
        category: 'Dolce Bella',
        image: 'https://placehold.co/600x400.png?text=Primer+Hidratante',
        wholesalePrice: 7.11,
        wholesaleMin: 2
    },
    {
        id: 'dolce-7',
        name: 'Crema Ginko Biloba con Filtro Solar',
        priceUSD: 8.00,
        description: 'Mayor: $5.70 (a partir de 3 unidades).',
        category: 'Dolce Bella',
        image: 'https://placehold.co/600x400.png?text=Crema+Ginko',
        wholesalePrice: 5.70,
        wholesaleMin: 3
    },
    {
        id: 'dolce-8',
        name: 'Base Matte Dolce Bella',
        priceUSD: 0.00, // Consultar precio
        category: 'Dolce Bella',
        image: '/products/dolce-bella-base-matte-01.jpg',
        images: ['/products/dolce-bella-base-matte-01.jpg', '/products/dolce-bella-base-matte-swatches.jpg'],
    },
    {
        id: 'dolce-9',
        name: 'Base Velvet Touch Dolce Bella',
        priceUSD: 0.00, // Consultar precio
        category: 'Dolce Bella',
        image: '/products/dolce-bella-base-velvet-01.jpg',
        images: ['/products/dolce-bella-base-velvet-01.jpg', '/products/dolce-bella-base-velvet-swatches.png'],
    },

    // --- Importado ---
    {
        id: 'imp-1',
        name: 'Mascara de pestañas Essence Lash Princess',
        priceUSD: 13.00,
        description: 'Mayor: $9.16.',
        category: 'Importado',
        image: '/products/essence-lash-princess.png',
        wholesalePrice: 9.16,
        wholesaleMin: 3
    },
    {
        id: 'imp-2',
        name: 'Mascara de Pestañas Prosa 4 en 1',
        priceUSD: 11.50,
        description: 'Mayor: $8.11 (a partir de 3 unidades, una de cada tipo).',
        category: 'Importado',
        image: '/products/prosa-mascara-4en1-group.png',
        images: ['/products/prosa-mascara-4en1-group.png', '/products/prosa-mascara-4en1-group-02.png'],
        wholesalePrice: 8.11,
        wholesaleMin: 3
    },

    // --- Aria Cosmetics ---
    {
        id: 'aria-1',
        name: 'Polvo compacto Aria',
        priceUSD: 12.00,
        description: 'Mayor: $8.57 (a partir de 2 unidades). Tonos variados (210, 220, 225, 260).',
        category: 'Aria Cosmetics',
        image: 'https://placehold.co/600x400.png?text=Polvo+Compacto',
        // images: ['/products/aria-polvo-compacto-01.png', '/products/aria-polvo-compacto-swatches.jpg', '/products/aria-polvo-compacto-open.jpg'],
        wholesalePrice: 8.57,
        wholesaleMin: 2
    },
    {
        id: 'aria-2',
        name: 'Corrector Full Face Aria',
        priceUSD: 9.00,
        description: 'Mayor: $6.31 (a partir de 3 unidades). Multiexcelente cobertura.',
        category: 'Aria Cosmetics',
        image: 'https://placehold.co/600x400.png?text=Corrector+Full+Face',
        wholesalePrice: 6.31,
        wholesaleMin: 3
    },
    {
        id: 'aria-3',
        name: 'Labial Marker a prueba de agua Aria',
        priceUSD: 5.50,
        description: 'Mayor: $3.81 (a partir de 3 unidades). Tipo marcador, punta redonda.',
        category: 'Aria Cosmetics',
        image: 'https://placehold.co/600x400.png?text=Labial+Marker',
        wholesalePrice: 3.81,
        wholesaleMin: 3
    },
    {
        id: 'aria-4',
        name: 'Gloss Transparente Plump Aria',
        priceUSD: 5.50,
        description: 'Mayor: $3.81 (a partir de 3 unidades).',
        category: 'Aria Cosmetics',
        image: 'https://placehold.co/600x400.png?text=Gloss+Plump',
        wholesalePrice: 3.81,
        wholesaleMin: 3
    },
    {
        id: 'aria-5',
        name: 'Paleta de Sombras Phuket 88 Tonos Aria',
        priceUSD: 19.00,
        description: 'Mayor: $13.36 (a partir de 2 unidades).',
        category: 'Aria Cosmetics',
        image: '/products/aria-paleta-phuket-88.jpg',
        wholesalePrice: 13.36,
        wholesaleMin: 2
    },

    // --- Ushas ---
    {
        id: 'ushas-1',
        name: 'Rubor líquido Ushas',
        priceUSD: 2.50, // Confirmar precio si cambio
        category: 'Ushas',
        image: '/products/ushas-rubor-liquido-01.jpg',
        images: ['/products/ushas-rubor-liquido-01.jpg', '/products/ushas-rubor-liquido-swatches.jpg'],
    },
    {
        id: 'ushas-2',
        name: 'Jabón de cejas Ushas',
        priceUSD: 1.68,
        category: 'Ushas',
        image: '/products/ushas-jabon-cejas.jpg',
    },
    {
        id: 'ushas-3',
        name: 'Brillo Yess Ushas',
        priceUSD: 1.68,
        category: 'Ushas',
        image: '/products/ushas-brillo-yess.jpg',
    },
    {
        id: 'ushas-4',
        name: 'Lip Gloss Ushas',
        priceUSD: 3.00,
        description: 'Mayor: $2.06 (a partir de 3 unidades).',
        category: 'Ushas',
        image: '/products/ushas-lip-gloss-01.jpg',
        images: ['/products/ushas-lip-gloss-01.jpg', '/products/ushas-lip-gloss-02.jpg'],
        wholesalePrice: 2.06,
        wholesaleMin: 3
    },
    {
        id: 'ushas-5',
        name: 'Rubor Jelly Ushas (Jelly Blusher)',
        priceUSD: 3.50,
        description: 'Mayor: $2.63 (a partir de 4 unidades, uno de cada tono).',
        category: 'Ushas',
        image: '/products/ushas-rubor-jelly-01.png',
        wholesalePrice: 2.63,
        wholesaleMin: 4
    },
    {
        id: 'ushas-6',
        name: 'Tinta de Labios Ushas',
        priceUSD: 2.50, // Estimado detal
        description: 'Mayor: $1.68 (a partir de 3 unidades).',
        category: 'Ushas',
        image: '/products/ushas-tinta-labios-01.jpg',
        images: ['/products/ushas-tinta-labios-01.jpg', '/products/ushas-tinta-labios-swatches.jpg'],
        wholesalePrice: 1.68,
        wholesaleMin: 3
    },
    {
        id: 'ushas-7',
        name: 'Mascarilla Carbón Ushas',
        priceUSD: 3.80,
        description: 'Precio único: $3.80.',
        category: 'Ushas',
        image: '/products/ushas-mascarilla-carbon.png',
    },

    // --- Brochas ---
    // --- Brochas ---
    {
        id: 'brocha-1',
        name: 'Brocha para difuminar Pfiffery',
        priceUSD: 3.62,
        category: 'Brochas',
        image: '/products/pfiffery-brocha-difuminar.png',
    },
    {
        id: 'brocha-2',
        name: 'Set de brochas mini x8',
        priceUSD: 2.00,
        description: 'Mayor: $1.59 (a partir de 3 unidades).',
        category: 'Brochas',
        image: '/products/brochas-mini-set-x8.png',
        wholesalePrice: 1.59,
        wholesaleMin: 3
    },
    {
        id: 'brocha-3',
        name: 'Set de brochas x10',
        priceUSD: 7.50,
        description: 'Mayor: $5.22 (a partir de 3 unidades).',
        category: 'Brochas',
        image: '/products/brochas-set-x10.png',
        wholesalePrice: 5.22,
        wholesaleMin: 3
    },
    {
        id: 'brocha-4',
        name: 'Set de brochas x5',
        priceUSD: 3.50,
        description: 'Mayor: $2.64 (a partir de 3 unidades).',
        category: 'Brochas',
        image: '/products/brochas-set-x5.png',
        wholesalePrice: 2.64,
        wholesaleMin: 3
    },
    {
        id: 'brocha-5',
        name: 'Brocha Base Kabuki',
        priceUSD: 1.50,
        description: 'Mayor: $1.01 (a partir de 3 unidades).',
        category: 'Brochas',
        image: '/products/brocha-base-kabuki.png',
        wholesalePrice: 1.01,
        wholesaleMin: 3
    },
    {
        id: 'brocha-6',
        name: 'Brocha Polvo Grande',
        priceUSD: 2.00,
        description: 'Mayor: $1.50 (a partir de 3 unidades).',
        category: 'Brochas',
        image: '/products/brocha-polvo-grande.png',
        wholesalePrice: 1.50,
        wholesaleMin: 3
    },
    {
        id: 'brocha-7',
        name: 'Brocha para Cejas Doble',
        priceUSD: 0.50,
        description: 'Mayor: $0.31 (a partir de 6 unidades).',
        category: 'Brochas',
        image: 'https://placehold.co/600x400.png?text=Brocha+Cejas',
        wholesalePrice: 0.31,
        wholesaleMin: 6
    },


    // --- Cuidado Del Cabello ---
    {
        id: 'hair-1',
        name: 'Mantequilla Corporal',
        priceUSD: 11.00,
        category: 'Cuidado Del Cabello',
        image: 'https://placehold.co/600x400.png?text=Mantequilla+Corporal',
    },
    {
        id: 'hair-2',
        name: 'Keratina - Ritual de Alisado',
        priceUSD: 20.00,
        category: 'Cuidado Del Cabello',
        image: 'https://placehold.co/600x400.png?text=Keratina',
    },
    {
        id: 'hair-3',
        name: 'Bomba Mascarilla Botánica SOS',
        priceUSD: 20.00,
        category: 'Cuidado Del Cabello',
        image: 'https://placehold.co/600x400.png?text=Bomba+Mascarilla',
    },

    // --- Otros ---
    {
        id: 'otros-1',
        name: 'Portacosmeticos',
        priceUSD: 5.00, // Estimated placeholder
        category: 'Otros',
        image: 'https://placehold.co/600x400.png?text=Portacosmeticos',
    },
    {
        id: 'otros-2',
        name: 'Polvo compacto Nailen',
        priceUSD: 5.95,
        category: 'Otros',
        image: 'https://placehold.co/600x400.png?text=Polvo+Nailen',
    },
    {
        id: 'otros-3',
        name: 'Beauty blender',
        priceUSD: 0.61,
        category: 'Otros',
        image: 'https://placehold.co/600x400.png?text=Beauty+Blender',
    },

    // --- Bolsas de boutique ---
    {
        id: 'bolsas-1',
        name: 'Bolsas de boutique 15x23',
        priceUSD: 1.00, // Estimated placeholder
        category: 'Bolsas de boutique',
        image: 'https://placehold.co/600x400.png?text=Bolsa+15x23',
    },
    {
        id: 'bolsas-2',
        name: 'Bolsas de boutique 20x30',
        priceUSD: 1.50, // Estimated placeholder
        category: 'Bolsas de boutique',
        image: 'https://placehold.co/600x400.png?text=Bolsa+20x30',
    },
    {
        id: 'bolsas-3',
        name: 'Bolsas de boutique 30x40 (Paq. x5)',
        priceUSD: 1.50,
        description: 'Colores: Morado, rosado claro y rosado.',
        category: 'Bolsas de boutique',
        image: 'https://placehold.co/600x400.png?text=Bolsa+30x40',
    },

    // --- Combos ---
    {
        id: 'combo-dolce-40',
        name: 'Combo Emprendedor Dolce Bella $40',
        priceUSD: 40.00,
        category: 'Combos',
        description: 'Incluye 18 artículos: 2 Rubores individuales, 2 Compactos sencillos, 2 Correctores barra, 2 Mascaras, 2 Mini paletas sombra, 2 Brillos colapsibles, 2 Lápices, 2 Borlas, 2 Beauty blenders.',
        image: '/combo-emprendedor-dolce-40.png',
    },
    {
        id: 'combo-dolce-60',
        name: 'Combo Emprendedor Dolce Bella $60',
        priceUSD: 60.00,
        category: 'Combos',
        description: 'Incluye 16 artículos: 2 Rubores degradados, 2 Compactos filtro solar, 2 Correctores líquidos, 2 Mascaras aprueba agua, 2 Lip gloss, 2 Bases Velvet Touch, 2 Lápices, 2 Beauty blenders.',
        image: '/combo-emprendedor-dolce-60.png',
    },
    {
        id: 'combo-salome-60',
        name: 'Combo Emprendedor Salomé $60',
        priceUSD: 60.00,
        category: 'Combos',
        description: 'Incluye 18 artículos: 2 Paletas contorno/rubor, 2 Polvos compactos doble, 2 Labiales imantados, 2 Correctores líquidos, 2 Polvos sueltos, 2 Mascaras, 2 Pestañas postizas, 2 Borlas, 2 Beauty blenders.',
        image: '/combo-emprendedor-salome-60.png',
    }
];

export const CATEGORIES = [
    'Salome Makeup',
    'Dolce Bella',
    'Importado',
    'Aria Cosmetics',
    'Ushas',
    'Brochas',
    'Combos',
    'Cuidado Del Cabello',
    'Otros',
    'Bolsas de boutique',
    'Accesorios'
];
