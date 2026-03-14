"use client";

import { useState, useEffect } from "react";

// Target date: Arsenal vs Everton — Saturday March 14, 2026 at 5:30 PM GMT
const TARGET_DATE = new Date("2026-03-14T17:30:00Z");

const standings = [
  { pos: 1, team: "Arsenal", p: 30, w: 20, d: 7, l: 3, gd: 42, pts: 67 },
  { pos: 2, team: "Man City", p: 29, w: 18, d: 6, l: 5, gd: 33, pts: 60 },
  { pos: 3, team: "Man United", p: 29, w: 14, d: 9, l: 6, gd: 12, pts: 51 },
  { pos: 4, team: "Aston Villa", p: 29, w: 15, d: 6, l: 8, gd: 10, pts: 51 },
  { pos: 5, team: "Chelsea", p: 29, w: 13, d: 9, l: 7, gd: 9, pts: 48 },
  { pos: 6, team: "Liverpool", p: 29, w: 14, d: 6, l: 9, gd: 8, pts: 48 },
  { pos: 7, team: "Brentford", p: 29, w: 13, d: 5, l: 11, gd: 2, pts: 44 },
  { pos: 8, team: "Everton", p: 29, w: 12, d: 7, l: 10, gd: 1, pts: 43 },
  { pos: 9, team: "Bournemouth", p: 29, w: 9, d: 13, l: 7, gd: -2, pts: 40 },
  { pos: 10, team: "Fulham", p: 29, w: 12, d: 4, l: 13, gd: -5, pts: 40 },
  { pos: 11, team: "Sunderland", p: 29, w: 10, d: 10, l: 9, gd: -1, pts: 40 },
  { pos: 12, team: "Newcastle", p: 29, w: 11, d: 6, l: 12, gd: -4, pts: 39 },
  { pos: 13, team: "Crystal Palace", p: 29, w: 10, d: 8, l: 11, gd: -3, pts: 38 },
  { pos: 14, team: "Brighton", p: 29, w: 9, d: 10, l: 10, gd: -4, pts: 37 },
  { pos: 15, team: "Leeds", p: 29, w: 7, d: 10, l: 12, gd: -12, pts: 31 },
  { pos: 16, team: "Tottenham", p: 29, w: 7, d: 8, l: 14, gd: -18, pts: 29 },
  { pos: 17, team: "Nottm Forest", p: 29, w: 7, d: 7, l: 15, gd: -14, pts: 28 },
  { pos: 18, team: "West Ham", p: 29, w: 7, d: 7, l: 15, gd: -16, pts: 28 },
  { pos: 19, team: "Burnley", p: 29, w: 4, d: 7, l: 18, gd: -28, pts: 19 },
  { pos: 20, team: "Wolves", p: 30, w: 3, d: 7, l: 20, gd: -30, pts: 16 },
];

const recentResults = [
  { opponent: "Chelsea", venue: "H", score: "2-1", result: "W" },
  { opponent: "Brighton", venue: "A", score: "1-0", result: "W" },
  { opponent: "Mansfield FA Cup", venue: "A", score: "2-1", result: "W" },
  { opponent: "Leverkusen UCL", venue: "A", score: "1-1", result: "D" },
  { opponent: "Brentford", venue: "A", score: "1-1", result: "D" },
];

const upcomingFixtures = [
  { opponent: "Everton", venue: "H", date: "TODAY", comp: "PL" },
  { opponent: "Leverkusen UCL", venue: "H", date: "Mar 17", comp: "UCL" },
  { opponent: "Wolves", venue: "A", date: "Mar 21", comp: "PL" },
  { opponent: "Southampton FA Cup", venue: "A", date: "Mar 28", comp: "FA Cup" },
  { opponent: "Bournemouth", venue: "H", date: "Apr 11", comp: "PL" },
];

