import { useMemo, useState, type ReactNode } from "react";
import { dealTopics, rankTopics, type Topic } from "./topics";
import { NODES, START, guessList, isStump, type Ask } from "./twenty";

const MAX = 20;

export function Twenty() {
  const [mode, setMode] = useState<10 | 20 | null>(null);
  if (mode === null) return <Pick onPick={setMode} />;
  if (mode === 10) return <Ten onMenu={() => setMode(null)} />;
  return <Classic onMenu={() => setMode(null)} />;
}

function Pick({ onPick }: { onPick: (mode: 10 | 20) => void }) {
  return (
    <div className="safe-top safe-x mx-auto flex min-h-full w-full max-w-md flex-col px-4 pb-8 text-cream">
      <p className="py-4 font-display text-lg font-bold">Fred guesses</p>
      <p className="text-xs font-medium tracking-widest text-gold">HOW LONG IS THE ROUND?</p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight">Think of what has to go.</h1>
      <button
        type="button"
        onClick={() => onPick(10)}
        className="mt-6 min-h-14 w-full rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
      >
        10 Questions
      </button>
      <p className="mt-2 text-sm text-cream/80">Random topics. A different set every game.</p>
      <button
        type="button"
        onClick={() => onPick(20)}
        className="mt-4 min-h-14 w-full rounded-xl border border-cream/30 bg-grass px-4 py-3 text-lg font-bold"
      >
        20 Questions
      </button>
      <p className="mt-2 text-sm text-cream/80">The full round, same path every time.</p>
    </div>
  );
}

function Ten({ onMenu }: { onMenu: () => void }) {
  const [topics] = useState<Topic[]>(() => dealTopics());
  const [answers, setAnswers] = useState<{ id: string; yes: boolean }[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const choices = useMemo(() => guessList(), []);
  const asking = !picked && skipped.length === 0 && answers.length < topics.length;
  const topic = topics[answers.length];
  const ranked = rankTopics(answers, skipped);
  const guess = ranked[0];
  const won = NODES[picked ?? ""];

  function reply(yes: boolean) {
    if (!topic) return;
    setAnswers((list) => [...list, { id: topic.id, yes }]);
  }

  function back() {
    setPicked(null);
    setSkipped([]);
    setAnswers((list) => list.slice(0, -1));
  }

  return (
    <Shell
      title="10 Questions"
      asked={asking ? answers.length : topics.length}
      max={topics.length}
      done={picked !== null}
      onMenu={onMenu}
    >
      {picked && won && won.kind === "guess" ? (
        <Win item={won.item} detail={won.detail} asked={topics.length} onAgain={onMenu} />
      ) : asking && topic ? (
        <AskView
          node={{ kind: "ask", text: topic.text, yes: "", no: "", yesLabel: topic.yesLabel, noLabel: topic.noLabel }}
          canBack={answers.length > 0}
          onBack={back}
          onYes={() => reply(true)}
          onNo={() => reply(false)}
        />
      ) : guess ? (
        <div className="mt-8">
          <p className="text-xs font-medium tracking-widest text-gold">IS THIS IT?</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{guess.item}</h1>
          <p className="mt-3 text-cream/90">{guess.detail}</p>
          <button
            type="button"
            onClick={() => setPicked(guess.id)}
            className="mt-6 min-h-12 w-full rounded-xl bg-gold px-4 py-3 text-lg font-bold text-ink"
          >
            That's the one
          </button>
          <button
            type="button"
            onClick={() => setSkipped((list) => [...list, guess.id])}
            className="mt-3 min-h-12 w-full rounded-xl border border-cream/30 px-4 py-3 text-lg font-medium"
          >
            Not quite
          </button>
        </div>
      ) : (
        <Stumped choices={choices} onPick={setPicked} onRestart={onMenu} />
      )}
    </Shell>
  );
}

function Classic({ onMenu }: { onMenu: () => void }) {
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
    <Shell title="20 Questions" asked={asked} max={MAX} done={won} onMenu={onMenu}>
      {won ? (
        <Win item={item} detail={detail} asked={asked} onAgain={restart} />
      ) : isStump(id) || (node?.kind !== "ask" && node?.kind !== "guess") ? (
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
    </Shell>
  );
}

function Shell({
  title,
  asked,
  max,
  done,
  onMenu,
  children,
}: {
  title: string;
  asked: number;
  max: number;
  done: boolean;
  onMenu: () => void;
  children: ReactNode;
}) {
  return (
    <div className="safe-top safe-x mx-auto flex min-h-full w-full max-w-md flex-col px-4 pb-8 text-cream">
      <div className="flex items-center justify-between gap-3 py-4">
        <button type="button" onClick={onMenu} className="min-h-11 text-left font-display text-lg font-bold text-cream">
          {title}
        </button>
        <p className="text-sm font-medium text-cream/80">
          {done ? `${asked} questions` : `Question ${Math.min(asked + 1, max)} of ${max}`}
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-cream/20">
        <div className="h-full bg-gold" style={{ width: `${Math.min(100, (asked / max) * 100)}%` }} />
      </div>
      {children}
    </div>
  );
}

function Win({
  item,
  detail,
  asked,
  onAgain,
}: {
  item: string;
  detail: string;
  asked: number;
  onAgain: () => void;
}) {
  return (
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
        onClick={onAgain}
        className="mt-3 min-h-12 w-full rounded-xl border border-cream/30 px-4 py-3 text-lg font-medium"
      >
        Play again
      </button>
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
