// components/LanguageSwitcher.tsx
"use client";

import React, { useTransition, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { i18n } from '@/i18n-config';
import { Globe } from 'lucide-react';

// ✅ Separate component that uses useSearchParams
function LanguageSwitcherContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = pathname.split('/')[1] || i18n.defaultLocale;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // Pathni bo'laklarga ajratamiz
    const pathSegments = pathname.split('/');
    // 1-indexda locale turadi (masalan: /uz/...), uni yangisiga almashtiramiz
    if (pathSegments.length > 1) {
      pathSegments[1] = newLocale;
    } else {
      pathSegments.splice(1, 0, newLocale);
    }

    const newPath = pathSegments.join('/');

    // Query paramlarni saqlab qolamiz
    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${newPath}?${queryString}` : newPath;

    startTransition(() => {
      router.push(finalUrl);
    });
  };

  const labels: Record<string, string> = {
    uz: "O'zbek",
    ru: "Русский",
    en: "English",
    "uz-cy": "Ўзбекча"
  };

  return (
      <div className="relative group">
        <div className="flex items-center text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg px-2 py-1.5 transition-colors">
          <Globe size={18} className="mr-2 text-emerald-600" />
          <select
              value={currentLocale}
              onChange={handleChange}
              disabled={isPending}
              className="appearance-none bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer pr-6 text-slate-700 w-full"
              style={{ backgroundImage: 'none' }}
          >
            {i18n.locales.map((locale) => (
                <option key={locale} value={locale} className="py-1">
                  {labels[locale]}
                </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 flex items-center text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
  );
}

// ✅ Loading fallback component uhi
function LanguageSwitcherFallback() {
  return (
      <div className="relative group">
        <div className="flex items-center text-slate-600 bg-slate-100 rounded-lg px-2 py-1.5">
          <Globe size={18} className="mr-2 text-emerald-600" />
          <div className="w-20 h-5 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
  );
}

// ✅ Main component wrapped in Suspense
export function LanguageSwitcher() {
  return (
      <Suspense fallback={<LanguageSwitcherFallback />}>
        <LanguageSwitcherContent />
      </Suspense>
  );
}