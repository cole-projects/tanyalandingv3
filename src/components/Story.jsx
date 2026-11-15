import { useEffect, useRef } from "react";
import { features, gaps, realStuff, testimonial } from "../content/site.js";
import { Reveal, ScrollWords } from "./ui.jsx";

/** The quote fills in as you read it. */
export function Testimonial() {
  return (
    <section aria-label="What someone said after texting Tanya" className="py-24 sm:py-40">
      <figure className="wrap max-w-[60rem]">
        <ScrollWords as="blockquote" text={`“${testimonial.quote}”`} className="display-md font-semibold text-ink" />
        <Reveal as="figcaption" className="mt-8 text-lg font-medium text-ink-muted">
          {testimonial.author}
        </Reveal>
      </figure>
    </section>
  );
}

/**
 * One-time mobile teach: when the rail enters view, ease right to reveal
 * more of the next card, pause, ease back. Cancels if they touch it.
 */
function useSwipePeek(railRef) {
  useEffect(() => {
    const el = railRef.current;
    if (!el) return undefined;

    const mobile = window.matchMedia("(max-width: 767px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mobile.matches || reduce.matches) return undefined;

    let cancelled = false;
    let timers = [];
    let played = false;

    const clearTimers = () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
    };

    const cancel = () => {
      cancelled = true;
      clearTimers();
      el.style.scrollSnapType = "";
    };

    const peek = () => {
      if (cancelled || played || el.scrollLeft > 8) return;
      played = true;
      const amount = Math.min(72, el.clientWidth * 0.18);
      // Snap would yank the peek back — turn it off for the demo only.
      el.style.scrollSnapType = "none";
      el.scrollBy({ left: amount, behavior: "smooth" });
      timers.push(
        window.setTimeout(() => {
          if (cancelled) {
            el.style.scrollSnapType = "";
            return;
          }
          el.scrollTo({ left: 0, behavior: "smooth" });
          timers.push(
            window.setTimeout(() => {
              el.style.scrollSnapType = "";
            }, 550),
          );
        }, 1100),
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          timers.push(window.setTimeout(peek, 400));
          io.disconnect();
        }
      },
      { threshold: [0.45] },
    );
    io.observe(el);

    el.addEventListener("pointerdown", cancel, { passive: true });
    el.addEventListener("touchstart", cancel, { passive: true });
    el.addEventListener("wheel", cancel, { passive: true });

    return () => {
      cancel();
      io.disconnect();
      el.removeEventListener("pointerdown", cancel);
      el.removeEventListener("touchstart", cancel);
      el.removeEventListener("wheel", cancel);
    };
  }, [railRef]);
}

/** Swipeable gallery: what each alternative gives you, and where it stops. */
export function Gaps() {
  const rail = useRef(null);
  useSwipePeek(rail);
  const nudge = (dir) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: "smooth" });
  // lines the first card up with the page column on any screen width
  const pad = "max(1.375rem, calc((100vw - 1120px) / 2 + 2rem))";
  const arrow =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-mist text-ink-soft transition hover:bg-ink/10 active:scale-95";

  return (
    <section id="what-is-tanyatalk" aria-labelledby="gaps-heading" className="pb-24 sm:pb-36">
      <Reveal className="wrap">
        <p className="eyebrow">{gaps.eyebrow}</p>
        <h2 id="gaps-heading" className="display-lg mt-2 max-w-[12ch]">
          {gaps.title}
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <ul ref={rail} tabIndex={0} aria-label="Other options and their gaps" className="rail mt-10 flex gap-4 overflow-x-auto pb-2 sm:mt-14 sm:gap-5" style={{ paddingInline: pad, scrollPaddingInline: pad }}>
          {gaps.items.map((g, i) => (
            <li key={g.who} className="tile flex w-[78vw] max-w-[21rem] shrink-0 snap-start flex-col p-7 sm:p-8">
              <span className="text-sm font-semibold tabular-nums text-ink-faint">0{i + 1}</span>
              <h3 className="mt-10 text-[1.75rem] font-semibold leading-tight tracking-tightish sm:mt-16 sm:text-[2rem]">{g.who}</h3>
              <p className="mt-3 text-lg font-medium text-tide-600">{g.strength}</p>
              <p className="mt-auto border-t border-hairline pt-4 text-lg leading-snug text-ink-muted">
                <span className="sr-only">The gap: </span>
                {g.gap}
              </p>
            </li>
          ))}
        </ul>

        <div className="wrap mt-6 hidden justify-end gap-3 md:flex">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous options" className={arrow}>
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="m12 5-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="More options" className={arrow}>
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/** Three lines of very large type, then the answer. */
export function RealStuff() {
  return (
    <section aria-labelledby="real-heading" className="pb-24 sm:pb-40">
      <div className="wrap">
        <Reveal>
          <h2 id="real-heading" className="display-md max-w-[18ch] text-ink-muted">
            {realStuff.lead}
          </h2>
        </Reveal>
        <ul className="mt-6 sm:mt-10">
          {realStuff.lines.map((line, i) => (
            <Reveal as="li" key={line} delay={i * 0.12} className={`display-lg ${i === realStuff.lines.length - 1 ? "text-sunset" : ""}`}>
              {line}
            </Reveal>
          ))}
        </ul>
        <ScrollWords text={realStuff.answer} className="display-md mt-14 max-w-[26ch] sm:mt-24 lg:ml-auto" />
      </div>
    </section>
  );
}

const icons = {
  memory: <path d="M4 6h16M4 12h16M4 18h10" />,
  next: <path d="M7 17 17 7M8 7h9v9" />,
  asYouAre: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
    </>
  ),
  honest: <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />,
  level: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-7 w-7 text-tide-600">
      {icons[name]}
    </svg>
  );
}

function SmallTile({ icon, line, sub, delay }) {
  return (
    <Reveal as="li" delay={delay} className="tile flex min-h-[11.5rem] flex-col justify-between p-7 md:col-span-2 md:min-h-[14rem] md:p-8">
      <Icon name={icon} />
      <p className="mt-8 text-[1.6rem] font-semibold leading-[1.1] tracking-tightish md:text-[1.75rem]">
        {line}
        {sub ? <span className="block text-ink-faint">{sub}</span> : null}
      </p>
    </Reveal>
  );
}

export function Features() {
  const t = features.tiles;
  return (
    <section aria-labelledby="features-heading" className="py-24 sm:py-36">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{features.eyebrow}</p>
          <h2 id="features-heading" className="display-lg mt-2">
            {features.title}
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-6">
          <Reveal as="li" className="tile flex min-h-[19rem] flex-col justify-end p-7 md:col-span-4 md:row-span-2 md:p-10">
            <p className="text-sunset w-fit text-[clamp(6rem,19vw,13rem)] font-semibold leading-[0.9] tracking-display">{t.always.big}</p>
            <p className="mt-4 max-w-[18ch] text-[1.6rem] font-semibold leading-[1.1] tracking-tightish md:text-[2rem]">{t.always.line}</p>
          </Reveal>
          <SmallTile icon="memory" line={t.memory} delay={0.06} />
          <SmallTile icon="next" line={t.next} delay={0.12} />
          <SmallTile icon="asYouAre" line={t.asYouAre.line} sub={t.asYouAre.sub} />
          <SmallTile icon="honest" line={t.honest} delay={0.06} />
          <SmallTile icon="level" line={t.level.line} sub={t.level.sub} delay={0.12} />
          <Reveal as="li" className="tile flex min-h-[13rem] items-center justify-center p-8 text-center md:col-span-6 md:min-h-[17rem]">
            <p className="display-lg text-sunset">{t.trust}</p>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
