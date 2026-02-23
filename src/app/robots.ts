import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://loyafu.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/admin/login'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
