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

function isArsenalMatch(event: SportsDBEvent): boolean {
  return (
    event.strHomeTeam === "Arsenal" ||
    event.strAwayTeam === "Arsenal" ||
    event.idHomeTeam === ARSENAL_ID ||
    event.idAwayTeam === ARSENAL_ID
  );
}

function eventToMatchData(event: SportsDBEvent): MatchData {
  const isHome = event.strHomeTeam === "Arsenal" || event.idHomeTeam === ARSENAL_ID;
  return {
    id: parseInt(event.idEvent),
    date: event.strTimestamp,
    status: event.strStatus || "SCHEDULED",
    competition: event.strLeague,
    competitionCode: "PL",
    homeTeam: event.strHomeTeam,
    awayTeam: event.strAwayTeam,
    homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : null,
    awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : null,
    isHome,
  };
}

function getSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // Season starts in August (month 7), so before August use previous year
  const seasonStart = month < 7 ? year - 1 : year;
  return `${seasonStart}-${seasonStart + 1}`;
}

// Cache season events to avoid multiple fetches
let cachedSeasonEvents: SportsDBEvent[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getSeasonEvents(): Promise<SportsDBEvent[]> {
  const now = Date.now();
  if (cachedSeasonEvents && now - cacheTime < CACHE_DURATION) {
    return cachedSeasonEvents;
  }

  const season = getSeason();
  const data = await fetchAPI<{ events: SportsDBEvent[] | null }>(
    `/eventsseason.php?id=${PREMIER_LEAGUE_ID}&s=${season}`
  );

  if (data?.events) {
    cachedSeasonEvents = data.events;
    cacheTime = now;
    return data.events;
  }

  return [];
}

export async function getRecentResults(): Promise<MatchData[]> {
  const data = await fetchAPI<{ results: SportsDBEvent[] | null }>(
    `/eventslast.php?id=${ARSENAL_ID}`
  );

  if (!data?.results) return [];

  // Filter to only Arsenal matches (the API sometimes returns wrong data)
  return data.results
    .filter(isArsenalMatch)
    .slice(0, 5)
    .map(eventToMatchData);
}

export async function getUpcomingFixtures(): Promise<MatchData[]> {
  const events = await getSeasonEvents();
  const now = new Date();

  const upcoming = events
    .filter((e) => {
      if (!isArsenalMatch(e)) return false;
      const matchDate = new Date(e.strTimestamp);
      const isUpcoming = matchDate > now;
      const notFinished = e.strStatus !== "Match Finished";
      return isUpcoming && notFinished;
    })
    .sort((a, b) => new Date(a.strTimestamp).getTime() - new Date(b.strTimestamp).getTime())
    .slice(0, 5)
    .map(eventToMatchData);

  return upcoming;
}

export async function getNextMatch(): Promise<MatchData | null> {
  const fixtures = await getUpcomingFixtures();
  return fixtures[0] || null;
}

export async function getLiveMatch(): Promise<MatchData | null> {
  // TheSportsDB free tier doesn't have live match data
  return null;
}

export async function getStandings(): Promise<StandingsData[]> {
  const season = getSeason();
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
  return [];
}

export const ARSENAL_TEAM_ID = parseInt(ARSENAL_ID);
