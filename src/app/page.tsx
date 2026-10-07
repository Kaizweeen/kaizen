import { Intro } from "@/components/Intro";
import { Header } from "@/components/Header";
import { Cursor } from "@/components/Cursor";
import { VersionTag } from "@/components/VersionTag";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { Statement } from "@/components/Statement";
import { OnePercent } from "@/components/OnePercent";
import { Work } from "@/components/Work";
import { Method } from "@/components/Method";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only z-[90] bg-fg px-4 py-3 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the projects
      </a>
      <SmoothScroll />
      <Intro />
      <Header />
      <main>
        <Hero />
        <Statement />
        <OnePercent />
        <Work />
        <Method />
        <Clients />
        <Contact />
      </main>
      <VersionTag />
      <Cursor />
      <div aria-hidden className="grain" />
    </>
  );
}
