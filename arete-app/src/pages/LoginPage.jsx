import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { SolCharacter } from '../components/Characters';

/* ── Floating particle canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.4 + 0.1,
      color: ['#4a7c6b','#c4955a','#9a6ac4','#e8875a'][Math.floor(Math.random() * 4)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10 || p.x > canvas.width + 10) p.dx *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

/* ── Floating shapes background ── */
const FloatingShape = ({ delay, x, y, size, color, shape }) => (
  <motion.div
    style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size,
      borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? 6 : '50% 0',
      background: color, opacity: 0.06, zIndex: 0,
    }}
    animate={{ y: [0, -20, 0], rotate: [0, 180, 360], opacity: [0.04, 0.1, 0.04] }}
    transition={{ duration: 6 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const SHAPES = [
  { x: '5%',  y: '10%', size: 80,  color: '#4a7c6b', shape: 'circle' },
  { x: '80%', y: '8%',  size: 60,  color: '#c4955a', shape: 'square' },
  { x: '15%', y: '70%', size: 100, color: '#9a6ac4', shape: 'circle' },
  { x: '70%', y: '65%', size: 70,  color: '#e8875a', shape: 'blob'   },
  { x: '45%', y: '5%',  size: 50,  color: '#4a7c6b', shape: 'square' },
  { x: '88%', y: '40%', size: 90,  color: '#9a6ac4', shape: 'circle' },
  { x: '2%',  y: '45%', size: 55,  color: '#c4955a', shape: 'blob'   },
];

const SOL_QUIPS = [
  "Ready to be excellent? ☀️",
  "Your streak awaits! 🔥",
  "Let's make today count ✨",
  "Excellence is a habit 💪",
];

export default function LoginPage() {
  const { updateState } = useContext(AppContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('idle'); // idle | loading | done
  const [quip, setQuip] = useState('');
  const [quipIdx, setQuipIdx] = useState(0);
  const [error, setError] = useState('');

  // cycle quips
  useEffect(() => {
    setQuip(SOL_QUIPS[0]);
    const t = setInterval(() => {
      setQuipIdx(i => {
        const next = (i + 1) % SOL_QUIPS.length;
        setQuip(SOL_QUIPS[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = async () => {
    if (!name.trim()) { setError('What should we call you?'); return; }
    setError('');
    setStep('loading');
    await new Promise(r => setTimeout(r, 1800));
    setStep('done');
    await new Promise(r => setTimeout(r, 600));
    updateState({
      user: { name: name.trim(), email: email.trim() || `${name.trim().toLowerCase()}@arete.app` },
      streak: 1,
      xp: 0,
    });
    navigate('/onboarding');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <ParticleCanvas />
      {SHAPES.map((s, i) => <FloatingShape key={i} delay={i * 0.8} {...s} />)}

      {/* Big decorative serif text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(80px, 20vw, 180px)',
          fontWeight: 600, color: '#000',
          userSelect: 'none', pointerEvents: 'none',
          whiteSpace: 'nowrap', zIndex: 0,
        }}
      >
        Arête
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 400,
          margin: '0 16px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 28, padding: '40px 36px',
          border: '0.5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        {/* Sol */}
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <SolCharacter size={90} mood="happy" quip={quip} />
        </motion.div>

        {/* Logo */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 32 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 500, color: 'var(--text-dark)', letterSpacing: 2, marginBottom: 4 }}>
            Arête
          </h1>
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 14, color: 'var(--sage)', letterSpacing: 0.5 }}>
            excellence, daily
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
              Your name
            </label>
            <input
              className="input"
              placeholder="e.g. Diya"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ fontSize: 15 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
              Email (optional)
            </label>
            <input
              className="input"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontSize: 12, color: '#e84a4a', fontWeight: 500 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            className="btn-primary"
            onClick={handleLogin}
            disabled={step === 'loading'}
            whileTap={{ scale: 0.97 }}
            style={{ marginTop: 4, position: 'relative', overflow: 'hidden' }}
          >
            <AnimatePresence mode="wait">
              {step === 'idle' && (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Begin your journey →
                </motion.span>
              )}
              {step === 'loading' && (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {[0,1,2].map(i => (
                    <motion.span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }}
                      animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                  ))}
                </motion.span>
              )}
              {step === 'done' && (
                <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}>
                  ✓ Let's go!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 0.5, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: 0.5, background: 'var(--border)' }} />
        </div>

        {/* Google sign in (demo) */}
        <motion.button
          className="btn-ghost"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setName('Diya'); setEmail('diya@gmail.com');
            setTimeout(handleLogin, 300);
          }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 20 }}>
          Free forever. No ads. Just you and your goals.
        </p>
      </motion.div>
    </div>
  );
}
