import React from 'react';
import { Calendar, Building, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-electric-cyan uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan"></span>
            Professional Experience
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Career Timeline &amp; Contributions
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Documented enterprise engineering responsibilities and system modernizations at Purchasing Power.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 md:before:left-1/2 before:w-0.5 before:bg-slate-800 before:-translate-x-1/2">
          {EXPERIENCES.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                } gap-6 md:gap-12`}
              >
                {/* Timeline Center Node */}
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-dark-950 border-2 border-electric-cyan flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-electric-cyan"></div>
                </div>

                {/* Content Box */}
                <div className="ml-9 md:ml-0 md:w-1/2">
                  <div className="bg-dark-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all shadow-md space-y-4">
                    {/* Header */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-electric-blue/20 border border-electric-blue/40 text-sky-300">
                          {exp.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{exp.period}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>

                      <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Building className="w-4 h-4 text-electric-cyan" />
                        <span>{exp.company}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {exp.summary}
                    </p>

                    {/* Verified Responsibilities */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                        Verified Responsibilities:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies Tagged */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-950 border border-slate-800 text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
