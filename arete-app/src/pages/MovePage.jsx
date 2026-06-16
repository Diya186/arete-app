import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { BlazeCharacter } from '../components/Characters';
import BottomNav from '../components/BottomNav';
import PageTransition from '../components/PageTransition';

const WORKOUT_TYPES = [
  { id: 'run',     icon: '🏃', label: 'Run',      color: 'var(--coral-light)',    border: '#f0c0b0' },
  { id: 'walk',    icon: '🚶', label: 'Walk',     color: 'var(--sage-light)',     border: '#c0e0d0' },
  { id: 'cycle',   icon: '🚴', label: 'Cycle',    color: 'var(--blue-light)',     border: '#c0caf0' },
  { id: 'gym',     icon: '🏋️', label: 'Gym',      color: 'var(--gold-light)',     border: '#f0d890' },
  { id: 'swim',    icon: '🏊', label: 'Swim',     color: 'var(--blue-light)',     border: '#90c0f0' },
  { id: 'yoga',    icon: '🧘', label: 'Yoga',     color: 'var(--lavender-light)', border: '#c8b0f0' },
];

function StatBadge({ label, value, unit, color }) {
  return (
    <div style={{ flex: 1, background: 'var(--white)', borderRadius: 14, padding: '14px 12px', border: '0.5px solid var(--border)', textAlign: 'center' }}>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: color || 'var(--text-dark)', fontWeight: 500 }}>{value}</p>
      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{unit}</p>
    </div>
  );
}

/* Simple animated pulse for active timer */
function PulseRing() {
  return (
    <motion.div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid var(--coral)', opacity: 0 }}
      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  );
}

