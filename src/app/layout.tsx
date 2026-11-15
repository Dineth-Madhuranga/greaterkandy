import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Motion } from "@/components/motion";
import { brand, socials } from "@/lib/content";
import "./globals.css";
import "lenis/dist/lenis.css";
import "./motion.css";

const condensed = localFont({
  src: "./fonts/barlow-condensed.woff2",
  variable: "--font-condensed",
  display: "swap",
  weight: "900",
  fallback: ["Impact", "Arial Narrow", "Arial"],
});
const inter = localFont({
  src: "./fonts/inter-tight.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  fallback: ["Arial"],
});
const handwritten = localFont({
  src: "./fonts/nothing-you-could-do.woff2",
  variable: "--font-hand",
  display: "swap",
  weight: "400",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.canonical),
  title: {
    default: "GreaterKandy — Sustainable marketing, rooted in place",
    template: "%s | GreaterKandy",
  },
  description:
    "A sustainable marketing agency based in Kandy, Sri Lanka. Connecting brands, people, and places through thoughtful advertising, digital signage, and public-space engagement.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "GreaterKandy",
    title: "GreaterKandy — Make your brand part of a better place.",
    description:
      "Sustainable marketing. Thoughtful creativity. Rooted in Kandy, Sri Lanka.",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GreaterKandy — Make your brand part of a better place",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GreaterKandy — Sustainable marketing",
    description:
      "Connecting brands, people, and places. Rooted in Kandy, Sri Lanka.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${condensed.variable} ${inter.variable} ${handwritten.variable}`}
    >
      <body id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <Motion />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: brand.name,
              url: brand.canonical,
              email: brand.email,
              telephone: brand.phoneHref,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kandy",
                postalCode: "20000",
                addressCountry: "LK",
              },
              sameAs: socials.map((social) => social.href),
            }),
          }}
        />
      </body>
    </html>
  );
}
