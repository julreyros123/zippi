import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatInterface from './pages/ChatInterface';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const { checkAuth, token, user } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token && !user) await checkAuth();
      setIsInitializing(false);
    };
    initAuth();
  }, [token, user, checkAuth]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white gap-3">
        <svg className="animate-spin h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-gray-400 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const FEATURES = [
  {
    icon: '💬',
    title: 'Real-time Group Chat',
    desc: 'Instant messaging with channels, reactions, file sharing, and typing indicators.'
  },
  {
    icon: '📚',
    title: 'Study Groups',
    desc: 'Create private or public study rooms for any subject, with tags to make them discoverable.'
  },
  {
    icon: '📅',
    title: 'Events & Announcements',
    desc: 'Schedule study sessions, post class updates, and keep your whole network in sync.'
  },
  {
    icon: '🤝',
    title: 'Connect with Classmates',
    desc: 'Find study partners, send connection requests, and build your academic network.'
  },
  {
    icon: '📱',
    title: 'Cross-Platform',
    desc: 'Use Zippi on web or mobile — your data is always in sync across all your devices.'
  },
  {
    icon: '🔒',
    title: 'Private & Secure',
    desc: 'JWT-authenticated, rate-limited, and CORS-protected so only your group can access your data.'
  }
];

function Landing() {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800 shadow-xl shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-extrabold text-lg">Z</span>
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">Zippi</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-500/20">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 rounded-full text-gray-300 hover:text-white font-medium text-sm transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-500/20">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen pt-16 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[15%] w-[55%] h-[55%] rounded-full bg-blue-700/15 blur-[130px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] rounded-full bg-emerald-700/15 blur-[130px]" />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-700/10 blur-[100px]" />
        </div>

        {/* Badge */}
        <div className="relative mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          The study app built for students
        </div>

        {/* Headline */}
        <h1 className="relative text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-emerald-200 leading-tight tracking-tight mb-6">
          Study Together,<br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Achieve More.
          </span>
        </h1>

        <p className="relative text-xl text-gray-400 max-w-2xl leading-relaxed mb-12">
          Zippi is the cross-platform study hub — group chat, study groups, events, announcements, and classmate connections all in one place.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-4 items-center">
          <Link to={isAuthenticated ? '/dashboard' : '/register'}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-lg transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
            {isAuthenticated ? 'Open Dashboard →' : 'Start for Free →'}
          </Link>
          <Link to="/login" className="px-8 py-4 rounded-full border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold text-lg transition-all">
            Sign In
          </Link>
        </div>

        {/* Mini stat strip */}
        <div className="relative mt-16 flex items-center gap-8 text-sm text-gray-500 flex-wrap justify-center">
          {['100% Free', 'No credit card', 'Works on mobile + web', 'Open source friendly'].map(item => (
            <div key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Built for student life</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">All the tools you need to collaborate, communicate, and succeed — in one seamless app.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="group relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-blue-500/40 hover:bg-gray-900 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl mb-4 group-hover:border-blue-500/40 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-gray-900 to-emerald-600/10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to start studying smarter?</h2>
            <p className="text-gray-400 mb-8 text-lg">Join Zippi for free. No credit card needed.</p>
            <Link to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95">
              {isAuthenticated ? 'Go to Dashboard →' : 'Create Your Free Account →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">Z</span>
          </div>
          <span className="font-bold text-gray-400">Zippi</span>
        </div>
        <p>© {new Date().getFullYear()} Zippi. The cross-platform study hub for students.</p>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 flex-col items-center justify-center gap-6 px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>
      <div className="relative text-center">
        <div className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 leading-none mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8">Looks like this page doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-500/20">
            ← Go Home
          </Link>
          <Link to="/dashboard" className="px-6 py-3 rounded-full border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
