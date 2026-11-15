import { useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Hero from "../components/Hero.jsx";
import { Features, Gaps, RealStuff, Testimonial } from "../components/Story.jsx";
import Demo from "../components/Demo.jsx";
import MeetTanya from "../components/MeetTanya.jsx";
import { BecomingYou, Faq, Finale, Footer } from "../components/Closing.jsx";

/** Old deep links (/what-is-tanyatalk, /who-is-tanya) still land on the right section. */
const LEGACY_PATHS = { "/what-is-tanyatalk": "what-is-tanyatalk", "/who-is-tanya": "who-is-tanya" };

export default function HomePage() {
  useEffect(() => {
    const id = LEGACY_PATHS[window.location.pathname.replace(/\/$/, "")];
    if (!id) return;
    window.history.replaceState(null, "", `/#${id}`);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  return (
    <>
      <a href="#main" className="fixed left-3 top-3 z-50 -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white focus:translate-y-0">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Testimonial />
        <Gaps />
        <RealStuff />
        <Demo />
        <Features />
        <MeetTanya />
        <BecomingYou />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
