// app/gamedesign/GameDesignClient.tsx
"use client";

import { useEffect, useState } from "react";

export type GameItem = {
  id: string;
  name: string;
  img: string | null;
  gif: string | null;
  description: string;
};

const prettify = (name: string) =>
  name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function GameDesignClient({ items }: { items: GameItem[] }) {
  const [active, setActive] = useState<GameItem | null>(null);
  const [view, setView] = useState<"img" | "gif">("img");

  const open = (item: GameItem) => {
    setView(item.img ? "img" : "gif"); // popup defaults to the still image
    setActive(item);
  };

  // Close on Escape + lock page scroll while the popup is open
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

  return (
    <>
      {/* ---------- Collage (masonry: columns pack tightly, no gaps) ---------- */}
      <div className="mx-auto max-w-7xl columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 xl:columns-5">
        {items.map((item) => {
          // GIF wins on the collage; fall back to the image
          const src = item.gif ?? item.img!;
          return (
            <button
              key={item.id}
              onClick={() => open(item)}
              className="group relative mb-2 block w-full break-inside-avoid overflow-hidden rounded-xl bg-neutral-900 sm:mb-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={item.name}
                loading="lazy"
                className="block h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-left text-sm font-semibold">
                  {prettify(item.name)}
                </span>
              </div>
            </button>
          );
        })}
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
            </div>

            {/* RIGHT: image (with GIF toggle when both exist) */}
            <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-black/40 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(view === "img" ? active.img : active.gif) ?? ""}
                alt={active.name}
                className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain"
              />

              {active.img && active.gif && (
                <div className="flex gap-2 rounded-full bg-white/10 p-1 text-sm">
                  {(["img", "gif"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`rounded-full px-4 py-1 uppercase transition-colors ${
                        view === v
                          ? "bg-white text-black"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {v}
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