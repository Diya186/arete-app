import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV = [
  { path: '/home',    icon: '🏠', label: 'Home'    },
  { path: '/learn',   icon: '🧠', label: 'Learn'   },
  { path: '/do',      icon: '✅', label: 'Do'      },
  { path: '/move',    icon: '🏃', label: 'Move'    },
  { path: '/compete', icon: '🏆', label: 'Compete' },
  { path: '/reflect', icon: '🪞', label: 'Reflect' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV.map(({ path, icon, label }) => {
        const active = pathname === path;
        return (
          <motion.button
            key={path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(path)}
            whileTap={{ scale: 0.85 }}
            whileHover={{ y: -2 }}
          >
            <motion.span
              animate={active ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.span>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: active ? 600 : 400 }}>
              {label}
            </label>
            {active && (
              <motion.div
                layoutId="nav-pill"
                style={{
                  position: 'absolute', bottom: -10, width: 4, height: 4,
                  borderRadius: '50%', background: 'var(--sage)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
