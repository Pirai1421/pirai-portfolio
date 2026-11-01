import React from 'react';
import { Terminal, Github, Linkedin, Globe } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-950 border-t border-slate-800/80 py-12 text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dark-900 border border-slate-700 flex items-center justify-center text-electric-cyan">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{PERSONAL_INFO.name}</div>
              <div className="text-[11px] text-slate-400">Java Backend Software Engineer</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-electric-cyan transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-electric-cyan transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href={PERSONAL_INFO.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-electric-cyan transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Live Portfolio</span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Pirai Soodan G. All verified portfolio information strictly reserved.
          </div>
          <div>
            Engineered with React, TypeScript, Tailwind CSS &amp; Spring Boot 3+ (Java 17).
          </div>
        </div>
      </div>
    </footer>
  );
};
