import React, { useState, useContext } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { AppContext } from '../App';
import { DashCharacter } from '../components/Characters';
import BottomNav from '../components/BottomNav';
import PageTransition from '../components/PageTransition';

const AI_NUDGES = [
  n => n === 0 ? "Let's get moving! First task is always hardest 💪" : null,
  n => n >= 3 ? "You're on fire! Keep going! 🔥" : null,
  n => n => `${n} done. You're building momentum! ⚡`,
];

function getAIMessage(done, total) {
  if (done === 0) return "Ready to crush your goals? Let's go! 💪";
  if (done === total) return "ALL DONE! You're absolutely crushing it! 🎉🎊";
  if (done >= total * 0.6) return `${total - done} left — you're so close! Push through! 🔥`;
  if (done >= total * 0.3) return `${done} down, ${total - done} to go. Keep the momentum! ⚡`;
  return `${done} checked off. Nice start! Keep building! 🌱`;
}

export default function DoPage() {
  const { state, updateState, addXP } = useContext(AppContext);
  const [newTask, setNewTask] = useState('');
  const [dashQuip, setDashQuip] = useState('Ready to hustle! ⚡');
  const [confetti, setConfetti] = useState([]);

  const tasks = state.tasks || [];
  const done = tasks.filter(t => t.done).length;
  const allDone = done === tasks.length && tasks.length > 0;

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const wasDone = task?.done;

    updateState({
      tasks: tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
    });

    if (!wasDone) {
      addXP(10);
      setDashQuip(allDone ? 'ALL DONE!!! 🎊' : 'That\'s what I\'m talking about! ⚡');
      // Confetti burst
      const newConfetti = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 300 - 150,
        y: -(Math.random() * 200 + 100),
        color: ['#4a7c6b','#c4955a','#9a6ac4','#e8875a','#f5c842'][Math.floor(Math.random() * 5)],
      }));
      setConfetti(newConfetti);
      setTimeout(() => setConfetti([]), 1500);
    } else {
      setDashQuip('Undo? No worries! 😤');
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    updateState({
      tasks: [...tasks, { id: Date.now(), text: newTask.trim(), done: false }],
    });
    setNewTask('');
    setDashQuip('New mission accepted! ⚡');
  };

  const deleteTask = (id) => {
    updateState({ tasks: tasks.filter(t => t.id !== id) });
  };

  const progress = tasks.length > 0 ? (done / tasks.length) * 100 : 0;

  return (
    <PageTransition>
      <div className="page" style={{ background: '#f7f9ff', overflow: 'hidden' }}>

        {/* Confetti */}
        <AnimatePresence>
          {confetti.map(c => (
            <motion.div
              key={c.id}
              style={{
                position: 'fixed', top: '40%', left: '50%',
                width: 8, height: 8, borderRadius: '50%',
                background: c.color, zIndex: 200, pointerEvents: 'none',
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: c.x, y: c.y, opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        <div className="scroll-content" style={{ padding: '0 16px' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ paddingTop: 56, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>✅ Do</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--text-dark)', marginBottom: 12 }}>Today's tasks</h2>
              {/* Progress bar */}
              <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: allDone ? 'var(--sage)' : 'var(--blue)', borderRadius: 3 }}
                />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{done}/{tasks.length} completed · {Math.round(progress)}%</p>
            </div>
            <DashCharacter size={72} tasksDone={done} tasksTotal={tasks.length} quip={dashQuip} />
          </motion.div>

          {/* AI Coach bubble */}
          <motion.div
            key={done}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              background: 'rgba(90,122,212,0.08)', borderRadius: 14,
              padding: '12px 16px', marginBottom: 20,
              border: '0.5px solid rgba(90,122,212,0.2)',
            }}
          >
            <p style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, marginBottom: 2 }}>🤖 Dash says</p>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', fontStyle: 'italic' }}>"{getAIMessage(done, tasks.length)}"</p>
          </motion.div>

          {/* Task list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ layout: { duration: 0.2 } }}
                  style={{
                    background: task.done ? 'var(--sage-light)' : 'var(--white)',
                    borderRadius: 14,
                    border: `0.5px solid ${task.done ? 'rgba(74,124,107,0.3)' : 'var(--border)'}`,
                    padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <motion.button
                    onClick={() => toggleTask(task.id)}
                    whileTap={{ scale: 0.8 }}
                    style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${task.done ? 'var(--sage)' : 'rgba(0,0,0,0.2)'}`,
                      background: task.done ? 'var(--sage)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {task.done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</motion.span>}
                  </motion.button>
                  <span style={{
                    flex: 1, fontSize: 14, color: task.done ? 'var(--sage)' : 'var(--text-dark)',
                    textDecoration: task.done ? 'line-through' : 'none',
                    opacity: task.done ? 0.7 : 1,
                    fontWeight: task.done ? 400 : 500,
                  }}>
                    {task.text || `Task ${task.id}`}
                  </span>
                  {task.done && <span style={{ fontSize: 11, color: 'var(--sage)', fontWeight: 600 }}>+10 XP</span>}
                  <motion.button
                    onClick={() => deleteTask(task.id)}
                    whileTap={{ scale: 0.8 }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, padding: 2 }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add task */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input
              className="input"
              placeholder="Add a new task..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              style={{ flex: 1 }}
            />
            <motion.button
              onClick={addTask}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'var(--sage-dark)', color: '#fff', border: 'none',
                borderRadius: 14, padding: '0 18px', fontSize: 20, cursor: 'pointer', flexShrink: 0,
              }}
            >
              +
            </motion.button>
          </div>

          {/* Celebration */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'var(--sage-light)', borderRadius: 18, padding: '20px 24px',
                  textAlign: 'center', border: '1px solid rgba(74,124,107,0.3)',
                }}
              >
                <p style={{ fontSize: 28, marginBottom: 8 }}>🎊</p>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--sage-dark)', marginBottom: 6 }}>
                  All tasks done!
                </h3>
                <p style={{ fontSize: 13, color: 'var(--sage)', marginBottom: 12 }}>That's excellence in action.</p>
                <span className="xp-pill" style={{ fontSize: 13 }}>+{tasks.length * 10} XP earned today</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
