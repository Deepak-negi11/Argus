import Link from 'next/link';
import { Github, Twitter, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/logo';

const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Get started', href: '/user/signup' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', href: '/user/signin' },
      { label: 'Create account', href: '/user/signup' },
      { label: 'Account recovery', href: '/user/forgot-password' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: 'https://github.com/Deepak-negi11/Argus#readme', external: true },
      { label: 'Source code', href: 'https://github.com/Deepak-negi11/Argus', external: true },
      { label: 'Status', href: '/dashboard' },
    ],
  },
];

const GITHUB_URL = 'https://github.com/Deepak-negi11/Argus';
const TWITTER_URL = 'https://x.com/depx_____';

export function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-10 border-t border-white/15 pt-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + social */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 font-brand text-lg font-semibold text-white">
              <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white/12 p-1.5 ring-1 ring-white/20">
                <Logo className="h-full w-full object-contain" />
              </span>
              Argus
            </Link>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Multi-region uptime monitoring, built for the moment something changes.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/[0.06] text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/[0.06] text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center gap-1.5 text-xs font-medium text-white/65 transition hover:text-white"
              >
                Star on GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                {col.title}
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 transition hover:text-white"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-60" />
                      </a>
                    ) : (
                      <Link href={link.href} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Argus · Built with Rust and Next.js</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
