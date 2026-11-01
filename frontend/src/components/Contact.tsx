import React, { useState } from 'react';
import { Mail, Linkedin, Github, Globe, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { submitContactForm } from '../services/contactService';

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFeedback({ type: 'error', message: 'Please fill out all fields before submitting.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const result = await submitContactForm(formData);
    setLoading(false);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
    formData.subject || 'Portfolio Inquiry for Pirai Soodan G.'
  )}&body=${encodeURIComponent(formData.message || 'Hi Pirai,')}`;

  return (
    <section id="contact" className="py-20 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-electric-cyan uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan"></span>
            Get in Touch
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Contact &amp; Public Profiles
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Reach out directly for backend software engineering roles, Java modernization discussions, or technical inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-dark-900 border border-slate-800 rounded-xl p-6 space-y-5">
              <h3 className="text-lg font-bold text-white">Direct Communication</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Feel free to email me directly or connect across verified professional platforms.
              </p>

              {/* Email Address with Copy Button */}
              <div className="p-3.5 rounded-lg bg-dark-950 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono uppercase text-slate-400">Verified Email:</div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-sm font-mono text-electric-cyan hover:underline truncate"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Email"
                    aria-label="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Direct Mailto Action Button */}
              <a
                href={mailtoUrl}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-electric-cyan hover:bg-cyan-300 text-dark-950 font-semibold text-sm transition-colors shadow-subtle-cyan"
              >
                <Mail className="w-4 h-4" />
                <span>Open in Email Client (mailto)</span>
              </a>

              {/* Verified Links */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                <div className="text-xs font-mono uppercase text-slate-400">Professional Links:</div>
                <div className="space-y-2">
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-electric-cyan transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-xs font-mono">
                      <Linkedin className="w-4 h-4 text-sky-400" />
                      <span>LinkedIn Profile</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">/pirai-soodan-g</span>
                  </a>

                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-electric-cyan transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-xs font-mono">
                      <Github className="w-4 h-4 text-slate-300" />
                      <span>GitHub Repositories</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">@Pirai1421</span>
                  </a>

                  <a
                    href={PERSONAL_INFO.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-electric-cyan transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-xs font-mono">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>Live Portfolio Deployment</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Vercel</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-dark-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Send a Direct Message</h3>
                <p className="text-xs text-slate-400">
                  Connected directly to the Spring Boot backend validation service.
                </p>
              </div>

              {feedback && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 text-xs leading-relaxed ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                      : 'bg-red-950/40 border border-red-800/60 text-red-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="block text-xs font-mono text-slate-300">
                      Your Name <span className="text-electric-cyan">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-dark-950 border border-slate-800 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="block text-xs font-mono text-slate-300">
                      Email Address <span className="text-electric-cyan">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      maxLength={120}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane.doe@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-dark-950 border border-slate-800 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-300">
                    Subject <span className="text-electric-cyan">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    maxLength={150}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Java Backend Engineer Role Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-dark-950 border border-slate-800 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="block text-xs font-mono text-slate-300">
                    Message <span className="text-electric-cyan">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    maxLength={2000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi Pirai, we reviewed your microservices and Spring Boot work..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-dark-950 border border-slate-800 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-electric-cyan" />
                  <span>{loading ? 'Validating and Sending...' : 'Submit Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
