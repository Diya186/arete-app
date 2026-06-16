import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Shared bubble ─── */
const Bubble = ({ text, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          position: 'absolute', bottom: '110%', left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)',
          borderRadius: 12, padding: '8px 14px',
          fontSize: 11, color: '#333', whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          fontFamily: 'Inter, sans-serif', fontWeight: 500,
          zIndex: 10,
        }}
      >
        {text}
        <div style={{
          position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 10, background: '#fff',
          border: '0.5px solid rgba(0,0,0,0.08)',
          borderTop: 'none', borderLeft: 'none',
          transform: 'translateX(-50%) rotate(45deg)',
        }} />
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── SOL — the home sun character ─── */
export const SolCharacter = ({ size = 80, mood = 'happy', quip }) => {
  const [showBubble, setShowBubble] = useState(false);
  const hour = new Date().getHours();
  const isEvening = hour >= 18;
  const isMorning = hour < 12;

  const sunColor = isEvening ? '#e8875a' : isMorning ? '#f5c842' : '#f0a830';
  const rayColor = isEvening ? '#d4603a' : isMorning ? '#e8b520' : '#d89020';

  useEffect(() => {
    if (quip) { setShowBubble(true); const t = setTimeout(() => setShowBubble(false), 3000); return () => clearTimeout(t); }
  }, [quip]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Bubble text={quip} visible={showBubble} />
      <motion.svg
        width={size} height={size} viewBox="0 0 80 80"
        animate={{ rotate: isEvening ? [0, -5, 5, 0] : [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Rays */}
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <motion.line
            key={i}
            x1={40 + Math.cos(angle * Math.PI/180) * 22}
            y1={40 + Math.sin(angle * Math.PI/180) * 22}
            x2={40 + Math.cos(angle * Math.PI/180) * 30}
            y2={40 + Math.sin(angle * Math.PI/180) * 30}
            stroke={rayColor} strokeWidth={2.5} strokeLinecap="round"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
        {/* Body */}
        <circle cx={40} cy={40} r={18} fill={sunColor} />
        {/* Eyes */}
        <motion.circle cx={34} cy={37} r={2.5} fill="#5a3010"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5 }}
        />
        <motion.circle cx={46} cy={37} r={2.5} fill="#5a3010"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5 }}
        />
        {/* Smile */}
        <path d={mood === 'happy' ? 'M34 44 Q40 50 46 44' : 'M34 46 Q40 42 46 46'}
          stroke="#5a3010" strokeWidth={2} fill="none" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx={29} cy={43} rx={4} ry={2.5} fill={rayColor} opacity={0.4} />
        <ellipse cx={51} cy={43} rx={4} ry={2.5} fill={rayColor} opacity={0.4} />
      </motion.svg>
    </div>
  );
};

