import React from 'react';
import { Star, Sparkles, Building2 } from 'lucide-react';
import { RECOGNITION } from '../data/portfolioData';

export const Recognition: React.FC = () => {
  return (
    <section id="recognition" className="py-20 border-b border-slate-800/60 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="space-y-2 mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honors &amp; Recognition</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Quarterly Performance Recognition
          </h2>
        </div>

        {/* Award Showcase Card */}
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-dark-900 to-dark-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Medal / Star badge */}
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Star className="w-10 h-10 fill-amber-400/20" />
            </div>

            {/* Details */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  {RECOGNITION.period}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{RECOGNITION.organization}</span>
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                {RECOGNITION.title}
              </h3>

              <div className="text-sm font-mono text-electric-cyan font-medium">
                {RECOGNITION.recognition}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed pt-2 border-t border-slate-800">
                {RECOGNITION.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
