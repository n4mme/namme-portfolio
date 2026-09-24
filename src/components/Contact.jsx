import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Github, Linkedin, MapPin, CheckCircle2, MessageSquare, Clock, ExternalLink, AlertCircle, MailCheck, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import SectionWrapper, { staggerContainer, fadeInUp } from './SectionWrapper';
import { personalInfo } from '../data/portfolioData';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'activation' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${personalInfo.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          _replyto: formData.email.trim(),
          subject: formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim()}`,
          message: formData.message.trim(),
          _subject: `[Portfolio Contact] ${formData.subject.trim() || 'New Inquiry'} from ${formData.name.trim()}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#10b981', '#14b8a6', '#06b6d4', '#6366f1'],
          });
        } catch (err) {
          // graceful fallback if canvas not supported
        }
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        setStatus('activation');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.message || 'Failed to deliver message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Unable to connect to the mail service right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Mail size={14} />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans">
            Let's Build Something Exceptional
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Seeking opportunities for professional internships, freelance contracts, or technical collaborations.
          </p>
        </motion.div>

        {/* Two-Column Contact Layout with Staggered Cascading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left Column: Direct Info & Social Cards */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-6">
            
            {/* Quick Pitch Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                Available for Early-Career Roles
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Whether you have an upcoming web or mobile engineering position, need an agile developer with AI-accelerated velocity, or just want to connect, my inbox is always open.
              </p>

              {/* Status Indicator */}
              <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Typical response time: Within 24 hours
                </span>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              {/* Email Card */}
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Direct Email</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {personalInfo.email}
                  </p>
                </div>
              </a>

              {/* LinkedIn Profile Card */}
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#0A66C2]/60 dark:hover:border-[#0A66C2]/60 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center shrink-0">
                  <Linkedin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-zinc-400 uppercase">LinkedIn Profile</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-[#0A66C2] transition-colors truncate">
                    linkedin.com/in/emmanuel-nantes
                  </p>
                </div>
                <ExternalLink size={16} className="text-zinc-400 group-hover:text-[#0A66C2] transition-colors shrink-0" />
              </a>

              {/* Location Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase">Location</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    {personalInfo.location}
                  </p>
                </div>
              </div>

              {/* GitHub Profile Card */}
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-500 flex items-center justify-center shrink-0 transition-colors">
                  <Github size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-zinc-400 uppercase">GitHub Profile</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">
                    github.com/n4mme
                  </p>
                </div>
                <ExternalLink size={16} className="text-zinc-400 group-hover:text-emerald-500 transition-colors shrink-0" />
              </a>
            </div>

          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-emerald-500" />
                <span>Send a Direct Message</span>
              </h3>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out! Your message was delivered directly to Emmanuel's Gmail inbox. He will review your note and respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Send Another Message</span>
                  </button>
                </motion.div>
              ) : status === 'activation' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
                    <MailCheck size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-amber-900 dark:text-amber-200">
                    One-Time Activation Needed
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-300 mt-2 max-w-md mx-auto leading-relaxed">
                    FormSubmit has sent a one-time verification email to <span className="font-semibold underline text-amber-900 dark:text-amber-100">{personalInfo.email}</span>.
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 max-w-md mx-auto">
                    Please open your Gmail and click <strong>Activate Form</strong>. After clicking it once, all future submissions will arrive directly in your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Return to Form</span>
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-700 dark:text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertCircle size={18} className="shrink-0 text-rose-500" />
                        <span className="truncate">{errorMessage || 'Could not send message automatically.'}</span>
                      </div>
                      <a
                        href={`mailto:${personalInfo.email}?subject=${encodeURIComponent(formData.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Emmanuel,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-sm transition-colors whitespace-nowrap shrink-0"
                      >
                        <Mail size={14} />
                        <span>Send via Email Client</span>
                      </a>
                    </motion.div>
                  )}

                  {/* Honeypot spam field (invisible to real users) */}
                  <input type="text" name="_honey" className="hidden" tabIndex="-1" autoComplete="off" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Your Name <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Maria Santos"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Email Address <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="maria@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      disabled={isSubmitting}
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Internship Inquiry / Project Discussion"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Message <span className="text-emerald-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share project goals, timeline, or open role requirements..."
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none disabled:opacity-60"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </motion.div>

      </div>
    </SectionWrapper>
  );
};

export default Contact;
