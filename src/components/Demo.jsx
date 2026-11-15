import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { demo } from "../content/site.js";
import { track } from "../lib/track.js";
import { SHORT_SCREEN, useMediaQuery } from "./ui.jsx";

/** Load the YouTube IFrame API once for the whole page. */
function loadYouTubeAPI() {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT?.Player) return Promise.resolve(window.YT);

  return new Promise((resolve) => {
    const done = () => resolve(window.YT);
    const prior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prior?.();
      done();
    };
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    } else if (window.YT?.Player) {
      done();
    }
  });
}

/**
 * Sound and phone browsers: a video may start on its own only while muted.
 * Sound is allowed once the visitor has really tapped (or clicked, or pressed
 * a key). Scrolling does not count, and neither do touchstart or pointerdown.
 * So: play muted straight away, and switch sound on at the first real tap.
 */
const tapListeners = new Set();
let hasTapped = false;

function onTap(cb) {
  tapListeners.add(cb);
  return () => tapListeners.delete(cb);
}

if (typeof window !== "undefined") {
  const opts = { capture: true, passive: true };
  const fire = () => {
    hasTapped = true;
    tapListeners.forEach((cb) => cb());
  };
  let startX = 0;
  let startY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0]?.clientX ?? 0;
      startY = e.touches[0]?.clientY ?? 0;
    },
    opts,
  );
  // A finger lifting after a scroll is not a tap; browsers ignore it too.
  window.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      if (t && Math.hypot(t.clientX - startX, t.clientY - startY) < 12) fire();
    },
    opts,
  );
  window.addEventListener("click", fire, opts);
  window.addEventListener("keydown", fire, opts);
}

/** iPhone and iPad allow sound only from inside a tap, never from an earlier one. */
const isIOS =
  typeof navigator !== "undefined" &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

/** Has the visitor interacted with the page at all yet? */
function pageActivated() {
  return navigator.userActivation?.hasBeenActive ?? hasTapped;
}

/**
 * YouTube Short in the phone.
 * It starts muted when the scene comes on screen. Sound comes on at the first
 * real tap anywhere on the page; where the browser allows it (the visitor has
 * already tapped something), it comes on by itself. Mute and pause stay available.
 */
