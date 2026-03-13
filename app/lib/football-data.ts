const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
const ARSENAL_ID = "133604";
const PREMIER_LEAGUE_ID = "4328";

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

interface SportsDBEvent {
  idEvent: string;
  strEvent: string;
  strTimestamp: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
  idHomeTeam: string;
  idAwayTeam: string;
}

interface SportsDBStanding {
  intRank: string;
  strTeam: string;
  idTeam: string;
  intPlayed: string;
  intWin: string;
  intDraw: string;
  intLoss: string;
  intGoalDifference: string;
  intPoints: string;
}

async function fetchAPI<T>(endpoint: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
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
  const data = await fetchAPI<{ results: SportsDBEvent[] | null }>(
    `/eventslast.php?id=${ARSENAL_ID}`
  );

  if (!data?.results) return [];

  return data.results
    .slice(0, 5)
    .map((event) => ({
      id: parseInt(event.idEvent),
      date: event.strTimestamp,
      status: "FINISHED",
      competition: event.strLeague,
      competitionCode: "PL",
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
      homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : null,
      awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : null,
      isHome: event.idHomeTeam === ARSENAL_ID,
    }));
}

export async function getUpcomingFixtures(): Promise<MatchData[]> {
  const data = await fetchAPI<{ events: SportsDBEvent[] | null }>(
    `/eventsnext.php?id=${ARSENAL_ID}`
  );

  if (!data?.events) return [];

  return data.events
    .slice(0, 5)
    .map((event) => ({
      id: parseInt(event.idEvent),
      date: event.strTimestamp,
      status: "SCHEDULED",
      competition: event.strLeague,
      competitionCode: "PL",
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
      homeScore: null,
      awayScore: null,
      isHome: event.idHomeTeam === ARSENAL_ID,
    }));
}

export async function getNextMatch(): Promise<MatchData | null> {
  const fixtures = await getUpcomingFixtures();
  return fixtures[0] || null;
}

export async function getLiveMatch(): Promise<MatchData | null> {
  // TheSportsDB free tier doesn't have live match data
  // Return null - could be enhanced with a paid API later
  return null;
}

export async function getStandings(): Promise<StandingsData[]> {
  // Get current season
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  // Season starts in August, so before August use previous year
  const seasonStart = currentMonth < 7 ? currentYear - 1 : currentYear;
  const season = `${seasonStart}-${seasonStart + 1}`;

  const data = await fetchAPI<{ table: SportsDBStanding[] | null }>(
    `/lookuptable.php?l=${PREMIER_LEAGUE_ID}&s=${season}`
  );

  if (!data?.table) return [];

  return data.table.map((entry) => ({
    position: parseInt(entry.intRank),
    team: entry.strTeam,
    teamId: parseInt(entry.idTeam),
    played: parseInt(entry.intPlayed),
    won: parseInt(entry.intWin),
    drawn: parseInt(entry.intDraw),
    lost: parseInt(entry.intLoss),
    gd: parseInt(entry.intGoalDifference),
    points: parseInt(entry.intPoints),
  }));
}

export async function getTopScorers(): Promise<ScorerData[]> {
  // TheSportsDB free tier doesn't have scorer data
  // Return empty - could be enhanced with a paid API later
  return [];
}

export const ARSENAL_TEAM_ID = parseInt(ARSENAL_ID);
