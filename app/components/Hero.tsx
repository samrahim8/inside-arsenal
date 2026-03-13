"use client";

import { useEffect, useState } from "react";
import SignupForm from "./SignupForm";
import type { MatchData } from "@/app/lib/football-data";

interface HeroProps {
  nextMatch: MatchData | null;
  liveMatch: MatchData | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Hero({ nextMatch, liveMatch }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!nextMatch) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextMatch.date));
    }, 1000);

    setTimeLeft(calculateTimeLeft(nextMatch.date));

    return () => clearInterval(timer);
  }, [nextMatch]);

  if (liveMatch) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 hero-gradient">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-3 h-3 bg-arsenal rounded-full animate-pulse-live" />
            <span className="font-mono text-sm tracking-widest text-arsenal uppercase">
              Live Now
            </span>
          </div>

          <p className="font-mono text-xs text-[rgba(255,255,255,0.45)] tracking-widest uppercase mb-4">
            {liveMatch.competition}
          </p>

          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="text-right">
              <p className={`text-2xl md:text-4xl font-serif ${liveMatch.isHome ? "text-arsenal" : "text-white"}`}>
                {liveMatch.homeTeam}
              </p>
              {liveMatch.isHome && (
                <p className="text-xs font-mono text-[rgba(255,255,255,0.45)] mt-1">HOME</p>
              )}
            </div>

            <div className="font-mono text-5xl md:text-7xl font-bold text-white">
              {liveMatch.homeScore ?? 0} - {liveMatch.awayScore ?? 0}
            </div>

            <div className="text-left">
              <p className={`text-2xl md:text-4xl font-serif ${!liveMatch.isHome ? "text-arsenal" : "text-white"}`}>
                {liveMatch.awayTeam}
              </p>
              {!liveMatch.isHome && (
                <p className="text-xs font-mono text-[rgba(255,255,255,0.45)] mt-1">AWAY</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md animate-fade-up" style={{ animationDelay: "100ms" }}>
          <SignupForm utmSource="hero_live" />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 hero-gradient">
      <div className="text-center mb-12 animate-fade-up">
        {nextMatch ? (
          <>
            <p className="font-mono text-xs text-[rgba(255,255,255,0.45)] tracking-widest uppercase mb-4">
              {nextMatch.competition}
            </p>

            <h1 className="text-3xl md:text-5xl font-serif mb-2">
              <span className={nextMatch.isHome ? "text-arsenal" : "text-white"}>
                {nextMatch.homeTeam}
              </span>
              <span className="text-[rgba(255,255,255,0.3)] mx-4">vs</span>
              <span className={!nextMatch.isHome ? "text-arsenal" : "text-white"}>
                {nextMatch.awayTeam}
              </span>
            </h1>

            <p className="font-mono text-sm text-[rgba(255,255,255,0.45)] mb-8">
              {formatMatchDate(nextMatch.date)} {nextMatch.isHome ? "(H)" : "(A)"}
            </p>

            {mounted && timeLeft && (
              <div className="flex justify-center gap-4 md:gap-8 mb-12">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Mins" },
                  { value: timeLeft.seconds, label: "Secs" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="w-16 md:w-24 h-16 md:h-24 bg-surface border border-subtle rounded-lg flex items-center justify-center mb-2">
                      <span className="font-mono text-3xl md:text-5xl font-bold text-white">
                        {String(value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!mounted && (
              <div className="flex justify-center gap-4 md:gap-8 mb-12">
                {["Days", "Hours", "Mins", "Secs"].map((label) => (
                  <div key={label} className="text-center">
                    <div className="w-16 md:w-24 h-16 md:h-24 bg-surface border border-subtle rounded-lg flex items-center justify-center mb-2">
                      <span className="font-mono text-3xl md:text-5xl font-bold text-white">
                        --
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-serif mb-4">
              Inside <span className="text-arsenal">Arsenal</span> FC
            </h1>
            <p className="text-[rgba(255,255,255,0.7)] text-lg">
              The best Arsenal content, curated.
            </p>
          </>
        )}
      </div>

      <div className="w-full max-w-md animate-fade-up" style={{ animationDelay: "100ms" }}>
        <SignupForm utmSource="hero" />
      </div>
    </section>
  );
}
