import type { ScorerData } from "@/app/lib/football-data";

interface SquadStatsProps {
  scorers: ScorerData[];
}

export default function SquadStats({ scorers }: SquadStatsProps) {
  if (scorers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="section-label mb-8">Arsenal by Numbers</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
          {scorers.map((player, index) => (
            <div
              key={player.name}
              className="bg-surface border border-subtle rounded-lg p-5 card-hover animate-fade-up opacity-0"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-xs text-[rgba(255,255,255,0.3)]">
                  #{index + 1}
                </span>
              </div>

              <h4 className="font-serif text-lg text-white mb-4 leading-tight">
                {player.name}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-2xl font-bold text-white">
                    {player.goals}
                  </p>
                  <p className="font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase">
                    Goals
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold text-white">
                    {player.assists}
                  </p>
                  <p className="font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase">
                    Assists
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-subtle">
                <p className="font-mono text-xs text-[rgba(255,255,255,0.45)]">
                  {player.matches} matches played
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
