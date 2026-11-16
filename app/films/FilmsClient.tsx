// app/films/FilmsClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type Film = {
  id: string;
  name: string;
  src: string;
};

const prettify = (name: string) =>
  name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function FilmsClient({ films }: { films: Film[] }) {
  const [active, setActive] = useState<Film | null>(null); // popup
  const [current, setCurrent] = useState(0); // video playing in the auto sequence
  const [hovered, setHovered] = useState<number | null>(null); // card under the cursor
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Which collage video plays right now:
  // popup open -> none, cursor on a card -> that card, otherwise the sequence
  useEffect(() => {
    const playing = active ? -1 : hovered ?? current;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === playing) {
        video.play().catch(() => {});
      } else if (!video.paused || video.currentTime > 0.2) {
        video.pause();
        video.currentTime = 0.1; // back to the thumbnail frame
      }
    });
  }, [current, hovered, active]);

  // Esc closes + page scroll is locked while the popup is open
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  const handleEnded = (i: number) => {
    if (hovered !== null || i !== current) return; // only the sequence advances
    if (films.length === 1) {
      const video = videoRefs.current[0];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return;
    }
    setCurrent((i + 1) % films.length);
  };

  return (
    <>
      {/* ---------- Collage (masonry: columns pack tightly, no gaps) ---------- */}
      <div className="mx-auto max-w-7xl columns-1 gap-2 sm:columns-2 sm:gap-3 lg:columns-3">
        {films.map((film, i) => (
          <button
            key={film.id}
            onClick={() => setActive(film)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => {
              setHovered(null);
              setCurrent(i); // sequence continues from the card you left
            }}
            className="group relative mb-2 block w-full break-inside-avoid overflow-hidden rounded-xl bg-neutral-900 sm:mb-3"
          >
            {/* #t=0.1 makes browsers show a frame while the video is idle */}
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={`${film.src}#t=0.1`}
              muted
              playsInline
              preload="metadata"
              loop={hovered === i} // hovered video loops, sequence videos play once
              onEnded={() => handleEnded(i)}
              className="block h-auto w-full transition-transform duration-500 group-hover:scale-105"
            />

            {/* name on hover */}
            <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-left text-sm font-semibold">
                {prettify(film.name)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ---------- Popup card ---------- */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl leading-none hover:bg-black/80"
            >
              ×
            </button>

            {/* TOP: name */}
            <h2 className="px-6 pb-4 pt-5 pr-16 text-2xl font-bold sm:text-3xl">
              {prettify(active.name)}
            </h2>

            {/* VIDEO */}
            <div className="flex items-center justify-center bg-black">
              <video
                key={active.id}
                src={active.src}
                controls
                autoPlay
                playsInline
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}