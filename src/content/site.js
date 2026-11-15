/**
 * All page copy. v3 tightens the v1/v2 wording into short lines;
 * the facts and claims are unchanged. Quotes are kept word for word.
 */

/** iMessage deep link: opens Messages with "hey tanya" ready to send */
export const SMS_LINK = "sms:+13177282783&body=hey%20tanya";
export const SMS_NUMBER_DISPLAY = "(317) 728-2783";
/** Tanya's direct line, used only for the BecomingYOU program */
export const DIRECT_SMS_LINK = "sms:+15627149917";

export const hero = {
  eyebrow: "Life coaching, over iMessage",
  title: ["It’s 2am.", "You’re"],
  /** Rotates under “You’re …” every 1.5s in the hero */
  spiralWords: ["spiraling", "overthinking", "unraveling", "panicking", "drowning", "stuck", "falling apart"],
  subtitle: "Real coaching back in seconds.",
  cta: "Text TanyaTalk now",
  reassurance: "Free to start. No signup, no card.",
  chat: {
    stamp: "iMessage · 2:04 AM",
    question: "why does everyone else look fine except me",
    reply: "Because you’re comparing your inside to their outside. What happened today that brought this up?",
  },
  trust: ["Replies in seconds.", "24/7.", "ICF-certified coach methods."],
};

export const testimonial = {
  quote:
    "I texted at 11pm completely overwhelmed and honestly didn’t know what I was even looking for. Within a few messages it helped me see exactly what I was doing and why I kept ending up in the same place. I didn’t expect that from a text. I came back the next morning.",
  author: "Anonymous",
};

export const gaps = {
  eyebrow: "The problem",
  title: "Everything else leaves a gap.",
  items: [
    { who: "Therapy", strength: "Deep emotional processing.", gap: "Has a waitlist. No guidance between sessions." },
    { who: "Friends & family", strength: "Love and connection.", gap: "Biased, and based on their own fears." },
    { who: "Google & chatbots", strength: "Endless information.", gap: "Generic memory. Not specialized in transformation." },
    { who: "Journaling", strength: "Self-reflection and awareness.", gap: "Doesn’t respond." },
    { who: "Coaching", strength: "Powerful transformation.", gap: "Not covered by insurance." },
    { who: "Social media", strength: "Inspiration.", gap: "A dopamine hit without direction." },
  ],
};

export const realStuff = {
  lead: "Nobody prepares you for the real stuff.",
  lines: ["Getting what you want.", "Trusting your decisions.", "Deciding who you’re becoming."],
  answer:
    "TanyaTalk is a personal coaching tool, backed by nearly a decade of Tanya Wannemacher’s professional expertise. In your iMessage, 24/7. Used by the real Tanya in her life coaching program.",
};

export const demo = {
  eyebrow: "See it in action",
  title: ["No app.", "No appointment.", "Just a text."],
  steps: [
    { title: "Tap.", body: "iMessage opens with a hello ready to send." },
    { title: "Say what’s on your mind.", body: "Show up as you are, at any hour." },
    { title: "Coaching back in seconds.", body: "It remembers your story and guides your next step." },
  ],
  /** YouTube Short: “What is TanyaTalk? A pocket life coach” */
  video: { youtubeId: "7udtah5_W_g" },
};

export const features = {
  eyebrow: "What you get",
  title: "A coach in your pocket.",
  tiles: {
    always: { big: "24/7", line: "Available day and night. No scheduling." },
    memory: "Remembers your story.",
    next: "Guides your next step.",
    asYouAre: { line: "Show up as you are.", sub: "No diagnosis." },
    honest: "A safe space to be honest.",
    level: { line: "Master-level coaching.", sub: "Professional support." },
    trust: "Regain trust in yourself.",
  },
};

export const tanya = {
  eyebrow: "Who is Tanya?",
  title: "Meet Tanya.",
  photoAlt: "Tanya smiling, seated on red brick steps in front of a dark paneled door.",
  bio: "Tanya Wannemacher was an elementary school teacher before earning an ICF-accredited professional coaching degree. Today she helps you see your world through a different lens, and close the gap between who you are and who you want to become.",
  stats: [
    { value: "~10", unit: "years", label: "of experience" },
    { value: "2,000+", unit: "hours", label: "of coaching" },
  ],
  focus: ["Neuroscience", "Identity transformation", "Spiritual growth", "Perspective shifts", "Emotional regulation"],
  beliefLabel: "Her core belief",
  belief: "Your alignment begins the moment you stop outsourcing your peace, worth, and happiness to the outside world.",
  style: ["Coaches beside you, not above you.", "Holds space while moving you forward."],
  closer: "That little whisper telling you that you were meant for something more? Let’s go get it.",
  voiceNote: {
    label: "Hear how Tanya answers",
    question: "Hey Tanya, why do I feel like I'm never doing enough, even when I'm trying my best?",
    src: "/tanya-voice-note.m4a",
    duration: "0:12",
  },
};

export const becomingYou = {
  eyebrow: "BecomingYOU",
  title: "Want to go to the next level?",
  body: "A 16-week Inner Circle coaching program with Tanya, personally. Understand your brain, your nervous system patterns, your identity and your emotional healing, and start moving through life with more clarity, confidence and self-trust.",
  includes: "Weekly teachings, tools, and group coaching calls included.",
  cta: "Call or text Tanya directly",
};

/** Answers come from the Terms letter (public/terms.html). */
export const faq = [
  {
    q: "Is it really free to start?",
    a: "Yes. Your first 15 messages require no credit card and no signup. If you want to keep going after that, a subscription is $21 per month, and you will never be charged without choosing to continue.",
  },
  {
    q: "How do I cancel?",
    a: "Text “cancel subscription” anytime. Your profile stays intact, so TanyaTalk remembers you if you come back.",
  },
  {
    q: "Are my conversations private?",
    a: "They are stored securely and encrypted. They exist to help TanyaTalk remember you, and are only ever looked at if something on TanyaTalk’s end needs to be fixed. Text “delete my data” and everything is permanently gone.",
  },
  {
    q: "Is this therapy?",
    a: "No. TanyaTalk is a coaching tool for reflection, clarity, and growth. Tanya is not a licensed therapist, and TanyaTalk is not a replacement for therapy, medical care, or crisis support. If you are in crisis, reach out to a qualified professional or call 988.",
  },
  {
    q: "Who is it for?",
    a: "Adults 18 and older. You don’t have to have everything figured out. Just start wherever you are.",
  },
];

export const finale = {
  title: ["That’s TanyaTalk.", "Right in your pocket."],
  photoAlt: "Tanya on the beach at sunset, seen from behind with arms open wide toward the calm ocean and soft pink sky.",
};

export const legal = {
  crisis: "Not for emergencies. In crisis, call or text 988.",
};
