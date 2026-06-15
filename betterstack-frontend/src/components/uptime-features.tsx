'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bell, Check, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';

const regions = [
  { name: 'Bangalore', ms: '68 ms', color: '#2E9BFF' },
  { name: 'San Francisco', ms: '142 ms', color: '#E8AB3A' },
];

const stats = [
  ['2 min', 'Check interval'],
  ['2', 'Global regions'],
  ['<60s', 'Detect → alert'],
  ['24/7', 'Always watching'],
];

const lightCard =
  'group relative overflow-hidden rounded-[26px] border border-[#0d3c82]/[0.08] bg-white p-6 shadow-[0_22px_60px_rgba(8,60,150,0.14)] sm:p-8';

export function UptimeFeatures() {
  return (
    <section className="relative px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[1120px]">
        {/* Section header — clear, benefit-led, no eyebrow. */}
        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.4rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[#0b1e3a] sm:text-[3.4rem]">
            Two regions watching.
            <br />
            <span className="text-[#0872F0]">One clear answer.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#33476e] sm:text-lg">
            Argus checks your site from Bangalore and San Francisco every 2 minutes — and only calls it
            an outage when both regions agree. No noise, no guessing.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Compare — white card with the live chart, the centerpiece. */}
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={`${lightCard} lg:col-span-8`}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#7e8aa6]">
                01 — Compare
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0b1e3a] sm:text-[1.7rem]">
              Real response times, side by side.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#44557a]">
              Bangalore and San Francisco on one chart, so a regional slowdown can never hide inside a
              global average.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {regions.map((r) => (
                <span key={r.name} className="flex items-center gap-2 text-xs text-[#44557a]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                  {r.name} <strong className="font-semibold text-[#0b1e3a]">{r.ms}</strong>
                </span>
              ))}
            </div>

            <LiveChart />
          </motion.article>

          {/* Alert — animated bell. */}
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={`${lightCard} flex flex-col lg:col-span-4 lg:self-start`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#7e8aa6]">
                02 — Alert
              </span>
              <motion.span
                className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0872F0]/10 text-[#0872F0]"
                style={{ transformOrigin: '50% 4px' }}
                animate={{ rotate: [0, -16, 13, -9, 6, -3, 0] }}
                transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
              >
                <Bell className="h-5 w-5" fill="currentColor" />
              </motion.span>
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-[#0b1e3a] sm:text-[1.7rem]">
              The second it breaks, you know.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#44557a]">
              An email hits your inbox within seconds of a failed check — with the region, the status
              code, and the response time already in it.
            </p>
          </motion.article>

          {/* Verify — concrete cross-region confirmation, full width. */}
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={`${lightCard} lg:col-span-12`}
          >
            <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#7e8aa6]">
                  03 — Verify
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0b1e3a] sm:text-[1.7rem]">
                  Confirmed by a second region before you&apos;re paged.
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#44557a]">
                  When Bangalore sees a failure, San Francisco re-tests it immediately. If it was just a
                  network blip on one side, you stay asleep — we only open an incident when both regions
                  agree.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Bangalore', 'Check failed', 'HTTP 503 at 00:00', false],
                  ['San Francisco', 'Re-tested & failed', 'Confirmed at 00:08', false],
                  ['Incident', 'Opened + emailed', 'You hear from us once', true],
                ].map(([region, title, detail, done], index) => (
                  <motion.div
                    key={region as string}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12, duration: 0.5 }}
                    className="rounded-2xl border border-[#0d3c82]/[0.08] bg-[#f6f9ff] p-5 shadow-sm transition hover:border-[#0872F0]/30 hover:shadow-[0_10px_28px_rgba(8,114,240,0.12)]"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7e8aa6]">
                        {region}
                      </span>
                      <span
                        className={`grid h-6 w-6 place-items-center rounded-full ${
                          done ? 'bg-emerald-500/12 text-emerald-600' : 'bg-[#0872F0]/12 text-[#0872F0]'
                        }`}
                      >
                        {done ? <Check className="h-3 w-3" /> : <Radio className="h-3 w-3" />}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#0b1e3a]">{title}</p>
                    <p className="mt-1.5 text-xs leading-5 text-[#7e8aa6]">{detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.article>
        </div>

        {/* Quick stats band. */}
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[26px] border border-white/70 bg-[#0d3c82]/[0.08] shadow-[0_22px_60px_rgba(8,60,150,0.14)] sm:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="bg-white/85 px-6 py-7 backdrop-blur-xl">
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[#0b1e3a]">{value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#7e8aa6]">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Closing CTA. */}
        <div className="mt-14 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#33476e]">
            Free to start · No credit card · Live in two minutes
          </p>
          <a
            href="/user/signup"
            className="group mt-5 inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#0b1e3a] px-8 text-base font-semibold text-white shadow-[0_16px_40px_rgba(11,30,58,0.28)] transition hover:-translate-y-0.5 hover:bg-[#0872F0] hover:shadow-[0_20px_48px_rgba(8,114,240,0.32)]"
          >
            Build your first monitor
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Live response-time chart ---------------- */

const N = 8;
const VIEW_W = 1000;
const X0 = 56;
const X1 = 910;
const TOP = 46;
const BOTTOM = 286;
const STEP = (X1 - X0) / (N - 1);

// Deterministic seeds so the server render matches the first client render
// (randomisation only starts after mount, inside the interval).
const SEED_A = [44, 30, 58, 42, 72, 50, 84, 62];
const SEED_B = [28, 36, 30, 48, 40, 54, 46, 60];

const xAt = (i: number) => X0 + i * STEP;
const yAt = (v: number) => BOTTOM - (v / 100) * (BOTTOM - TOP);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function buildLine(vals: number[]) {
  const p = vals.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const t = 0.16;
    const c1x = p1.x + (p2.x - p0.x) * t;
    const c1y = p1.y + (p2.y - p0.y) * t;
    const c2x = p2.x - (p3.x - p1.x) * t;
    const c2y = p2.y - (p3.y - p1.y) * t;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function LiveChart() {
  const [a, setA] = useState(SEED_A);
  const [b, setB] = useState(SEED_B);

  useEffect(() => {
    const id = setInterval(() => {
      setA((v) => [...v.slice(1), clamp(v[v.length - 1] + (Math.random() * 44 - 22), 14, 92)]);
      setB((v) => [...v.slice(1), clamp(v[v.length - 1] + (Math.random() * 36 - 18), 8, 78)]);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const lineA = buildLine(a);
  const lineB = buildLine(b);
  const areaA = `${lineA} L ${X1} 320 L ${X0} 320 Z`;
  const lastA = a[a.length - 1];
  const lastB = b[b.length - 1];
  const spring = { type: 'spring' as const, stiffness: 90, damping: 18 };

  // Pill y-centers, nudged apart if the two line ends are too close.
  let pillA = yAt(lastA);
  let pillB = yAt(lastB);
  if (Math.abs(pillA - pillB) < 32) {
    if (pillA <= pillB) {
      pillA -= 16;
      pillB += 16;
    } else {
      pillA += 16;
      pillB -= 16;
    }
  }

  return (
    <motion.svg
      viewBox={`0 0 ${VIEW_W} 340`}
      className="mt-4 w-full overflow-visible"
      role="img"
      aria-label="Live response times from Bangalore and San Francisco"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <linearGradient id="liveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* faint gridlines */}
      {[TOP, (TOP + BOTTOM) / 2, BOTTOM].map((y) => (
        <line key={y} x1={X0} x2={X1} y1={y} y2={y} stroke="rgba(13,60,130,0.08)" strokeDasharray="3 9" />
      ))}

      {/* area under the primary line */}
      <motion.path fill="url(#liveFill)" initial={false} animate={{ d: areaA }} transition={spring} />

      {/* San Francisco — amber line */}
      <motion.path
        fill="none"
        stroke="#E8AB3A"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ d: lineB }}
        transition={spring}
      />
      {b.map((v, i) => (
        <motion.circle
          key={`sf-${i}`}
          cx={xAt(i)}
          r={i === N - 1 ? 5 : 3.5}
          fill={i === N - 1 ? '#E8AB3A' : '#ffffff'}
          stroke="#E8AB3A"
          strokeWidth="2"
          initial={false}
          animate={{ cy: yAt(v) }}
          transition={spring}
        />
      ))}

      {/* primary bold blue line */}
      <motion.path
        fill="none"
        stroke="#2E9BFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ d: lineA }}
        transition={spring}
      />

      {/* white node markers on the primary line */}
      {a.map((v, i) => (
        <motion.circle
          key={i}
          cx={xAt(i)}
          r={i === N - 1 ? 6 : 4.5}
          fill={i === N - 1 ? '#2E9BFF' : '#ffffff'}
          stroke="#2E9BFF"
          strokeWidth="2.5"
          initial={false}
          animate={{ cy: yAt(v) }}
          transition={spring}
        />
      ))}

      {/* pulsing halo on the latest point */}
      <motion.circle
        cx={xAt(N - 1)}
        fill="#2E9BFF"
        opacity={0.5}
        initial={false}
        animate={{ cy: yAt(lastA), r: [6, 16, 6], opacity: [0.45, 0, 0.45] }}
        transition={{ cy: spring, r: { duration: 1.8, repeat: Infinity }, opacity: { duration: 1.8, repeat: Infinity } }}
      />

      {/* live value pills — kept vertically separated so they never collide */}
      <motion.g initial={false} animate={{ y: pillA }} transition={spring}>
        <rect x={X1 + 14} y={-13} rx="9" width="66" height="26" fill="#2E9BFF" />
        <text x={X1 + 47} y={5} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="600" fill="#fff">
          {Math.round(lastA * 1.4)}ms
        </text>
      </motion.g>
      <motion.g initial={false} animate={{ y: pillB }} transition={spring}>
        <rect x={X1 + 14} y={-13} rx="9" width="66" height="26" fill="#E8AB3A" />
        <text x={X1 + 47} y={5} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="600" fill="#1a1205">
          {Math.round(lastB * 1.4)}ms
        </text>
      </motion.g>
    </motion.svg>
  );
}
