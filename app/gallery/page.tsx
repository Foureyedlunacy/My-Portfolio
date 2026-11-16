// app/gallery/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import fs from "fs";
import path from "path";
import GalleryClient, { GalleryGroup } from "./GalleryClient";

const ROOT = path.join(process.cwd(), "public", "gallery");
const IMG_EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

const baseName = (file: string) => file.replace(/\.[^.]+$/, "");

// "sunset", "sunset1", "sunset-2", "sunset_3", "sunset 4"  ->  "sunset"
const stripNumber = (name: string) => {
  const stripped = name.replace(/[\s_-]*\d+$/, "").trim();
  return stripped || name; // a name that is only digits stays as it is
};

const trailingNumber = (name: string): number | null => {
  const m = name.match(/(\d+)$/);
  return m && stripNumber(name) !== name ? parseInt(m[1], 10) : null;
};

// Optional: public/gallery/descriptions.json  ->  { "sunset": "Text...", ... }
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

function getGroups(): GalleryGroup[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(ROOT).filter((f) => IMG_EXT.test(f));
  } catch {
    return []; // folder missing -> empty
  }

  const descriptions = loadDescriptions();
  const map = new Map<
    string,
    { name: string; items: { url: string; num: number | null }[] }
  >();

  for (const file of files) {
    const name = baseName(file);
    const groupName = stripNumber(name);
    const key = groupName.toLowerCase();
    const entry = map.get(key) ?? { name: groupName, items: [] };
    entry.items.push({
      url: `/gallery/${encodeURIComponent(file)}`,
      num: trailingNumber(name),
    });
    map.set(key, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([key, v]) => {
      // un-numbered image first (it becomes the collage cover), then 1, 2, 3...
      const sorted = [...v.items].sort(
        (a, b) => (a.num ?? -1) - (b.num ?? -1)
      );
      return {
        id: key,
        name: v.name,
        images: sorted.map((i) => i.url),
        description: descriptions[key] ?? "No description yet.",
      };
    });
}

// Reads the folder at request time, so new files show up on refresh.
async function Gallery() {
  await connection();
  const groups = getGroups();

  if (groups.length === 0) {
    return (
      <p className="text-center text-neutral-400">
        No images found. Add images to <code>public/gallery</code>.
      </p>
    );
  }

  return <GalleryClient groups={groups} />;
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-3 py-8 text-white sm:px-6">
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight sm:text-5xl">
        Gallery
      </h1>

      <Suspense
        fallback={<p className="text-center text-neutral-500">Loading…</p>}
      >
        <Gallery />
      </Suspense>
    </main>
  );
}