import { useState, useEffect } from 'react';

/**
 * A looping, self-contained "peek inside a watch party" — friends watching in
 * sync, floating emoji reactions, live chat and a talking (voice) member.
 * Pure CSS/RAF animation, no external assets, so it always renders.
 */

const CHAT_LINES = [
  { name: 'Maya', grad: 'from-pink-500 to-rose-500',   text: 'lmaooo did you SEE that 😂' },
  { name: 'Jay',  grad: 'from-sky-400 to-indigo-500',  text: 'nooo pause I missed it 😭' },
  { name: 'Aria', grad: 'from-violet-400 to-fuchsia-500', text: 'this scene >>> 🔥' },
];

const WATCHERS = [
  { i: 'M', grad: 'from-pink-500 to-rose-500' },
  { i: 'J', grad: 'from-sky-400 to-indigo-500', speaking: true },
  { i: 'A', grad: 'from-emerald-400 to-teal-500', online: true },
  { i: 'K', grad: 'from-violet-400 to-fuchsia-500' },
];

const FLOATERS = [
  { e: '❤️', left: '16%', delay: '0s',   dur: '3.2s' },
  { e: '😂', left: '36%', delay: '0.9s', dur: '2.8s' },
  { e: '🔥', left: '60%', delay: '1.7s', dur: '3.5s' },
  { e: '✨', left: '80%', delay: '2.4s', dur: '3.0s' },
  { e: '🎉', left: '48%', delay: '1.2s', dur: '3.7s' },
];

function Avatar({ i, grad, speaking, online, ring = false }) {
  return (
    <div className={`relative ${speaking ? 'animate-ring-pulse rounded-full' : ''}`}>
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad}
                       flex items-center justify-center text-[11px] font-bold text-white
                       ${ring ? 'ring-2 ring-surface' : ''}`}>
        {i}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                         bg-online border-2 border-surface" />
      )}
      {speaking && (
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full
                         bg-info border-2 border-surface flex items-center justify-center">
          <svg width="7" height="7" viewBox="0 0 24 24" fill="white">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z" />
          </svg>
        </span>
      )}
    </div>
  );
}

export default function LivingRoomDemo() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % CHAT_LINES.length), 2600);
    return () => clearInterval(t);
  }, []);

  const chat = CHAT_LINES[idx];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Soft glow behind the card */}
      <div className="absolute -inset-6 bg-screen-glow opacity-80 blur-2xl pointer-events-none" />

      <div className="relative card shadow-cinema border-white/10 p-3 sm:p-4
                      bg-gradient-to-b from-surface to-void">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse-dot" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-danger">Live</span>
            <span className="text-xs text-sub font-medium ml-1">Friday Night 🍿</span>
          </div>
          <div className="flex -space-x-2">
            {WATCHERS.slice(0, 3).map((w) => (
              <Avatar key={w.i} {...w} ring speaking={false} online={false} />
            ))}
          </div>
        </div>

        {/* "Video" stage */}
        <div className="relative rounded-xl overflow-hidden aspect-video
                        bg-[radial-gradient(ellipse_at_30%_20%,#2a2140_0%,#0b0d14_70%)]
                        border border-white/10">
          <div className="absolute inset-0 bg-cinema-grain opacity-60 mix-blend-overlay" />

          {/* Now playing label */}
          <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-bright/80">
              Now playing
            </span>
          </div>

          {/* Center play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-amber/90 shadow-glow-amber
                            flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0e1118">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Floating reactions */}
          {FLOATERS.map((f, k) => (
            <span
              key={k}
              className="animate-float-up absolute bottom-10 text-xl select-none"
              style={{
                left: f.left,
                animationDelay: f.delay,
                animationDuration: f.dur,
                animationIterationCount: 'infinite',
              }}
            >
              {f.e}
            </span>
          ))}

          {/* Progress bar */}
          <div className="absolute bottom-0 inset-x-0 p-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 h-1 rounded-full bg-white/15 overflow-visible">
                <div className="animate-wp-progress absolute left-0 top-0 h-full rounded-full bg-amber">
                  <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-amber
                                   shadow-glow-sm" />
                </div>
              </div>
              <span className="text-[10px] font-mono text-bright/70">1:24</span>
            </div>
          </div>
        </div>

        {/* Watchers + in-sync */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {WATCHERS.map((w) => (
                <Avatar key={w.i} {...w} ring />
              ))}
            </div>
            <span className="text-[11px] text-dim">+2 watching</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse-dot" />
            <span className="text-[11px] font-medium text-online">In sync</span>
          </div>
        </div>

        {/* Live chat bubble (cycles) */}
        <div className="mt-2 h-9 px-1">
          <div key={idx} className="animate-slide-up flex items-center gap-2">
            <div className={`w-6 h-6 shrink-0 rounded-full bg-gradient-to-br ${chat.grad}
                            flex items-center justify-center text-[10px] font-bold text-white`}>
              {chat.name[0]}
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-raised border border-border
                            px-3 py-1.5 text-xs text-base">
              <span className="text-sub font-medium mr-1">{chat.name}</span>
              {chat.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
