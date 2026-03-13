export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Wordmark */}
          <h2 className="font-serif text-2xl">
            Inside <span className="text-arsenal">Arsenal</span> FC
          </h2>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-mono text-sm text-[rgba(255,255,255,0.45)] hover:text-white transition-colors"
            >
              TikTok
            </a>
            <a
              href="#"
              className="font-mono text-sm text-[rgba(255,255,255,0.45)] hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="font-mono text-sm text-[rgba(255,255,255,0.45)] hover:text-white transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[rgba(255,255,255,0.3)]">
            {new Date().getFullYear()} Inside Arsenal FC. Not affiliated with Arsenal Football Club.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-mono text-xs text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.45)] transition-colors"
            >
              Unsubscribe
            </a>
            <a
              href="#"
              className="font-mono text-xs text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.45)] transition-colors"
            >
              Preferences
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
