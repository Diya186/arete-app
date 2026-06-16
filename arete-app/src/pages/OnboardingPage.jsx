import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { SolCharacter } from '../components/Characters';

const STEPS = [
  { id: 'welcome',  title: 'Welcome to Arête',     subtitle: 'Let\'s set you up for excellence.' },
  { id: 'focus',   title: 'What do you want to\nimprove?', subtitle: 'Pick all that apply.' },
  { id: 'steps',   title: 'Daily step goal',        subtitle: 'How active do you want to be?' },
  { id: 'tasks',   title: 'Tasks per day',          subtitle: 'How many goals do you set daily?' },
  { id: 'ready',   title: 'You\'re all set!',       subtitle: 'Your journey to excellence starts now.' },
];

const FOCUS_OPTIONS = [
  { id: 'fitness',   icon: '🏃', label: 'Fitness',    color: '#fff0ec', border: '#f0c0b0' },
  { id: 'study',     icon: '📚', label: 'Study',      color: '#f0f4ff', border: '#c0caf0' },
  { id: 'mindset',   icon: '🧘', label: 'Mindset',    color: '#f5f0ff', border: '#c8b0f0' },
  { id: 'career',    icon: '💼', label: 'Career',     color: '#fff8e8', border: '#f0d890' },
  { id: 'creative',  icon: '🎨', label: 'Creative',   color: '#f0f8f5', border: '#a0d0c0' },
  { id: 'social',    icon: '🤝', label: 'Social',     color: '#fdf0f5', border: '#f0b0c8' },
];

const STEP_OPTIONS = [5000, 7500, 10000, 12500, 15000];
const TASK_OPTIONS = [3, 5, 7, 10];

const SOL_QUIPS_BY_STEP = {
  welcome: "I've been waiting for you! ☀️",
  focus:   "Pick what matters most! 🌟",
  steps:   "I believe in your legs! 🚶",
  tasks:   "Let's not overdo it... or do we? 😄",
  ready:   "HERE WE GOOOOO! 🎉",
};

export default function OnboardingPage() {
  const { state, updateState } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [focusAreas, setFocusAreas] = useState([]);
  const [stepGoal, setStepGoal] = useState(10000);
  const [taskGoal, setTaskGoal] = useState(5);
  const [direction, setDirection] = useState(1);

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const goNext = () => {
    setDirection(1);
    if (isLast) {
      updateState({
        focusAreas,
        stepGoal,
        tasks: Array.from({ length: taskGoal }, (_, i) => ({ id: i + 1, text: '', done: false })),
      });
      navigate('/home');
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    setCurrentStep(s => s - 1);
  };

  const toggleFocus = (id) => {
    setFocusAreas(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const canContinue = () => {
    if (step.id === 'focus') return focusAreas.length > 0;
    return true;
  };

  const slideVariants = {
    enter:  d => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   d => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.06)' }}>
        <motion.div
          style={{ height: '100%', background: 'var(--sage)', borderRadius: '0 2px 2px 0' }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Sol + step counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <motion.div key={currentStep} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <SolCharacter size={72} mood={isLast ? 'happy' : 'happy'} quip={SOL_QUIPS_BY_STEP[step.id]} />
          </motion.div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 8 }}>
            {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Animated content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Title */}
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 500, color: 'var(--text-dark)', marginBottom: 8, whiteSpace: 'pre-line', lineHeight: 1.3 }}>
              {step.title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>{step.subtitle}</p>

            {/* WELCOME */}
            {step.id === 'welcome' && (
              <motion.div
                style={{ background: 'var(--white)', borderRadius: 20, padding: 24, border: '0.5px solid var(--border)' }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              >
                <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                  <strong style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>Arête</strong> (ἀρετή) is the ancient Greek concept of living up to your fullest potential — in body, mind, and character.
                </p>
                <br />
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Every day you'll learn something new, complete your goals, track your movement, compete with friends, and reflect on your growth.
                </p>
              </motion.div>
            )}

            {/* FOCUS */}
            {step.id === 'focus' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {FOCUS_OPTIONS.map(({ id, icon, label, color, border }) => {
                  const selected = focusAreas.includes(id);
                  return (
                    <motion.button
                      key={id}
                      onClick={() => toggleFocus(id)}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: selected ? color : 'var(--white)',
                        border: `${selected ? 2 : 0.5}px solid ${selected ? border : 'var(--border)'}`,
                        borderRadius: 16, padding: '16px 12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{icon}</span>
                      <span style={{ fontSize: 12, fontWeight: selected ? 600 : 400, color: 'var(--text-dark)' }}>{label}</span>
                      {selected && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: 10, color: 'var(--sage)', fontWeight: 600 }}>✓</motion.span>}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* STEPS */}
            {step.id === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {STEP_OPTIONS.map(s => (
                  <motion.button
                    key={s}
                    onClick={() => setStepGoal(s)}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: stepGoal === s ? 'var(--sage-light)' : 'var(--white)',
                      border: `${stepGoal === s ? 2 : 0.5}px solid ${stepGoal === s ? 'var(--sage)' : 'var(--border)'}`,
                      borderRadius: 14, padding: '14px 20px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: stepGoal === s ? 600 : 400, color: stepGoal === s ? 'var(--sage-dark)' : 'var(--text-dark)' }}>
                      {s.toLocaleString()} steps
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {s <= 5000 ? '🧘 Light' : s <= 7500 ? '🚶 Moderate' : s <= 10000 ? '🏃 Active' : s <= 12500 ? '⚡ Energetic' : '🔥 Beast mode'}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* TASKS */}
            {step.id === 'tasks' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {TASK_OPTIONS.map(t => (
                  <motion.button
                    key={t}
                    onClick={() => setTaskGoal(t)}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: taskGoal === t ? 'var(--blue-light)' : 'var(--white)',
                      border: `${taskGoal === t ? 2 : 0.5}px solid ${taskGoal === t ? 'var(--blue)' : 'var(--border)'}`,
                      borderRadius: 16, padding: '20px 12px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 500, color: taskGoal === t ? 'var(--blue)' : 'var(--text-dark)' }}>{t}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>tasks/day</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* READY */}
            {step.id === 'ready' && (
              <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {[
                  { icon: '🧠', label: 'Word of the day',       color: 'var(--gold-light)'     },
                  { icon: '✅', label: `${taskGoal} tasks set`,  color: 'var(--blue-light)'     },
                  { icon: '🏃', label: `${stepGoal.toLocaleString()} step goal`, color: 'var(--coral-light)' },
                  { icon: '🏆', label: 'Compete with friends',  color: 'var(--lavender-light)' },
                  { icon: '🪞', label: 'Evening reflection',    color: 'var(--sage-light)'     },
                ].map(({ icon, label, color }, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    style={{ background: color, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)' }}>{label}</span>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}
                      style={{ marginLeft: 'auto', color: 'var(--sage)', fontWeight: 700 }}>✓</motion.span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
          {currentStep > 0 && (
            <motion.button className="btn-ghost" onClick={goBack} whileTap={{ scale: 0.97 }} style={{ flex: '0 0 auto', width: 48 }}>
              ←
            </motion.button>
          )}
          <motion.button
            className="btn-primary"
            onClick={goNext}
            disabled={!canContinue()}
            whileTap={{ scale: 0.97 }}
            style={{ flex: 1, opacity: canContinue() ? 1 : 0.5 }}
          >
            {isLast ? '✨ Start my journey' : 'Continue →'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
