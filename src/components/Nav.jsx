import { TextTanyaButton, Wordmark } from "./ui.jsx";

const links = [
  { href: "#what-is-tanyatalk", label: "Why" },
  { href: "#demo", label: "How it works" },
  { href: "#who-is-tanya", label: "Tanya" },
  { href: "#faq", label: "Questions" },
];

/** Thin, translucent, always there: the action is one tap away on every screen size. */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-white/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
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
    </header>
  );
}
