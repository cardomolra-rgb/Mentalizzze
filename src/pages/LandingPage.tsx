/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, ChevronRight, CheckCircle2, Phone, Mail, MapPin, 
  Instagram, Linkedin, Facebook, MessageCircle, ArrowRight,
  BarChart3, FileText, UserPlus, Users, Calculator, ShieldCheck,
  Star, ChevronDown
} from 'lucide-react';

// --- Logo Component ---
export const Logo = () => (
  <div className="flex items-center gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="38" height="38" className="shrink-0 drop-shadow-[0_2px_8px_rgba(201,168,76,0.35)]">
      <defs>
        <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5DFAB" />
          <stop offset="35%" stop-color="#C9A84C" />
          <stop offset="100%" stop-color="#917228" />
        </linearGradient>
      </defs>
      <path d="M18 80 L38 25 L50 50 L62 25 L82 80" fill="none" stroke="url(#logo-gold-grad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="50" cy="15" r="7" fill="url(#logo-gold-grad)" />
    </svg>
    <div className="flex flex-col items-start leading-none">
      <span className="text-lg font-bold text-white tracking-[0.2em] font-sans">MENTALIZZE</span>
      <span className="text-[7px] font-medium text-gold tracking-[0.35em] mt-1 opacity-90 uppercase">Consultoria Contábil</span>
    </div>
  </div>
);

// --- Navbar Component ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Serviços', href: '#servicos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Diagnóstico', href: '#diagnostico' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy-dark/80 backdrop-blur-lg py-4 border-b border-gold/15 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="hover:opacity-90 transition-opacity">
          <Logo />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-gold transition-colors tracking-wide">
              {link.name}
            </a>
          ))}
          <a href="#diagnostico" className="bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark font-bold py-2.5 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md shadow-gold/10 hover:shadow-gold/25">
            Diagnóstico Gratuito
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-dark/95 backdrop-blur-lg border-b border-gold/15 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#diagnostico" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-gold-gradient text-navy-dark font-bold py-3 px-6 rounded-full text-center shadow-lg"
              >
                Diagnóstico Gratuito
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ServiceCard = ({ icon: Icon, title, description, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    className="glass-panel p-8 rounded-2xl transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(201,168,76,0.12)]"
  >
    <div className="w-14 h-14 bg-gold/5 rounded-xl border border-gold/20 flex items-center justify-center mb-6 text-gold group-hover:bg-gold-gradient group-hover:text-navy-dark group-hover:border-transparent transition-all duration-300 shadow-inner">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-serif font-bold text-white mb-4 tracking-wide group-hover:text-gold-light transition-colors">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const StatItem = ({ number, label, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="glass-panel p-6 rounded-2xl text-center flex flex-col justify-center items-center h-full hover:shadow-[0_10px_30px_rgba(201,168,76,0.08)] transition-all"
  >
    <div className="text-4xl md:text-5xl font-serif font-bold text-gold-gradient mb-2">{number}</div>
    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{label}</div>
  </motion.div>
);

const TestimonialCard = ({ name, company, text, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="glass-panel p-8 rounded-2xl italic relative hover:border-gold/30 hover:shadow-[0_15px_40px_rgba(201,168,76,0.1)] transition-all duration-300"
  >
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => <Star key={i} size={15} className="fill-gold text-gold" />)}
    </div>
    <p className="text-gray-300 mb-6 leading-relaxed text-sm">"{text}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gold-gradient text-navy-dark font-bold flex items-center justify-center shadow-md shadow-gold/15">
        {name.charAt(0)}
      </div>
      <div>
        <div className="text-white font-bold not-italic text-sm">{name}</div>
        <div className="text-gold/80 text-xs not-italic font-medium">{company}</div>
      </div>
    </div>
  </motion.div>
);

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gold/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-gold transition-colors"
      >
        <span className="text-lg font-medium">{question}</span>
        <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    empresa: '',
    segmento: '',
    faturamento: '',
    regime: '',
    desafio: '',
    concordo: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          nome: '', whatsapp: '', email: '', empresa: '', segmento: '', faturamento: '', regime: '', desafio: '', concordo: false
        });
      } else {
        console.error("Erro ao enviar lead");
      }
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-gray-200 selection:bg-gold selection:text-navy-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-grid-pattern">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/10 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[120px] animate-glow pointer-events-none" />
        <div className="absolute top-1/3 right-1/10 w-[450px] h-[450px] bg-gold/5 rounded-full blur-[150px] animate-glow pointer-events-none [animation-delay:2s]" />
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-navy/0 via-navy/50 to-navy pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-bold uppercase tracking-widest mb-6"
              >
                Estratégia & Crescimento
              </motion.div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-8">
                Sua empresa merece uma contabilidade que <span className="text-gold-gradient font-extrabold">pensa junto</span> com você.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A Mentalizze vai além dos números. Somos parceiros estratégicos focados em transformar sua gestão contábil em uma ferramenta de crescimento real para o seu negócio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#diagnostico" className="bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-gold/20 hover:shadow-gold/35">
                  Quero meu Diagnóstico Gratuito <ArrowRight size={20} />
                </a>
                <a href="#servicos" className="border border-gold/30 hover:border-gold text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-gold/5 flex items-center justify-center hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]">
                  Conheça nossos serviços
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:w-1/2 relative flex justify-center lg:justify-end items-end min-h-[500px] lg:min-h-[700px]"
            >
              <div className="relative z-10 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mt-10 md:mt-0 flex justify-center lg:justify-end items-end">
                <img 
                  src="/foto_fundo.svg" 
                  alt="Equipe Mentalizze" 
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
                  }}
                  className="w-full h-auto max-h-[600px] lg:max-h-[750px] object-contain filter brightness-[0.95] contrast-[1.05] drop-shadow-[0_25px_60px_rgba(201,168,76,0.25)] hover:scale-[1.02] transition-all duration-700 relative z-20 rounded-2xl"
                />
              </div>
              
              {/* Subtle background decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24 bg-navy">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">O que fazemos por você</h2>
            <div className="w-20 h-1 bg-gold mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto">
              Soluções contábeis completas e personalizadas para cada etapa da sua jornada empreendedora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              index={0}
              icon={BarChart3}
              title="Contabilidade Empresarial"
              description="Escrituração contábil, balancetes, DRE e relatórios gerenciais para uma visão clara do seu negócio."
            />
            <ServiceCard 
              index={1}
              icon={ShieldCheck}
              title="Planejamento Tributário"
              description="Redução legal da carga tributária e escolha do melhor regime fiscal para otimizar seus lucros."
            />
            <ServiceCard 
              index={2}
              icon={UserPlus}
              title="Abertura e Legalização"
              description="CNPJ, alvarás, contratos sociais e toda a burocracia resolvida com agilidade e segurança."
            />
            <ServiceCard 
              index={3}
              icon={Users}
              title="Folha de Pagamento (RH)"
              description="Gestão completa de admissão, demissão, férias, encargos e conformidade com o e-Social."
            />
            <ServiceCard 
              index={4}
              icon={Calculator}
              title="Consultoria Financeira"
              description="Análise profunda de custos, fluxo de caixa e estratégias para manter a saúde financeira em dia."
            />
            <ServiceCard 
              index={5}
              icon={FileText}
              title="Imposto de Renda PF"
              description="Declaração de IR para pessoa física com análise detalhada para máxima restituição legal."
            />
          </div>
        </div>
      </section>

      {/* Why Mentalizze Section */}
      <section id="sobre" className="py-24 bg-navy/50 border-y border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">Por que a Mentalizze?</h2>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                Nascemos com o propósito de humanizar a contabilidade. Para nós, você não é apenas um CNPJ, mas um parceiro de negócios que busca segurança para crescer.
              </p>
              
              <div className="space-y-6">
                {[
                  "Atendimento personalizado e humanizado",
                  "Equipe especializada e certificada",
                  "Tecnologia e sistemas modernos",
                  "Relatórios claros e estratégicos",
                  "Conformidade fiscal garantida"
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-gray-200 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-8">
              <StatItem index={0} number="+500" label="Clientes Atendidos" />
              <StatItem index={1} number="10+" label="Anos de Experiência" />
              <StatItem index={2} number="98%" label="Satisfação" />
              <StatItem index={3} number="0" label="Multas por Falha" />
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis Form Section */}
      <section id="diagnostico" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-navy-dark border border-gold/25 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gold-gradient p-8 text-navy-dark text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5 pointer-events-none" />
              <h2 className="text-3xl font-serif font-bold mb-2">Receba seu Diagnóstico Contábil Gratuito</h2>
              <p className="font-semibold opacity-90 text-sm">Em menos de 24h, nossa equipe entra em contato com uma análise personalizada.</p>
            </div>
            
            <div className="p-8 md:p-12">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">Solicitação Enviada!</h3>
                  <p className="text-gray-400 mb-8">Obrigado pelo interesse. Nossa equipe entrará em contato em breve.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-gold font-bold hover:underline"
                  >
                    Enviar outra solicitação
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Nome completo *</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-navy/60 border border-gold/15 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors text-white"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">WhatsApp *</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-navy/60 border border-gold/15 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors text-white"
                      placeholder="(00) 00000-0000"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">E-mail *</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-navy/60 border border-gold/15 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors text-white"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Nome da empresa</label>
                    <input 
                      type="text" 
                      className="w-full bg-navy/60 border border-gold/15 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors text-white"
                      placeholder="Sua Empresa Ltda"
                      value={formData.empresa}
                      onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Segmento/Ramo</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-navy/60 border border-gold/15 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors appearance-none text-white cursor-pointer"
                        value={formData.segmento}
                        onChange={(e) => setFormData({...formData, segmento: e.target.value})}
                      >
                        <option value="" className="bg-navy-dark text-gray-400">Selecione...</option>
                        <option value="Serviços" className="bg-navy-dark text-white">Serviços</option>
                        <option value="Comércio" className="bg-navy-dark text-white">Comércio</option>
                        <option value="Indústria" className="bg-navy-dark text-white">Indústria</option>
                        <option value="Tecnologia" className="bg-navy-dark text-white">Tecnologia</option>
                        <option value="Outros" className="bg-navy-dark text-white">Outros</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Faturamento Mensal</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-navy/60 border border-gold/15 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors appearance-none text-white cursor-pointer"
                        value={formData.faturamento}
                        onChange={(e) => setFormData({...formData, faturamento: e.target.value})}
                      >
                        <option value="" className="bg-navy-dark text-gray-400">Selecione...</option>
                        <option value="Até R$10k" className="bg-navy-dark text-white">Até R$10k</option>
                        <option value="R$10k–50k" className="bg-navy-dark text-white">R$10k–50k</option>
                        <option value="R$50k–200k" className="bg-navy-dark text-white">R$50k–200k</option>
                        <option value="Acima de R$200k" className="bg-navy-dark text-white">Acima de R$200k</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-400">Regime Tributário Atual</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'Não sei'].map((regime) => (
                        <button
                          key={regime}
                          type="button"
                          onClick={() => setFormData({...formData, regime})}
                          className={`px-4 py-2.5 rounded-lg border text-sm transition-all duration-300 ${formData.regime === regime ? 'bg-gold-gradient text-navy-dark border-transparent shadow-lg shadow-gold/15 font-semibold' : 'border-gold/10 text-gray-400 hover:border-gold/30 hover:text-white'}`}
                        >
                          {regime}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-400">Principal desafio atual</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-navy/60 border border-gold/15 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors resize-none text-white"
                      placeholder="Como podemos te ajudar hoje?"
                      value={formData.desafio}
                      onChange={(e) => setFormData({...formData, desafio: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-start gap-3">
                    <input 
                      required
                      type="checkbox" 
                      id="concordo"
                      className="mt-1 accent-gold w-4 h-4 cursor-pointer"
                      checked={formData.concordo}
                      onChange={(e) => setFormData({...formData, concordo: e.target.checked})}
                    />
                    <label htmlFor="concordo" className="text-sm text-gray-400 cursor-pointer select-none">
                      Concordo em receber contato da Mentalizze para fins de diagnóstico contábil.
                    </label>
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button 
                      disabled={isSubmitting}
                      type="submit" 
                      className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-gold/15 hover:shadow-gold/25"
                    >
                      {isSubmitting ? 'Enviando...' : 'Quero meu Diagnóstico Gratuito'} <ArrowRight size={20} />
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-gray-500 uppercase tracking-widest border-t border-gold/10 pt-8">
                <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-gold" /> Seus dados estão seguros</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-gold" /> Sem compromisso</div>
                <div className="flex items-center gap-2"><ArrowRight size={14} className="text-gold" /> Resposta em 24h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-navy">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">O que dizem nossos clientes</h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              index={0}
              name="Ricardo Santos"
              company="TechFlow Solutions"
              text="A Mentalizze mudou nossa percepção sobre contabilidade. Hoje temos relatórios que realmente ajudam na tomada de decisão."
            />
            <TestimonialCard 
              index={1}
              name="Mariana Costa"
              company="Studio M Arquitetura"
              text="Atendimento impecável e humano. Resolveram toda a burocracia da minha empresa em tempo recorde. Recomendo muito!"
            />
            <TestimonialCard 
              index={2}
              name="André Oliveira"
              company="E-commerce Pro"
              text="O planejamento tributário que fizeram nos economizou milhares de reais logo no primeiro semestre. São especialistas de verdade."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-navy/50">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Dúvidas Frequentes</h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </div>

          <div className="space-y-2">
            <FAQItem 
              question="Quanto custa a contabilidade?"
              answer="Nossos honorários são personalizados de acordo com o porte, regime tributário e volume de movimentação da sua empresa. Oferecemos planos competitivos que cabem no seu orçamento."
            />
            <FAQItem 
              question="Posso trocar de contador sem problemas?"
              answer="Sim! O processo é simples e nós cuidamos de toda a transição documental para você, garantindo que não haja interrupção na sua conformidade fiscal."
            />
            <FAQItem 
              question="Atendem empresas de todo o Brasil?"
              answer="Sim, utilizamos tecnologia de ponta para atender clientes em todo o território nacional de forma digital e eficiente, sem perder o toque humano."
            />
            <FAQItem 
              question="O diagnóstico é realmente gratuito?"
              answer="Sim, o diagnóstico inicial é 100% gratuito e sem compromisso. Nosso objetivo é mostrar como podemos agregar valor ao seu negócio antes de qualquer contrato."
            />
            <FAQItem 
              question="Quanto tempo leva para abrir meu CNPJ?"
              answer="Dependendo da cidade e do tipo de empresa, o processo costuma levar entre 5 a 15 dias úteis. Nós cuidamos de todas as etapas burocráticas."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-navy border-t border-gold/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-3xl rounded-full" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
            Dê o primeiro passo rumo a uma <br className="hidden md:block" /> <span className="text-gold-gradient">contabilidade estratégica</span>.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="#diagnostico" className="bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark font-bold py-5 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-gold/20 hover:shadow-gold/35">
              Agendar meu Diagnóstico Gratuito
            </a>
            <a href="https://wa.me/5563985159252" target="_blank" className="flex items-center gap-3 text-white font-bold hover:text-gold transition-colors text-lg font-medium">
              <MessageCircle size={24} className="text-green-500" /> Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-navy pt-20 pb-10 border-t border-gold/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <Logo />
              <p className="text-gray-400 leading-relaxed text-sm">
                Transformando a contabilidade em uma poderosa ferramenta de estratégia e crescimento para o seu negócio.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mentalizzecontabilidade?igsh=OHVsODh6OXM4djB0" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold-gradient hover:text-navy-dark hover:border-transparent transition-all shadow-md"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold-gradient hover:text-navy-dark hover:border-transparent transition-all shadow-md"><Linkedin size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold-gradient hover:text-navy-dark hover:border-transparent transition-all shadow-md"><Facebook size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Links Rápidos</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#servicos" className="hover:text-gold transition-colors">Serviços</a></li>
                <li><a href="#sobre" className="hover:text-gold transition-colors">Sobre Nós</a></li>
                <li><a href="#diagnostico" className="hover:text-gold transition-colors">Diagnóstico Gratuito</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contato</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3"><MapPin size={18} className="text-gold shrink-0" /> Quadra ARSE 81 (804 SUL), Alameda 14, H.M, Lote 16 Salas Nº 105-c e 105-d Edificio GRS Empresarial</li>
                <li className="flex items-center gap-3"><a href="https://wa.me/5563985159252" target="_blank" className="hover:text-gold transition-colors flex items-center gap-3"><Phone size={18} className="text-gold shrink-0" /> +55 (63) 98515-9252</a></li>
                <li className="flex items-center gap-3"><a href="mailto:mentalizecontabilidade@gmail.com" className="hover:text-gold transition-colors flex items-center gap-3"><Mail size={18} className="text-gold shrink-0" /> mentalizecontabilidade@gmail.com</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Newsletter</h4>
              <p className="text-gray-400 text-xs mb-4">Receba insights estratégicos no seu e-mail.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Seu e-mail" className="bg-navy/50 border border-gold/20 rounded-lg px-4 py-2 w-full outline-none focus:border-gold text-sm text-white" />
                <button className="bg-gold-gradient text-navy-dark p-2.5 rounded-lg hover:bg-gold-gradient-hover transition-colors shadow-md"><ArrowRight size={18} /></button>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
            <div>CRC/TO 00000/O-0</div>
            <div>Copyright © 2025 Mentalizze Consultoria Contábil. Todos os direitos reservados.</div>
          </div>
        </div>
      </footer >

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5563985159252" 
        target="_blank"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:scale-110 hover:shadow-[0_4px_30px_rgba(34,197,94,0.65)] transition-all group duration-300 active:scale-95"
      >
        <span className="absolute right-20 bg-navy-dark border border-gold/20 text-white text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
          Fale Conosco no WhatsApp
        </span>
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
