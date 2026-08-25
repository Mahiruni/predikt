import React, { useState, useEffect, useMemo } from "react";
import {
  Home,
  Target,
  Trophy,
  User,
  Flame,
  ChevronRight,
  Check,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Bell,
  Globe,
  LogOut,
  Crown,
  ArrowLeft,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const T = {
  ink: "#060D1B",
  surface: "#0D1729",
  surface2: "#142238",
  raised: "#1A2B45",
  line: "#1E3050",
  lineSoft: "#16253D",
  teal: "#2FD4C4",
  tealDim: "#1B7F78",
  blue: "#4C8DFF",
  amber: "#F5B84B",
  rose: "#FF6B6B",
  text: "#E8EEF7",
  muted: "#7E93B0",
  faint: "#4E6485",
};

const display = { fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" };
const body = { fontFamily: "'Inter', system-ui, sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const FIXTURES = [
  {
    id: 1,
    league: "Ethiopian Premier League",
    home: "Saint George",
    away: "Fasil Kenema",
    kick: "Sat 16:00",
    split: [54, 27, 19],
  },
  {
    id: 2,
    league: "Ethiopian Premier League",
    home: "Ethiopian Coffee",
    away: "Bahir Dar Kenema",
    kick: "Sat 16:00",
    split: [41, 31, 28],
  },
  {
    id: 3,
    league: "Ethiopian Premier League",
    home: "Adama City",
    away: "Mekelle 70 Enderta",
    kick: "Sun 15:30",
    split: [36, 30, 34],
  },
  {
    id: 4,
    league: "Premier League",
    home: "Arsenal",
    away: "Manchester City",
    kick: "Sat 18:30",
    split: [38, 24, 38],
  },
  {
    id: 5,
    league: "Premier League",
    home: "Liverpool",
    away: "Chelsea",
    kick: "Sun 17:00",
    split: [57, 22, 21],
  },
  {
    id: 6,
    league: "Premier League",
    home: "Tottenham",
    away: "Newcastle",
    kick: "Sun 19:30",
    split: [44, 26, 30],
  },
  {
    id: 7,
    league: "La Liga",
    home: "Real Madrid",
    away: "Sevilla",
    kick: "Sat 22:00",
    split: [71, 18, 11],
  },
  {
    id: 8,
    league: "La Liga",
    home: "Barcelona",
    away: "Atlético Madrid",
    kick: "Sun 22:00",
    split: [52, 25, 23],
  },
];

const LEADERS = [
  { rank: 1, name: "Yonatan A.", pts: 2841, move: 2, streak: 7 },
  { rank: 2, name: "Hanan M.", pts: 2790, move: -1, streak: 4 },
  { rank: 3, name: "Dawit T.", pts: 2764, move: 1, streak: 5 },
  { rank: 4, name: "Selam G.", pts: 2698, move: 0, streak: 2 },
  { rank: 5, name: "Bereket L.", pts: 2655, move: 3, streak: 6 },
  { rank: 6, name: "Meron K.", pts: 2601, move: -2, streak: 0 },
  { rank: 7, name: "Abel W.", pts: 2588, move: 1, streak: 3 },
];

const RECENT = [
  { match: "Saint George 2–0 Adama City", pick: "1", ok: true, pts: 40 },
  { match: "Arsenal 1–1 Brighton", pick: "1", ok: false, pts: 0 },
  { match: "Real Madrid 3–1 Girona", pick: "1", ok: true, pts: 25 },
  { match: "Ethiopian Coffee 0–1 Fasil Kenema", pick: "2", ok: true, pts: 55 },
];

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      * { -webkit-tap-highlight-color: transparent; }
      .pk-scroll::-webkit-scrollbar { display: none; }
      .pk-scroll { scrollbar-width: none; }
      @keyframes pkRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      .pk-rise { animation: pkRise .45s cubic-bezier(.2,.7,.3,1) both; }
      @media (prefers-reduced-motion: reduce) {
        .pk-rise { animation: none; }
        * { transition: none !important; }
      }
    `}</style>
  );
}

/** Signature element: segmented streak rail that drives the points multiplier. */
function StreakRail({ streak, compact = false }) {
  const segs = 6;
  const mult = (1 + Math.min(streak, segs) * 0.25).toFixed(2);
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Flame size={compact ? 14 : 16} style={{ color: streak > 0 ? T.amber : T.faint }} />
          <span
            className="uppercase"
            style={{ ...mono, fontSize: 10, letterSpacing: "0.14em", color: T.muted }}
          >
            Streak {streak} correct
          </span>
        </div>
        <span style={{ ...mono, fontSize: compact ? 13 : 15, color: T.teal, fontWeight: 600 }}>
          ×{mult}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: segs }).map((_, i) => {
          const on = i < streak;
          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-500"
              style={{
                height: compact ? 5 : 7,
                background: on
                  ? `linear-gradient(90deg, ${T.tealDim}, ${T.teal})`
                  : T.lineSoft,
                boxShadow: on ? `0 0 12px ${T.teal}55` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: T.surface,
        border: `1px solid ${T.line}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      style={{
        ...body,
        height: 54,
        fontSize: 16,
        fontWeight: 600,
        color: disabled ? T.faint : T.ink,
        background: disabled
          ? T.surface2
          : `linear-gradient(100deg, ${T.teal}, #52E0D0)`,
        border: `1px solid ${disabled ? T.line : "transparent"}`,
        boxShadow: disabled ? "none" : `0 8px 28px -10px ${T.teal}99`,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

function FreeToPlayNote({ tone = "quiet" }) {
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-3 py-2.5"
      style={{
        background: tone === "loud" ? `${T.teal}10` : "transparent",
        border: tone === "loud" ? `1px solid ${T.teal}30` : `1px solid ${T.lineSoft}`,
      }}
    >
      <Shield size={14} style={{ color: T.teal, marginTop: 2, flexShrink: 0 }} />
      <p style={{ ...body, fontSize: 11.5, lineHeight: 1.5, color: T.muted }}>
        Free to play. No deposits, no stakes, no cash prizes — you play for points and
        position on the table.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */
function Auth({ onEnter }) {
  const [phone, setPhone] = useState("");
  const valid = phone.replace(/\D/g, "").length === 9;

  return (
    <div
      className="min-h-screen flex flex-col px-6 pt-16 pb-8"
      style={{
        background: `radial-gradient(120% 70% at 50% -10%, #15385A 0%, ${T.ink} 55%)`,
      }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        <div className="pk-rise">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-8"
            style={{ background: `${T.teal}14`, border: `1px solid ${T.teal}33` }}
          >
            <div
              className="rounded-full"
              style={{ width: 6, height: 6, background: T.teal }}
            />
            <span
              className="uppercase"
              style={{ ...mono, fontSize: 10, letterSpacing: "0.16em", color: T.teal }}
            >
              Gameweek 12 open
            </span>
          </div>

          <h1
            style={{
              ...display,
              fontSize: 46,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: T.text,
            }}
          >
            Call the result.
            <br />
            <span style={{ color: T.teal }}>Climb the table.</span>
          </h1>

          <p
            className="mt-4 mb-9"
            style={{ ...body, fontSize: 15, lineHeight: 1.6, color: T.muted }}
          >
            Predict eight matches a week across the Ethiopian Premier League and Europe.
            Build a streak, multiply your points, and see where you land against the
            country.
          </p>
        </div>

        <div className="pk-rise" style={{ animationDelay: "80ms" }}>
          <label
            className="block mb-2 uppercase"
            style={{ ...mono, fontSize: 10, letterSpacing: "0.14em", color: T.faint }}
          >
            Phone number
          </label>
          <div
            className="flex items-center rounded-xl overflow-hidden mb-3"
            style={{ background: T.surface, border: `1px solid ${T.line}`, height: 54 }}
          >
            <div
              className="flex items-center h-full px-4"
              style={{
                borderRight: `1px solid ${T.line}`,
                ...mono,
                fontSize: 15,
                color: T.text,
              }}
            >
              +251
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              inputMode="numeric"
              placeholder="911 234 567"
              className="flex-1 h-full bg-transparent px-4 outline-none"
              style={{ ...mono, fontSize: 15, color: T.text }}
            />
          </div>

          <PrimaryButton onClick={onEnter} disabled={!valid}>
            Send code
          </PrimaryButton>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1" style={{ height: 1, background: T.line }} />
            <span style={{ ...mono, fontSize: 10, color: T.faint }}>OR</span>
            <div className="flex-1" style={{ height: 1, background: T.line }} />
          </div>

          <button
            onClick={onEnter}
            className="w-full rounded-xl flex items-center justify-center gap-2.5 transition-colors active:scale-[0.98]"
            style={{
              height: 48,
              background: T.surface,
              border: `1px solid ${T.line}`,
              ...body,
              fontSize: 14.5,
              fontWeight: 500,
              color: T.text,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto mt-8">
        <FreeToPlayNote tone="loud" />
        <p
          className="text-center mt-4"
          style={{ ...body, fontSize: 11, color: T.faint }}
        >
          18+ · By continuing you accept the Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Home dashboard                                                     */
/* ------------------------------------------------------------------ */
function Countdown() {
  const [left, setLeft] = useState(4 * 3600 + 12 * 60 + 8);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(left / 3600)).padStart(2, "0");
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return (
    <span style={{ ...mono, fontSize: 15, fontWeight: 600, color: T.amber }}>
      {h}:{m}:{s}
    </span>
  );
}

function StatTile({ label, value, sub, accent }) {
  return (
    <Card className="p-4">
      <p
        className="uppercase mb-2"
        style={{ ...mono, fontSize: 9.5, letterSpacing: "0.14em", color: T.faint }}
      >
        {label}
      </p>
      <p style={{ ...display, fontSize: 26, fontWeight: 700, color: accent || T.text, lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p className="mt-1.5" style={{ ...body, fontSize: 11.5, color: T.muted }}>
          {sub}
        </p>
      )}
    </Card>
  );
}

function HomeScreen({ go, picksMade, streak }) {
  return (
    <div className="px-5 pt-6 pb-32 pk-rise">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p style={{ ...body, fontSize: 13, color: T.muted }}>Selam,</p>
          <h2 style={{ ...display, fontSize: 24, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>
            Mahir
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            className="rounded-full flex items-center justify-center"
            style={{ width: 38, height: 38, background: T.surface, border: `1px solid ${T.line}` }}
          >
            <Bell size={16} style={{ color: T.muted }} />
          </button>
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              background: `linear-gradient(135deg, ${T.tealDim}, ${T.blue})`,
              ...display,
              fontWeight: 700,
              fontSize: 15,
              color: T.ink,
            }}
          >
            M
          </div>
        </div>
      </div>

      {/* Live gameweek card */}
      <Card
        className="p-5 mb-4"
        style={{
          background: `linear-gradient(155deg, ${T.surface2}, ${T.surface})`,
          borderColor: `${T.teal}33`,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p
              className="uppercase mb-1"
              style={{ ...mono, fontSize: 10, letterSpacing: "0.16em", color: T.teal }}
            >
              Gameweek 12
            </p>
            <p style={{ ...display, fontSize: 19, fontWeight: 700, color: T.text }}>
              {picksMade}/8 picks locked
            </p>
          </div>
          <div className="text-right">
            <p style={{ ...body, fontSize: 11, color: T.muted, marginBottom: 2 }}>Closes in</p>
            <Countdown />
          </div>
        </div>

        <div className="flex gap-1 mb-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-300"
              style={{ height: 4, background: i < picksMade ? T.teal : T.lineSoft }}
            />
          ))}
        </div>

        <PrimaryButton onClick={() => go("picks")} icon={Target}>
          {picksMade === 0 ? "Make your picks" : picksMade < 8 ? "Finish your picks" : "Review picks"}
        </PrimaryButton>
      </Card>

      {/* Streak rail — signature */}
      <Card className="p-5 mb-4">
        <StreakRail streak={streak} />
        <p className="mt-3" style={{ ...body, fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
          Every correct call adds 25% to your points multiplier. One wrong call resets it.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatTile label="Total points" value="2,412" sub="+120 this week" accent={T.teal} />
        <StatTile label="National rank" value="#38" sub="↑ 6 places" />
        <StatTile label="Accuracy" value="61%" sub="Last 40 picks" />
        <StatTile label="Best streak" value="9" sub="Set in GW7" accent={T.amber} />
      </div>

      {/* Leaderboard preview */}
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ ...display, fontSize: 16, fontWeight: 700, color: T.text }}>
            Top of the table
          </h3>
          <button
            onClick={() => go("board")}
            className="flex items-center gap-0.5"
            style={{ ...body, fontSize: 12.5, color: T.teal }}
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        {LEADERS.slice(0, 3).map((l) => (
          <div key={l.rank} className="flex items-center gap-3 py-2.5">
            <span style={{ ...mono, fontSize: 13, color: l.rank === 1 ? T.amber : T.faint, width: 18 }}>
              {l.rank}
            </span>
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 30, height: 30, background: T.raised, ...display, fontSize: 12, fontWeight: 700, color: T.muted }}
            >
              {l.name[0]}
            </div>
            <span className="flex-1" style={{ ...body, fontSize: 14, color: T.text }}>
              {l.name}
            </span>
            <span style={{ ...mono, fontSize: 13.5, color: T.text }}>{l.pts.toLocaleString()}</span>
          </div>
        ))}
      </Card>

      {/* Recent results */}
      <Card className="p-5 mb-5">
        <h3 className="mb-4" style={{ ...display, fontSize: 16, fontWeight: 700, color: T.text }}>
          Your last calls
        </h3>
        {RECENT.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3"
            style={{ borderTop: i ? `1px solid ${T.lineSoft}` : "none" }}
          >
            <div
              className="rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                width: 28,
                height: 28,
                background: r.ok ? `${T.teal}1A` : `${T.rose}14`,
              }}
            >
              {r.ok ? (
                <Check size={14} style={{ color: T.teal }} />
              ) : (
                <Minus size={14} style={{ color: T.rose }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ ...body, fontSize: 13.5, color: T.text }}>
                {r.match}
              </p>
              <p style={{ ...mono, fontSize: 10.5, color: T.faint }}>Picked {r.pick}</p>
            </div>
            <span style={{ ...mono, fontSize: 13, color: r.ok ? T.teal : T.faint }}>
              {r.ok ? `+${r.pts}` : "0"}
            </span>
          </div>
        ))}
      </Card>

      <FreeToPlayNote />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Picks                                                              */
/* ------------------------------------------------------------------ */
function MatchCard({ fx, pick, onPick, boosted, onBoost, boostUsed }) {
  const opts = [
    { key: "1", label: fx.home, short: "Home", pct: fx.split[0] },
    { key: "X", label: "Draw", short: "Draw", pct: fx.split[1] },
    { key: "2", label: fx.away, short: "Away", pct: fx.split[2] },
  ];

  return (
    <Card className="p-4 mb-3" style={{ borderColor: boosted ? `${T.amber}55` : T.line }}>
      <div className="flex items-center justify-between mb-3">
        <span
          className="uppercase truncate"
          style={{ ...mono, fontSize: 9.5, letterSpacing: "0.13em", color: T.faint }}
        >
          {fx.league}
        </span>
        <span style={{ ...mono, fontSize: 10.5, color: T.muted }}>{fx.kick}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="flex-1" style={{ ...display, fontSize: 15.5, fontWeight: 600, color: T.text }}>
          {fx.home}
        </span>
        <span style={{ ...mono, fontSize: 11, color: T.faint, padding: "0 10px" }}>v</span>
        <span className="flex-1 text-right" style={{ ...display, fontSize: 15.5, fontWeight: 600, color: T.text }}>
          {fx.away}
        </span>
      </div>

      <div className="flex gap-2">
        {opts.map((o) => {
          const on = pick === o.key;
          return (
            <button
              key={o.key}
              onClick={() => onPick(fx.id, o.key)}
              className="flex-1 rounded-xl transition-all active:scale-[0.97]"
              style={{
                height: 56,
                background: on ? `${T.teal}1F` : T.surface2,
                border: `1px solid ${on ? T.teal : T.lineSoft}`,
              }}
            >
              <div style={{ ...mono, fontSize: 15, fontWeight: 600, color: on ? T.teal : T.text }}>
                {o.key}
              </div>
              <div style={{ ...body, fontSize: 10, color: on ? T.teal : T.faint, marginTop: 1 }}>
                {o.pct}%
              </div>
            </button>
          );
        })}
      </div>

      {pick && (
        <button
          onClick={() => onBoost(fx.id)}
          disabled={boostUsed && !boosted}
          className="w-full mt-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          style={{
            height: 36,
            background: boosted ? `${T.amber}18` : "transparent",
            border: `1px solid ${boosted ? `${T.amber}66` : T.lineSoft}`,
            opacity: boostUsed && !boosted ? 0.35 : 1,
            cursor: boostUsed && !boosted ? "not-allowed" : "pointer",
          }}
        >
          <Zap size={13} style={{ color: boosted ? T.amber : T.faint }} />
          <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", color: boosted ? T.amber : T.faint }}>
            {boosted ? "BOOSTED ×2" : "BOOST THIS PICK"}
          </span>
        </button>
      )}
    </Card>
  );
}

function PicksScreen({ picks, setPicks, boost, setBoost, go, streak }) {
  const count = Object.keys(picks).length;

  const onPick = (id, key) =>
    setPicks((p) => ({ ...p, [id]: p[id] === key ? undefined : key }));

  const onBoost = (id) => setBoost((b) => (b === id ? null : id));

  const cleaned = useMemo(
    () => Object.fromEntries(Object.entries(picks).filter(([, v]) => v)),
    [picks]
  );
  const made = Object.keys(cleaned).length;

  return (
    <div className="pb-40">
      <div
        className="sticky top-0 z-10 px-5 pt-5 pb-4"
        style={{
          background: `${T.ink}F2`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${T.lineSoft}`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => go("home")}>
            <ArrowLeft size={20} style={{ color: T.muted }} />
          </button>
          <div className="flex-1">
            <h2 style={{ ...display, fontSize: 19, fontWeight: 700, color: T.text }}>
              Gameweek 12
            </h2>
            <p style={{ ...body, fontSize: 12, color: T.muted }}>
              {made} of 8 locked · closes Sat 15:00
            </p>
          </div>
          <Countdown />
        </div>
        <StreakRail streak={streak} compact />
      </div>

      <div className="px-5 pt-4">
        {FIXTURES.map((fx) => (
          <MatchCard
            key={fx.id}
            fx={fx}
            pick={cleaned[fx.id]}
            onPick={onPick}
            boosted={boost === fx.id}
            onBoost={onBoost}
            boostUsed={boost !== null}
          />
        ))}
        <FreeToPlayNote />
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-4 pb-24 max-w-md mx-auto"
        style={{
          background: `linear-gradient(to top, ${T.ink} 60%, transparent)`,
        }}
      >
        <PrimaryButton onClick={() => go("home")} disabled={made === 0} icon={Check}>
          {made === 8 ? "Lock in all 8 picks" : `Lock in ${made} pick${made === 1 ? "" : "s"}`}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Leaderboard                                                        */
/* ------------------------------------------------------------------ */
function BoardScreen() {
  const [tab, setTab] = useState("Weekly");
  const tabs = ["Weekly", "All-time", "Friends"];

  return (
    <div className="px-5 pt-6 pb-32 pk-rise">
      <h2 className="mb-1" style={{ ...display, fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>
        Leaderboard
      </h2>
      <p className="mb-5" style={{ ...body, fontSize: 13, color: T.muted }}>
        18,402 players · Gameweek 12
      </p>

      <div
        className="flex gap-1 p-1 rounded-xl mb-5"
        style={{ background: T.surface, border: `1px solid ${T.line}` }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-lg transition-all"
            style={{
              height: 38,
              background: tab === t ? T.raised : "transparent",
              ...body,
              fontSize: 13,
              fontWeight: 500,
              color: tab === t ? T.text : T.faint,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden mb-4">
        {LEADERS.map((l, i) => (
          <div
            key={l.rank}
            className="flex items-center gap-3 px-4 py-3.5"
            style={{ borderTop: i ? `1px solid ${T.lineSoft}` : "none" }}
          >
            <div className="flex items-center gap-1" style={{ width: 34 }}>
              {l.rank === 1 ? (
                <Crown size={15} style={{ color: T.amber }} />
              ) : (
                <span style={{ ...mono, fontSize: 13, color: T.faint }}>{l.rank}</span>
              )}
            </div>
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                width: 34,
                height: 34,
                background: T.raised,
                ...display,
                fontSize: 13,
                fontWeight: 700,
                color: T.muted,
              }}
            >
              {l.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ ...body, fontSize: 14.5, color: T.text }}>{l.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Flame size={10} style={{ color: l.streak > 3 ? T.amber : T.faint }} />
                <span style={{ ...mono, fontSize: 10, color: T.faint }}>{l.streak} streak</span>
              </div>
            </div>
            <div className="text-right">
              <p style={{ ...mono, fontSize: 14, color: T.text }}>{l.pts.toLocaleString()}</p>
              <div className="flex items-center justify-end gap-0.5">
                {l.move > 0 && <TrendingUp size={10} style={{ color: T.teal }} />}
                {l.move < 0 && <TrendingDown size={10} style={{ color: T.rose }} />}
                {l.move === 0 && <Minus size={10} style={{ color: T.faint }} />}
                <span
                  style={{
                    ...mono,
                    fontSize: 10,
                    color: l.move > 0 ? T.teal : l.move < 0 ? T.rose : T.faint,
                  }}
                >
                  {Math.abs(l.move)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Pinned own row */}
      <Card
        className="px-4 py-3.5 flex items-center gap-3"
        style={{ borderColor: `${T.teal}55`, background: `${T.teal}0D` }}
      >
        <span style={{ ...mono, fontSize: 13, color: T.teal, width: 34 }}>38</span>
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: 34,
            height: 34,
            background: `linear-gradient(135deg, ${T.tealDim}, ${T.blue})`,
            ...display,
            fontSize: 13,
            fontWeight: 700,
            color: T.ink,
          }}
        >
          M
        </div>
        <div className="flex-1">
          <p style={{ ...body, fontSize: 14.5, color: T.text }}>You</p>
          <span style={{ ...mono, fontSize: 10, color: T.teal }}>6 places to top 30</span>
        </div>
        <p style={{ ...mono, fontSize: 14, color: T.text }}>2,412</p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile                                                            */
/* ------------------------------------------------------------------ */
function ProfileScreen({ onSignOut }) {
  const rows = [
    { icon: Bell, label: "Notifications", value: "On" },
    { icon: Globe, label: "Language", value: "English" },
    { icon: Shield, label: "Privacy & data", value: "" },
  ];

  return (
    <div className="px-5 pt-6 pb-32 pk-rise">
      <div className="flex flex-col items-center mb-7">
        <div
          className="rounded-full flex items-center justify-center mb-3"
          style={{
            width: 76,
            height: 76,
            background: `linear-gradient(135deg, ${T.tealDim}, ${T.blue})`,
            ...display,
            fontSize: 30,
            fontWeight: 800,
            color: T.ink,
          }}
        >
          M
        </div>
        <h2 style={{ ...display, fontSize: 21, fontWeight: 700, color: T.text }}>Mahir</h2>
        <p style={{ ...mono, fontSize: 12.5, color: T.muted, marginTop: 2 }}>+251 911 234 567</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          ["Points", "2,412"],
          ["Rank", "#38"],
          ["Weeks", "11"],
        ].map(([k, v]) => (
          <Card key={k} className="py-4 text-center">
            <p style={{ ...display, fontSize: 20, fontWeight: 700, color: T.text }}>{v}</p>
            <p
              className="uppercase mt-1"
              style={{ ...mono, fontSize: 9, letterSpacing: "0.13em", color: T.faint }}
            >
              {k}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-5 mb-5">
        <h3 className="mb-4" style={{ ...display, fontSize: 16, fontWeight: 700, color: T.text }}>
          Badges
        </h3>
        <div className="flex gap-3">
          {[
            { icon: Flame, label: "9 streak", on: true },
            { icon: Target, label: "Perfect GW", on: true },
            { icon: Crown, label: "Top 10", on: false },
          ].map(({ icon: I, label, on }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="rounded-xl flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  background: on ? `${T.amber}16` : T.surface2,
                  border: `1px solid ${on ? `${T.amber}44` : T.lineSoft}`,
                }}
              >
                <I size={19} style={{ color: on ? T.amber : T.faint }} />
              </div>
              <span
                className="text-center"
                style={{ ...body, fontSize: 10.5, color: on ? T.muted : T.faint }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden mb-5">
        {rows.map(({ icon: I, label, value }, i) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-4 py-4"
            style={{ borderTop: i ? `1px solid ${T.lineSoft}` : "none" }}
          >
            <I size={17} style={{ color: T.muted }} />
            <span className="flex-1 text-left" style={{ ...body, fontSize: 14.5, color: T.text }}>
              {label}
            </span>
            <span style={{ ...body, fontSize: 13, color: T.faint }}>{value}</span>
            <ChevronRight size={16} style={{ color: T.faint }} />
          </button>
        ))}
      </Card>

      <FreeToPlayNote tone="loud" />

      <button
        onClick={onSignOut}
        className="w-full mt-4 rounded-xl flex items-center justify-center gap-2"
        style={{ height: 50, border: `1px solid ${T.line}`, ...body, fontSize: 14.5, color: T.rose }}
      >
        <LogOut size={16} /> Sign out
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer nav (X-style)                                               */
/* ------------------------------------------------------------------ */
function FooterNav({ screen, go, badge }) {
  const items = [
    { key: "home", icon: Home },
    { key: "picks", icon: Target, badge },
    { key: "board", icon: Trophy },
    { key: "profile", icon: User },
  ];
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex items-center"
      style={{
        height: 64,
        background: `${T.ink}F2`,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${T.lineSoft}`,
      }}
    >
      {items.map(({ key, icon: I, badge: b }) => {
        const on = screen === key;
        return (
          <button
            key={key}
            onClick={() => go(key)}
            className="flex-1 h-full flex items-center justify-center relative"
          >
            <I size={22} style={{ color: on ? T.teal : T.faint }} strokeWidth={on ? 2.3 : 1.9} />
            {b > 0 && (
              <span
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  top: 12,
                  right: "50%",
                  marginRight: -20,
                  minWidth: 17,
                  height: 17,
                  padding: "0 4px",
                  background: T.teal,
                  ...mono,
                  fontSize: 9.5,
                  fontWeight: 600,
                  color: T.ink,
                }}
              >
                {b}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
export default function Predikt() {
  const [screen, setScreen] = useState("auth");
  const [picks, setPicks] = useState({});
  const [boost, setBoost] = useState(null);
  const streak = 4;

  const made = Object.values(picks).filter(Boolean).length;
  const remaining = 8 - made;

  return (
    <div style={{ background: T.ink, minHeight: "100vh" }}>
      <Fonts />
      <div className="max-w-md mx-auto relative" style={{ minHeight: "100vh" }}>
        {screen === "auth" && <Auth onEnter={() => setScreen("home")} />}

        {screen === "home" && (
          <HomeScreen go={setScreen} picksMade={made} streak={streak} />
        )}
        {screen === "picks" && (
          <PicksScreen
            picks={picks}
            setPicks={setPicks}
            boost={boost}
            setBoost={setBoost}
            go={setScreen}
            streak={streak}
          />
        )}
        {screen === "board" && <BoardScreen />}
        {screen === "profile" && <ProfileScreen onSignOut={() => setScreen("auth")} />}

        {screen !== "auth" && (
          <FooterNav screen={screen} go={setScreen} badge={remaining > 0 ? remaining : 0} />
        )}
      </div>
    </div>
  );
}
