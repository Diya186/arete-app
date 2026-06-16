import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { AppContext } from '../App';
import { SolCharacter } from '../components/Characters';
import BottomNav from '../components/BottomNav';
import PageTransition from '../components/PageTransition';

const CARD_COLORS = [
  { bg: '#f0f7f4', accent: 'var(--sage)',     border: '#d0e8df' },
  { bg: '#fff8e8', accent: 'var(--gold)',      border: '#f0d890' },
  { bg: '#f0f4ff', accent: 'var(--blue)',      border: '#c0caf0' },
  { bg: '#fff0ec', accent: 'var(--coral)',     border: '#f0c0b0' },
  { bg: '#f5f0ff', accent: 'var(--lavender)', border: '#c8b0f0' },
];

function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 5)  return { text: `Sleep, ${name}... 😴`, sub: 'You shouldn\'t be up this late.' };
  if (h < 12) return { text: `Good morning, ${name} ☀️`, sub: 'Ready to be excellent today?' };
  if (h < 17) return { text: `Good afternoon, ${name} 🌤️`, sub: 'How\'s the day going?' };
  if (h < 21) return { text: `Good evening, ${name} 🌙`, sub: 'Time to wind down and reflect.' };
  return { text: `Late night grind, ${name} 🌑`, sub: 'Make sure to rest. Excellence needs recovery.' };
}

/* ── Swipeable story card ── */
function StoryCard({ idx, total, title, icon, color, children, onSwipeLeft, onSwipeRight }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-6, 6]);
  const cardOpacity = useTransform(x, [-120, 0, 120], [0.6, 1, 0.6]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      style={{ x, rotate, opacity: cardOpacity }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -60) onSwipeLeft?.();
        if (info.offset.x >  60) onSwipeRight?.();
      }}
    >
      <div style={{
        background: color.bg, borderRadius: 24, padding: '22px 20px',
        border: `0.5px solid ${color.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        cursor: 'grab',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: color.accent, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {icon} {title}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)' }}>{idx + 1}/{total}</span>
        </div>
        {children}
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 14 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              height: 3, borderRadius: 2,
              width: i === idx ? 18 : 6,
              background: i === idx ? color.accent : 'rgba(0,0,0,0.12)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── XP animation ── */
function XPBar({ xp }) {
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--sage-dark)' }}>Level {level}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{progress}/100 XP</span>
      </div>
      <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          style={{ height: '100%', background: 'var(--sage)', borderRadius: 3 }}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();
  const [cardIdx, setCardIdx] = useState(0);
  const { text: greeting, sub: greetingSub } = getGreeting(state.user?.name || 'friend');

  const tasksTotal = state.tasks?.length || 5;
  const tasksDone  = state.tasks?.filter(t => t.done).length || 0;
  const stepsProgress = Math.min((state.steps / state.stepGoal) * 100, 100);

  const STORY_CARDS = [
    {
      title: 'Your streak', icon: '🔥',
      color: CARD_COLORS[0],
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 42, color: 'var(--coral)', lineHeight: 1 }}>
              {state.streak}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>days</span>
          </div>
          <XPBar xp={state.xp} />
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <span className="xp-pill">+{state.xp} XP total</span>
            <span className="streak-badge">🔥 {state.streak} day streak</span>
          </div>
        </div>
      ),
      action: null,
    },
    {
      title: 'Word of the day', icon: '🧠',
      color: CARD_COLORS[1],
      content: (
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--text-dark)', marginBottom: 4 }}>Sonder</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>noun · /ˈsɒn.dər/</div>
          <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>The realization that every passerby has a life as vivid and complex as your own.</div>
        </div>
      ),
      action: () => navigate('/learn'),
    },
    {
      title: 'Tasks', icon: '✅',
      color: CARD_COLORS[2],
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--blue)' }}>{tasksDone}</span>
            <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ {tasksTotal} done</span>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tasksTotal > 0 ? (tasksDone / tasksTotal) * 100 : 0}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ height: '100%', background: 'var(--blue)', borderRadius: 4 }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {tasksDone === tasksTotal ? '🎉 All done! Amazing!' : `${tasksTotal - tasksDone} tasks remaining`}
          </p>
        </div>
      ),
      action: () => navigate('/do'),
    },
    {
      title: 'Move', icon: '🏃',
      color: CARD_COLORS[3],
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--coral)' }}>
              {(state.steps || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>steps</span>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stepsProgress}%` }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ height: '100%', background: 'var(--coral)', borderRadius: 4 }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Goal: {(state.stepGoal || 10000).toLocaleString()} steps · {Math.round(stepsProgress)}%</p>
        </div>
      ),
      action: () => navigate('/move'),
    },
    {
      title: 'Friends', icon: '🏆',
      color: CARD_COLORS[4],
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...(state.friends || []), { id: 'me', name: state.user?.name || 'You', xp: state.xp }]
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 3)
            .map((f, i) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14 }}>{['🥇','🥈','🥉'][i]}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: f.id === 'me' ? 600 : 400, color: f.id === 'me' ? 'var(--lavender)' : 'var(--text-dark)' }}>{f.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.xp} XP</span>
              </div>
            ))
          }
        </div>
      ),
      action: () => navigate('/compete'),
    },
  ];

  return (
    <PageTransition>
      <div className="page" style={{ background: 'var(--cream)' }}>
        <div className="scroll-content" style={{ padding: '0 16px' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ paddingTop: 56, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 500, color: 'var(--text-dark)', lineHeight: 1.3 }}>
                {greeting}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{greetingSub}</p>
            </div>
            <SolCharacter size={60} mood="happy" />
          </motion.div>

          {/* Story cards — swipeable */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 20 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={cardIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <StoryCard
                  idx={cardIdx}
                  total={STORY_CARDS.length}
                  {...STORY_CARDS[cardIdx]}
                  onSwipeLeft={() => setCardIdx(i => Math.min(i + 1, STORY_CARDS.length - 1))}
                  onSwipeRight={() => setCardIdx(i => Math.max(i - 1, 0))}
                >
                  {STORY_CARDS[cardIdx].content}
                </StoryCard>
              </motion.div>
            </AnimatePresence>

            {STORY_CARDS[cardIdx].action && (
              <motion.button
                className="btn-ghost"
                onClick={STORY_CARDS[cardIdx].action}
                whileTap={{ scale: 0.97 }}
                style={{ marginTop: 10, fontSize: 13, padding: '10px 20px' }}
              >
                Go to {STORY_CARDS[cardIdx].title} →
              </motion.button>
            )}

            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              ← swipe to explore your day →
            </p>
          </motion.div>

          {/* Quick action grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Quick actions</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { icon: '🧠', label: 'Learn today\'s word',   path: '/learn',   color: 'var(--gold-light)'     },
                { icon: '✅', label: 'Check off tasks',        path: '/do',      color: 'var(--blue-light)'     },
                { icon: '🏃', label: 'Log a workout',          path: '/move',    color: 'var(--coral-light)'    },
                { icon: '🪞', label: 'Reflect on your day',   path: '/reflect', color: 'var(--lavender-light)' },
              ].map(({ icon, label, path, color }) => (
                <motion.button
                  key={path}
                  onClick={() => navigate(path)}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ y: -2 }}
                  style={{
                    background: color, border: '0.5px solid var(--border)',
                    borderRadius: 16, padding: '16px 14px',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    gap: 6, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-dark)', lineHeight: 1.3 }}>{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Arête brand footer */}
          <div style={{ textAlign: 'center', paddingBottom: 8 }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 12, color: 'var(--text-muted)' }}>
              excellence, daily
            </span>
          </div>

        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
