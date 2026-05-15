import Script from "next/script";

/**
 * Drops in Google Analytics 4 when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
 * (e.g. `G-XXXXXXXXXX`). No-op otherwise — safe to ship before GA is wired up.
 *
 * Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxxxxxxxxx` to the environment when
 * you create the GA4 property on https://analytics.google.com.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

/**
 * Optional: Google Search Console site-verification meta tag. Set
 * `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>` once you generate it inside
 * https://search.google.com/search-console.
 */
export function SearchConsoleVerification() {
  const token = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  if (!token) return null;
  return <meta name="google-site-verification" content={token} />;
}
