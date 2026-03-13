import Hero from "./components/Hero";
import Fixtures from "./components/Fixtures";
import Standings from "./components/Standings";
import SquadStats from "./components/SquadStats";
import SecondCTA from "./components/SecondCTA";
import Footer from "./components/Footer";
import {
  getNextMatch,
  getLiveMatch,
  getRecentResults,
  getUpcomingFixtures,
  getStandings,
  getTopScorers,
} from "./lib/football-data";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  const [nextMatch, liveMatch, results, upcoming, standings, scorers] =
    await Promise.all([
      getNextMatch(),
      getLiveMatch(),
      getRecentResults(),
      getUpcomingFixtures(),
      getStandings(),
      getTopScorers(),
    ]);

  return (
    <main>
      <Hero nextMatch={nextMatch} liveMatch={liveMatch} />
      <Fixtures results={results} upcoming={upcoming} />
      <Standings standings={standings} />
      <SquadStats scorers={scorers} />
      <SecondCTA />
      <Footer />
    </main>
  );
}
