import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, AlertCircle, Layers, Cpu } from 'lucide-react';
import { ProjectDetail } from '../types/portfolio';

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-dark-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-950/95 backdrop-blur-md border-b border-slate-800 p-5 sm:p-6 flex items-start justify-between z-10">
          <div className="space-y-1 pr-6">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan">
              {project.category}
            </span>
            <h3 id="modal-project-title" className="text-2xl font-bold text-white pt-2">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-electric-cyan"
            aria-label="Close project details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-300 text-sm">
          {/* Summary */}
          <div className="bg-dark-950 border border-slate-800 rounded-xl p-4 text-slate-200">
            <p className="leading-relaxed">{project.summary}</p>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-electric-cyan" />
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md bg-dark-950 border border-slate-800 text-slate-200 text-xs font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Problem Statement
            </h4>
            <p className="p-3.5 rounded-lg bg-dark-950/60 border border-slate-800/80 leading-relaxed text-slate-300">
              {project.problemStatement}
            </p>
          </div>

          {/* My Contribution */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              My Contribution
            </h4>
            <p className="p-3.5 rounded-lg bg-dark-950/60 border border-slate-800/80 leading-relaxed text-slate-300">
              {project.myContribution}
            </p>
          </div>

          {/* Technical Implementation */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Technical Implementation
            </h4>
            <ul className="space-y-2 p-3.5 rounded-lg bg-dark-950/60 border border-slate-800/80">
              {project.technicalImplementation.map((impl, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="text-electric-cyan font-bold">•</span>
                  <span className="leading-relaxed">{impl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges & Solutions */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Challenges &amp; Solutions
            </h4>
            <div className="space-y-3">
              {project.challengesAndSolutions.map((cs, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-dark-950/80 border border-slate-800 space-y-2"
                >
                  <div className="text-xs font-medium text-amber-300 flex items-start gap-2">
                    <span className="font-mono text-slate-400 shrink-0">Challenge:</span>
                    <span>{cs.challenge}</span>
                  </div>
                  <div className="text-xs text-slate-300 flex items-start gap-2 border-t border-slate-800/80 pt-2">
                    <span className="font-mono text-emerald-400 shrink-0">Solution:</span>
                    <span>{cs.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Verified Outcome
            </h4>
            <p className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 leading-relaxed text-xs">
              {project.outcome}
            </p>
          </div>

          {/* GitHub link ONLY if real */}
          {project.githubUrl && (
            <div className="pt-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Repository</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-950 border-t border-slate-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
