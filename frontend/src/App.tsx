import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Recognition } from './components/Recognition';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { AiAssistant } from './components/AiAssistant';

export function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return saved !== null ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-electric-cyan/20 selection:text-electric-cyan transition-colors duration-200">
      {/* Navigation */}
      <Navbar
        onOpenAssistant={() => setIsAssistantOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Recognition />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Floating AI Assistant */}
      <AiAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpen={() => setIsAssistantOpen(true)}
      />
    </div>
  );
}

export default App;
