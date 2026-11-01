import React, { useState } from 'react';
import { ArrowUpRight, Code, Database, Sparkles, Activity, Layers } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectDetail } from '../types/portfolio';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  const getProjectIcon = (category: string) => {
    switch (category) {
      case 'Enterprise Backend':
        return <Database className="w-5 h-5 text-sky-400" />;
      case 'E-Commerce / Integrations':
        return <Layers className="w-5 h-5 text-electric-cyan" />;
      case 'Observability':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Machine Learning':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Code className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <section id="projects" className="py-20 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-electric-cyan uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan"></span>
            Featured Projects
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Backend Modernization &amp; Engineering Work
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Detailed case studies across enterprise persistence refactoring, e-commerce integrations, service observability, and machine learning exploration.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-dark-900 border border-slate-800 rounded-xl p-6 hover:border-electric-cyan/40 hover:shadow-subtle-cyan transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Category & Icon */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                    {getProjectIcon(project.category)}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-dark-950 border border-slate-800 text-slate-300">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-electric-cyan transition-colors">
                  {project.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {project.summary}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-950 border border-slate-800/80 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-950 text-slate-400">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-dark-950 border border-slate-800 hover:border-electric-cyan/60 text-slate-200 hover:text-white text-xs font-mono transition-all group-hover:bg-slate-800/40"
                >
                  <span>Explore Technical Deep-Dive</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-electric-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Deep Dive */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
