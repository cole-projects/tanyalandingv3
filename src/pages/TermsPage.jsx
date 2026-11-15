import { Wordmark } from "../components/ui.jsx";

/** Tanya's letter. Wording is unchanged from v1 (also served statically at /terms.html). */
export default function TermsPage() {
  const p = "text-[1.1875rem] leading-[1.6] text-ink-soft";
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-hairline">
        <div className="wrap flex h-12 items-center">
          <a href="/" aria-label="TanyaTalk home" className="rounded">
            <Wordmark />
          </a>
        </div>
      </header>
      <main className="wrap max-w-[44rem] pb-24 pt-16 sm:pt-24">
        <p className="eyebrow">A note from Tanya</p>
        <h1 className="display-lg mt-2">TanyaTalk Terms</h1>
        <div className="mt-10 space-y-6">
          <p className={p}>To whoever is reading this,</p>
          <p className={p}>
            Hi, I’m Tanya. I’ve spent years helping people work through what’s on their mind, and I’m here for you too.
            Everything here is built with my heart, so you always have someone to come to whenever you need it, 24/7.
          </p>
          <p className={p}>
            Your conversations are stored securely and encrypted. They exist to help TanyaTalk remember you and go deeper
            with you over time. They stay private and are only ever looked at if something on TanyaTalk’s end needs to be
            fixed. That’s it. You can cancel anytime by texting “cancel subscription”, and your profile stays intact so
            TanyaTalk remembers you if you come back. If you ever want everything permanently deleted, just text “delete
            my data” and it’s gone.
          </p>
          <p className={p}>
            TanyaTalk is a coaching tool built for reflection, clarity, and growth. I am not a licensed therapist, and
            TanyaTalk is not a replacement for therapy, medical care, or crisis support. If you are in crisis or need
            immediate help, please reach out to a qualified professional or call 988. By continuing, you agree to use
            TanyaTalk as the coaching companion it is. TanyaTalk is intended for adults 18 and older.
          </p>
          <p className={p}>
            Starting is completely free. Your first 15 messages require no credit card and no signup. Just start the
            conversation. If you want to keep going after that, a subscription is $21 per month. You can cancel anytime
            by texting “cancel subscription” and you will never be charged without choosing to continue.
          </p>
          <p className={p}>
            When you’re ready, the more you share with TanyaTalk, the deeper you can go together. You don’t have to have
            everything figured out. Just start wherever you are.
          </p>
        </div>
        <div className="mt-12 flex flex-col items-end">
          <p className={p}>Sincerely,</p>
          <p className="display-md text-sunset mt-1">Tanya</p>
          <img src="/loading-spiral.png" alt="" aria-hidden="true" className="mt-4 h-10 w-auto opacity-80" />
        </div>
        <a href="/" className="text-link mt-12">
          Back to TanyaTalk
        </a>
      </main>
    </div>
  );
}
