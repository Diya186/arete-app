import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { SageCharacter } from '../components/Characters';
import BottomNav from '../components/BottomNav';
import PageTransition from '../components/PageTransition';

const WORDS = [
  {
    word: 'Sonder',       pos: 'noun',      phonetic: '/ˈsɒn.dər/',
    def: 'The realization that every passerby has a life as vivid and complex as your own.',
    example: '"She felt a wave of sonder watching strangers rush through the station."',
    options: ['A deep longing for the past', 'Awareness of others\' inner lives', 'The joy of solving a puzzle'],
    answer: 1,
  },
  {
    word: 'Meraki',       pos: 'noun',      phonetic: '/meˈrɑːki/',
    def: 'Doing something with soul, creativity, and love — leaving a piece of yourself in your work.',
    example: '"She cooked with meraki, turning a simple meal into an act of love."',
    options: ['Doing work carelessly', 'Pouring your soul into what you do', 'A Greek musical tradition'],
    answer: 1,
  },
  {
    word: 'Eudaimonia',   pos: 'noun',      phonetic: '/juːˌdaɪˈməʊniə/',
    def: 'The state of flourishing and living a life of virtue and meaning — Aristotle\'s idea of true happiness.',
    example: '"He found eudaimonia not in pleasure, but in living purposefully."',
    options: ['Superficial pleasure', 'A Greek city-state', 'Deep human flourishing'],
    answer: 2,
  },
];

// Get today's word based on day of year
const todayWord = WORDS[Math.floor(new Date().getDay()) % WORDS.length];

export default function LearnPage() {
  const { addXP, state, updateState } = useContext(AppContext);
  const [phase, setPhase] = useState(state.wordLearned ? 'done' : 'read'); // read | quiz | result | done
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [sageExcited, setSageExcited] = useState(false);
  const [sageQuip, setSageQuip] = useState('Learn something new! 📖');

  const word = todayWord;

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    const isCorrect = idx === word.answer;
    setSelected(idx);
    setCorrect(isCorrect);
    setSageExcited(isCorrect);
    setSageQuip(isCorrect ? 'Brilliant! +20 XP! 🎉' : 'Hmm, not quite... 🤔');
    setTimeout(() => {
      setPhase('result');
      if (isCorrect) {
        addXP(20);
        updateState({ wordLearned: true });
      }
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="page" style={{ background: '#faf8f5' }}>
        <div className="scroll-content" style={{ padding: '0 16px' }}>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ paddingTop: 56, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <p style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>🧠 Learn</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 500, color: 'var(--text-dark)' }}>Word of the day</h2>
            </div>
            <SageCharacter size={72} excited={sageExcited} quip={sageQuip} />
          </motion.div>

          <AnimatePresence mode="wait">

            {/* READ phase */}
            {phase === 'read' && (
              <motion.div key="read" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="card" style={{ marginBottom: 14, textAlign: 'center', padding: '32px 24px' }}>
                  <motion.h1
                    style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 500, color: 'var(--text-dark)', marginBottom: 8 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    {word.word}
                  </motion.h1>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{word.pos} · {word.phonetic}</p>
                  <div style={{ height: 0.5, background: 'var(--border)', margin: '16px 0' }} />
                  <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 16 }}>{word.def}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>{word.example}</p>
                </div>

                {/* Fun word stats */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  {[
                    { label: 'Origin', val: 'Modern' },
                    { label: 'Rarity', val: '⭐⭐⭐' },
                    { label: 'XP value', val: '+20' },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ flex: 1, background: 'var(--white)', borderRadius: 14, padding: '12px 8px', border: '0.5px solid var(--border)', textAlign: 'center' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{val}</p>
                    </div>
                  ))}
                </div>

                <motion.button className="btn-primary" onClick={() => { setPhase('quiz'); setSageQuip('Quiz time! 🧪'); }}
                  whileTap={{ scale: 0.97 }}>
                  Take the quiz → (+20 XP)
                </motion.button>
              </motion.div>
            )}

            {/* QUIZ phase */}
            {phase === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                <div className="card" style={{ marginBottom: 16, padding: '24px 20px' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>What does</p>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 500, color: 'var(--text-dark)', marginBottom: 6 }}>
                    "{word.word}"
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>mean?</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {word.options.map((opt, i) => {
                    let bg = 'var(--white)', border = '0.5px solid var(--border)', color = 'var(--text-dark)';
                    if (selected !== null) {
                      if (i === word.answer) { bg = 'var(--sage-light)'; border = '2px solid var(--sage)'; color = 'var(--sage-dark)'; }
                      else if (i === selected && !correct) { bg = '#fff0f0'; border = '2px solid #e84a4a'; color = '#a02020'; }
                    }
                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        whileTap={selected === null ? { scale: 0.97 } : {}}
                        style={{
                          background: bg, border, borderRadius: 16, padding: '16px 18px',
                          fontSize: 14, color, textAlign: 'left', cursor: selected === null ? 'pointer' : 'default',
                          transition: 'all 0.25s', fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        <span style={{ fontWeight: 500, marginRight: 10, opacity: 0.4 }}>{['A','B','C'][i]}</span>
                        {opt}
                        {selected !== null && i === word.answer && ' ✓'}
                        {selected !== null && i === selected && !correct && ' ✗'}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* RESULT phase */}
            {phase === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <motion.div
                  className="card"
                  style={{ textAlign: 'center', padding: '40px 24px', marginBottom: 16, background: correct ? 'var(--sage-light)' : '#fff0f0' }}
                  animate={correct ? { boxShadow: ['0 0 0 0 rgba(74,124,107,0)', '0 0 0 12px rgba(74,124,107,0.1)', '0 0 0 0 rgba(74,124,107,0)'] } : {}}
                  transition={{ duration: 1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    style={{ fontSize: 56, marginBottom: 12 }}
                  >
                    {correct ? '🎉' : '📖'}
                  </motion.div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: correct ? 'var(--sage-dark)' : '#a02020', marginBottom: 8 }}>
                    {correct ? 'Excellent!' : 'Not quite!'}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 16 }}>
                    {correct
                      ? `+20 XP earned! Keep building your vocabulary.`
                      : `The correct answer was: "${word.options[word.answer]}"`
                    }
                  </p>
                  {correct && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <span className="xp-pill" style={{ fontSize: 14, padding: '6px 16px' }}>+20 XP</span>
                    </motion.div>
                  )}
                </motion.div>

                <button className="btn-primary" onClick={() => setPhase('done')}>
                  Continue learning →
                </button>
              </motion.div>
            )}

            {/* DONE phase */}
            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="card" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Today's word</p>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--text-dark)', marginBottom: 8 }}>{word.word}</h2>
                  <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6 }}>{word.def}</p>
                  <div style={{ marginTop: 16 }}>
                    <span className="xp-pill">✓ Completed today</span>
                  </div>
                </div>
                <div style={{ background: 'var(--gold-light)', borderRadius: 16, padding: 16, border: '0.5px solid #f0d890' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', marginBottom: 4 }}>Come back tomorrow</p>
                  <p style={{ fontSize: 13, color: 'var(--text-mid)' }}>A fresh word awaits. Stay curious.</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
