# Argus — uptime monitoring that checks from two sides of the world 🌍

> Know the moment your site goes down — and know it's *actually* down, not just a hiccup on one network.

![The Argus dashboard](./betterstack-frontend/public/landing-new-clean.png)

---

## So what is this?

Argus watches your websites and APIs around the clock. Every couple of minutes it pings your service from **two different places — Bangalore and San Francisco** — measures how fast it responded, and quietly keeps a log. The second something breaks, it emails you.

Most uptime tools check from a single location. The problem with that is networks are messy: a route between, say, one data center and your server can wobble for 30 seconds and make a perfectly healthy site *look* dead. You get woken up at 3am for nothing.

Argus fixes that by asking a simple question before it panics: **"Did the other region see it too?"** If Bangalore says your site is down but San Francisco says it's fine, that's probably just network noise — so you stay asleep. Only when *both* regions agree does it open an incident and reach out. Fewer false alarms, more trust in the alerts you do get.

---

## A peek inside

The dashboard is dark, fast, and to the point. You add a site, and you get live response-time graphs, uptime percentages, and a clear "is it up right now?" answer.

![A monitor with its live response-time graph](./image.png)

You can compare the two regions on the same chart, so a slowdown in one part of the world never hides inside a global average.

---

## How it actually works

There are three moving pieces. Think of it like a control room with field agents.

**1. The central server — the brain 🧠**
This is home base. It holds:
- **PostgreSQL** — every user, every monitored site, and every single check result.
- **Redis** — a to-do list (using Redis Streams) of "go check this site now" jobs.
- **The API** (Rust) — what the dashboard talks to: logging in, adding sites, fetching graphs.
- **The Pusher** (Rust) — a little scheduler that, on a timer, drops "check this site" jobs onto the Redis list.

**2. The regional workers — the field agents 🛰️**
These run on small servers in different countries (Bangalore, San Francisco, wherever you like). Each one:
- Grabs jobs off the central Redis list,
- Pings the site over HTTP/HTTPS (with retries, so one dropped packet doesn't cry wolf),
- Writes the result — up/down, response time, region — straight back to the central database.

**3. The frontend — the window 🪟**
A Next.js app (the "Argus" dashboard you see above) where you manage your sites and read the story the data tells.

```
        ┌─────────────────────────────────────────┐
        │            CENTRAL SERVER                │
        │   Postgres  ·  Redis  ·  API  ·  Pusher  │
        └───────▲───────────────┬─────────────────┘
                │ results        │ "go check X"
        ┌───────┴───────┐ ┌──────┴────────┐
        │ Worker · BLR  │ │ Worker · SFO  │   ← add as many as you want
        └───────────────┘ └───────────────┘
                ▲
                │ talks to the API
        ┌───────┴────────┐
        │  Next.js (UI)  │
        └────────────────┘
```

---

## What's under the hood

| Part | Built with |
|------|-----------|
| **Backend** | Rust — [Poem](https://github.com/poem-web/poem) (web), [Diesel](https://diesel.rs/) (database), Tokio (async) |
| **Frontend** | Next.js 16, React 19, Tailwind CSS, Framer Motion, Lucide icons |
| **Data** | PostgreSQL + Redis (Streams as a job queue) |
| **Auth** | JWT tokens, passwords hashed with Argon2, plus OAuth sign-in |
| **Shipping it** | Docker + Docker Compose, multi-region droplets |

---

## Try it yourself

### You'll need
- **Rust** (latest stable)
- **Bun** (or Node.js) for the frontend
- **Docker** & Docker Compose
- A **PostgreSQL** and **Redis** instance (Docker can spin these up for you)

### 1. Set up your environment
Create a `.env` file in the project root:

```env
# Database
DB_PASSWORD=your_password
DATABASE_URL=postgres://postgres:your_password@your_central_ip:5432/betteruptime

# Redis
REDIS_URL=redis://:your_redis_password@your_central_ip:6379
REDIS_PASSWORD=your_redis_password

# API & Frontend
API_PORT=3001
NEXT_PUBLIC_API_URL=http://your_central_ip:3001
JWT_SECRET=your_secret
JWT_EXPIRATION=86400

# Which region is this worker?
REGION_ID="worker-blr"
```

### 2. Run the backend (Rust)
Open three terminals — the brain needs all three running:

```bash
cd betterstack-rust

cargo run --bin api      # the API the dashboard talks to
cargo run --bin pusher   # the scheduler that hands out check-jobs
cargo run --bin worker   # a worker that does the actual pinging
```

### 3. Run the frontend (Next.js)
```bash
cd betterstack-frontend
bun install
bun run dev
```

Now open **http://localhost:3000**, create an account, add a site, and watch the graphs fill in. 🎉

---

## Going live with Docker

**Central server** (the brain — run this on your main box):
```bash
docker compose -f docker-compose.central.yml up -d --build
```

**Workers** (run this on each regional box — copy over `docker-compose.worker.yml` and its `.env.worker` first):
```bash
docker compose -f docker-compose.worker.yml up -d --build
```

Want a third region? Spin up another small server, set its `REGION_ID`, and start a worker. That's the whole "add a region" process.

> 📖 More detailed, step-by-step deployment notes live in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## What it does today

- ✅ **Real multi-region checks** — Bangalore + San Francisco, side by side
- ✅ **Cross-region confirmation** — a failure is re-tested elsewhere before it ever pages you
- ✅ **Live response-time graphs** — per region, over day / week / month
- ✅ **Uptime analytics** — 24h, 7d, 30d availability
- ✅ **Instant email alerts** — with the region, status code, and response time baked in
- ✅ **Incident tracking** — downtime is detected and recorded automatically

## On the roadmap

- 🔜 Slack / Discord / webhook alerts (email's just the start)
- 🔜 Public status pages
- 🔜 SSL & domain-expiry warnings
- 🔜 On-call schedules & escalation

---

## How the code is organized

```
BetterUptime/
├── betterstack-rust/        # the Rust backend (a Cargo workspace)
│   ├── api/                 #   the HTTP API (auth, sites, results)
│   ├── pusher/              #   the scheduler
│   ├── worker/              #   the regional ping workers
│   └── store/               #   shared database models + Redis helpers
├── betterstack-frontend/    # the Next.js dashboard ("Argus")
├── docker-compose.*.yml     # central + worker deployment setups
└── DEPLOYMENT.md            # the long-form deploy guide
```

---

## A note on the name

You'll see both **"BetterUptime"** and **"Argus"** around the repo. BetterUptime is the project; **Argus** is what the product calls itself in the UI — named after the hundred-eyed giant from Greek myth who never slept and saw everything. Felt right for an uptime monitor. 👀

---

## Built by

**Deepak Negi** — [GitHub](https://github.com/Deepak-negi11/Argus) · [X / Twitter](https://x.com/depx_____)

If you found this useful, a ⭐ on the repo genuinely makes my day. And if something's broken or confusing, open an issue — I'd love to hear about it.