/* ─── SAGE — the learn owl ─── */
export const SageCharacter = ({ size = 80, excited = false, quip }) => {
  const [showBubble, setShowBubble] = useState(false);
  useEffect(() => {
    if (quip) { setShowBubble(true); const t = setTimeout(() => setShowBubble(false), 3000); return () => clearTimeout(t); }
  }, [quip]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Bubble text={quip} visible={showBubble} />
      <motion.svg width={size} height={size} viewBox="0 0 80 80"
        animate={excited ? { y: [0, -8, 0], rotate: [0, -5, 5, 0] } : { y: [0, -3, 0] }}
        transition={excited ? { duration: 0.5, repeat: 3 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Body */}
        <ellipse cx={40} cy={50} rx={22} ry={24} fill="#c4955a" />
        {/* Wings */}
        <motion.ellipse cx={18} cy={52} rx={10} ry={16} fill="#b08040"
          animate={{ rotate: excited ? [-20, 20, -20] : [-5, 5, -5] }}
          style={{ transformOrigin: '18px 44px' }}
          transition={{ duration: excited ? 0.3 : 2, repeat: Infinity }}
        />
        <motion.ellipse cx={62} cy={52} rx={10} ry={16} fill="#b08040"
          animate={{ rotate: excited ? [20, -20, 20] : [5, -5, 5] }}
          style={{ transformOrigin: '62px 44px' }}
          transition={{ duration: excited ? 0.3 : 2, repeat: Infinity }}
        />
        {/* Head */}
        <circle cx={40} cy={30} r={20} fill="#c4955a" />
        {/* Ear tufts */}
        <polygon points="28,14 24,6 32,12" fill="#b08040" />
        <polygon points="52,14 56,6 48,12" fill="#b08040" />
        {/* Eye circles */}
        <circle cx={32} cy={30} r={9} fill="#fff" />
        <circle cx={48} cy={30} r={9} fill="#fff" />
        <circle cx={32} cy={30} r={5} fill="#2d1a00" />
        <circle cx={48} cy={30} r={5} fill="#2d1a00" />
        <circle cx={34} cy={28} r={2} fill="#fff" />
        <circle cx={50} cy={28} r={2} fill="#fff" />
        {/* Beak */}
        <polygon points="37,35 43,35 40,40" fill="#e8875a" />
        {/* Glasses */}
        <motion.g
          animate={excited ? { y: [-1, 1, -1] } : {}}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <circle cx={32} cy={30} r={9} fill="none" stroke="#5a3a10" strokeWidth={1.5} />
          <circle cx={48} cy={30} r={9} fill="none" stroke="#5a3a10" strokeWidth={1.5} />
          <line x1={41} y1={30} x2={39} y2={30} stroke="#5a3a10" strokeWidth={1.5} />
        </motion.g>
        {/* Belly pattern */}
        <ellipse cx={40} cy={55} rx={12} ry={14} fill="#e8c88a" opacity={0.6} />
      </motion.svg>
    </div>
  );
};

/* ─── DASH — the do lightning bolt ─── */
export const DashCharacter = ({ size = 80, tasksDone = 0, tasksTotal = 5, quip }) => {
  const [showBubble, setShowBubble] = useState(false);
  const allDone = tasksDone === tasksTotal;
  useEffect(() => {
    if (quip) { setShowBubble(true); const t = setTimeout(() => setShowBubble(false), 3000); return () => clearTimeout(t); }
  }, [quip]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Bubble text={quip} visible={showBubble} />
      <motion.svg width={size} height={size} viewBox="0 0 80 80"
        animate={allDone
          ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0] }
          : { y: [0, -4, 0], rotate: [0, 2, -2, 0] }
        }
        transition={allDone
          ? { duration: 0.8, repeat: 2 }
          : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Bolt body */}
        <polygon points="45,5 25,42 38,42 30,75 58,30 44,30" fill="#f5c842" />
        <polygon points="45,5 25,42 38,42 30,75 58,30 44,30" fill="none" stroke="#d4a010" strokeWidth={1.5} />
        {/* Glow lines */}
        {allDone && [0,1,2,3,4].map(i => (
          <motion.line key={i}
            x1={40 + Math.cos(i * 72 * Math.PI/180) * 20}
            y1={40 + Math.sin(i * 72 * Math.PI/180) * 20}
            x2={40 + Math.cos(i * 72 * Math.PI/180) * 36}
            y2={40 + Math.sin(i * 72 * Math.PI/180) * 36}
            stroke="#f5c842" strokeWidth={2} strokeLinecap="round"
            animate={{ opacity: [1, 0], scale: [1, 1.5] }}
            transition={{ duration: 0.6, delay: i * 0.05, repeat: 3 }}
          />
        ))}
        {/* Face */}
        <circle cx={40} cy={32} r={9} fill="#fff8d0" />
        <circle cx={37} cy={30} r={2} fill="#2d2010" />
        <circle cx={43} cy={30} r={2} fill="#2d2010" />
        <path d={allDone ? 'M36 35 Q40 40 44 35' : 'M36 34 Q40 37 44 34'}
          stroke="#2d2010" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Sweat drop if not done */}
        {!allDone && (
          <motion.ellipse cx={52} cy={20} rx={3} ry={4} fill="#a0d0ff" opacity={0.8}
            animate={{ y: [0, 4], opacity: [0.8, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.svg>
    </div>
  );
};

/* ─── BLAZE — the move cheetah ─── */
export const BlazeCharacter = ({ size = 80, running = false, quip }) => {
  const [showBubble, setShowBubble] = useState(false);
  useEffect(() => {
    if (quip) { setShowBubble(true); const t = setTimeout(() => setShowBubble(false), 3000); return () => clearTimeout(t); }
  }, [quip]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Bubble text={quip} visible={showBubble} />
      <motion.svg width={size} height={size} viewBox="0 0 80 80"
        animate={running
          ? { x: [-2, 2, -2], y: [0, -6, 0], scaleX: [1, 1.05, 1] }
          : { y: [0, -2, 0] }
        }
        transition={running
          ? { duration: 0.4, repeat: Infinity }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Speed lines when running */}
        {running && [-10, 0, 10].map((y, i) => (
          <motion.line key={i} x1={0} y1={40 + y} x2={15} y2={40 + y}
            stroke="#f0c060" strokeWidth={1.5} strokeLinecap="round"
            animate={{ opacity: [1, 0], x: [-5, 0] }}
            transition={{ duration: 0.3, delay: i * 0.05, repeat: Infinity }}
          />
        ))}
        {/* Body */}
        <ellipse cx={42} cy={50} rx={20} ry={14} fill="#e8a840" />
        {/* Spots */}
        <circle cx={36} cy={46} r={3} fill="#c07820" opacity={0.6} />
        <circle cx={48} cy={44} r={2.5} fill="#c07820" opacity={0.6} />
        <circle cx={44} cy={56} r={2} fill="#c07820" opacity={0.6} />
        {/* Head */}
        <circle cx={58} cy={38} r={16} fill="#e8a840" />
        {/* Ears */}
        <polygon points="50,26 46,18 56,24" fill="#d08030" />
        <polygon points="68,26 72,18 64,24" fill="#d08030" />
        {/* Eyes */}
        <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}>
          <circle cx={54} cy={36} r={4} fill="#2d1a00" />
          <circle cx={64} cy={36} r={4} fill="#2d1a00" />
          <circle cx={55} cy={34} r={1.5} fill="#fff" />
          <circle cx={65} cy={34} r={1.5} fill="#fff" />
        </motion.g>
        {/* Muzzle */}
        <ellipse cx={59} cy={44} rx={7} ry={5} fill="#f0c090" />
        <circle cx={56} cy={43} r={1.5} fill="#2d1a00" />
        <circle cx={62} cy={43} r={1.5} fill="#2d1a00" />
        <path d="M56 47 Q59 50 62 47" stroke="#c07020" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Tail */}
        <motion.path d="M22 50 Q10 40 14 30 Q18 22 24 28"
          fill="none" stroke="#e8a840" strokeWidth={6} strokeLinecap="round"
          animate={{ d: running
            ? ['M22 50 Q10 38 14 28 Q18 20 24 26', 'M22 50 Q10 42 14 32 Q18 24 24 30']
            : ['M22 50 Q10 40 14 30 Q18 22 24 28', 'M22 50 Q8 44 12 34 Q16 26 22 32']
          }}
          transition={{ duration: running ? 0.3 : 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Legs */}
        <motion.g
          animate={running ? { rotate: [-15, 15, -15] } : {}}
          style={{ transformOrigin: '42px 60px' }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <line x1={34} y1={62} x2={30} y2={74} stroke="#d08030" strokeWidth={4} strokeLinecap="round" />
          <line x1={42} y1={63} x2={44} y2={75} stroke="#d08030" strokeWidth={4} strokeLinecap="round" />
          <line x1={50} y1={62} x2={52} y2={74} stroke="#d08030" strokeWidth={4} strokeLinecap="round" />
        </motion.g>
      </motion.svg>
    </div>
  );
};

/* ─── REX — the compete crown ─── */
export const RexCharacter = ({ size = 80, rank = 3, quip }) => {
  const [showBubble, setShowBubble] = useState(false);
  useEffect(() => {
    if (quip) { setShowBubble(true); const t = setTimeout(() => setShowBubble(false), 3000); return () => clearTimeout(t); }
  }, [quip]);

  const isFirst = rank === 1;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Bubble text={quip} visible={showBubble} />
      <motion.svg width={size} height={size} viewBox="0 0 80 80"
        animate={isFirst
          ? { y: [0, -6, 0], rotate: [0, -3, 3, 0] }
          : { y: [0, -2, 0], rotate: [0, 1, -1, 0] }
        }
        transition={{ duration: isFirst ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Crown */}
        <motion.g
          animate={{ y: isFirst ? [0, -3, 0] : [0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <polygon points="20,30 20,18 30,24 40,12 50,24 60,18 60,30" fill="#f5c842" />
          <polygon points="20,30 20,18 30,24 40,12 50,24 60,18 60,30" fill="none" stroke="#d4a010" strokeWidth={1} />
          {isFirst && <circle cx={40} cy={13} r={3} fill="#e84a4a" />}
          {isFirst && <circle cx={21} cy={19} r={2} fill="#4ae84a" />}
          {isFirst && <circle cx={59} cy={19} r={2} fill="#4a84e8" />}
        </motion.g>
        {/* Body — round king shape */}
        <ellipse cx={40} cy={58} rx={24} ry={20} fill="#9a6ac4" />
        {/* Robe detail */}
        <ellipse cx={40} cy={66} rx={18} ry={12} fill="#7a4aa4" />
        {/* Head */}
        <circle cx={40} cy={38} r={18} fill="#f0c090" />
        {/* Eyes */}
        <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}>
          <circle cx={33} cy={36} r={3.5} fill="#2d1a00" />
          <circle cx={47} cy={36} r={3.5} fill="#2d1a00" />
          <circle cx={34} cy={34} r={1.5} fill="#fff" />
          <circle cx={48} cy={34} r={1.5} fill="#fff" />
        </motion.g>
        {/* Monocle if rank > 1 */}
        {!isFirst && <circle cx={47} cy={36} r={5} fill="none" stroke="#5a3a10" strokeWidth={1.5} />}
        {/* Mouth */}
        <path d={isFirst ? 'M34 44 Q40 50 46 44' : 'M34 43 Q40 46 46 43'}
          stroke="#5a3010" strokeWidth={2} fill="none" strokeLinecap="round" />
        {/* Mustache */}
        <path d="M33 40 Q37 43 40 40 Q43 43 47 40"
          stroke="#5a3010" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Scepter */}
        <motion.g animate={{ rotate: [0, 5, -5, 0] }} style={{ transformOrigin: '65px 55px' }}
          transition={{ duration: 2, repeat: Infinity }}>
          <line x1={65} y1={55} x2={65} y2={75} stroke="#d4a010" strokeWidth={3} strokeLinecap="round" />
          <circle cx={65} cy={52} r={5} fill="#f5c842" />
          <circle cx={65} cy={52} r={3} fill="#e84a4a" />
        </motion.g>
      </motion.svg>
    </div>
  );
};

/* ─── LUNA — the reflect moon ─── */
export const LunaCharacter = ({ size = 80, quip }) => {
  const [showBubble, setShowBubble] = useState(false);
  useEffect(() => {
    if (quip) { setShowBubble(true); const t = setTimeout(() => setShowBubble(false), 3000); return () => clearTimeout(t); }
  }, [quip]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Bubble text={quip} visible={showBubble} />
      <motion.svg width={size} height={size} viewBox="0 0 80 80"
        animate={{ y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Stars */}
        {[[10,15],[68,20],[14,60],[70,55]].map(([x,y], i) => (
          <motion.polygon key={i}
            points={`${x},${y-4} ${x+1.5},${y-1} ${x+4},${y-1} ${x+2},${y+1} ${x+3},${y+4} ${x},${y+2} ${x-3},${y+4} ${x-2},${y+1} ${x-4},${y-1} ${x-1.5},${y-1}`}
            fill="#c4b0f0"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
        {/* Crescent body */}
        <circle cx={40} cy={40} r={26} fill="#9a8ad4" />
        <circle cx={50} cy={32} r={20} fill="#fafaf8" />
        {/* Crescent face area */}
        <circle cx={32} cy={44} r={10} fill="#b0a0e0" opacity={0.3} />
        {/* Eyes — half closed, serene */}
        <path d="M28 40 Q31 37 34 40" stroke="#2d1a4a" strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M40 38 Q43 35 46 38" stroke="#2d1a4a" strokeWidth={2} fill="none" strokeLinecap="round" />
        {/* Gentle smile */}
        <path d="M30 48 Q37 54 44 48" stroke="#2d1a4a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Tiny journal */}
        <motion.g animate={{ rotate: [-5, 5, -5] }} style={{ transformOrigin: '56px 60px' }}
          transition={{ duration: 3, repeat: Infinity }}>
          <rect x={50} y={54} width={14} height={18} rx={2} fill="#f0e0ff" stroke="#b090e0" strokeWidth={1} />
          <line x1={53} y1={59} x2={61} y2={59} stroke="#b090e0" strokeWidth={1} />
          <line x1={53} y1={63} x2={61} y2={63} stroke="#b090e0" strokeWidth={1} />
          <line x1={53} y1={67} x2={58} y2={67} stroke="#b090e0" strokeWidth={1} />
        </motion.g>
        {/* Glow */}
        <motion.circle cx={40} cy={40} r={28} fill="none" stroke="#c4b0f0"
          animate={{ opacity: [0.1, 0.4, 0.1], r: [28, 32, 28] }}
          transition={{ duration: 3, repeat: Infinity }}
          strokeWidth={4}
        />
      </motion.svg>
    </div>
  );
};

export default { SolCharacter, SageCharacter, DashCharacter, BlazeCharacter, RexCharacter, LunaCharacter };
