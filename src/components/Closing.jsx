import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { becomingYou, DIRECT_SMS_LINK, faq, finale, hero, legal, SMS_NUMBER_DISPLAY } from "../content/site.js";
import { Reveal, TextTanyaButton, Wordmark } from "./ui.jsx";

export function BecomingYou() {
  return (
    <section aria-labelledby="becoming-heading" className="wrap pb-24 sm:pb-36">
      <Reveal className="tile bg-[linear-gradient(135deg,#eefaf8_0%,#fdf1f3_55%,#fdf3e7_100%)] px-7 py-14 sm:px-14 sm:py-20">
        <div className="max-w-[44rem]">
          <p className="eyebrow">{becomingYou.eyebrow}</p>
          <h2 id="becoming-heading" className="display-md mt-2">
            {becomingYou.title}
          </h2>
          <p className="mt-6 text-xl font-medium leading-[1.4] tracking-tightish text-ink-soft sm:text-[1.4rem]">{becomingYou.body}</p>
          <p className="mt-4 text-lg font-semibold text-ink">{becomingYou.includes}</p>
          <a href={DIRECT_SMS_LINK} className="text-link mt-6">
            {becomingYou.cta}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="pb-24 sm:pb-36">
      <div className="wrap max-w-[52rem]">
        <Reveal>
          <h2 id="faq-heading" className="display-lg">
            Questions.
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-10 border-b border-hairline sm:mt-14">
          {faq.map((item) => (
            <details key={item.q} className="group border-t border-hairline">
              <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-5 text-[1.3rem] font-semibold leading-snug tracking-tightish sm:text-[1.6rem] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist transition-colors group-hover:bg-ink/10">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 text-ink-soft transition-transform duration-300 group-open:rotate-45">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[40rem] pb-7 text-lg leading-relaxed text-ink-muted sm:text-xl sm:leading-relaxed">{item.a}</p>
            </details>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <a href="/terms" className="text-link mt-6">
            Read the full note from Tanya
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/** Closing frame: the last call to action, then the beach photo settles into place beneath it. */
export function Finale() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const frame = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  return (
    <section aria-labelledby="finale-heading" className="pb-10 sm:pb-16">
      <Reveal className="wrap flex flex-col items-center text-center">
        <h2 id="finale-heading" className="display-lg">
          {finale.title[0]}
          <span className="block text-sunset">{finale.title[1]}</span>
        </h2>
        <TextTanyaButton className="mt-8">{hero.cta}</TextTanyaButton>
        <p className="mt-4 text-sm font-medium text-ink-muted">{hero.reassurance}</p>
      </Reveal>
      <div ref={ref} className="wrap mt-12 sm:mt-16">
        <motion.div className="tile aspect-[4/5] sm:aspect-[16/9]" style={reduce ? undefined : { scale: frame }}>
          <motion.img
            src="/tanya-beach-footer.png"
            alt={finale.photoAlt}
            width="838"
            height="978"
            loading="lazy"
            decoding="async"
            style={reduce ? undefined : { scale }}
            className="absolute inset-0 h-full w-full object-cover object-[center_45%] sm:object-[center_58%]"
          />
        </motion.div>
      </div>
    </section>
  );
}

const BOT_URL = import.meta.env.VITE_BOT_URL ?? "";

/** Same endpoint and payload as v1's "Report an issue". */
function ReportIssue() {
  const dialogRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const close = () => {
    dialogRef.current?.close();
    setStatus("idle");
  };

  async function submit(e) {
    e.preventDefault();
    if (!description.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${BOT_URL}/report-error`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() || null, description: description.trim() }),
      });
      if (res.ok) {
        setStatus("success");
        setPhone("");
        setDescription("");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const field = "mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-base text-ink focus-visible:border-tide-600 focus-visible:ring-offset-0";

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className="cursor-pointer rounded hover:text-ink hover:underline">
        Report an issue
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="report-title"
        onClick={(e) => e.target === dialogRef.current && close()}
        className="w-[min(92vw,26rem)] rounded-[1.75rem] bg-white p-0 text-left text-ink shadow-device backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      >
        <div className="p-7">
          <h2 id="report-title" className="text-2xl font-semibold tracking-tightish">
            Report an issue
          </h2>
          {status === "success" ? (
            <div aria-live="polite">
              <p className="mt-4 text-lg text-ink-soft">Got it. Thanks for letting me know.</p>
              <button type="button" onClick={close} className="text-link mt-4">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
              <label className="text-sm font-semibold text-ink-soft">
                Your phone number <span className="font-normal text-ink-faint">(optional)</span>
                <input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
              </label>
              <label className="text-sm font-semibold text-ink-soft">
                What went wrong?
                <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`${field} resize-none`} />
              </label>
              <p role="alert" className={`text-sm font-semibold text-[#b3261e] ${status === "error" ? "" : "hidden"}`}>
                That didn’t send. Please try again in a moment.
              </p>
              <div className="flex items-center justify-end gap-5">
                <button type="button" onClick={close} className="min-h-[2.75rem] cursor-pointer rounded px-2 text-[1.0625rem] font-medium text-ink-muted hover:text-ink">
                  Cancel
                </button>
                <button type="submit" disabled={status === "loading" || !description.trim()} className="btn min-h-[2.75rem] px-6 shadow-none disabled:cursor-not-allowed disabled:opacity-40">
                  {status === "loading" ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-mist pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-[0.8125rem] leading-relaxed text-ink-muted">
      <div className="wrap">
        <p className="border-b border-hairline pb-5">
          {legal.crisis} TanyaTalk is a coaching tool, not therapy or medical care, for adults 18 and older. On a computer? Text “hey tanya” to {SMS_NUMBER_DISPLAY}.
        </p>
        <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark className="text-[0.95rem]" />
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href="/terms" className="rounded hover:text-ink hover:underline">
              Terms
            </a>
            <ReportIssue />
            <span>© {new Date().getFullYear()} TanyaTalk</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
