import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CursorGlow } from "@/components/motion/CursorGlow";
import { IntroProvider, introBootScript } from "@/components/motion/IntroProvider";
import { Preloader } from "@/components/motion/Preloader";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { profile } from "@/content/profile";
import { rssAlternate, siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s — Aditya Deshpande" },
  description: siteDescription,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: {
    canonical: "/",
    ...rssAlternate,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "Aditya Deshpande",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: profile.name,
  jobTitle: "Full-stack Software Engineer",
  url: siteUrl,
  email: `mailto:${profile.email}`,
  image: `${siteUrl}${profile.portrait}`,
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
  knowsAbout: ["React", "TypeScript", "Next.js", "ASP.NET Core", "C#", "Azure", "Nx", "Snowflake"],
  sameAs: [profile.links.github, profile.links.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="grain min-h-svh">
        <a
          href="#main"
          className="type-label fixed top-4 left-4 z-[200] -translate-y-24 rounded-pill bg-accent px-4 py-2 text-text-inverse transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScrollProvider>
            <IntroProvider>
              <Preloader />
              <Nav />
              <main id="main">{children}</main>
              <Footer />
              <CursorGlow />
            </IntroProvider>
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
