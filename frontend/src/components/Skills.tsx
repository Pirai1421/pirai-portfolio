import React, { useState } from 'react';
import { Terminal, Server, Database, Wrench, Shield, Sparkles } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming':
        return <Terminal className="w-5 h-5 text-sky-400" />;
      case 'AI & Data Engineering':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Backend Development':
        return <Server className="w-5 h-5 text-electric-cyan" />;
      case 'Databases':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Testing and Development Tools':
        return <Wrench className="w-5 h-5 text-amber-400" />;
      case 'Engineering Practices':
        return <Shield className="w-5 h-5 text-indigo-400" />;
      default:
        return <Terminal className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredCategories =
    selectedCategory === 'All'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((c) => c.category === selectedCategory);

  return (
    <section id="skills" className="py-20 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-electric-cyan uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan"></span>
              Technical Skills
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Categorized Backend Stack &amp; Practices
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Verified skills based strictly on professional employment and hands-on implementation.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 bg-dark-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-slate-800 text-electric-cyan font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Skills
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === cat.category
                    ? 'bg-slate-800 text-electric-cyan font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.category}
              className="bg-dark-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                    {getCategoryIcon(cat.category)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{cat.category}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cat.description}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md bg-dark-950 border border-slate-800 text-slate-200 text-xs font-mono hover:border-electric-cyan/50 hover:text-electric-cyan transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Verified Stack</span>
                <span>{cat.skills.length} Items</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
