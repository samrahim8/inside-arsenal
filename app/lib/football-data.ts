const BASE_URL = "https://api.football-data.org/v4";
const ARSENAL_ID = 57;

interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface Match {
  id: number;
  utcDate: string;
  status: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "CANCELLED";
  matchday: number;
  competition: {
    id: number;
    name: string;
    code: string;
  };
  homeTeam: Team;
  awayTeam: Team;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

interface StandingsEntry {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalDifference: number;
  points: number;
}

interface Player {
  id: number;
  name: string;
  position: string;
}

interface Scorer {
  player: Player;
  team: Team;
  goals: number;
  assists: number | null;
  playedMatches: number;
}

export interface MatchData {
  id: number;
  date: string;
  status: string;
  competition: string;
  competitionCode: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  isHome: boolean;
}

export interface StandingsData {
  position: number;
  team: string;
  teamId: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
}

export interface ScorerData {
  name: string;
  goals: number;
  assists: number;
  matches: number;
}

async function fetchAPI<T>(endpoint: string, revalidate = 300): Promise<T | null> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    console.error("FOOTBALL_DATA_API_KEY not set");
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "X-Auth-Token": apiKey,
      },
      next: { revalidate },
    });

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function getRecentResults(): Promise<MatchData[]> {
  const data = await fetchAPI<{ matches: Match[] }>(
    `/teams/${ARSENAL_ID}/matches?status=FINISHED&limit=5`
  );

  if (!data?.matches) return [];

  return data.matches
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .map((match) => ({
      id: match.id,
      date: match.utcDate,
      status: match.status,
      competition: match.competition.name,
      competitionCode: match.competition.code,
      homeTeam: match.homeTeam.shortName || match.homeTeam.name,
      awayTeam: match.awayTeam.shortName || match.awayTeam.name,
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away,
      isHome: match.homeTeam.id === ARSENAL_ID,
    }));
}

export async function getUpcomingFixtures(): Promise<MatchData[]> {
  const data = await fetchAPI<{ matches: Match[] }>(
    `/teams/${ARSENAL_ID}/matches?status=SCHEDULED&limit=5`
  );

  if (!data?.matches) return [];

  return data.matches
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .map((match) => ({
      id: match.id,
      date: match.utcDate,
      status: match.status,
      competition: match.competition.name,
      competitionCode: match.competition.code,
      homeTeam: match.homeTeam.shortName || match.homeTeam.name,
      awayTeam: match.awayTeam.shortName || match.awayTeam.name,
      homeScore: null,
      awayScore: null,
      isHome: match.homeTeam.id === ARSENAL_ID,
    }));
}

export async function getNextMatch(): Promise<MatchData | null> {
  const fixtures = await getUpcomingFixtures();
  return fixtures[0] || null;
}

export async function getLiveMatch(): Promise<MatchData | null> {
  const data = await fetchAPI<{ matches: Match[] }>(
    `/teams/${ARSENAL_ID}/matches?status=IN_PLAY`,
    30 // Revalidate every 30 seconds for live matches
  );

  if (!data?.matches?.length) return null;

  const match = data.matches[0];
  return {
    id: match.id,
    date: match.utcDate,
    status: match.status,
    competition: match.competition.name,
    competitionCode: match.competition.code,
    homeTeam: match.homeTeam.shortName || match.homeTeam.name,
    awayTeam: match.awayTeam.shortName || match.awayTeam.name,
    homeScore: match.score.fullTime.home,
    awayScore: match.score.fullTime.away,
    isHome: match.homeTeam.id === ARSENAL_ID,
  };
}

export async function getStandings(): Promise<StandingsData[]> {
  const data = await fetchAPI<{
    standings: Array<{
      type: string;
      table: StandingsEntry[];
    }>;
  }>("/competitions/PL/standings");

  if (!data?.standings) return [];

  const total = data.standings.find((s) => s.type === "TOTAL");
  if (!total) return [];

  return total.table.map((entry) => ({
    position: entry.position,
    team: entry.team.shortName || entry.team.name,
    teamId: entry.team.id,
    played: entry.playedGames,
    won: entry.won,
    drawn: entry.draw,
    lost: entry.lost,
    gd: entry.goalDifference,
    points: entry.points,
  }));
}

export async function getTopScorers(): Promise<ScorerData[]> {
  const data = await fetchAPI<{ scorers: Scorer[] }>(
    "/competitions/PL/scorers?limit=50"
  );

  if (!data?.scorers) return [];

  // Filter for Arsenal players
  const arsenalScorers = data.scorers
    .filter((s) => s.team.id === ARSENAL_ID)
    .slice(0, 5)
    .map((s) => ({
      name: s.player.name,
      goals: s.goals,
      assists: s.assists || 0,
      matches: s.playedMatches,
    }));

  return arsenalScorers;
}

export const ARSENAL_TEAM_ID = ARSENAL_ID;
