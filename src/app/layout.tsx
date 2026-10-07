import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { copy } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Only the kanji the page sets, so the Japanese face costs a few kilobytes.
const KANJI = "改善作品依頼計画実行評価紙墨版";
const JP_FONT = `https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@700&display=swap&text=${encodeURIComponent(KANJI)}`;

const HEAD_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("kz-theme");if(t==="paper"||t==="sumi")d.dataset.theme=t}catch(e){}try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.motion="on";if(!sessionStorage.getItem("kz-intro"))d.dataset.intro="play"}}catch(e){}})()`;

/*
 * Direction contract (kept in source, not shipped to visitors):
 * THESIS: The page is a print run that improves itself. Everything arrives off register and settles true. It refuses the template portfolio of hero, card grid, and skills list.
 * OWN-WORLD: Grey kozo paper, sumi ink, one vermilion seal plate. Archivo at full width and weight, Zen Kaku Gothic kanji set vertically, drawn grain, crop marks. No cards, no shadows, no gradients.
 * STORY: A visitor learns who Kai is, sees the meaning of the name proved in arithmetic and in nine real projects, and writes to him.
 * FIRST VIEWPORT: KAIZEN in ink particles across the full width; vertical 改善 in vermilion at the right edge; a 2px ink rule over name and role, the one-line promise, and two actions; version tag v0.1 bottom left.
 * FORM: Refinement, pinned by Kai over the roll. Raises: registration (riso), exact measure (labanotation), total commitment (rebel menu). Seed 0b3f9901.
 */

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  authors: [{ name: "Kaizen Gabriel", url: "https://github.com/Kaizweeen" }],
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f0ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1012" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={JP_FONT} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
