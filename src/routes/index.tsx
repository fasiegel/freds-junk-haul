import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const GameApp = lazy(() => import("@/game/GameApp"));

export const Route = createFileRoute("/")({ component: Home });

function Splash() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-ink px-6 text-center text-cream">
      <p className="text-sm font-medium tracking-widest text-gold">FREE TO PLAY</p>
      <h1 className="font-display text-4xl font-bold">Fred's Junk Haul</h1>
      <p className="text-cream/80">Loading the yard…</p>
    </div>
  );
}

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <main className="game-shell">
      {ready ? (
        <Suspense fallback={<Splash />}>
          <GameApp />
        </Suspense>
      ) : (
        <Splash />
      )}
    </main>
  );
}
