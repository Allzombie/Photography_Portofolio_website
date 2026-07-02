import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, Check, Mail, Phone, MapPin, Instagram, Youtube, Linkedin, Sparkles } from 'lucide-react';
import { ContactMessage } from '../types';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    subject: '',
    message: '',
    service: 'Architecture'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    { value: 'Architecture', label: 'Architectural Capture' },
    { value: 'Portraits', label: 'Editorial Portraits' },
    { value: 'Cinematography', label: 'Cinematography / Commercial Video' },
    { value: 'Prints', label: 'Fine Art Prints Purchase' },
    { value: 'Other', label: 'General / Collaboration' }
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server error when submitting inquiry.');
      }

      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        service: 'Architecture'
      });
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setErrorMsg('There was a connection issue. Please try again or reach out directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="inquire-section"
      className="py-24 md:py-32 bg-neutral-950 border-t border-white/10 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.35em] font-mono uppercase text-neutral-400">
              04 / Contact
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-white italic">
            Studio Bookings
          </h2>
          <p className="text-neutral-500 text-sm mt-3 max-w-lg font-sans font-light leading-relaxed">
            Let's collaborate on framing your architecture project, capturing a cinematic story, or discussing commercial commissions.
          </p>
        </div>

        {/* Outer Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Studio Details */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h3 className="text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-400 font-bold mb-6">
                Direct Inquiries
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xs shrink-0">
                    <Mail className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-widest font-mono text-neutral-500 uppercase">General & Press</h4>
                    <p className="text-sm text-neutral-200 mt-0.5 font-mono">m.bradescu15@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xs shrink-0">
                    <Phone className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-widest font-mono text-neutral-500 uppercase">Phone & Signal</h4>
                    <p className="text-sm text-neutral-200 mt-0.5 font-mono">+40732734889</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xs shrink-0">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-widest font-mono text-neutral-500 uppercase">Studio Workspace</h4>
                    <p className="text-sm text-neutral-200 mt-0.5 font-sans font-light leading-relaxed">
                      Bucharest, Romania
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Connect channels */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-400 font-bold mb-4">
                Creative Channels
              </h3>

              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900/40 hover:bg-neutral-800/60 border border-white/10 text-neutral-400 hover:text-white rounded-xs transition-all cursor-pointer"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://vimeo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900/40 hover:bg-neutral-800/60 border border-white/10 text-neutral-400 hover:text-white rounded-xs transition-all cursor-pointer"
                  aria-label="Vimeo Portfolio"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900/40 hover:bg-neutral-800/60 border border-white/10 text-neutral-400 hover:text-white rounded-xs transition-all cursor-pointer"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Print Note banner */}
            <div className="p-5 bg-neutral-900/10 rounded-xs border border-white/5 flex items-start gap-3.5">
              <Sparkles className="w-4.5 h-4.5 text-neutral-400 mt-0.5 shrink-0" />
              <p className="text-xs text-neutral-500 font-sans leading-relaxed font-light">
                <span className="text-neutral-300 font-medium font-serif italic">Fine Art Prints:</span> All images in the photography catalog are available as signed, limited-edition archival pigment prints. Include the photograph title in the message box to request a sizing list.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Form Container */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-900/10 p-8 md:p-12 border border-white/10 rounded-xs text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="w-16 h-16 bg-white text-neutral-950 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-serif italic text-white tracking-tight mb-3">
                  Inquiry Dispatched
                </h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed mb-6 font-sans font-light">
                  Thank you for reaching out. Your proposal has been received directly in our studio logs. M. Bradescu will review your details and respond via email within 24–48 hours.
                </p>
                <button
                  id="contact-reset-btn"
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] tracking-widest uppercase font-mono text-neutral-400 hover:text-white underline underline-offset-4 focus:outline-none cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-neutral-900/10 p-8 md:p-10 border border-white/10 rounded-xs backdrop-blur-sm"
              >
                <h3 className="text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-400 font-bold border-b border-white/10 pb-4 mb-6">
                  Online Booking & Proposal Form
                </h3>

                {errorMsg && (
                  <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xs text-xs text-red-200 font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-name" className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      Your Name <span className="text-neutral-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Elena Sorenson"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 hover:border-white/20 text-sm text-white px-4 py-3 rounded-xs transition-colors focus:outline-none font-sans font-light"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-email" className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      Email Address <span className="text-neutral-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="form-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. elena@company.com"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 hover:border-white/20 text-sm text-white px-4 py-3 rounded-xs transition-colors focus:outline-none font-sans font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Select Services dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="form-service" className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      Project Service Category
                    </label>
                    <select
                      id="form-service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 hover:border-white/20 text-sm text-white px-4 py-3 rounded-xs transition-colors focus:outline-none font-sans cursor-pointer font-light"
                    >
                      {services.map((srv) => (
                        <option key={srv.value} value={srv.value} className="bg-neutral-950">
                          {srv.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-subject" className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      Subject Line / Project Name
                    </label>
                    <input
                      type="text"
                      id="form-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Autumn Editorial Walk"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 hover:border-white/20 text-sm text-white px-4 py-3 rounded-xs transition-colors focus:outline-none font-sans font-light"
                    />
                  </div>
                </div>

                {/* Message Text Area */}
                <div className="space-y-2">
                  <label htmlFor="form-message" className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    Project Goals or Inquiry Message <span className="text-neutral-500">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your design space, required video length, or photography goals in detail..."
                    className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 hover:border-white/20 text-sm text-white px-4 py-3 rounded-xs transition-colors focus:outline-none font-sans font-light resize-y min-h-[120px]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 text-[10px] tracking-[0.25em] uppercase font-mono font-bold text-neutral-950 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all py-4 rounded-xs focus:outline-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      Dispatching proposal...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-neutral-950" />
                      Submit Proposal
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
