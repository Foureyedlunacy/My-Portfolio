// app/gamedesign/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import fs from "fs";
import path from "path";
import GameDesignClient, { GameItem } from "./GameDesignClient";

const ROOT = path.join(process.cwd(), "public", "game design");
const IMG_EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const GIF_EXT = /\.gif$/i;

function listFiles(dir: string, ext: RegExp): string[] {
  try {
    return fs.readdirSync(dir).filter((f) => ext.test(f));
  } catch {
    return []; // folder missing -> treat as empty
  }
}

const baseName = (file: string) => file.replace(/\.[^.]+$/, "");
const publicUrl = (folder: string, file: string) =>
  `/game%20design/${folder}/${encodeURIComponent(file)}`;

// Optional: public/game design/descriptions.json  ->  { "boss-fight": "Text...", ... }
function loadDescriptions(): Record<string, string> {
  try {
    const raw = fs.readFileSync(path.join(ROOT, "descriptions.json"), "utf-8");
    const json = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(json)) {
      out[key.toLowerCase()] = String(value);
    }
    return out;
  } catch {
    return {};
  }
}

function getItems(): GameItem[] {
  const imgFiles = listFiles(path.join(ROOT, "imgs"), IMG_EXT);
  const gifFiles = listFiles(path.join(ROOT, "gifs"), GIF_EXT);
  const descriptions = loadDescriptions();

  // Match img and gif by file name (case-insensitive, extension ignored)
  const map = new Map<string, { name: string; img?: string; gif?: string }>();

  for (const file of imgFiles) {
    const name = baseName(file);
    const key = name.toLowerCase();
    map.set(key, { ...(map.get(key) ?? { name }), img: publicUrl("imgs", file) });
  }
  for (const file of gifFiles) {
    const name = baseName(file);
    const key = name.toLowerCase();
    map.set(key, { ...(map.get(key) ?? { name }), gif: publicUrl("gifs", file) });
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([key, v]) => ({
      id: key,
      name: v.name,
      img: v.img ?? null,
      gif: v.gif ?? null,
      description: descriptions[key] ?? "No description yet.",
    }));
}

// Reads the folders at request time (not at build time), so new files
// show up on refresh without a rebuild.
async function Gallery() {
  await connection();
  const items = getItems();

  if (items.length === 0) {
    return (
      <p className="text-center text-neutral-400">
        No files found. Add images to <code>public/game design/imgs</code> and
        GIFs to <code>public/game design/gifs</code>.
      </p>
    );
  }

  return <GameDesignClient items={items} />;
}

export default function GameDesignPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-3 py-8 text-white sm:px-6">
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight sm:text-5xl">
        Game Design
      </h1>

      <Suspense
        fallback={<p className="text-center text-neutral-500">Loading…</p>}
      >
        <Gallery />
      </Suspense>
    </main>
  );
}