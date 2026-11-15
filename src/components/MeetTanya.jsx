import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { tanya } from "../content/site.js";
import { Reveal, ScrollWords } from "./ui.jsx";

const BARS = [5, 9, 6, 12, 8, 14, 7, 11, 5, 9, 13, 7, 15, 9, 11, 6, 12, 8, 10, 5, 8, 12, 6, 9, 13, 7, 10, 6];

function fmt(seconds) {
  if (!Number.isFinite(seconds)) return null;
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Tanya's own voice, as the reply to a texted question. */
function VoiceNote() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(tanya.voiceNote.duration);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return undefined;
    const onMeta = () => setDuration(fmt(el.duration) ?? tanya.voiceNote.duration);
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => {});
    else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="tile flex h-full flex-col justify-between p-7 md:p-10">
      <p className="text-lg font-semibold tracking-tightish text-tide-600">{tanya.voiceNote.label}</p>
      <div className="mt-10 flex flex-col gap-2.5 text-[1.0625rem] sm:text-lg">
        <p className="bubble bubble-sent max-w-[88%] self-end">{tanya.voiceNote.question}</p>
        <audio ref={audioRef} src={tanya.voiceNote.src} preload="metadata" playsInline />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause Tanya’s voice message" : `Play Tanya’s voice message, ${duration}`}
          className="bubble bubble-recv flex w-full max-w-[20rem] cursor-pointer items-center gap-3 self-start py-3 transition-colors hover:bg-[#dedee2]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tide-600 text-white">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              {playing ? <path d="M3 2.5h3.5v11H3zM9.5 2.5H13v11H9.5z" /> : <path d="M4.5 2.6v10.8a.6.6 0 0 0 .92.5l8.4-5.4a.6.6 0 0 0 0-1L5.42 2.1a.6.6 0 0 0-.92.5Z" />}
            </svg>
          </span>
          <span className="flex h-5 flex-1 items-center gap-[3px]" aria-hidden="true">
            {BARS.map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full transition-colors duration-150 ${i / BARS.length < progress ? "bg-tide-600" : "bg-[#b4b4ba]"}`}
                style={{ height: `${h}px` }}
              />
            ))}
          </span>
          <span className="text-xs font-semibold tabular-nums text-ink-muted">{duration}</span>
        </button>
      </div>
    </div>
  );
}

/** Kept from v1: five taps on Tanya's photo. */
function Confetti() {
  const colors = ["#f4b8c8", "#2bb5ad", "#f6d98b", "#aee3de", "#f6c9a3"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 48 }).map((_, i) => (
        <span
          key={i}
          className="absolute -top-4 h-2.5 w-2.5 animate-fall rounded-full"
          style={{ left: `${(i * 37) % 100}%`, background: colors[i % colors.length], animationDelay: `${(i % 12) * 0.05}s`, "--x": `${((i % 7) - 3) * 14}px` }}
        />
      ))}
    </div>
  );
}

function Portrait() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const [taps, setTaps] = useState(0);
  const [party, setParty] = useState(false);

  const tap = () => {
    const next = taps + 1;
    setTaps(next);
    if (next === 5) {
      setParty(true);
      setTimeout(() => {
        setParty(false);
        setTaps(0);
      }, 2600);
    }
  };

  return (
    <div ref={ref} className="tile aspect-[4/5] w-full">
      {party ? <Confetti /> : null}
      <motion.img
        src="/tanya-who.png"
        alt={tanya.photoAlt}
        width="678"
        height="1024"
        loading="lazy"
        decoding="async"
        onClick={tap}
        style={reduce ? undefined : { y }}
        className="absolute inset-0 h-[112%] w-full -translate-y-[6%] object-cover object-[center_12%]"
      />
    </div>
  );
}

export default function MeetTanya() {
  return (
    <section id="who-is-tanya" aria-labelledby="tanya-heading" className="py-24 sm:py-36">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{tanya.eyebrow}</p>
          <h2 id="tanya-heading" className="display-lg mt-2">
            {tanya.title}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal>
            <Portrait />
          </Reveal>
          <div>
            <Reveal>
              <p className="text-[clamp(1.2rem,2vw,1.6rem)] font-medium leading-[1.35] tracking-tightish text-ink">{tanya.bio}</p>
            </Reveal>
            <Reveal as="dl" delay={0.08} className="mt-10 grid grid-cols-2 gap-6 border-t border-hairline pt-8">
              {tanya.stats.map((s) => (
                <div key={s.unit} className="flex flex-col-reverse">
                  <dt className="mt-1 text-base font-medium text-ink-muted sm:text-lg">
                    {s.unit} {s.label}
                  </dt>
                  <dd className="text-sunset w-fit text-[clamp(3rem,7vw,5rem)] font-semibold leading-none tracking-display">{s.value}</dd>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.12} className="mt-8 flex items-center gap-5 border-t border-hairline pt-8">
              <img src="/icf-badge.png" alt="ICF, International Coaching Federation" loading="lazy" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
              <img src="/cert.webp" alt="ICF PCC, Professional Certified Coach" loading="lazy" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
              <p className="text-base font-medium leading-snug text-ink-muted">{tanya.focus.join(" · ")}</p>
            </Reveal>
          </div>
        </div>

        <figure className="mt-24 sm:mt-40">
          <Reveal as="figcaption" className="eyebrow">
            {tanya.beliefLabel}
          </Reveal>
          <ScrollWords as="blockquote" text={tanya.belief} className="mt-3 text-[clamp(2rem,5.6vw,4.25rem)] font-semibold leading-[1.06] tracking-display" />
        </figure>

        <div className="mt-16 grid gap-4 sm:mt-24 sm:gap-5 md:grid-cols-2">
          <Reveal>
            <VoiceNote />
          </Reveal>
          <Reveal delay={0.08} className="tile flex h-full flex-col justify-between p-7 md:p-10">
            <ul className="space-y-1 text-[1.6rem] font-semibold leading-[1.12] tracking-tightish md:text-[2rem]">
              {tanya.style.map((line, i) => (
                <li key={line} className={i ? "text-ink-faint" : ""}>
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-lg font-medium leading-snug text-ink-muted sm:text-xl">{tanya.closer}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
