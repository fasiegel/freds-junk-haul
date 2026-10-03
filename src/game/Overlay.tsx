import { Link } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { HATS, YARDS, type HatId } from "./content";
import { useGame } from "./store";
import { unlockAudio } from "./audio";

function Hats() {
  const bestYards = useGame((s) => s.bestYards);
  const hatId = useGame((s) => s.hatId);
  const setHat = useGame((s) => s.setHat);
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {HATS.map((hat) => {
        const open = bestYards >= hat.need;
        const on = hatId === hat.id;
        return (
          <button
            key={hat.id}
            type="button"
            disabled={!open}
            onClick={() => setHat(hat.id as HatId)}
            className={`min-h-11 rounded-full border px-3 py-2 text-sm font-medium ${
              on ? "border-gold bg-gold text-ink" : "border-cream/30 bg-ink text-cream"
            } disabled:opacity-45`}
          >
            {hat.name}
            {open ? "" : ` · clear ${hat.need}`}
          </button>
        );
      })}
    </div>
  );
}

export function Hud() {
  const phase = useGame((s) => s.phase);
  const yardIndex = useGame((s) => s.yardIndex);
  const load = useGame((s) => s.load);
  const carry = useGame((s) => s.carry);
  const score = useGame((s) => s.score);
  const shownTime = useGame((s) => s.shownTime);
  const toast = useGame((s) => s.toast);
  if (phase === "menu") return null;
  const yard = YARDS[Math.min(yardIndex, YARDS.length - 1)]!;
  const pct = Math.min(100, Math.round((load / yard.quota) * 100));
  return (
    <>
      <header className="safe-top safe-x pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-lg font-bold leading-none text-ink">Fred's Junk Haul</p>
            <p className="text-sm font-medium text-ink/80">
              {yard.name} · {Math.min(yardIndex + 1, 5)}/5
            </p>
          </div>
          <div className="rounded-full bg-ink/80 px-3 py-1 text-sm font-medium text-cream">
            {Math.max(0, Math.ceil(shownTime))}s · {score}
          </div>
        </div>
        <div className="rounded-full bg-ink/75 p-1">
          <div className="flex items-center gap-2 px-2 text-sm text-cream">
            <Truck className="h-4 w-4 text-gold" aria-hidden />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream/20">
              <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
            </div>
            <span className="tabular-nums">
              {load}/{yard.quota}
            </span>
            <span className="tabular-nums text-cream/70">
              carry {carry}/{yard.cap}
            </span>
          </div>
        </div>
      </header>
      {phase === "play" ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-36 z-20 px-4 text-center text-sm font-medium text-ink">
          {toast}
        </p>
      ) : null}
    </>
  );
}

export function Screens() {
  const phase = useGame((s) => s.phase);
  const score = useGame((s) => s.score);
  const yardIndex = useGame((s) => s.yardIndex);
  const bestScore = useGame((s) => s.bestScore);
  const startRun = useGame((s) => s.startRun);
  const nextYard = useGame((s) => s.nextYard);

  if (phase === "play") return null;

  const next = YARDS[yardIndex + 1];
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-ink/55 p-4">
      <div className="max-h-[85dvh] w-full max-w-md overflow-auto rounded-2xl bg-grass p-5 text-cream shadow-xl">
        <p className="text-xs font-medium tracking-widest text-gold">FREE TO PLAY</p>
        {phase === "menu" ? (
          <>
            <h1 className="font-display text-4xl font-bold leading-tight">Fred's Junk Haul</h1>
            <p className="mt-2 text-cream/90">
              Fred clears five yards. Grab junk, haul it to the yellow ring, and fill the truck before the clock dies.
              Free in the browser — nothing to buy.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-cream/90">
              <li>On a phone, drag the gold stick with your thumb.</li>
              <li>On a keyboard, WASD or arrows. W moves away from the camera.</li>
              <li>Heavy pieces slow Fred down. Dump when the ring lights up.</li>
            </ul>
            <p className="mt-4 text-sm text-cream/80">Caps unlock by clearing yards. Best score {bestScore}.</p>
            <Hats />
            <Link
              to="/guess"
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
            >
              20 Questions
            </Link>
            <button
              type="button"
              className="mt-3 min-h-12 w-full rounded-xl border border-cream/40 px-4 py-3 text-lg font-bold text-cream"
              onClick={() => {
                unlockAudio();
                startRun();
              }}
            >
              Start the route
            </button>
          </>
        ) : null}
        {phase === "between" && next ? (
          <>
            <h2 className="font-display text-3xl font-bold">Yard cleared</h2>
            <p className="mt-2">
              Score {score}. Next is {next.name}, quota {next.quota}.
            </p>
            <Hats />
            <button
              type="button"
              className="mt-4 min-h-12 w-full rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
              onClick={() => {
                unlockAudio();
                nextYard();
              }}
            >
              Next yard
            </button>
          </>
        ) : null}
        {phase === "win" || phase === "lose" ? (
          <>
            <h2 className="font-display text-3xl font-bold">{phase === "win" ? "Route complete" : "Job lost"}</h2>
            <p className="mt-2">
              {phase === "win" ? "Every truck is full. " : "The timer beat the quota. "}
              Score {score}. Best {bestScore}. Still free — run it again.
            </p>
            <Hats />
            <button
              type="button"
              className="mt-4 min-h-12 w-full rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
              onClick={() => {
                unlockAudio();
                startRun();
              }}
            >
              Start again
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
