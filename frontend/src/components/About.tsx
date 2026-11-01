import { GraduationCap, Building, CheckCircle2 } from 'lucide-react';
import { EDUCATION } from '../data/portfolioData';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-electric-cyan uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan"></span>
            About Me
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Engineering Background &amp; Core Focus
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Bio Text */}
          <div className="lg:col-span-7 space-y-5 text-slate-300 leading-relaxed text-base">
            <p className="bg-dark-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              I am a backend software engineer with professional experience at{' '}
              <strong className="text-white font-medium">Purchasing Power</strong>. My work
              includes Java application modernization, Spring Boot upgrades, REST API development
              and integration, third-party API health monitoring, testing, debugging, and production
              support.
            </p>

            <p className="bg-dark-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              I enjoy understanding backend systems, improving maintainability, and building reliable
              services with strong testing foundations and secure engineering standards.
            </p>

            {/* Core Competencies highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Microservices Modernization</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Spring Boot 2.x → 3+ Upgrades</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>REST API Architecture &amp; Integration</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>API Health &amp; Availability Monitoring</span>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div className="lg:col-span-5">
            <div className="bg-dark-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800 text-electric-cyan">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Education</h3>
                  <p className="text-xs font-mono text-slate-400">Formal Engineering Degree</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-medium text-slate-100 text-lg">
                  {EDUCATION.degree}
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{EDUCATION.institution}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Period: {EDUCATION.period}</span>
                  <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    CGPA: {EDUCATION.cgpa}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                {EDUCATION.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-electric-cyan font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
