import { SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted/60">
        <p className="font-mono text-xs">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          <span className="text-accent-amber">.</span> Built with Next.js &
          Three.js
        </p>
        <div className="flex items-center gap-6 text-xs font-mono">
          <a
            href={SITE_CONFIG.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-amber transition-colors duration-300 link-animated"
          >
            GitHub
          </a>
          <a
            href={SITE_CONFIG.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-amber transition-colors duration-300 link-animated"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
