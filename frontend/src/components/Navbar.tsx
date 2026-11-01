import React, { useState, useEffect } from 'react';
import { Bot, Menu, X, Terminal, Sun, Moon } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  onOpenAssistant: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistant, darkMode, onToggleDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Recognition', href: '#recognition' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-dark-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 py-3 shadow-sm dark:shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-slate-100 hover:text-electric-cyan transition-colors group focus:outline-none focus:ring-2 focus:ring-electric-cyan rounded-md px-1"
          >
            <div className="w-9 h-9 rounded-lg bg-dark-900 border border-slate-700 flex items-center justify-center text-electric-cyan group-hover:border-electric-cyan/60 group-hover:shadow-subtle-cyan transition-all">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm sm:text-base font-semibold tracking-tight text-white group-hover:text-electric-cyan transition-colors">
                {PERSONAL_INFO.name}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider">
                BACKEND ENGINEER
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm text-slate-300 hover:text-electric-cyan hover:bg-slate-800/50 rounded-md transition-all font-medium focus:outline-none focus:ring-1 focus:ring-electric-cyan"
              >
                {link.name}
              </a>
            ))}

            {/* Dark/Light Mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors ml-1 focus:outline-none focus:ring-1 focus:ring-electric-cyan"
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* AI Assistant Quick Pill */}
            <button
              onClick={onOpenAssistant}
              className="ml-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-900 border border-electric-cyan/40 hover:border-electric-cyan text-electric-cyan text-xs font-mono font-medium hover:bg-electric-cyan/10 transition-all shadow-subtle-cyan group focus:outline-none focus:ring-2 focus:ring-electric-cyan"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-cyan"></span>
              </span>
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-400 hover:text-white rounded-md"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-electric-cyan"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-950/95 border-b border-slate-800 px-4 pt-3 pb-6 mt-3 space-y-2 backdrop-blur-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-electric-cyan hover:bg-slate-800/60"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssistant();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-dark-900 border border-electric-cyan/50 text-electric-cyan text-sm font-mono font-medium hover:bg-electric-cyan/10 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Portfolio AI Assistant</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
