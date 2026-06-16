import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { LunaCharacter } from '../components/Characters';
import BottomNav from '../components/BottomNav';
import PageTransition from '../components/PageTransition';

const PROMPTS_BY_TIME = () => {
  const h = new Date().getHours();
  if (h < 12) return [
    "What's one thing you're looking forward to today?",
    "What would make today excellent?",
    "How are you feeling this morning, honestly?",
  ];
  if (h < 18) return [
    "What's been your highlight so far today?",
    "Is there anything you'd like to shift for the rest of the day?",
    "What are you grateful for right now?",
  ];
  return [
    "What's one thing you're proud of today?",
    "What would you do differently tomorrow?",
    "What made today meaningful?",
  ];
};

const AI_RESPONSES = [
  "That's a beautiful reflection. Remember — each day of effort is a step toward who you're becoming.",
  "I love your honesty. Growth often happens in the moments we least expect.",
  "Wonderful insight. You're building something real here, one day at a time.",
  "That vulnerability is strength. Keep showing up for yourself.",
  "Excellence isn't about perfection — it's about honest, daily effort. You're doing that.",
];

export default function ReflectPage() {
  const { state, updateState } = useContext(AppContext);
  const [entry, setEntry] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [view, setView] = useState('write'); // write | response | history
  const [lunaQuip, setLunaQuip] = useState('Write from the heart ✨');

  const prompts = PROMPTS_BY_TIME();
  const reflections = state.reflections || [];

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setSubmitting(true);
    setLunaQuip('Reading your heart... 🌙');
    await new Promise(r => setTimeout(r, 1400));

    const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    setAiResponse(response);

    const newReflection = {
      id: Date.now(),
      prompt: prompts[promptIdx],
      entry: entry.trim(),
      aiResponse: response,
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      mood: entry.length > 100 ? '💭' : entry.includes('happy') || entry.includes('great') || entry.includes('amazing') ? '😊' : '🌱',
    };
    updateState({ reflections: [newReflection, ...reflections] });
    setSubmitting(false);
    setView('response');
    setLunaQuip('Beautiful ✨');
  };

  return (
    <PageTransition>
      <div className="page" style={{ background: '#f9f5fc' }}>
        <div className="scroll-content" style={{ padding: '0 16px' }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ paddingTop: 56, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--lavender)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>🪞 Reflect</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--text-dark)' }}>Your journal</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{reflections.length} reflections written</p>
            </div>
            <LunaCharacter size={80} quip={lunaQuip} />
          </motion.div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 4 }}>
            {['write', 'history'].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{
                  flex: 1, padding: '8px 12px', border: 'none', borderRadius: 10, cursor: 'pointer',
                  background: view === v ? 'var(--white)' : 'transparent',
                  fontSize: 13, fontWeight: view === v ? 600 : 400, color: view === v ? 'var(--lavender)' : 'var(--text-muted)',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                  boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                }}>
                {v === 'write' ? '✍️ Write' : '📖 History'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* WRITE view */}
            {view === 'write' && (
              <motion.div key="write" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Prompt selector */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Today's prompt</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {prompts.map((p, i) => (
                      <motion.button key={i} onClick={() => setPromptIdx(i)} whileTap={{ scale: 0.98 }}
                        style={{
                          background: promptIdx === i ? 'var(--lavender-light)' : 'var(--white)',
                          border: `${promptIdx === i ? 2 : 0.5}px solid ${promptIdx === i ? 'var(--lavender)' : 'var(--border)'}`,
                          borderRadius: 14, padding: '12px 16px',
                          fontSize: 13, color: promptIdx === i ? 'var(--lavender)' : 'var(--text-mid)',
                          textAlign: 'left', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          fontStyle: 'italic', fontWeight: promptIdx === i ? 500 : 400,
                          transition: 'all 0.2s',
                        }}>
                        "{p}"
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Text area */}
                <div style={{ marginBottom: 16 }}>
                  <textarea
                    value={entry}
                    onChange={e => setEntry(e.target.value)}
                    placeholder="Write freely. Luna is listening..."
                    rows={6}
                    style={{
                      width: '100%', padding: '16px', border: '0.5px solid var(--border)',
                      borderRadius: 18, fontFamily: 'Inter, sans-serif', fontSize: 15,
                      color: 'var(--text-dark)', background: 'var(--white)', outline: 'none',
                      resize: 'none', lineHeight: 1.7, transition: 'border-color 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--lavender)'; setLunaQuip('I\'m listening... 🌙'); }}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{entry.length} characters</p>
                </div>

                <motion.button className="btn-primary" onClick={handleSubmit}
                  disabled={!entry.trim() || submitting} whileTap={{ scale: 0.97 }}
                  style={{ background: 'var(--lavender)', opacity: entry.trim() ? 1 : 0.5 }}>
                  <AnimatePresence mode="wait">
                    {submitting ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {[0,1,2].map(i => (
                          <motion.span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block' }}
                            animate={{ y: [0,-5,0] }} transition={{ duration: 0.5, delay: i*0.15, repeat: Infinity }} />
                        ))}
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Save reflection 🌙
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )}

            {/* RESPONSE view */}
            {view === 'response' && (
              <motion.div key="response" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="card" style={{ marginBottom: 14, padding: '24px 20px' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontStyle: 'italic' }}>You wrote:</p>
                  <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{entry}"</p>
                  <div style={{ background: 'var(--lavender-light)', borderRadius: 16, padding: '16px', border: '0.5px solid rgba(154,106,196,0.3)' }}>
                    <p style={{ fontSize: 11, color: 'var(--lavender)', fontWeight: 600, marginBottom: 8 }}>🌙 Luna reflects:</p>
                    <motion.p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, fontStyle: 'italic' }}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      "{aiResponse}"
                    </motion.p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" onClick={() => { setEntry(''); setView('write'); setLunaQuip('Write from the heart ✨'); }} style={{ flex: 1 }}>
                    Write again
                  </button>
                  <button className="btn-ghost" onClick={() => setView('history')} style={{ flex: 1 }}>
                    View history →
                  </button>
                </div>
              </motion.div>
            )}

            {/* HISTORY view */}
            {view === 'history' && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {reflections.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ fontSize: 32, marginBottom: 12 }}>🌱</p>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--text-dark)', marginBottom: 8 }}>Your journey starts here</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Write your first reflection to begin.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {reflections.map((r, i) => (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="card" style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 18 }}>{r.mood}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.date}</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--lavender)', fontStyle: 'italic', marginBottom: 6 }}>"{r.prompt}"</p>
                        <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>
                          {r.entry.length > 120 ? r.entry.slice(0, 120) + '...' : r.entry}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
