/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, ShieldCheck, ChevronRight, Menu, Heart, Users, Sparkles, BookOpen, CheckCircle2, Award, Mail, Phone, Quote, X } from 'lucide-react';
import siteData from './data.json';

const IconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="text-sage-light" size={24} />,
  Users: <Users className="text-sage-light" size={24} />,
  Sparkles: <Sparkles className="text-sage-light" size={24} />,
  BookOpen: <BookOpen className="text-sage-light" size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  MapPin: <MapPin className="text-sage-light" size={20} />,
  Clock: <Clock className="text-sage-light" size={20} />,
};

const EndorsementCard = ({ endorsement, index, onSelect }: any) => {
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const checkClamping = () => {
      if (textRef.current) {
        setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };

    checkClamping();
    window.addEventListener('resize', checkClamping);
    return () => window.removeEventListener('resize', checkClamping);
  }, [endorsement.blurb]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-shrink-0 w-[75vw] md:w-[350px] bg-cream/50 rounded-[32px] p-6 md:p-8 border border-sage-deep/10 snap-center hover:shadow-lg transition-shadow flex flex-col group/card"
    >
      <Quote className="text-sage-light/30 mb-4 flex-shrink-0" size={32} />
      <div className="relative flex-grow">
        <p 
          ref={textRef}
          className="text-base md:text-lg text-taupe leading-relaxed italic line-clamp-6"
        >
          "{endorsement.blurb}"
        </p>
        {isClamped && (
          <button 
            onClick={() => onSelect(endorsement)}
            className="mt-2 text-sage-deep font-bold text-sm uppercase tracking-wider hover:text-sage-light transition-colors"
          >
            Read More
          </button>
        )}
      </div>
      <div className="mt-8 pt-6 border-t border-sage-deep/10">
        <h4 className="font-serif text-lg md:text-xl text-sage-deep">{endorsement.name}</h4>
        <p className="text-xs text-sage-light uppercase tracking-widest font-bold mt-1">
          {endorsement.title}
        </p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedEndorsement, setSelectedEndorsement] = useState<typeof siteData.endorsements.list[0] | null>(null);

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActiveSection(visible[0].target.id);
      }
    };

    const handleScroll = () => {
      // Force 'hero' state when at the very top of the page
      if (window.scrollY < 50) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['hero', 'about', 'contact', 'appointments', 'services', 'endorsements', 'insurance'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission to Formspree
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-black/5 px-6 md:px-16 py-0 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center space-x-3"
        >
          <img src={siteData.logo} alt="Logo" className="h-20 w-auto" referrerPolicy="no-referrer" />
          <div className="text-xl md:text-2xl font-serif font-bold italic text-sage-deep">
            PNW Christian Counseling
          </div>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-8">
          {siteData.navigation.map((item, index) => {
            const isActive = activeSection === item.href.replace('#', '');
            const isClientPortal = item.name === "Client Portal";
            
            return (
              <React.Fragment key={`${item.name}-${index}`}>
                {isClientPortal && (
                  <div className="h-4 w-px bg-black/10" />
                )}
                <a 
                  href={item.href} 
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`relative text-xs uppercase tracking-widest font-medium transition-all py-2 ${
                    item.special 
                      ? "bg-sage-deep text-white px-6 py-2.5 rounded-full hover:bg-sage-light shadow-md hover:shadow-lg" 
                      : isActive ? "text-sage-deep" : "text-taupe hover:text-sage-deep"
                  }`}
                >
                  {item.name}
                  {!item.special && isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sage-deep rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </React.Fragment>
            );
          })}
        </nav>

        <button 
          className="md:hidden text-sage-deep p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-black/5 md:hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {siteData.navigation.map((item, index) => (
                <a 
                  key={`${item.name}-${index}`} 
                  href={item.href} 
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm uppercase tracking-widest font-medium transition-all ${
                    item.special 
                      ? "bg-sage-deep text-white px-6 py-3 rounded-full text-center shadow-md" 
                      : "text-sage-deep hover:text-sage-light"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={siteData.hero.backgroundImage} 
            alt="Shore Pebbles" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-5xl md:text-8xl text-white font-serif leading-tight"
          >
            {siteData.hero.headline}
          </motion.h1>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white/90 text-lg md:text-2xl font-light tracking-wide">
            {siteData.hero.subheaders.map((text, i) => (
              <React.Fragment key={i}>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.2), duration: 0.8, ease: "easeOut" }}
                >
                  {text}
                </motion.span>
                {i < siteData.hero.subheaders.length - 1 && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 0.6 + (i * 0.2), duration: 0.8 }}
                    className="hidden md:inline text-white"
                  >
                    •
                  </motion.span>
                )}
              </React.Fragment>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.0, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <a href="#contact" className="bg-white text-sage-deep px-10 py-4 rounded-full font-semibold hover:bg-cream transition-all inline-flex items-center space-x-2">
              <span>{siteData.hero.ctaPrimary}</span>
              <ChevronRight size={18} />
            </a>
            <a href="#appointments" className="border border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white/10 transition-all">
              {siteData.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="relative w-9/10 mx-auto lg:mx-0"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src={siteData.about.image} 
                alt={siteData.about.name} 
                className="object-cover w-full h-full object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl hidden md:block">
              <p className="text-sage-deep font-serif text-xl italic">"{siteData.about.quote}"</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-sage-light font-bold">{siteData.about.badge}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-sage-deep">
                {siteData.about.name}
                <span className="block text-lg md:text-xl font-sans font-medium text-sage-light mt-1 uppercase tracking-wide">
                  {siteData.about.certifications}
                </span>
              </h2>
              {siteData.about.bio.map((para, i) => (
                <p key={i} className={i === 0 ? "text-lg text-taupe leading-relaxed" : "text-base text-ink/80 leading-relaxed"}>
                  {para}
                </p>
              ))}
            </div>

            {/* Additional Credentials */}
            <div className="space-y-3 pt-2">
              {siteData.about.additionalCredentials.map((credential, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm text-taupe">
                  <Award size={16} className="text-sage-light shrink-0" />
                  <span>{credential}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              {siteData.about.stats.map((stat, i) => {
                const isYearsExp = stat.label === "Years Experience";
                const displayValue = isYearsExp 
                  ? `${new Date().getFullYear() - 2016}+` 
                  : stat.value;
                
                return (
                  <div key={i}>
                    <span className="block text-2xl font-serif text-sage-deep">{displayValue}</span>
                    <span className="text-xs uppercase tracking-widest text-taupe">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-16 bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Column 1: Full Column Image */}
          <div className="h-full min-h-[400px] lg:min-h-0 lg:col-span-3">
            <img 
              src={siteData.contact.image} 
              alt="Office Space" 
              className="w-full h-full object-cover rounded-[40px] shadow-2xl border border-sage-deep/5"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Column 2: Info */}
          <div className="space-y-8 flex flex-col justify-center lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif text-sage-deep leading-tight">{siteData.contact.headline}</h2>
              <p className="text-lg text-taupe leading-relaxed">
                {siteData.contact.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-sage-deep/5 text-sage-light group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-taupe font-bold">Email</span>
                  <a href={`mailto:${siteData.footer.contact.email}`} className="text-sage-deep hover:text-sage-light transition-colors">
                    {siteData.footer.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-sage-deep/5 text-sage-light group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-taupe font-bold">Phone</span>
                  <span className="text-sage-deep">{siteData.footer.contact.phone}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-sage-deep/5 text-sage-light group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-taupe font-bold">Location</span>
                  <span className="text-sage-deep">{siteData.footer.contact.address}, {siteData.footer.contact.cityState}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-sage-deep/5 lg:col-span-6"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-sage-light/20 text-sage-deep rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-serif text-sage-deep">{siteData.contact.form.successHeadline}</h3>
                <p className="text-taupe">{siteData.contact.form.successText}</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-sage-deep font-semibold hover:underline"
                >
                  {siteData.contact.form.successCta}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink/70">{siteData.contact.form.firstNameLabel}</label>
                    <input 
                      required
                      type="text" 
                      placeholder={siteData.contact.form.firstNamePlaceholder}
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-sage-light/20 focus:border-sage-light outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink/70">{siteData.contact.form.lastNameLabel}</label>
                    <input 
                      required
                      type="text" 
                      placeholder={siteData.contact.form.lastNamePlaceholder}
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-sage-light/20 focus:border-sage-light outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink/70">{siteData.contact.form.emailLabel}</label>
                  <input 
                    required
                    type="email" 
                    placeholder={siteData.contact.form.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-sage-light/20 focus:border-sage-light outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink/70">{siteData.contact.form.messageLabel}</label>
                  <textarea 
                    required
                    placeholder={siteData.contact.form.messagePlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 resize-none focus:ring-2 focus:ring-sage-light/20 focus:border-sage-light outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sage-deep text-white py-4 rounded-full font-semibold tracking-wide hover:bg-sage-deep/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  <span>{isSubmitting ? siteData.contact.form.submittingText : siteData.contact.form.submitButton}</span>
                  {!isSubmitting && <ChevronRight size={18} />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Appointments & Office Hours Section */}
      <section id="appointments" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Appointments */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-sage-deep">{siteData.appointments.headline}</h2>
              <div className="space-y-8">
                {siteData.appointments.details.map((detail, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-sm uppercase tracking-widest text-sage-light font-bold">{detail.label}</h4>
                    <p className="text-lg text-taupe leading-relaxed">{detail.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="bg-cream rounded-[40px] shadow-xl border border-sage-deep/5 overflow-hidden self-start"
            >
              <div className="bg-sage-deep p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-serif text-white">{siteData.appointments.officeHours.headline}</h2>
              </div>
              <div className="p-6 md:p-8 space-y-2">
                {siteData.appointments.officeHours.schedule.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-sage-deep/5 last:border-0">
                    <span className="font-medium text-sage-deep">{item.day}</span>
                    <span className="text-taupe">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 md:px-16 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-sage-deep">{siteData.services.headline}</h2>
            <p className="text-taupe max-w-2xl mx-auto">{siteData.services.subheadline}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteData.services.items.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 1.0, ease: "easeOut" }}
                className="p-8 rounded-3xl bg-white border border-sage-deep/10 hover:shadow-xl transition-all group"
              >
                <div className="mb-6 p-3 bg-cream rounded-2xl border-sage-deep/10 inline-block shadow-sm group-hover:scale-110 transition-transform">
                  {IconMap[service.icon]}
                </div>
                <h3 className="text-xl font-serif text-sage-deep mb-4">{service.title}</h3>
                <p className="text-sm text-taupe leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 p-12 rounded-[40px] bg-sage-deep text-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-1">
                <h3 className="text-3xl font-serif mb-4">{siteData.services.focus.headline}</h3>
                <p className="text-sage-light/80">{siteData.services.focus.subheadline}</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                {siteData.services.focus.areas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 size={16} className="text-sage-light" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Endorsements Section */}
      <section id="endorsements" className="py-24 px-6 md:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-sage-deep">{siteData.endorsements.headline}</h2>
            <p className="text-taupe max-w-2xl mx-auto">{siteData.endorsements.subheadline}</p>
          </motion.div>

          <div className="relative group">
            <div 
              id="endorsement-scroll"
              className="flex overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:mx-0 md:px-0"
            >
              <div className="flex space-x-6 min-w-full">
                {siteData.endorsements.list.map((endorsement, index) => (
                  <EndorsementCard 
                    key={index} 
                    endorsement={endorsement} 
                    index={index} 
                    onSelect={setSelectedEndorsement} 
                  />
                ))}
              </div>
            </div>
            
            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 -right-4 justify-between pointer-events-none">
              <button 
                onClick={() => document.getElementById('endorsement-scroll')?.scrollBy({ left: -374, behavior: 'smooth' })}
                className="pointer-events-auto bg-white shadow-lg border border-sage-deep/10 p-3 rounded-full text-sage-deep hover:bg-sage-deep hover:text-white transition-all transform -translate-x-1/2"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <button 
                onClick={() => document.getElementById('endorsement-scroll')?.scrollBy({ left: 374, behavior: 'smooth' })}
                className="pointer-events-auto bg-white shadow-lg border border-sage-deep/10 p-3 rounded-full text-sage-deep hover:bg-sage-deep hover:text-white transition-all transform translate-x-1/2"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section id="insurance" className="py-24 px-6 md:px-16 bg-sage-deep">
        <div className="max-w-5xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white">{siteData.insurance.headline}</h2>
            
            {/* Insurance Logos */}
            <div className="mt-20 px-4 rounded-[40px] bg-cream">
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-8">
                {siteData.insurance.logos.map((logo, index) => (
                  <motion.img 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    src={logo.src}
                    alt="Insurance Provider"
                    style={{ width: `${logo.width}px` }}
                    className="h-auto transition-all duration-300 hover:scale-110 hover:drop-shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>

            <p className="text-lg text-cream leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
              {siteData.insurance.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {siteData.insurance.providers.map((provider, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex items-center space-x-3 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm"
              >
                <CheckCircle2 size={16} className="text-sage-light shrink-0" />
                <span className="text-xs font-medium text-white leading-tight">{provider}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-12 bg-cream border-t border-black/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="flex items-center space-x-3">
            <img src={siteData.logo} alt="Logo" className="h-20 w-auto opacity-80" referrerPolicy="no-referrer" />
            <div className="text-xl font-serif font-bold italic text-sage-deep">
              PNW Christian Counseling
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-sage-light font-bold">{siteData.footer.contact.title}</h4>
            <div className="space-y-2 text-sm text-taupe">
              <p className="hover:text-sage-deep transition-colors">
                <a href={`mailto:${siteData.footer.contact.email}`}>{siteData.footer.contact.email}</a>
              </p>
              <p>{siteData.footer.contact.phone}</p>
              <p>
                {siteData.footer.contact.address}<br />
                {siteData.footer.contact.cityState}
              </p>
              <p className="pt-2">
                <a 
                  href={siteData.footer.contact.psychologyTodayUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-sage-deep font-medium hover:underline"
                >
                  <span>Psychology Today Profile</span>
                  <ChevronRight size={14} />
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end justify-center h-full space-y-4">
            <div className="text-xs text-taupe/60 uppercase tracking-widest">
              © {new Date().getFullYear()} {siteData.footer.copyright}
            </div>
          </div>
        </div>
      </footer>

      {/* Endorsement Modal */}
      <AnimatePresence>
        {selectedEndorsement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEndorsement(null)}
              className="absolute inset-0 bg-sage-deep/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-cream w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedEndorsement(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-sage-deep/5 text-sage-deep hover:bg-sage-deep hover:text-white transition-all z-10"
              >
                <X size={24} />
              </button>
              
              <div className="p-8 md:p-12">
                <Quote className="text-sage-light/20 mb-8" size={60} />
                <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <p className="text-base md:text-lg text-taupe leading-relaxed italic">
                    "{selectedEndorsement.blurb}"
                  </p>
                </div>
                
                <div className="mt-12 pt-8 border-t border-sage-deep/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-2xl text-sage-deep">{selectedEndorsement.name}</h4>
                    <p className="text-sm text-sage-light uppercase tracking-widest font-bold mt-1">
                      {selectedEndorsement.title}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