export default function MovePage() {
  const { state, updateState, addXP } = useContext(AppContext);
  const [view, setView] = useState('home'); // home | log | active | history
  const [workoutType, setWorkoutType] = useState('run');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [blazeRunning, setBlazeRunning] = useState(false);
  const [blazeQuip, setBlazeQuip] = useState('Ready to run! 🐆');
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  const workouts = state.workouts || [];
  const totalKm = workouts.reduce((acc, w) => acc + (parseFloat(w.distance) || 0), 0);
  const totalCal = workouts.reduce((acc, w) => acc + (parseInt(w.calories) || 0), 0);

  // Timer
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const calcCalories = (dist, type) => {
    const base = { run: 60, walk: 30, cycle: 40, gym: 50, swim: 55, yoga: 20 };
    return Math.round((parseFloat(dist) || 0) * (base[type] || 50));
  };

  const calcPace = (dist, dur) => {
    const d = parseFloat(dist), m = parseInt(dur);
    if (!d || !m) return '--';
    const pace = m / d;
    return `${Math.floor(pace)}:${String(Math.round((pace % 1) * 60)).padStart(2,'0')}/km`;
  };

  const logWorkout = () => {
    if (!distance || !duration) return;
    const calories = calcCalories(distance, workoutType);
    const workout = {
      id: Date.now(),
      type: workoutType,
      distance: parseFloat(distance),
      duration: parseInt(duration),
      calories,
      pace: calcPace(distance, duration),
      date: new Date().toLocaleDateString(),
    };
    updateState({ workouts: [workout, ...workouts] });
    addXP(25);
    setBlazeQuip('BEAST MODE! +25 XP! 🔥');
    setView('home');
    setDistance(''); setDuration('');
  };

  const startLiveSession = () => {
    setView('active');
    setTimerActive(true);
    setBlazeRunning(true);
    setBlazeQuip('Go go go! 🐆💨');
  };

  const endLiveSession = () => {
    setTimerActive(false);
    setBlazeRunning(false);
    const dist = ((timer / 60) * 0.1).toFixed(2); // rough estimate
    setDistance(dist);
    setDuration(String(Math.round(timer / 60)));
    setView('log');
    setBlazeQuip('Great session! Log it! 💪');
  };

  return (
    <PageTransition>
      <div className="page" style={{ background: 'var(--coral-light)' }}>
        <div className="scroll-content" style={{ padding: '0 16px' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ paddingTop: 56, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <p style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>🏃 Move</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--text-dark)' }}>Your movement</h2>
            </div>
            <BlazeCharacter size={80} running={blazeRunning} quip={blazeQuip} />
          </motion.div>

          <AnimatePresence mode="wait">

            {/* HOME view */}
            {view === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Steps progress */}
                <div className="card" style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>Today's steps</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--coral)', lineHeight: 1 }}>
                      {(state.steps || 0).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/ {(state.stepGoal || 10000).toLocaleString()}</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((state.steps || 0) / (state.stepGoal || 10000)) * 100, 100)}%` }}
                      transition={{ duration: 1.2 }}
                      style={{ height: '100%', background: 'var(--coral)', borderRadius: 4 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateState({ steps: Math.min((state.steps || 0) + 1000, 20000) })}
                      style={{ fontSize: 12, background: 'var(--coral-light)', border: '0.5px solid #f0c0b0', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: 'var(--text-dark)' }}>
                      + 1,000 steps
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateState({ steps: Math.min((state.steps || 0) + 5000, 20000) })}
                      style={{ fontSize: 12, background: 'var(--coral-light)', border: '0.5px solid #f0c0b0', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: 'var(--text-dark)' }}>
                      + 5,000 steps
                    </motion.button>
                  </div>
                </div>

                {/* All-time stats */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <StatBadge label="Total km" value={totalKm.toFixed(1)} unit="kilometres" color="var(--coral)" />
                  <StatBadge label="Calories" value={totalCal.toLocaleString()} unit="kcal burned" color="var(--sage)" />
                  <StatBadge label="Workouts" value={workouts.length} unit="sessions" color="var(--lavender)" />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <motion.button className="btn-primary" whileTap={{ scale: 0.97 }} onClick={startLiveSession} style={{ flex: 1 }}>
                    ▶ Start session
                  </motion.button>
                  <motion.button className="btn-ghost" whileTap={{ scale: 0.97 }} onClick={() => setView('log')} style={{ flex: 1 }}>
                    + Log workout
                  </motion.button>
                </div>

                {/* Recent workouts */}
                {workouts.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Recent</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {workouts.slice(0, 5).map(w => {
                        const wt = WORKOUT_TYPES.find(t => t.id === w.type) || WORKOUT_TYPES[0];
                        return (
                          <div key={w.id} style={{ background: 'var(--white)', borderRadius: 14, padding: '14px 16px', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 24 }}>{wt.icon}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)' }}>{wt.label}</p>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.date}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--coral)' }}>{w.distance} km</p>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.calories} kcal</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ACTIVE SESSION view */}
            {view === 'active' && (
              <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center' }}>
                <div className="card" style={{ padding: '40px 24px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                  <motion.div animate={{ background: ['rgba(232,135,90,0.05)', 'rgba(232,135,90,0.12)', 'rgba(232,135,90,0.05)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', inset: 0, borderRadius: 20 }}
                  />
                  <p style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16, position: 'relative' }}>● Live session</p>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <PulseRing />
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 56, color: 'var(--text-dark)', position: 'relative' }}>
                      {formatTime(timer)}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Keep going, Blaze is watching! 🐆</p>
                  <motion.button className="btn-primary" onClick={endLiveSession} whileTap={{ scale: 0.97 }}
                    style={{ background: '#e84a4a' }}>
                    ⏹ End session
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* LOG view */}
            {view === 'log' && (
              <motion.div key="log" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card" style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 14 }}>Workout type</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                    {WORKOUT_TYPES.map(wt => (
                      <motion.button key={wt.id} onClick={() => setWorkoutType(wt.id)} whileTap={{ scale: 0.92 }}
                        style={{
                          background: workoutType === wt.id ? wt.color : 'var(--white)',
                          border: `${workoutType === wt.id ? 2 : 0.5}px solid ${workoutType === wt.id ? wt.border : 'var(--border)'}`,
                          borderRadius: 12, padding: '12px 8px', cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        }}>
                        <span style={{ fontSize: 20 }}>{wt.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: workoutType === wt.id ? 600 : 400, color: 'var(--text-dark)' }}>{wt.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Distance (km)</label>
                      <input className="input" type="number" placeholder="e.g. 5.2" value={distance} onChange={e => setDistance(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Duration (minutes)</label>
                      <input className="input" type="number" placeholder="e.g. 30" value={duration} onChange={e => setDuration(e.target.value)} />
                    </div>
                  </div>

                  {/* Live preview */}
                  {distance && duration && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      <StatBadge label="Calories" value={calcCalories(distance, workoutType)} unit="kcal" color="var(--coral)" />
                      <StatBadge label="Pace" value={calcPace(distance, duration)} unit="" color="var(--blue)" />
                    </motion.div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" onClick={() => setView('home')} style={{ flex: '0 0 auto', width: 48 }}>←</button>
                  <motion.button className="btn-primary" onClick={logWorkout} whileTap={{ scale: 0.97 }} style={{ flex: 1 }}
                    disabled={!distance || !duration}>
                    Log workout (+25 XP)
                  </motion.button>
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
