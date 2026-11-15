import { SMS_LINK } from "../content/site.js";

/** Fires the Meta Pixel event in the browser and mirrors it server-side (api/track.js) with the same id. */
export function track(eventName) {
  const eventId =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.fbq?.("trackCustom", eventName, {}, { eventID: eventId });
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: eventId, event_name: eventName }),
    keepalive: true,
  }).catch(() => {});
}

/** Primary action everywhere on the page: record the click, then open iMessage. */
export function startIMessage() {
  track("StartIMessage");
  window.location.href = SMS_LINK;
}
