import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { startIMessage } from "../lib/track.js";

export const EASE = [0.16, 1, 0.3, 1];

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/**
 * A phone held sideways is too short for a full-screen pinned scene:
 * the scenes fall back to their plain stacked layout there.
 */
export const SHORT_SCREEN = "(max-height: 520px)";

/** Slow, soft rise the first time a block scrolls into view. */
export function Reveal({ children, delay = 0, className = "", as = "div", y = 28 }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** Statement type that "fills in" word by word as it travels up the screen. */
export function ScrollWords({ text, className = "", as = "p" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] });
  const words = useMemo(() => text.split(" "), [text]);
  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {reduce
        ? text
        : words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2) / words.length)]}>
              {w}
            </Word>
          ))}
    </Tag>
  );
}

export function ChatIcon({ className = "h-[1.1em] w-[1.1em]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`shrink-0 ${className}`}>
      <path d="M12 3C6.48 3 2 6.9 2 11.7c0 2.5 1.23 4.75 3.2 6.33-.12 1.03-.5 2.3-1.5 3.34a.5.5 0 0 0 .4.84c2.2-.13 3.9-.9 5.05-1.68.9.2 1.86.31 2.85.31 5.52 0 10-3.9 10-8.7S17.52 3 12 3Z" />
    </svg>
  );
}

/** The one primary action on the page. */
export function TextTanyaButton({ children = "Text TanyaTalk now", className = "", small = false }) {
  return (
    <button type="button" onClick={startIMessage} className={`btn btn-bubble ${small ? "btn-sm" : ""} ${className}`}>
      {children}
    </button>
  );
}

/** A long single-stroke spiral, drawn in code so it stays crisp at any size. */
export function spiralPath(turns = 9, points = 720) {
  let d = "";
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = t * turns * Math.PI * 2;
    // slight wobble so it reads as hand-drawn, like the brand mark
    const r = 4 + t * 92 + Math.sin(angle * 2.3) * 1.4 * t;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r * 0.94;
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

export function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[1.05rem] font-semibold tracking-tightish text-ink ${className}`}>
      <img src="/loading-spiral.png" alt="" aria-hidden="true" width="519" height="480" className="h-5 w-auto" />
      TanyaTalk
    </span>
  );
}
