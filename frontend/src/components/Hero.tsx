import React from 'react';
import { Bot, FileText, FolderGit2, Github, Globe, Linkedin, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArchitectureVisual } from './ArchitectureVisual';

interface HeroProps {
  onOpenAssistant: () => void;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAssistant, onOpenResume }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-slate-800/60">
      {/* Background technical grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Subtle radial spotlight */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-electric-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-900 border border-slate-700/80 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Associate Software Engineer @ Purchasing Power</span>
            </div>

            {/* Name & Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                {PERSONAL_INFO.name}
              </h1>
              <p className="text-lg sm:text-xl font-mono text-electric-cyan font-medium">
                {PERSONAL_INFO.headline}
              </p>
            </div>

            {/* Introduction */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {PERSONAL_INFO.intro}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-electric-cyan text-dark-950 font-semibold text-sm hover:bg-cyan-300 transition-colors shadow-subtle-cyan focus:outline-none focus:ring-2 focus:ring-electric-cyan"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>View My Projects</span>
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-dark-900 border border-slate-700 hover:border-slate-500 text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <FileText className="w-4 h-4 text-electric-cyan" />
                <span>Download Resume</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-dark-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Contact Me</span>
              </a>

              <button
                onClick={onOpenAssistant}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-dark-900 border border-electric-cyan/60 hover:border-electric-cyan text-electric-cyan font-mono text-sm hover:bg-electric-cyan/10 transition-all shadow-subtle-cyan focus:outline-none focus:ring-2 focus:ring-electric-cyan"
              >
                <Bot className="w-4 h-4" />
                <span>Ask My AI Assistant</span>
              </button>
            </div>

            {/* Verified Professional Links */}
            <div className="pt-4 flex items-center gap-5 text-slate-400 border-t border-slate-800/80">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Verified Links:
              </span>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm hover:text-electric-cyan transition-colors"
                title="Pirai Soodan G. on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-xs font-mono">LinkedIn</span>
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm hover:text-electric-cyan transition-colors"
                title="Pirai Soodan G. on GitHub"
              >
                <Github className="w-4 h-4" />
                <span className="text-xs font-mono">GitHub</span>
              </a>

              <a
                href={PERSONAL_INFO.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm hover:text-electric-cyan transition-colors"
                title="Live Vercel Portfolio"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-mono">Portfolio</span>
              </a>
            </div>
          </div>

          {/* Right Column: Subtle Architecture & Code Illustration */}
          <div className="lg:col-span-5">
            <ArchitectureVisual />
          </div>
        </div>
      </div>
    </section>
  );
};