function DemoVideo({ active = false }) {
  const mountRef = useRef(null);
  const playerRef = useRef(null);
  const tracked = useRef(false);
  const userPaused = useRef(false);
  const userMuted = useRef(false);
  const activeRef = useRef(active);
  const readyRef = useRef(false);
  const startedRef = useRef(false);
  const mutedRef = useRef(true);
  const soundGranted = useRef(false); // sound has worked once on this player
  const autoTried = useRef(false);
  const checkTimer = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMutedState] = useState(true);
  const [ready, setReady] = useState(false);
  const [choseMute, setChoseMute] = useState(false); // the visitor muted it on purpose: stop offering sound
  // The player is created only when the scene first comes on screen, with YouTube's own muted
  // autoplay. Phones (iPhone especially) often refuse playback started from script, but allow a
  // muted embed that starts itself.
  const [mountNow, setMountNow] = useState(false);

  activeRef.current = active;
  useEffect(() => {
    if (active) setMountNow(true);
  }, [active]);

  const setMuted = (value) => {
    mutedRef.current = value;
    setMutedState(value);
  };

  /** Start (or restart) playback muted. Always allowed. */
  const startMuted = () => {
    const player = playerRef.current;
    if (!player?.playVideo || userPaused.current || !activeRef.current || !readyRef.current) return;
    if (startedRef.current) return;
    startedRef.current = true;
    autoTried.current = false;
    try {
      player.mute();
      setMuted(true);
      player.playVideo();
    } catch {
      startedRef.current = false;
    }
  };

  /**
   * Ask for sound, then check half a second later whether the browser allowed it.
   * If it refused (the video stalls or stays muted), carry on muted; the next tap asks again.
   */
  const requestSound = () => {
    const player = playerRef.current;
    if (!player?.unMute) return;
    try {
      player.unMute();
      player.setVolume(100);
    } catch {
      return;
    }
    window.clearTimeout(checkTimer.current);
    checkTimer.current = window.setTimeout(() => {
      const pl = playerRef.current;
      if (!pl?.getPlayerState) return;
      const state = pl.getPlayerState();
      const S = window.YT?.PlayerState ?? {};
      const going = state === S.PLAYING || state === S.BUFFERING;
      const stillMuted = Boolean(pl.isMuted?.());
      if (going && !stillMuted) {
        soundGranted.current = true;
        setMuted(false);
        return;
      }
      if (userPaused.current || !activeRef.current) {
        setMuted(stillMuted);
        return;
      }
      pl.mute();
      setMuted(true);
      pl.playVideo();
    }, 600);
  };

  useEffect(() => {
    let cancelled = false;
    const mount = mountRef.current;
    if (!mount || !mountNow) return undefined;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || playerRef.current) return;

      const host = document.createElement("div");
      host.style.width = "100%";
      host.style.height = "100%";
      mount.replaceChildren(host);

      playerRef.current = new YT.Player(host, {
        videoId: demo.video.youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: demo.video.youtubeId,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            readyRef.current = true;
            setReady(true);
            startedRef.current = true; // the embed starts itself (muted autoplay)
            if (activeRef.current) {
              event.target.mute();
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
          },
          onStateChange: (event) => {
            const playingNow = event.data === YT.PlayerState.PLAYING;
            const buffering = event.data === YT.PlayerState.BUFFERING;
            setPlaying(playingNow || buffering);
            if (playingNow) {
              // Sound without a fresh tap: only where the browser will allow it,
              // so phones that would refuse are never made to stall.
              const allowed = soundGranted.current || (!isIOS && pageActivated());
              if (mutedRef.current && !userMuted.current && !autoTried.current && allowed) {
                autoTried.current = true;
                requestSound();
              }
            }
            if (event.data === YT.PlayerState.ENDED && !userPaused.current && activeRef.current) {
              event.target.seekTo(0);
              event.target.playVideo();
            }
          },
        },
      });
    });

    // Any real tap while the video is playing muted: switch the sound on, inside the tap.
    const stopTap = onTap(() => {
      if (!activeRef.current || userPaused.current || userMuted.current || !mutedRef.current) return;
      if (!startedRef.current) return;
      if (!tracked.current) {
        tracked.current = true;
        track("WatchedDemo");
      }
      requestSound();
    });

    return () => {
      cancelled = true;
      stopTap();
      window.clearTimeout(checkTimer.current);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      readyRef.current = false;
      startedRef.current = false;
      mount.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mountNow]);

  // Enter/leave the sticky demo scene: start when it arrives, pause when you leave.
  useEffect(() => {
    if (!readyRef.current) return;
    if (active) {
      userPaused.current = false;
      startMuted();
      return;
    }
    startedRef.current = false;
    window.clearTimeout(checkTimer.current);
    try {
      playerRef.current?.pauseVideo?.();
    } catch {
      /* ignore */
    }
    setPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player?.mute) return;
    if (mutedRef.current) {
      userMuted.current = false;
      setChoseMute(false);
      if (!tracked.current) {
        tracked.current = true;
        track("WatchedDemo");
      }
      if (!playing) {
        userPaused.current = false;
        startedRef.current = true;
        player.playVideo();
      }
      requestSound();
    } else {
      userMuted.current = true;
      setChoseMute(true);
      window.clearTimeout(checkTimer.current);
      player.mute();
      setMuted(true);
    }
  };

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player?.playVideo) return;
    if (playing) {
      userPaused.current = true;
      player.pauseVideo();
      setPlaying(false);
    } else {
      userPaused.current = false;
      startedRef.current = true;
      player.playVideo();
      if (!userMuted.current) requestSound();
    }
  };

  const offerSound = ready && playing && muted && !choseMute;

  const control =
    "relative z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/75 focus-visible:ring-white focus-visible:ring-offset-0";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-label="What is TanyaTalk? A pocket life coach">
        <div ref={mountRef} className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/80 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      {!ready && <div className="absolute inset-0 bg-ink/80" aria-hidden="true" />}
      <div className="absolute bottom-3.5 right-3.5 flex gap-2">
        {/* while it plays without sound, the mute button grows into a labelled prompt */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className={
            offerSound
              ? "relative z-10 flex h-11 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-ink shadow-device transition active:scale-95 focus-visible:ring-white focus-visible:ring-offset-0"
              : control
          }
        >
          {offerSound ? <span>Tap for sound</span> : null}
          <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
            <path d="M3.5 8v4h2.8L10 15V5L6.3 8H3.5Z" fill="currentColor" />
            {muted ? (
              <path d="m13 8 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M13 7.5a3.5 3.5 0 0 1 0 5M15 5.5a6.5 6.5 0 0 1 0 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause the video" : "Play the video"} className={control}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
            {playing ? (
              <path d="M5.5 4h3v12h-3zM11.5 4h3v12h-3z" />
            ) : (
              <path d="M6.5 4.3v11.4a.6.6 0 0 0 .92.5l8.9-5.7a.6.6 0 0 0 0-1L7.42 3.8a.6.6 0 0 0-.92.5Z" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * The demo as a video file served from this site. Phones reliably autoplay a muted inline <video>,
 * and switching its sound on inside a real tap works on iPhone too, which a YouTube embed (a
 * cross-site iframe driven by script) does not guarantee.
 */
function NativeDemoVideo({ active = false }) {
  const videoRef = useRef(null);
  const tracked = useRef(false);
  const userPaused = useRef(false);
  const userMuted = useRef(false);
  const activeRef = useRef(active);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [choseMute, setChoseMute] = useState(false);

  activeRef.current = active;

  // Play (muted) while the scene is on screen; pause when it leaves.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && !userPaused.current) {
      v.play().catch(() => {});
    } else if (!active) {
      v.pause();
    }
  }, [active]);

  // First real tap anywhere while it plays muted: sound on, from inside the tap.
  useEffect(
    () =>
      onTap(() => {
        const v = videoRef.current;
        if (!v || !activeRef.current || userPaused.current || userMuted.current || !v.muted) return;
        if (!tracked.current) {
          tracked.current = true;
          track("WatchedDemo");
        }
        v.muted = false;
        v.play().catch(() => {
          v.muted = true; // the browser said no; keep playing silently
          v.play().catch(() => {});
        });
      }),
    [],
  );

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted) {
      userMuted.current = false;
      setChoseMute(false);
      userPaused.current = false;
      if (!tracked.current) {
        tracked.current = true;
        track("WatchedDemo");
      }
      v.muted = false;
      v.play().catch(() => {});
    } else {
      userMuted.current = true;
      setChoseMute(true);
      v.muted = true;
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const offerSound = playing && muted && !choseMute;
  const control =
    "relative z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/75 focus-visible:ring-white focus-visible:ring-offset-0";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-black">
      <video
        ref={videoRef}
        src={demo.video.src}
        poster={demo.video.poster}
        muted
        autoPlay={active}
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        aria-label="What is TanyaTalk? A pocket life coach"
        className="h-full w-full object-cover"
      />
      <div className="absolute bottom-3.5 right-3.5 flex gap-2">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className={
            offerSound
              ? "relative z-10 flex h-11 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-ink shadow-device transition active:scale-95 focus-visible:ring-white focus-visible:ring-offset-0"
              : control
          }
        >
          {offerSound ? <span>Tap for sound</span> : null}
          <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
            <path d="M3.5 8v4h2.8L10 15V5L6.3 8H3.5Z" fill="currentColor" />
            {muted ? (
              <path d="m13 8 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M13 7.5a3.5 3.5 0 0 1 0 5M15 5.5a6.5 6.5 0 0 1 0 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause the video" : "Play the video"} className={control}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
            {playing ? (
              <path d="M5.5 4h3v12h-3zM11.5 4h3v12h-3z" />
            ) : (
              <path d="M6.5 4.3v11.4a.6.6 0 0 0 .92.5l8.9-5.7a.6.6 0 0 0 0-1L7.42 3.8a.6.6 0 0 0-.92.5Z" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

/** A video file on the site when one is set (reliable on phones); otherwise the YouTube Short. */
function DemoPlayer(props) {
  return demo.video.src ? <NativeDemoVideo {...props} /> : <DemoVideo {...props} />;
}

function useIsDesktop() {
  const query = "(min-width: 768px)";
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

function Phone({ children, className = "", style }) {
  return (
    <motion.div
      style={style}
      className={`relative aspect-[9/16] rounded-[2.4rem] bg-ink p-[7px] shadow-device ring-1 ring-black/10 sm:rounded-[3rem] sm:p-[9px] ${className}`}
    >
      <div className="h-full w-full rounded-[2rem] sm:rounded-[2.5rem]">{children}</div>
    </motion.div>
  );
}

function Title() {
  return (
    <>
      <p className="eyebrow">{demo.eyebrow}</p>
      <h2 id="demo-heading" className="display-lg mt-2">
        {demo.title.map((line, i) => (
          <span key={line} className={`block ${i === demo.title.length - 1 ? "text-sunset" : ""}`}>
            {line}
          </span>
        ))}
      </h2>
    </>
  );
}

function StaticDemoVideo() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setActive(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={rootRef} className="h-full w-full">
      <DemoPlayer active={active} />
    </div>
  );
}

function StaticDemo() {
  return (
    <section id="demo" aria-labelledby="demo-heading" className="bg-mist py-24">
      <div className="wrap flex flex-col items-center text-center">
        <Title />
        <Phone className="mt-12 w-[min(78vw,340px)]">
          <StaticDemoVideo />
        </Phone>
        <ol className="mt-12 grid gap-8 text-left sm:grid-cols-3">
          {demo.steps.map((s, i) => (
            <li key={s.title}>
              <p className="text-sm font-semibold text-tide-600">0{i + 1}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tightish">{s.title}</h3>
              <p className="mt-1 text-lg text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ step, index, progress, range }) {
  const [a, b, c, d] = range;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, index === demo.steps.length - 1 ? 1 : 0]);
  const y = useTransform(progress, [a, b, c, d], [24, 0, 0, index === demo.steps.length - 1 ? 0 : -24]);
  return (
    <motion.li className="absolute inset-0 flex flex-col md:justify-center" style={{ opacity, y }}>
      <p className="text-sm font-semibold tabular-nums text-tide-600 md:text-base">0{index + 1}</p>
      <h3 className="mt-1 text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold leading-[1.08] tracking-display">{step.title}</h3>
      <p className="mt-2 text-[clamp(1rem,1.6vw,1.3rem)] font-medium leading-snug text-ink-muted">{step.body}</p>
    </motion.li>
  );
}

function Bar({ progress, range }) {
  const scale = useTransform(progress, range, [0, 1]);
  return (
    <span className="block h-[3px] w-10 overflow-hidden rounded-full bg-ink/10 md:h-12 md:w-[3px]">
      <motion.span className="block h-full w-full origin-left rounded-full bg-tide-600 md:origin-top" style={{ scaleX: scale, scaleY: scale }} />
    </span>
  );
}

/**
 * Pinned scene: the title gives way to the phone, which grows to fill the
 * screen while the three steps take turns beside it. The Short plays throughout.
 */
export default function Demo() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [sceneActive, setSceneActive] = useState(false);

  // Play while the sticky phone scene is on screen (not before/after the section).
  useMotionValueEvent(p, "change", (v) => {
    setSceneActive(v > 0.02 && v < 0.98);
  });

  const desktop = useIsDesktop();
  const short = useMediaQuery(SHORT_SCREEN);
  const titleOpacity = useTransform(p, [0, 0.05, 0.12], [1, 1, 0]);
  const titleY = useTransform(p, [0, 0.12], [0, -50]);
  const phoneScale = useTransform(p, [0.03, 0.24], [desktop ? 0.58 : 0.54, 1]);
  // phone waits below the title, then rises into the middle as it grows
  const phoneY = useTransform(p, [0.03, 0.24], [desktop ? "34%" : "50%", "0%"]);
  const sideOpacity = useTransform(p, [0.2, 0.28], [0, 1]);

  const ranges = [
    [0.22, 0.28, 0.44, 0.5],
    [0.48, 0.54, 0.7, 0.76],
    [0.74, 0.8, 1, 1],
  ];

  if (reduce || short) return <StaticDemo />;

  return (
    <section id="demo" ref={ref} aria-labelledby="demo-heading" className="relative h-[380vh] bg-mist">
      <div className="sticky top-0 stage overflow-hidden">
        <motion.div className="absolute inset-x-0 top-[12svh] z-10 px-6 text-center md:top-[13svh]" style={{ opacity: titleOpacity, y: titleY }}>
          <Title />
        </motion.div>

        <div className="wrap relative flex h-full flex-col items-center justify-start pb-6 pt-[4.25rem] md:justify-center md:pb-0 md:pt-12">
          <Phone className="h-[60svh] shrink-0 origin-top md:h-[min(76svh,720px)] md:origin-center" style={{ scale: phoneScale, y: phoneY }}>
            <DemoPlayer active={sceneActive} />
          </Phone>

          {/* progress */}
          <motion.div
            aria-hidden="true"
            className="mt-5 flex gap-1.5 md:absolute md:right-8 md:top-1/2 md:mt-0 md:-translate-y-1/2 md:flex-col"
            style={{ opacity: sideOpacity }}
          >
            {ranges.map((r, i) => (
              <Bar key={i} progress={p} range={[r[1], r[3]]} />
            ))}
          </motion.div>

          {/* steps: under the phone on mobile, to its left on desktop */}
          <ol className="relative mt-4 w-full flex-1 text-center md:absolute md:inset-y-0 md:left-8 md:mt-0 md:w-[min(30%,20rem)] md:text-left">
            {demo.steps.map((s, i) => (
              <Step key={s.title} step={s} index={i} progress={p} range={ranges[i]} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
