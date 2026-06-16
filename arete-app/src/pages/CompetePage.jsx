import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../App';
import { RexCharacter } from '../components/Characters';
import BottomNav from '../components/BottomNav';
import PageTransition from '../components/PageTransition';

const MEDALS = ['🥇','🥈','🥉'];
const RANK_COLORS = [
  { bg: '#fff8e8', border: '#f0d890', text: '#7a6020' },
  { bg: '#f5f5f5', border: '#d0d0d0', text: '#5a5a5a' },
  { bg: '#fff0ec', border: '#f0c0b0', text: '#7a3020' },
];

function StatRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{icon} {label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{value}</span>
    </div>
  );
}

export default function CompetePage() {
  const { state } = useContext(AppContext);

  const me = {
    id: 'me', name: state.user?.name || 'You',
    xp: state.xp,
    steps: state.steps || 0,
    tasksCompleted: (state.tasks || []).filter(t => t.done).length,
    tasksTotal: (state.tasks || []).length,
    streak: state.streak || 0,
    workouts: (state.workouts || []).length,
  };

  const everyone = [...(state.friends || []), me].sort((a, b) => b.xp - a.xp);
  const myRank = everyone.findIndex(f => f.id === 'me') + 1;

  return (
    <PageTransition>
      <div className="page" style={{ background: 'var(--lavender-light)' }}>
        <div className="scroll-content" style={{ padding: '0 16px' }}>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ paddingTop: 56, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--lavender)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>🏆 Compete</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--text-dark)' }}>Leaderboard</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Weekly rankings reset Sunday</p>
            </div>
            <RexCharacter size={80} rank={myRank} quip={myRank === 1 ? 'ALL HAIL THE CHAMPION! 👑' : `Fight for #1, rank ${myRank}! 💪`} />
          </motion.div>

          {/* My rank banner */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            style={{
              background: myRank === 1 ? '#fff8e8' : 'var(--white)',
              borderRadius: 18, padding: '16px 20px', marginBottom: 14,
              border: `${myRank === 1 ? 2 : 0.5}px solid ${myRank === 1 ? '#f0d890' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
            <span style={{ fontSize: 32 }}>{myRank <= 3 ? MEDALS[myRank-1] : `#${myRank}`}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 2 }}>You're ranked #{myRank}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{state.xp} XP this week</p>
            </div>
            {myRank > 1 && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>to #{myRank-1}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--lavender)' }}>+{everyone[myRank-2].xp - state.xp} XP</p>
              </div>
            )}
          </motion.div>

          {/* Leaderboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {everyone.map((person, i) => {
              const isMe = person.id === 'me';
              const colors = RANK_COLORS[i] || { bg: 'var(--white)', border: 'var(--border)', text: 'var(--text-dark)' };
              return (
                <motion.div
                  key={person.id || person.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  style={{
                    background: isMe ? 'var(--lavender-light)' : i < 3 ? colors.bg : 'var(--white)',
                    borderRadius: 16, padding: '14px 16px',
                    border: `${isMe ? 2 : 0.5}px solid ${isMe ? 'var(--lavender)' : i < 3 ? colors.border : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <span style={{ fontSize: 18, minWidth: 28 }}>{i < 3 ? MEDALS[i] : `${i+1}.`}</span>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: isMe ? 'var(--lavender)' : i < 3 ? colors.border : 'rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600, color: isMe ? '#fff' : colors.text || '#555',
                    flexShrink: 0,
                  }}>
                    {(person.name || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: isMe ? 700 : 500, color: isMe ? 'var(--lavender)' : 'var(--text-dark)' }}>
                      {person.name}{isMe ? ' (you)' : ''}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      🔥 {person.streak || 0} streak · ✅ {person.tasksCompleted || 0}/{person.tasksTotal || 5} tasks
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: i < 3 ? colors.text : 'var(--text-dark)', fontWeight: 500 }}>{person.xp}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>XP</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats breakdown */}
          <div className="card" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>Your stats this week</p>
            <StatRow icon="⚡" label="Total XP" value={`${state.xp} XP`} />
            <StatRow icon="🔥" label="Current streak" value={`${state.streak || 0} days`} />
            <StatRow icon="✅" label="Tasks completed" value={`${(state.tasks||[]).filter(t=>t.done).length}`} />
            <StatRow icon="🏃" label="Steps today" value={(state.steps||0).toLocaleString()} />
            <StatRow icon="🏋️" label="Workouts logged" value={`${(state.workouts||[]).length}`} />
          </div>

          {/* Invite friends CTA */}
          <motion.div style={{ background: 'var(--sage-light)', borderRadius: 18, padding: '18px 20px', border: '0.5px solid rgba(74,124,107,0.2)', marginBottom: 8, textAlign: 'center' }}
            whileTap={{ scale: 0.98 }}>
            <p style={{ fontSize: 16, marginBottom: 6 }}>👥</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--sage-dark)', marginBottom: 4 }}>Invite friends to compete</p>
            <p style={{ fontSize: 12, color: 'var(--sage)' }}>Challenge your squad to be excellent together</p>
          </motion.div>

        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
