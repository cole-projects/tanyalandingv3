import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { hero } from "../content/site.js";
import { SHORT_SCREEN, spiralPath, TextTanyaButton, useMediaQuery } from "./ui.jsx";

const SPIRAL_INTERVAL_MS = 1500;

/** Cycles the emotional verb under “You’re …” every 1.5s. */
function SpiralWord() {
  const reduce = useReducedMotion();
  const words = hero.spiralWords;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, SPIRAL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduce, words.length]);

  const word = words[index] ?? words[0];
  // Reserve width for the longest phrase so the headline doesn’t jump.
  const widest = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  if (reduce) {
    return (
      <span className="text-sunset">
        {hero.title[1]} {words[0]}.
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-baseline justify-center">
      <span className="text-sunset">{hero.title[1]}&nbsp;</span>
      <span className="relative inline-block text-left">
        {/* Width reserve only — visible word always starts at the left edge (one space after You’re). */}
        <span className="invisible whitespace-nowrap" aria-hidden="true">
          {widest}.
        </span>
        <span className="absolute inset-0 overflow-hidden text-left">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={word}
              className="text-sunset absolute left-0 top-0 whitespace-nowrap"
              initial={{ y: "45%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-45%", opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}.
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </span>
  );
}

function Intro() {
  return (
    <div className="wrap flex flex-col items-center text-center">
      <p className="eyebrow">{hero.eyebrow}</p>
      <h1 className="display-xl mt-3 text-[clamp(2.7rem,11.5vw,8.5rem)]">
        <span className="sr-only">
          {hero.title[0]} {hero.title[1]} {hero.spiralWords[0]}.
        </span>
        <span aria-hidden="true">
          {hero.title[0]}
          <br />
          <SpiralWord />
        </span>
      </h1>
      <div className="mt-7 flex flex-col items-center sm:mt-9">
        <TextTanyaButton>{hero.cta}</TextTanyaButton>
      </div>
      <p className="lede mt-5 max-w-[22ch] sm:mt-6 sm:max-w-none">{hero.subtitle}</p>
      <p className="mt-3 text-sm font-medium text-ink-muted">{hero.reassurance}</p>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="bubble bubble-recv inline-flex items-center gap-[0.28em] py-[0.9em]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[0.42em] w-[0.42em] animate-dot rounded-full bg-ink-faint" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </span>
  );
}

/** Reduced motion: the same content, stacked and still. */
function StaticHero() {
  return (
    <section id="top" aria-label="TanyaTalk introduction" className="pb-20 pt-28">
      <Intro />
      <div className="wrap mt-16 flex max-w-[40rem] flex-col gap-3 text-[clamp(1.1rem,3.2vw,1.6rem)]">
        <p className="text-center text-sm font-medium text-ink-faint">{hero.chat.stamp}</p>
        <p className="bubble bubble-sent max-w-[85%] self-end">{hero.chat.question}</p>
        <p className="bubble bubble-recv max-w-[85%] self-start">{hero.chat.reply}</p>
        <p className="lede mt-8 text-center">{hero.trust.join(" ")}</p>
      </div>
    </section>
  );
}

/**
 * Pinned opening scene. Scrolling plays it:
 * headline → the spiral unwinds → a 2am text arrives → Tanya answers.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const short = useMediaQuery(SHORT_SCREEN);
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const d = useMemo(() => spiralPath(), []);

  const introOpacity = useTransform(p, [0, 0.1, 0.22], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.22], [0, -70]);
  const introScale = useTransform(p, [0, 0.22], [1, 0.94]);
  const introEvents = useTransform(p, (v) => (v > 0.18 ? "none" : "auto"));
  const cueOpacity = useTransform(p, [0, 0.05], [1, 0]);

  const spiralRotate = useTransform(p, [0, 1], [0, -260]);
  const spiralScale = useTransform(p, [0, 1], [1, 1.7]);
  const spiralLength = useTransform(p, [0.08, 0.86], [1, 0]);
  const spiralOpacity = useTransform(p, [0, 0.2, 0.8, 0.9], [0.5, 0.75, 0.6, 0]);

  const stampOpacity = useTransform(p, [0.22, 0.3], [0, 1]);
  const askOpacity = useTransform(p, [0.24, 0.34], [0, 1]);
  const askY = useTransform(p, [0.24, 0.34], [48, 0]);
  const askScale = useTransform(p, [0.24, 0.34], [0.86, 1]);
  const typingOpacity = useTransform(p, [0.4, 0.44, 0.54, 0.58], [0, 1, 1, 0]);
  const replyOpacity = useTransform(p, [0.57, 0.66], [0, 1]);
  const replyY = useTransform(p, [0.57, 0.66], [36, 0]);
  const replyScale = useTransform(p, [0.57, 0.66], [0.9, 1]);
  const trust = [
    useTransform(p, [0.72, 0.78], [0, 1]),
    useTransform(p, [0.77, 0.83], [0, 1]),
    useTransform(p, [0.82, 0.88], [0, 1]),
  ];
  const chatEvents = useTransform(p, (v) => (v > 0.24 ? "auto" : "none"));

  if (reduce || short) return <StaticHero />;

  return (
    <section id="top" ref={ref} aria-label="TanyaTalk introduction" className="relative h-[360vh]">
      <div className="sticky top-0 flex stage items-center justify-center overflow-hidden">
        {/* the spiral: tight at first, unwinding as the conversation begins */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.svg
          viewBox="-100 -100 200 200"
          className="h-[150vmax] w-[150vmax] shrink-0 md:h-[125vmax] md:w-[125vmax]"
          style={{ rotate: spiralRotate, scale: spiralScale, opacity: spiralOpacity }}
        >
          <defs>
            <linearGradient id="spiral-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2bb5ad" />
              <stop offset="0.55" stopColor="#f4b8c8" />
              <stop offset="1" stopColor="#f6c9a3" />
            </linearGradient>
          </defs>
          <motion.path d={d} fill="none" stroke="url(#spiral-stroke)" strokeWidth="0.32" strokeLinecap="round" style={{ pathLength: spiralLength }} />
        </motion.svg>
        </div>
        {/* keeps type crisp over the lines */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,255,255,0.94),rgba(255,255,255,0.72)_55%,rgba(255,255,255,0.15))]" />

        <motion.div className="relative w-full pt-12" style={{ opacity: introOpacity, y: introY, scale: introScale, pointerEvents: introEvents }}>
          <Intro />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-[max(1.375rem,env(safe-area-inset-left))] pt-12"
          style={{ pointerEvents: chatEvents }}
        >
          <div className="flex w-full max-w-[44rem] flex-col gap-[0.6em] text-[clamp(1.2rem,4.6vw,2.25rem)] font-medium tracking-tightish">
            <motion.p className="text-center text-[0.8125rem] font-medium tracking-normal text-ink-faint sm:text-[0.9375rem]" style={{ opacity: stampOpacity }}>
              {hero.chat.stamp}
            </motion.p>
            <motion.p
              className="bubble bubble-sent max-w-[88%] origin-bottom-right self-end"
              style={{ opacity: askOpacity, y: askY, scale: askScale }}
            >
              {hero.chat.question}
            </motion.p>
            <div className="relative max-w-[88%] self-start">
              <motion.p className="bubble bubble-recv origin-bottom-left" style={{ opacity: replyOpacity, y: replyY, scale: replyScale }}>
                {hero.chat.reply}
              </motion.p>
              <motion.span className="absolute left-0 top-0" style={{ opacity: typingOpacity }}>
                <TypingDots />
              </motion.span>
            </div>
            <p className="mt-[1.4em] flex flex-wrap justify-center gap-x-[0.4em] text-center text-[clamp(1.05rem,2.6vw,1.6rem)] font-semibold text-ink">
              {hero.trust.map((t, i) => (
                <motion.span key={t} style={{ opacity: trust[i] }}>
                  {t}
                </motion.span>
              ))}
            </p>
          </div>
        </motion.div>

        {/* scroll cue: "See it in action" and the arrow bob together; not a link, it just invites a scroll */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] flex justify-center"
          style={{ opacity: cueOpacity }}
        >
          <span className="flex animate-nudge flex-col items-center text-[1.0625rem] font-medium text-tide-600">
            See it in action
            <svg viewBox="0 0 20 20" fill="none" className="h-7 w-7 text-ink-faint">
              <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
