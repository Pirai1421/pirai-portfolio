import React, { useEffect } from 'react';
import { X, Download, FileText, GraduationCap, Briefcase, Award } from 'lucide-react';
import { PERSONAL_INFO, EDUCATION, EXPERIENCES, RECOGNITION, SKILL_CATEGORIES } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-dark-950/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-dark-900 border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-950/95 backdrop-blur-md border-b border-slate-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-dark-900 border border-slate-800 text-electric-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="resume-modal-title" className="text-lg font-bold text-white">
                Pirai Soodan G. — Professional Resume
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Verified Java Backend Engineer Profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={PERSONAL_INFO.resumePath}
              download="Pirai_Soodan_G_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-cyan text-dark-950 text-xs font-semibold hover:bg-cyan-300 transition-colors shadow-subtle-cyan"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Resume Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Content View */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm">
          {/* Note regarding PDF placement */}
          <div className="p-3.5 rounded-lg bg-dark-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <span className="font-mono text-electric-cyan font-bold">INFO:</span>
            <span>
              The download button accesses{' '}
              <code className="text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">
                public/Pirai_Soodan_G_Resume.pdf
              </code>
              . Below is the verified resume document overview.
            </span>
          </div>

          {/* Header block */}
          <div className="border-b border-slate-800 pb-5 space-y-2">
            <h2 className="text-2xl font-bold text-white">{PERSONAL_INFO.name}</h2>
            <div className="text-electric-cyan font-mono text-sm">{PERSONAL_INFO.headline}</div>
            <div className="text-slate-400 font-mono text-xs flex flex-wrap gap-x-4 gap-y-1">
              <span>Email: {PERSONAL_INFO.email}</span>
              <span>Location: {PERSONAL_INFO.location}</span>
              <span>GitHub: {PERSONAL_INFO.github}</span>
              <span>LinkedIn: {PERSONAL_INFO.linkedin}</span>
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-electric-cyan" />
              Professional Experience
            </h4>

            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="font-semibold text-white text-sm">
                    {exp.role} — <span className="text-slate-300 font-normal">{exp.company}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">{exp.period}</div>
                </div>

                <ul className="space-y-1.5 pt-1 text-slate-300 text-xs">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-electric-cyan font-bold">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Honors Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Honors &amp; Recognition
            </h4>
            <div className="p-4 rounded-xl bg-dark-950 border border-amber-500/20 text-xs space-y-1">
              <div className="font-semibold text-amber-300">{RECOGNITION.title}</div>
              <div className="text-slate-300">{RECOGNITION.organization} — {RECOGNITION.recognition}</div>
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              Education
            </h4>
            <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-1 text-xs">
              <div className="font-semibold text-white">{EDUCATION.degree}</div>
              <div className="text-slate-300">{EDUCATION.institution} ({EDUCATION.period})</div>
              <div className="text-emerald-400 font-mono">CGPA: {EDUCATION.cgpa}</div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Technical Competencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.category} className="p-3 rounded-lg bg-dark-950 border border-slate-800 text-xs">
                  <div className="font-mono text-slate-400 font-medium">{cat.category}:</div>
                  <div className="text-slate-200 mt-1">{cat.skills.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-950 border-t border-slate-800 p-4 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">
            Pirai Soodan G. Portfolio
          </span>
          <div className="flex gap-2">
            <a
              href={PERSONAL_INFO.resumePath}
              download="Pirai_Soodan_G_Resume.pdf"
              className="px-4 py-2 rounded-lg bg-electric-cyan text-dark-950 text-xs font-semibold hover:bg-cyan-300 transition-colors"
            >
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
