'use client';

import { getValidStoredToken } from '@/lib/auth';
import { ArrowUpRight, Check, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/logo';
import { UptimeFeatures } from '@/components/uptime-features';
import { Footer } from '@/components/footers';

const navItems = ['Features'];

export default function Home() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (getValidStoredToken()) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#1534bd]">
      <section
        className="relative flex w-full min-w-0 flex-col items-center overflow-hidden"
      >
        <div className="supaste-gradient-layer" aria-hidden="true" />

        <nav className="landing-nav absolute left-3 right-3 top-3 z-20 w-auto px-3.5 py-1.5 text-white sm:left-1/2 sm:right-auto sm:w-[460px] sm:-translate-x-1/2 sm:px-3.5">
          <div className="relative z-10 flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-1.5 rounded-xl">
              <span className="grid h-9  w-9 place-items-center rounded-[10px] border border-white/20 bg-transparent overflow-hidden p-1 text-white ">
                <Logo className="h-full w-full object-contain" />
              </span>
              <span className="text-[15px] font-bold tracking-tight text-white drop-shadow-sm font-brand">Argus</span>
            </Link>

            <div className="hidden sm:flex items-center gap-4 text-[13px] text-white/70">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-white">
                  {item}
                </a>
              ))}
              <Link href="/user/signin" className="transition hover:text-white">
                Sign in
              </Link>
              <Link href="/user/signup" className="rounded-[10px] border border-white/20 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-transparent ml-1">
                Get started
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((open) => !open)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/25 bg-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,.25)] sm:hidden"
            >
              <Menu className="h-3.5 w-3.5" />
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-2.5 grid gap-1 border-t border-white/10 pt-2.5 sm:hidden">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="rounded-lg px-3 py-1.5 text-xs text-white/65">
                  {item}
                </a>
              ))}
              <Link href="/user/signin" className="rounded-lg px-3 py-1.5 text-xs text-white/65">Sign in</Link>
              <Link href="/user/signup" className="mt-1 rounded-lg border border-white/25 bg-white/[0.025] px-3 py-1.5 text-center text-xs font-semibold text-white">Get started</Link>
            </div>
          )}
        </nav>

        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 pt-40 text-center sm:px-10 sm:pt-[185px]">
          <div className="mb-8 flex items-center gap-2.5 text-sm font-medium text-white">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Multi-region uptime monitoring
          </div>

          <h1 className="w-full max-w-[680px] text-[2.55rem] font-bold leading-none tracking-[-0.05em] text-white sm:text-[4.5rem]">
            <span className="block">Know sooner.</span>
            {/* Outer span fades/slides in once; inner span floats forever so the
                entrance and the loop don't fight each other. */}
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-1 block"
            >
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="landing-serif block text-[2.55rem] font-normal leading-none tracking-[-0.05em] text-white sm:text-[4.5rem]"
              >
                Respond faster.
              </motion.span>
            </motion.span>
          </h1>

          <p className="mt-7 max-w-[570px] text-base leading-7 text-white/85 sm:text-lg sm:leading-7">
            Monitor your services from Bangalore and San Francisco, compare real response times, and receive an alert the moment something goes wrong.
          </p>

          <Link
            href="/user/signup"
            className="group mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-[18px] bg-black px-7 text-base font-semibold text-white shadow-[0_14px_35px_rgba(0,0,0,.18)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,.24)]"
          >
            Start monitoring
            <motion.span
              animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.span>
          </Link>

          {/* Each check drops in from the 3D "top" (rotateX + y) one after the
              other. Perspective on the parent makes the tilt read as depth. */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { delayChildren: 0.6, staggerChildren: 0.18 } },
            }}
            style={{ perspective: '800px' }}
            className="mt-9 grid gap-y-2 text- text-[#0A5BCE] sm:flex sm:flex-wrap sm:justify-center sm:gap-x-7"
          >
            {['2-minute checks', 'Real regional data', 'Instant email alerts'].map((item) => (
              <motion.span
                key={item}
                variants={{
                  hidden: { opacity: 0, y: -28, rotateX: -55 },
                  visible: { opacity: 1, y: 0, rotateX: 0 },
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'top center' }}
                className="flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                {item}
              </motion.span>
            ))}
          </motion.div>

          <MonitorPreview />
        </div>
      </section>

      {/* Continue from the hero's lightest blue, then rebuild the same signal
          palette toward the deep navigation blue. */}
      <div className="landing-return-gradient relative">
        <section id="features">

          <UptimeFeatures />

        </section>

        <Footer />
      </div>
    </main>
  );
}

/** Hero product preview: the real Argus dashboard screenshot, shown in full. */
function MonitorPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto mt-12 w-full min-w-0 max-w-[1140px] sm:mt-10"
    >
      <Image
        src="/landing-new-clean.png"
        alt="Argus dashboard comparing response times from India and San Francisco"
        width={3720}
        height={2341}
        priority
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </motion.div>
  );
}
