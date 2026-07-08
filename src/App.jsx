import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SwapProvider } from './context/SwapContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import SwapBoard from './pages/SwapBoard';
import TimetablePage from './pages/TimetablePage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';

export default function App() {
  return (
    <AuthProvider>
      <SwapProvider>
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col bg-white dark:bg-[#111111] text-gray-900 dark:text-white transition-colors duration-300">
            <ParticleBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-14">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/swap" element={
                    <ProtectedRoute>
                      <SwapBoard />
                    </ProtectedRoute>
                  } />
                  <Route path="/timetable" element={
                    <ProtectedRoute>
                      <TimetablePage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </SwapProvider>
    </AuthProvider>
  );
}
