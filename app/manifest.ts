
// ===========================
// app/manifest.ts (optional - for PWA)
// ===========================
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Maskan Lux - Ko\'chmas Mulk',
        short_name: 'Maskan Lux',
        description: 'Toshkent shahridagi eng yaxshi ko\'chmas mulk takliflari',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}