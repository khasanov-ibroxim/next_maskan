import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Maskan Lux - Toshkentdagi eng yaxshi uylar va ko'chmas mulk savdosi.", 
  image = "https://picsum.photos/1200/630",
  type = "website"
}) => {
  useEffect(() => {
    document.title = title;
    
    // Update meta tags dynamically
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:type', type);

    // JSON-LD Structure
    const scriptId = 'json-ld-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type === 'product' ? 'Product' : 'RealEstateAgent',
      "name": title,
      "description": description,
      "image": image,
      "telephone": "+998 97 085 06 04"
    });

  }, [title, description, image, type]);

  return null;
};