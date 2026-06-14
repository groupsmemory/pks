'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL || 'https://cloud.umami.is';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

    const gtag = (window as unknown as Record<string, unknown>).gtag as
      | ((...args: unknown[]) => void)
      | undefined;
    if (!gtag) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    gtag('config', GA_MEASUREMENT_ID, { page_path: url });
  }, [pathname, searchParams]);

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
      {UMAMI_WEBSITE_ID && (
        <Script
          src={`${UMAMI_URL}/script.js`}
          data-website-id={UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
