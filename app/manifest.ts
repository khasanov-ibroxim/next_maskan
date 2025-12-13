// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Maskan Lux - Ko\'chmas Mulk',
        short_name: 'Maskan Lux',
        description: 'Toshkent shahridagi eng yaxshi ko\'chmas mulk takliflari',
        start_url: '/uz',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
            {
                src: '/logo.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        categories: ['business', 'real-estate'],
        lang: 'uz',
        dir: 'ltr',
        orientation: 'portrait',
    };
}