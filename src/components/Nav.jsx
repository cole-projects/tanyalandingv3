import { useEffect, useRef, useState } from "react";
import { TextTanyaButton, Wordmark } from "./ui.jsx";
import { startIMessage } from "../lib/track.js";
import { sale } from "../content/site.js";

const links = [
  { href: "#what-is-tanyatalk", label: "Why" },
  { href: "#demo", label: "How it works" },
  { href: "#who-is-tanya", label: "Tanya" },
  { href: "#faq", label: "Questions" },
];

/** Milliseconds left until `end`. Ticks every second in the final day, every 15s before that. */
function useTimeLeft(end) {
  const [left, setLeft] = useState(() => end - Date.now());
  const lastDay = left < 864e5;
  const over = left <= 0;
  useEffect(() => {
    if (over) return undefined;
    const id = setInterval(() => setLeft(end - Date.now()), lastDay ? 1000 : 15000);
    return () => clearInterval(id);
  }, [end, lastDay, over]);
  return left;
}

/** Days / hours / minutes, plus seconds once it is down to the final day. */
function units(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, "0");
  const d = Math.floor(s / 86400);
  const parts = [
    [d, "d", "days"],
    [pad(Math.floor((s % 86400) / 3600)), "h", "hours"],
    [pad(Math.floor((s % 3600) / 60)), "m", "minutes"],
  ];
  if (d === 0) {
    parts.shift();
    parts.push([pad(s % 60), "s", "seconds"]);
  }
  return parts;
}

/** Fixed positions so the snowfall looks the same on every load. */
const FLAKES = [
  [4, 0, 5.5, 3, 0.7], [11, 2.1, 7, 2, 0.5], [19, 4.2, 6, 3, 0.8], [27, 1.2, 8, 2, 0.45],
  [35, 3.4, 6.5, 2.5, 0.6], [44, 0.6, 7.5, 2, 0.5], [52, 2.8, 5.8, 3, 0.75], [61, 4.8, 7.2, 2, 0.45],
  [69, 1.6, 6.2, 2.5, 0.65], [77, 3.9, 8, 2, 0.5], [85, 0.9, 6.8, 3, 0.7], [93, 2.5, 7.4, 2, 0.5],
];

function Snowflake({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7" />
      <path d="m9 3.5 3 2.5 3-2.5M9 20.5l3-2.5 3 2.5M3.6 10.4l3.7-.9-1.3-3.6M20.4 13.6l-3.7.9 1.3 3.6M3.6 13.6l3.7.9-1.3 3.6M20.4 10.4l-3.7-.9 1.3-3.6" />
    </svg>
  );
}

function Countdown({ left }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-white/70">Ends in</span>
      <span className="inline-flex gap-1" role="timer" aria-live="off">
        {units(left).map(([n, short, long]) => (
          <span key={long} className="rounded-md bg-white/[0.12] px-1.5 py-0.5 font-semibold tabular-nums text-white ring-1 ring-inset ring-white/15">
            {n}
            <span className="ml-px font-medium text-white/60" aria-hidden="true">{short}</span>
            <span className="sr-only"> {long}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Holiday sale ribbon, pinned under the nav for as long as the sale runs.
 * Evergreen, gold and cranberry; the code itself is shared by Tanya after the free trial.
 */
function SaleRibbon({ left }) {
  const ref = useRef(null);

  // Let page offsets (anchor jumps, the static hero) account for the ribbon's height.
  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    const set = () => root.style.setProperty("--ribbon-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--ribbon-h");
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-[linear-gradient(100deg,#0b4f4c_0%,#0f3d36_45%,#13342c_100%)] text-white shadow-[0_8px_24px_-14px_rgba(11,79,76,0.9)]"
    >
      {/* snowfall + a slow sheen, purely decorative and still under reduced motion */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {FLAKES.map(([x, delay, dur, size, o], i) => (
          <span
            key={i}
            className="absolute top-0 animate-snow rounded-full bg-white opacity-0"
            style={{
              left: `${x}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              "--d": `${dur}s`,
              "--o": o,
              "--drift": `${i % 2 ? -10 : 10}px`,
            }}
          />
        ))}
        <span className="absolute inset-y-0 left-0 w-1/3 animate-sheen bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />
      </div>
      {/* hairline of gold along the bottom edge */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,#f6c9a3_30%,#f4b8c8_70%,transparent)] opacity-70" />

      <p className="wrap relative flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-2.5 text-center text-[0.8125rem] leading-none sm:text-sm">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.08em] text-peach min-[400px]:tracking-[0.14em]">
            <Snowflake className="h-3.5 w-3.5" />
            Black Friday
          </span>
          <s className="text-white/55 decoration-white/55">
            <span className="sr-only">Regular price </span>
            {sale.was}
          </s>
          <span className="sr-only">sale price </span>
          <span className="rounded-full bg-[#c8263f] px-2 py-1 font-semibold text-white shadow-[0_2px_10px_-2px_rgba(200,38,63,0.7)]">
            {sale.now}/month
          </span>
          <span className="text-white/85">for life</span>
        </span>
        <Countdown left={left} />
        <button
          type="button"
          onClick={startIMessage}
          className="-my-2 hidden whitespace-nowrap rounded py-2 font-medium text-white underline-offset-4 hover:underline sm:inline"
        >
          Start free <span aria-hidden="true">›</span>
        </button>
      </p>
    </div>
  );
}

/** Thin, translucent, always there: the action is one tap away on every screen size. */
export default function Nav() {
  const left = useTimeLeft(sale.end);
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="relative z-10 border-b border-hairline bg-white/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
        <div className="wrap flex h-12 items-center justify-between gap-6">
          <a href="#top" aria-label="TanyaTalk, back to top" className="rounded">
            <Wordmark />
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded text-xs font-medium text-ink-soft transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          {/* 32px tall visually; the padding around it extends the tap area */}
          <span className="-my-2 py-2">
            <TextTanyaButton small>Text TanyaTalk</TextTanyaButton>
          </span>
        </div>
      </div>
      {left > 0 && <SaleRibbon left={left} />}
    </header>
  );
}