const topScorers = [
  { name: "Viktor Gyokeres", goals: 18, assists: 6 },
  { name: "Bukayo Saka", goals: 14, assists: 11 },
  { name: "Kai Havertz", goals: 10, assists: 5 },
  { name: "Martin Odegaard", goals: 7, assists: 12 },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-[10px] tracking-[2.5px] uppercase text-arsenal whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-arsenal to-transparent" />
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-subtle rounded-lg ${className}`}>
      {children}
    </div>
  );
}

function ResultBadge({ result }: { result: string }) {
  const colors = {
    W: "text-green-400",
    D: "text-yellow-400",
    L: "text-red-400",
  };
  return (
    <span className={`font-mono font-bold ${colors[result as keyof typeof colors]}`}>
      {result}
    </span>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-4 md:gap-8">
        {["Days", "Hours", "Mins", "Secs"].map((label) => (
          <div key={label} className="text-center">
            <div className="w-16 md:w-24 h-16 md:h-24 bg-surface border border-subtle rounded-lg flex items-center justify-center mb-2">
              <span className="font-mono text-3xl md:text-5xl font-bold">--</span>
            </div>
            <span className="font-mono text-xs text-muted uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Mins" },
        { value: timeLeft.seconds, label: "Secs" },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="w-16 md:w-24 h-16 md:h-24 bg-surface border border-subtle rounded-lg flex items-center justify-center mb-2">
            <span className="font-mono text-3xl md:text-5xl font-bold">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="font-mono text-xs text-muted uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  );
}

function SignupForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-3">
        <input
          type="email"
          placeholder="your email"
          className="flex-1 px-4 py-3 bg-surface border border-subtle rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-arsenal transition-colors"
        />
        <button className="px-6 py-3 bg-arsenal text-white font-medium rounded-lg hover:bg-red-600 transition-colors">
          Subscribe
        </button>
      </div>
      <p className="mt-3 text-sm text-secondary text-center">
        Free weekly. Every Friday. The best Arsenal content, curated.
      </p>
    </div>
  );
}

function TabSite() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 hero-gradient">
        <p className="font-mono text-xs text-secondary tracking-widest uppercase mb-4">
          Premier League
        </p>
        <h1 className="text-4xl md:text-6xl font-serif text-center mb-2">
          <span className="text-arsenal">ARSENAL</span>
          <span className="text-muted mx-4">vs</span>
          <span className="text-white">EVERTON</span>
        </h1>
        <p className="font-mono text-sm text-secondary mb-8">
          Emirates Stadium · Sat Mar 14, 5:30 PM
        </p>
        <div className="mb-12">
          <Countdown />
        </div>
        <SignupForm />
      </section>

      {/* Results + Fixtures */}
      <section className="px-4 max-w-6xl mx-auto">
        <SectionLabel>Results + Fixtures</SectionLabel>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-mono text-xs text-secondary uppercase tracking-wider mb-4">Recent</h3>
            <div className="space-y-2">
              {recentResults.map((match, i) => (
                <Card key={i} className="p-4 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-3">
                    <ResultBadge result={match.result} />
                    <span className="text-white">{match.opponent}</span>
                    <span className="font-mono text-xs text-muted">({match.venue})</span>
                  </div>
                  <span className="font-mono text-white font-bold">{match.score}</span>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs text-secondary uppercase tracking-wider mb-4">Coming Up</h3>
            <div className="space-y-2">
              {upcomingFixtures.map((match, i) => (
                <Card key={i} className="p-4 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted w-4">{match.venue}</span>
                    <span className="text-white">{match.opponent}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-secondary">{match.date}</span>
                    <span className="font-mono text-xs px-2 py-1 bg-surface border border-subtle rounded text-muted">
                      {match.comp}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Standings */}
      <section className="px-4 max-w-6xl mx-auto">
        <SectionLabel>The Table</SectionLabel>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left py-3 px-4 font-mono text-xs text-secondary uppercase tracking-wider sticky left-0 bg-surface">#</th>
                  <th className="text-left py-3 px-4 font-mono text-xs text-secondary uppercase tracking-wider sticky left-12 bg-surface">Team</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-secondary uppercase">P</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-secondary uppercase">W</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-secondary uppercase">D</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-secondary uppercase">L</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-secondary uppercase">GD</th>
                  <th className="text-center py-3 px-4 font-mono text-xs text-secondary uppercase">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => {
                  const isArsenal = row.team === "Arsenal";
                  return (
                    <tr
                      key={row.pos}
                      className={`border-b border-subtle last:border-b-0 ${
                        isArsenal ? "bg-[#1a1416] border-l-2 border-l-arsenal" : i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-sm sticky left-0 bg-inherit">{row.pos}</td>
                      <td className={`py-3 px-4 text-sm sticky left-12 bg-inherit ${isArsenal ? "text-arsenal font-medium" : ""}`}>
                        {row.team}
                      </td>
                      <td className="text-center py-3 px-2 font-mono text-sm text-body">{row.p}</td>
                      <td className="text-center py-3 px-2 font-mono text-sm text-body">{row.w}</td>
                      <td className="text-center py-3 px-2 font-mono text-sm text-body">{row.d}</td>
                      <td className="text-center py-3 px-2 font-mono text-sm text-body">{row.l}</td>
                      <td className={`text-center py-3 px-2 font-mono text-sm ${row.gd > 0 ? "text-green-400" : row.gd < 0 ? "text-red-400" : "text-body"}`}>
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="text-center py-3 px-4 font-mono text-sm font-bold">{row.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Top Scorers */}
      <section className="px-4 max-w-6xl mx-auto">
        <SectionLabel>Arsenal by Numbers</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topScorers.map((player, i) => (
            <Card key={i} className="p-5">
              <span className="font-mono text-xs text-muted">#{i + 1}</span>
              <h4 className="font-serif text-lg mt-2 mb-4">{player.name}</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-2xl font-bold text-arsenal">{player.goals}</p>
                  <p className="font-mono text-xs text-muted uppercase">Goals</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold">{player.assists}</p>
                  <p className="font-mono text-xs text-muted uppercase">Assists</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Second CTA */}
      <section className="px-4 py-16 bg-[#080808]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-4">Don&apos;t miss it.</h2>
          <p className="text-body mb-8">The best Arsenal content, one email, every Friday.</p>
          <SignupForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-subtle">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="font-serif text-xl">Inside <span className="text-arsenal">Arsenal</span> FC</h2>
          <div className="flex gap-6 font-mono text-sm text-secondary">
            <span className="hover:text-white cursor-pointer transition-colors">TikTok</span>
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">YouTube</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted">2026 Inside Arsenal FC</p>
          <div className="flex gap-4 font-mono text-xs text-muted">
            <span className="hover:text-secondary cursor-pointer transition-colors">Unsubscribe</span>
            <span className="hover:text-secondary cursor-pointer transition-colors">Preferences</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TabEmail() {
  return (
    <div className="max-w-[620px] mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <header className="text-center">
        <h1 className="font-serif text-2xl mb-2">Inside <span className="text-arsenal">Arsenal</span> FC</h1>
        <p className="font-mono text-xs text-muted mb-4">Issue #1 · Mar 14, 2026</p>
        <div className="w-12 h-0.5 bg-arsenal mx-auto mb-6" />
        <p className="text-body text-sm leading-relaxed">
          Your weekly Arsenal briefing. The best content, one great find from somewhere else, a quick take, and everything you need to know before the weekend.
        </p>
      </header>

      {/* Clip of the Week */}
      <section>
        <SectionLabel>Clip of the Week</SectionLabel>
        <Card className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full bg-arsenal flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-serif text-xl mb-3">Saka&apos;s winner at Brighton — every angle</h3>
            <p className="text-body text-sm leading-relaxed mb-4">
              Bukayo did what Bukayo does. The ball from Odegaard, the run, the finish — clinical. We broke down the goal with commentary from the stands and every replay you didn&apos;t see on TV. This is the one you&apos;re sending to your group chat.
            </p>
            <p className="font-mono text-xs text-muted">1.2M views · Watch on TikTok</p>
          </div>
        </Card>
      </section>

      {/* From the Timeline */}
      <section>
        <SectionLabel>From the Timeline</SectionLabel>
        <Card className="p-5">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-surface rounded flex-shrink-0" />
            <div>
              <p className="font-mono text-xs text-arsenal mb-1">@dailycannon</p>
              <h3 className="font-serif text-lg mb-2">Havertz&apos;s two surgeries and what they changed</h3>
              <p className="text-body text-sm leading-relaxed">
                Kai opened up about his injury struggles this week — the hunger, the doubt, the comeback. This piece from Daily Cannon captures it perfectly. Worth five minutes.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* The Take */}
      <section>
        <SectionLabel>The Take</SectionLabel>
        <div className="border-l-2 border-arsenal pl-5 space-y-4">
          <p className="text-body leading-relaxed">
            Seven points clear with eight to play. That&apos;s where we are. And yet the feeling in the fanbase is strangely nervous — like we&apos;ve been here before and know what can happen.
          </p>
          <p className="text-body leading-relaxed">
            Here&apos;s the thing: this isn&apos;t 22/23. This squad is deeper, more experienced, and playing with the kind of control that title winners have. The Chelsea win wasn&apos;t pretty. Brighton was a grind. That&apos;s the point. Those are the games you have to win, and we&apos;re winning them.
          </p>
          <p className="text-body leading-relaxed">
            Odegaard&apos;s knee is the only cloud. But Leverkusen showed we can compete without him. Everton today, then Wolves before the break. Take care of business, and we go into April with the title in our hands.
          </p>
        </div>
      </section>

      {/* The Week Ahead */}
      <section>
        <SectionLabel>The Week Ahead</SectionLabel>
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-mono text-4xl font-bold text-arsenal">1st</span>
              <span className="text-body">Premier League</span>
            </div>
            <span className="font-mono text-2xl font-bold">67 pts</span>
          </div>
        </Card>
        <div className="space-y-2">
          {[
            { opponent: "Chelsea", venue: "H", score: "2-1", result: "W", type: "result" },
            { opponent: "Brighton", venue: "A", score: "1-0", result: "W", type: "result" },
            { opponent: "Mansfield FA Cup", venue: "A", score: "2-1", result: "W", type: "result" },
            { opponent: "Leverkusen UCL", venue: "A", score: "1-1", result: "D", type: "result" },
            { opponent: "Everton", venue: "H", date: "TODAY", type: "fixture", highlight: true },
            { opponent: "Leverkusen UCL", venue: "H", date: "Mar 17/18", type: "fixture" },
            { opponent: "Wolves", venue: "A", date: "Mar 21", type: "fixture" },
          ].map((match, i) => (
            <Card key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {match.type === "result" ? (
                  <ResultBadge result={match.result!} />
                ) : (
                  <span className="font-mono text-xs text-muted w-6">{match.venue}</span>
                )}
                <span className="text-white">{match.opponent}</span>
              </div>
              {match.type === "result" ? (
                <span className="font-mono font-bold">{match.score}</span>
              ) : match.highlight ? (
                <span className="font-mono text-xs px-2 py-1 bg-arsenal rounded text-white">TODAY</span>
              ) : (
                <span className="font-mono text-sm text-secondary">{match.date}</span>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-subtle text-center">
        <h2 className="font-serif text-xl mb-4">Inside <span className="text-arsenal">Arsenal</span> FC</h2>
        <div className="flex justify-center gap-6 font-mono text-sm text-secondary mb-4">
          <span>TikTok</span>
          <span>Instagram</span>
          <span>YouTube</span>
        </div>
        <p className="font-mono text-xs text-muted mb-2">You&apos;re getting this because you signed up at insidearsenalfc.com</p>
        <div className="flex justify-center gap-4 font-mono text-xs text-muted">
          <span className="hover:text-secondary cursor-pointer">Unsubscribe</span>
          <span className="hover:text-secondary cursor-pointer">Preferences</span>
        </div>
      </footer>
    </div>
  );
}

function TabPlan() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-16">
      {/* The Funnel */}
      <section>
        <SectionLabel>The Funnel</SectionLabel>
        <div className="space-y-4">
          {[
            { title: "HIS SOCIALS", subtitle: "TikTok · Instagram · YouTube", desc: "Hundreds of thousands following", annotation: "CTA in every post" },
            { title: "LINK IN BIO", subtitle: "insidearsenalfc.com", desc: "The landing page", annotation: "Live data = reason to visit" },
            { title: "EMAIL SIGNUP", subtitle: "Beehiiv form on landing page", desc: "Convert visitors to subscribers", annotation: "Every Friday" },
            { title: "WEEKLY NEWSLETTER", subtitle: "Clip + Timeline + Take + Table", desc: "The product", annotation: "Featured creator shares" },
            { title: "CROSS-PROMO FLYWHEEL", subtitle: "New audience discovers us", desc: "Growth loop", annotation: null },
          ].map((step, i) => (
            <div key={i}>
              <Card className="p-5">
                <h3 className="font-mono text-sm text-arsenal mb-1">{step.title}</h3>
                <p className="text-white mb-1">{step.subtitle}</p>
                <p className="text-sm text-secondary">{step.desc}</p>
              </Card>
              {step.annotation && (
                <div className="flex items-center gap-3 py-3 pl-6">
                  <div className="w-0.5 h-4 bg-arsenal" />
                  <span className="font-mono text-xs text-secondary">{step.annotation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Growth Engine */}
      <section>
        <SectionLabel>The Growth Engine</SectionLabel>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { num: "1", title: "Feature", desc: "Every issue highlights one piece of content from another Arsenal creator in 'From the Timeline'" },
            { num: "2", title: "Notify", desc: "DM the creator before the issue ships. Let them know they're featured." },
            { num: "3", title: "Amplify", desc: "Creator shares the issue with their audience. Their fans discover us. Repeat weekly." },
          ].map((step) => (
            <Card key={step.num} className="p-5">
              <span className="font-mono text-3xl text-arsenal font-bold">{step.num}</span>
              <h3 className="font-serif text-lg mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-body">{step.desc}</p>
            </Card>
          ))}
        </div>
        <p className="text-secondary text-sm text-center">
          Every issue is a distribution event. No ads. No paid growth. Just great content that sells itself.
        </p>
      </section>

      {/* CTAs */}
      <section>
        <SectionLabel>Caption CTAs</SectionLabel>
        <p className="text-secondary text-sm mb-4">Rotating copy for post captions. Never the same line twice.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "This made the newsletter this week → link in bio",
            "Get this in your inbox every Friday → link in bio",
            "Everything you missed this week, one email. Link in bio.",
            "Friday's email covers all of this. Link in bio to subscribe.",
            "Your Friday Arsenal fix → link in bio",
            "The weekly Arsenal briefing. Link in bio.",
            "10,000 fans get this email every Friday. Join them → link in bio",
            "What should we cover next week? Drop it below",
          ].map((cta, i) => (
            <Card key={i} className="p-4 border-l-2 border-l-arsenal">
              <p className="font-mono text-sm text-body">{cta}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <SectionLabel>Launch Timeline</SectionLabel>
        <div className="space-y-4">
          {[
            { week: "Week -1", title: "Pre-Launch", desc: "Set up Beehiiv, deploy site, soft tease on stories, post launch video, pin it" },
            { week: "Week 1", title: "Issue #1", desc: "Ship first newsletter, begin rotating CTAs, DM featured creator" },
            { week: "Weeks 2-4", title: "Rhythm", desc: "Weekly issues, weekly cross-promo, story CTAs, build creator list" },
            { week: "Weeks 5-8", title: "Scale", desc: "Reddit seeding, supporter group outreach, 2nd wave of creator features" },
          ].map((milestone, i) => (
            <Card key={i} className="p-5">
              <span className="font-mono text-xs text-arsenal">{milestone.week}</span>
              <h3 className="font-serif text-lg mt-1 mb-2">{milestone.title}</h3>
              <p className="text-sm text-body">{milestone.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section>
        <SectionLabel>Milestones</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: "500", title: "subs", desc: "You're real. Keep going." },
            { num: "2,500", title: "subs", desc: "Beehiiv Ad Network. First passive revenue." },
            { num: "5,000", title: "subs", desc: "Direct sponsorships. $200-500/issue." },
            { num: "10,000", title: "subs", desc: "Premium sponsors. $500-1,500/issue. You've built something." },
          ].map((m, i) => (
            <Card key={i} className="p-5">
              <p className="font-mono text-3xl text-arsenal font-bold">{m.num}</p>
              <p className="font-mono text-sm text-secondary mb-2">{m.title}</p>
              <p className="text-sm text-body">{m.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Monetization */}
      <section>
        <SectionLabel>Monetization</SectionLabel>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: "Sponsorships", desc: "Arsenal-adjacent brands (betting, kits, streaming, travel) pay for placement once the list is big enough." },
            { title: "Merch", desc: "Inside Arsenal FC branded gear. Or affiliate deals with kit/apparel companies." },
            { title: "Affiliate", desc: "Streaming services, ticket platforms, fantasy football tools. Passive links in every issue." },
          ].map((item) => (
            <Card key={item.title} className="p-5">
              <h3 className="font-serif text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-body">{item.desc}</p>
            </Card>
          ))}
        </div>
        <p className="text-secondary text-sm text-center">
          Monetization starts at ~2,500 subscribers. Until then, the only job is making the newsletter great.
        </p>
      </section>
    </div>
  );
}

export default function PitchPage() {
  const [activeTab, setActiveTab] = useState<"site" | "email" | "plan">("site");

  const tabs = [
    { id: "site" as const, label: "The Site" },
    { id: "email" as const, label: "The Email" },
    { id: "plan" as const, label: "The Plan" },
  ];

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Tab Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 font-mono text-xs uppercase tracking-wider transition-colors relative ${
                  activeTab === tab.id ? "text-white" : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.6)]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-arsenal" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="animate-fade-in">
        {activeTab === "site" && <TabSite />}
        {activeTab === "email" && <TabEmail />}
        {activeTab === "plan" && <TabPlan />}
      </main>
    </div>
  );
}
