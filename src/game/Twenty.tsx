import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NODES, START, guessList, isStump, type Ask } from "./twenty";

const MAX = 20;

export function Twenty() {
  const [trail, setTrail] = useState<string[]>([START]);
  const [picked, setPicked] = useState<string | null>(null);
  const id = trail[trail.length - 1] ?? START;
  const node = NODES[id] ?? NODES.stump;
  const asked = trail.length - 1;
  const choices = useMemo(() => guessList(), []);

  function answer(next: string) {
    if (asked >= MAX) {
      setTrail((t) => [...t, "stump"]);
      return;
    }
    setTrail((t) => [...t, next]);
  }

  function back() {
    setPicked(null);
    setTrail((t) => (t.length > 1 ? t.slice(0, -1) : t));
  }

  function restart() {
    setPicked(null);
    setTrail([START]);
  }

  const won = picked !== null;
  const wonNode = won ? NODES[picked] : null;
  const item = wonNode && wonNode.kind === "guess" ? wonNode.item : "";
  const detail = wonNode && wonNode.kind === "guess" ? wonNode.detail : "";

  return (
    <div className="safe-top safe-x mx-auto flex min-h-full w-full max-w-md flex-col px-4 pb-8 text-cream">
      <div className="flex items-center justify-between gap-3 py-4">
        <Link to="/" className="min-h-11 rounded-full px-3 py-2 text-sm font-medium text-gold">
          Yard game
        </Link>
        <p className="text-sm font-medium text-cream/80">
          {won ? `${asked} questions` : `Question ${Math.min(asked + 1, MAX)} of ${MAX}`}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-cream/20">
        <div className="h-full bg-gold" style={{ width: `${Math.min(100, (asked / MAX) * 100)}%` }} />
      </div>

      {won ? (
        <div className="mt-8">
          <p className="text-xs font-medium tracking-widest text-gold">FRED'S GUESS</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{item}</h1>
          <p className="mt-3 text-cream/90">{detail}</p>
          <p className="mt-3 text-sm text-cream/70">
            Nailed in {asked} {asked === 1 ? "question" : "questions"}.
          </p>
          <a
            href="https://fredsjunkremoval.com"
            className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
          >
            Ask Fred to haul it
          </a>
          <button
            type="button"
            onClick={restart}
            className="mt-3 min-h-12 w-full rounded-xl border border-cream/30 px-4 py-3 text-lg font-medium"
          >
            Play again
          </button>
        </div>
      ) : isStump(id) || node?.kind !== "ask" && node?.kind !== "guess" ? (
        <Stumped choices={choices} onPick={setPicked} onRestart={restart} />
      ) : node.kind === "guess" && isStump(id) ? null : node.kind === "ask" ? (
        <AskView
          node={node}
          canBack={trail.length > 1}
          onBack={back}
          onYes={() => answer(node.yes)}
          onNo={() => answer(node.no)}
        />
      ) : node.kind === "guess" ? (
        <div className="mt-8">
          <p className="text-xs font-medium tracking-widest text-gold">IS THIS IT?</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{node.item}</h1>
          <p className="mt-3 text-cream/90">{node.detail}</p>
          <button
            type="button"
            onClick={() => setPicked(id)}
            className="mt-6 min-h-12 w-full rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
          >
            That's the one
          </button>
          <button
            type="button"
            onClick={() => answer(node.wrong)}
            className="mt-3 min-h-12 w-full rounded-xl border border-cream/30 px-4 py-3 text-lg font-medium"
          >
            Not quite
          </button>
          {trail.length > 1 ? (
            <button type="button" onClick={back} className="mt-3 min-h-11 text-sm font-medium text-gold">
              Previous question
            </button>
          ) : null}
        </div>
      ) : (
        <Stumped choices={choices} onPick={setPicked} onRestart={restart} />
      )}
    </div>
  );
}

function AskView({
  node,
  canBack,
  onBack,
  onYes,
  onNo,
}: {
  node: Ask;
  canBack: boolean;
  onBack: () => void;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="mt-8">
      <p className="text-xs font-medium tracking-widest text-gold">THINK OF WHAT HAS TO GO</p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight">{node.text}</h1>
      <button
        type="button"
        onClick={onYes}
        className="mt-6 min-h-14 w-full rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
      >
        {node.yesLabel ?? "Yes"}
      </button>
      <button
        type="button"
        onClick={onNo}
        className="mt-3 min-h-14 w-full rounded-xl border border-cream/30 bg-grass px-4 py-3 text-lg font-bold"
      >
        {node.noLabel ?? "No"}
      </button>
      {canBack ? (
        <button type="button" onClick={onBack} className="mt-4 min-h-11 text-sm font-medium text-gold">
          Previous question
        </button>
      ) : null}
    </div>
  );
}

function Stumped({
  choices,
  onPick,
  onRestart,
}: {
  choices: { id: string; item: string }[];
  onPick: (id: string) => void;
  onRestart: () => void;
}) {
  return (
    <div className="mt-8">
      <p className="text-xs font-medium tracking-widest text-gold">FRED IS STUMPED</p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight">Pick the closest thing.</h1>
      <div className="mt-4 flex flex-col gap-2">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onPick(choice.id)}
            className="min-h-11 rounded-xl border border-cream/30 px-4 py-2 text-left font-medium"
          >
            {choice.item}
          </button>
        ))}
      </div>
      <button type="button" onClick={onRestart} className="mt-4 min-h-11 text-sm font-medium text-gold">
        Start over
      </button>
    </div>
  );
}
