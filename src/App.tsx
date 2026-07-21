import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  History,
  Info,
  Menu,
  X,
  PlusCircle,
  Home,
} from 'lucide-react';
import { LandingPage } from './pages/LandingPage.js';
import { UploadPage } from './pages/UploadPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { AboutPage } from './pages/AboutPage.js';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/analyze', label: 'Analyze', icon: PlusCircle },
    { to: '/history', label: 'History', icon: History },
    { to: '/about', label: 'How it Works', icon: Info },
  ];

  return (
    <BrowserRouter>
      <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
        
        {/* Desktop Sidebar */}
        <aside id="desktop-sidebar" className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/60 p-6 space-y-8 shrink-0 relative z-25">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/15">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                ResumeAI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block -mt-0.5">
                ATS Optimizer
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wide block">
              SaaS v1.0.0
            </span>
          </div>
        </aside>

        {/* Mobile Header */}
        <header id="mobile-header" className="md:hidden bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shrink-0 relative z-30">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">
              ResumeAI
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:text-slate-900 transition-all rounded-lg bg-slate-50 border border-slate-200/60"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile menu drawer overlay */}
        {mobileMenuOpen && (
          <div
            id="mobile-drawer"
            className="md:hidden fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          >
            <div
              className="bg-white w-72 h-full p-6 flex flex-col space-y-6 shadow-2xl relative z-50 animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 tracking-tight">
                    ResumeAI
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="p-1.5 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
