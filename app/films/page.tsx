// app/films/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import fs from "fs";
import path from "path";
import FilmsClient, { Film } from "./FilmsClient";

const ROOT = path.join(process.cwd(), "public", "films");
const VIDEO_EXT = /\.(mp4|webm)$/i;

function getFilms(): Film[] {
  try {
    return fs
      .readdirSync(ROOT)
      .filter((f) => VIDEO_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => ({
        id: file.toLowerCase(),
        name: file.replace(/\.[^.]+$/, ""),
        src: `/films/${encodeURIComponent(file)}`,
      }));
  } catch {
    return []; // folder missing -> empty
  }
}

// Reads the folder at request time, so new videos show up on refresh.
async function Films() {
  await connection();
  const films = getFilms();

  if (films.length === 0) {
    return (
      <p className="text-center text-neutral-400">
        No videos found. Add .mp4 files to <code>public/films</code>.
      </p>
    );
  }

  return <FilmsClient films={films} />;
}

export default function FilmsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-3 py-8 text-white sm:px-6">
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight sm:text-5xl">
        Films
      </h1>

      <Suspense
        fallback={<p className="text-center text-neutral-500">Loading…</p>}
      >
        <Films />
      </Suspense>
    </main>
  );
}