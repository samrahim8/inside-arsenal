import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inside Arsenal FC | Weekly Newsletter for Arsenal Fans",
  description:
    "The best Arsenal content, curated. One email, every Friday. Live scores, fixtures, standings, and more.",
  openGraph: {
    title: "Inside Arsenal FC",
    description: "The best Arsenal content, curated. One email, every Friday.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className="font-sans bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
