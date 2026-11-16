// app/gallery/GalleryClient.tsx
"use client";

import { useEffect, useState } from "react";

export type GalleryGroup = {
  id: string;
  name: string;
  images: string[]; // images[0] is the collage cover
  description: string;
};

const prettify = (name: string) =>
  name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function GalleryClient({ groups }: { groups: GalleryGroup[] }) {
  const [active, setActive] = useState<GalleryGroup | null>(null);
  const [index, setIndex] = useState(0);

  const open = (group: GalleryGroup) => {
    setIndex(0);
    setActive(group);
  };

  // Esc closes, arrow keys switch images, page scroll is locked while open
  useEffect(() => {
    if (!active) return;
    const count = active.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <>
      {/* ---------- Collage (masonry: columns pack tightly, no gaps) ---------- */}
      <div className="mx-auto max-w-7xl columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 xl:columns-5">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => open(group)}
            className="group relative mb-2 block w-full break-inside-avoid overflow-hidden rounded-xl bg-neutral-900 sm:mb-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={group.images[0]}
              alt={group.name}
              loading="lazy"
              className="block h-auto w-full transition-transform duration-500 group-hover:scale-105"
            />

            {group.images.length > 1 && (
              <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                +{group.images.length - 1}
              </span>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-left text-sm font-semibold">
                {prettify(group.name)}
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
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl md:flex-row"
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl leading-none hover:bg-black/80"
            >
              ×
            </button>

            {/* LEFT: name + description */}
            <div className="flex flex-1 flex-col justify-center gap-4 overflow-y-auto p-6 md:p-10">
              <h2 className="text-2xl font-bold sm:text-4xl">
                {prettify(active.name)}
              </h2>
              <p className="whitespace-pre-line text-neutral-300">
                {active.description}
              </p>
              {active.images.length > 1 && (
                <p className="text-sm text-neutral-500">
                  {index + 1} / {active.images.length}
                </p>
              )}
            </div>

            {/* RIGHT: current image + thumbnails */}
            <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-black/40 p-4">
              <div className="relative flex w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.images[index]}
                  alt={`${active.name} ${index + 1}`}
                  className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain"
                />

                {active.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setIndex(
                          (i) =>
                            (i - 1 + active.images.length) %
                            active.images.length
                        )
                      }
                      aria-label="Previous image"
                      className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl hover:bg-black/80"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setIndex((i) => (i + 1) % active.images.length)
                      }
                      aria-label="Next image"
                      className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl hover:bg-black/80"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {active.images.length > 1 && (
                <div className="flex max-w-full gap-2 overflow-x-auto p-1">
                  {active.images.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setIndex(i)}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity ${
                        i === index
                          ? "border-white"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}