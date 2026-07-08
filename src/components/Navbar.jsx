import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useSwap } from '../context/SwapContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Swap Board',   href: '/swap' },
  { label: 'Timetable',    href: '/timetable' },
];

export default function Navbar() {
  const { darkMode, setDarkMode } = useSwap();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" onClick={handleNav} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-[18px] tracking-tight">KMate</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                  ${location.pathname === link.href 
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-full py-1 px-1 pr-3 border border-gray-200 dark:border-white/10">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                    {user.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                  {user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0]}
                </span>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1"></div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-colors duration-150"
              aria-label="Toggle dark mode"
              id="dark-mode-toggle"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={darkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {darkMode ? <FiSun size={17} /> : <FiMoon size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-colors duration-150"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#111111]"
          >
            <div className="px-4 py-2 space-y-0.5">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={handleNav}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                    ${location.pathname === link.href 
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-white/5">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                          {user.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={handleNav}
                    className="block w-full text-center px-3 py-2.5 rounded-lg text-sm font-bold bg-emerald-600 text-white shadow-sm transition-colors"
                  >
                    Login to KMate
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
