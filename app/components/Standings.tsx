import type { StandingsData } from "@/app/lib/football-data";
import { ARSENAL_TEAM_ID } from "@/app/lib/football-data";

interface StandingsProps {
  standings: StandingsData[];
}

export default function Standings({ standings }: StandingsProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="section-label mb-8">The Table</div>

        <div className="bg-surface border border-subtle rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider sticky left-0 bg-surface">
                    #
                  </th>
                  <th className="text-left py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider sticky left-12 bg-surface">
                    Team
                  </th>
                  <th className="text-center py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                    P
                  </th>
                  <th className="text-center py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                    W
                  </th>
                  <th className="text-center py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                    D
                  </th>
                  <th className="text-center py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                    L
                  </th>
                  <th className="text-center py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                    GD
                  </th>
                  <th className="text-center py-3 px-4 font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => {
                  const isArsenal = row.teamId === ARSENAL_TEAM_ID;
                  return (
                    <tr
                      key={row.teamId}
                      className={`border-b border-subtle last:border-b-0 ${
                        isArsenal
                          ? "bg-[#1a1416] border-l-2 border-l-arsenal"
                          : "hover:bg-[rgba(255,255,255,0.02)]"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-sm text-white sticky left-0 bg-inherit">
                        {row.position}
                      </td>
                      <td
                        className={`py-3 px-4 text-sm sticky left-12 bg-inherit ${
                          isArsenal ? "text-arsenal font-medium" : "text-white"
                        }`}
                      >
                        {row.team}
                      </td>
                      <td className="text-center py-3 px-4 font-mono text-sm text-[rgba(255,255,255,0.7)]">
                        {row.played}
                      </td>
                      <td className="text-center py-3 px-4 font-mono text-sm text-[rgba(255,255,255,0.7)]">
                        {row.won}
                      </td>
                      <td className="text-center py-3 px-4 font-mono text-sm text-[rgba(255,255,255,0.7)]">
                        {row.drawn}
                      </td>
                      <td className="text-center py-3 px-4 font-mono text-sm text-[rgba(255,255,255,0.7)]">
                        {row.lost}
                      </td>
                      <td
                        className={`text-center py-3 px-4 font-mono text-sm ${
                          row.gd > 0
                            ? "text-green-400"
                            : row.gd < 0
                            ? "text-red-400"
                            : "text-[rgba(255,255,255,0.7)]"
                        }`}
                      >
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="text-center py-3 px-4 font-mono text-sm font-bold text-white">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {standings.length === 0 && (
          <p className="text-[rgba(255,255,255,0.45)] text-sm text-center mt-4">
            Standings not available
          </p>
        )}
      </div>
    </section>
  );
}
