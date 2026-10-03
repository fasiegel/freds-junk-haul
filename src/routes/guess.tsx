import { createFileRoute } from "@tanstack/react-router";
import { Twenty } from "@/game/Twenty";

export const Route = createFileRoute("/guess")({ component: GuessPage });

function GuessPage() {
  return (
    <main className="game-shell">
      <div className="absolute inset-0 overflow-auto bg-ink">
        <Twenty />
      </div>
    </main>
  );
}
