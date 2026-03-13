import type { MatchData } from "@/app/lib/football-data";

interface FixturesProps {
  results: MatchData[];
  upcoming: MatchData[];
}

function getResultIndicator(match: MatchData): { text: "W" | "D" | "L"; color: string } {
  const arsenalScore = match.isHome ? match.homeScore : match.awayScore;
  const opponentScore = match.isHome ? match.awayScore : match.homeScore;

  if (arsenalScore === null || opponentScore === null) {
    return { text: "D", color: "text-yellow-400" };
  }

  if (arsenalScore > opponentScore) {
    return { text: "W", color: "text-green-400" };
  } else if (arsenalScore < opponentScore) {
    return { text: "L", color: "text-red-400" };
  }
  return { text: "D", color: "text-yellow-400" };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOpponent(match: MatchData): string {
  return match.isHome ? match.awayTeam : match.homeTeam;
}

function getScore(match: MatchData): string {
  if (match.homeScore === null || match.awayScore === null) return "-";
  return `${match.homeScore}-${match.awayScore}`;
}

export default function Fixtures({ results, upcoming }: FixturesProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="section-label mb-8">Results + Fixtures</div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Results */}
          <div>
            <h3 className="font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider mb-4">
              Recent Results
            </h3>
            <div className="space-y-2 stagger-children">
              {results.map((match) => {
                const result = getResultIndicator(match);
                return (
                  <div
                    key={match.id}
                    className="bg-surface border border-subtle rounded-lg p-4 flex items-center justify-between card-hover animate-fade-up opacity-0"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-sm font-bold w-6 ${result.color}`}
                      >
                        {result.text}
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          {match.isHome ? "vs" : "@"} {getOpponent(match)}
                        </p>
                        <p className="font-mono text-xs text-[rgba(255,255,255,0.45)]">
                          {match.competition}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-lg font-bold text-white">
                        {getScore(match)}
                      </p>
                      <p className="font-mono text-xs text-[rgba(255,255,255,0.45)]">
                        {formatDate(match.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {results.length === 0 && (
                <p className="text-[rgba(255,255,255,0.45)] text-sm">
                  No recent results available
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Fixtures */}
          <div>
            <h3 className="font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider mb-4">
              Upcoming Fixtures
            </h3>
            <div className="space-y-2 stagger-children">
              {upcoming.map((match) => (
                <div
                  key={match.id}
                  className="bg-surface border border-subtle rounded-lg p-4 flex items-center justify-between card-hover animate-fade-up opacity-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-[rgba(255,255,255,0.45)] w-6">
                      {match.isHome ? "H" : "A"}
                    </span>
                    <div>
                      <p className="text-white font-medium">
                        {match.isHome ? "vs" : "@"} {getOpponent(match)}
                      </p>
                      <p className="font-mono text-xs text-[rgba(255,255,255,0.45)]">
                        {match.competition}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-white">
                      {formatDate(match.date)}
                    </p>
                    <p className="font-mono text-xs text-[rgba(255,255,255,0.45)]">
                      {formatTime(match.date)}
                    </p>
                  </div>
                </div>
              ))}
              {upcoming.length === 0 && (
                <p className="text-[rgba(255,255,255,0.45)] text-sm">
                  No upcoming fixtures available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
