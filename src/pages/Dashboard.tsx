/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, BarChart3, Clock, CheckCircle2, XCircle, 
  Search, Filter, ExternalLink, RefreshCw, LogOut,
  MessageCircle, Mail, Phone, Building2, Briefcase, TrendingUp,
  Plus, Trash2, Lock, Eye, EyeOff, ShieldCheck
} from 'lucide-react';
import { Logo } from './LandingPage';

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  empresa: string;
  segmento: string;
  faturamento: string;
  regime: string;
  desafio: string;
  status: 'novo' | 'em_atendimento' | 'concluido' | 'descartado';
  data: string;
}

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || '';
    }
    return '';
  });
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New States for Settings Tab
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
  const [settingsEmails, setSettingsEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    setToken(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', data.token);
        }
        setToken(data.token);
      } else {
        setLoginError(data.error || "Erro ao efetuar login.");
      }
    } catch (error) {
      setLoginError("Erro de conexão com o servidor.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      setChangePasswordError("As senhas novas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setChangePasswordLoading(true);
    setChangePasswordSuccess('');
    setChangePasswordError('');
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setChangePasswordSuccess("Senha alterada com sucesso!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setChangePasswordSuccess(''), 4000);
      } else {
        setChangePasswordError(data.error || "Erro ao alterar a senha.");
      }
    } catch (error) {
      setChangePasswordError("Erro de conexão ao alterar a senha.");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const fetchLeads = async (authToken?: string) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    setLoading(true);
    try {
      const response = await fetch('/api/leads', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async (authToken?: string) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    try {
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      setSettingsEmails(data.emails || []);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeads(token);
      fetchSettings(token);
    }
  }, [token]);

  const handleAddEmail = () => {
    const emailTrim = newEmail.trim();
    if (!emailTrim) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }
    if (settingsEmails.includes(emailTrim)) {
      alert("Este e-mail já foi adicionado.");
      return;
    }
    setSettingsEmails([...settingsEmails, emailTrim]);
    setNewEmail('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setSettingsEmails(settingsEmails.filter(email => email !== emailToRemove));
  };



  const handleSaveSettings = async () => {
    if (!token) return;
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError('');
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emails: settingsEmails }),
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        const errData = await response.json();
        setSaveError(errData.error || "Erro ao salvar configurações no servidor.");
      }
    } catch (error) {
      setSaveError("Erro de conexão ao salvar configurações.");
    } finally {
      setSaveLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    novos: leads.filter(l => l.status === 'novo').length,
    emAtendimento: leads.filter(l => l.status === 'em_atendimento').length,
    concluidos: leads.filter(l => l.status === 'concluido').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'em_atendimento': return 'bg-gold/20 text-gold border-gold/30';
      case 'concluido': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'descartado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'em_atendimento': return 'Em Atendimento';
      case 'concluido': return 'Concluído';
      case 'descartado': return 'Descartado';
      default: return status;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-navy text-gray-200 font-sans flex items-center justify-center relative overflow-hidden px-4">
        {/* Ambient background decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md z-10">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-2xl border border-gold/15 shadow-2xl flex flex-col gap-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-serif font-bold text-white mb-2">Painel do Administrador</h2>
              <p className="text-gray-400 text-sm">Entre com suas credenciais de acesso</p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-gold font-bold">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="email" 
                    required
                    placeholder="admin@email.com"
                    className="w-full bg-navy border border-gold/20 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-gold transition-colors text-white placeholder-gray-600 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-gold font-bold">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className="w-full bg-navy border border-gold/20 rounded-xl pl-12 pr-12 py-3 outline-none focus:border-gold transition-colors text-white placeholder-gray-600 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loginLoading}
                className="bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm shadow-lg shadow-gold/15 mt-2 flex items-center justify-center gap-2 hover:scale-[1.01] transform cursor-pointer"
              >
                {loginLoading ? 'Verificando...' : 'Acessar Painel'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-gray-200 font-sans">
      {/* Sidebar / Header */}
      <header className="bg-navy/80 backdrop-blur-md border-b border-gold/20 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchLeads()}
              className="p-2 hover:bg-gold/10 rounded-full text-gold transition-colors"
              title="Atualizar"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="h-8 w-px bg-gold/20 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                A
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold text-white">Admin Mentalizze</div>
                <div className="text-xs text-gray-500">Administrador</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 rounded-full text-red-400 transition-colors ml-2 flex items-center gap-1 text-sm font-semibold border border-red-500/20 px-3 cursor-pointer"
              title="Sair do Painel"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gold/15 mb-8 gap-6">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative outline-none ${activeTab === 'leads' ? 'text-gold border-b-2 border-gold font-extrabold' : 'text-gray-400 hover:text-white'}`}
          >
            Lista de Leads
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative outline-none ${activeTab === 'settings' ? 'text-gold border-b-2 border-gold font-extrabold' : 'text-gray-400 hover:text-white'}`}
          >
            Configuração de Notificações
          </button>
        </div>

        {activeTab === 'settings' ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Email Settings Card */}
            <div className="glass-panel p-8 rounded-2xl border border-gold/15 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                    <Mail size={20} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">E-mails para Notificações</h3>
                </div>
                <p className="text-gray-400 text-sm">Adicione os endereços de e-mail que receberão os alertas de novos diagnósticos.</p>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="exemplo@email.com"
                  className="bg-navy border border-gold/20 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors text-white w-full text-sm placeholder-gray-500"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                />
                <button 
                  onClick={handleAddEmail}
                  className="bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-1.5 whitespace-nowrap shadow-md cursor-pointer"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>

              <div className="divide-y divide-gold/10 max-h-60 overflow-y-auto pr-2">
                {settingsEmails.length === 0 ? (
                  <div className="py-8 text-gray-500 text-sm text-center">Nenhum e-mail cadastrado.</div>
                ) : (
                  settingsEmails.map((email, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 group">
                      <span className="text-gray-300 text-sm">{email}</span>
                      <button 
                        onClick={() => handleRemoveEmail(email)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Security / Password Change Card */}
            <div className="glass-panel p-8 rounded-2xl border border-gold/15 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">Segurança de Acesso</h3>
                </div>
                <p className="text-gray-400 text-sm">Altere a senha mestre utilizada para acessar a área administrativa.</p>
              </div>

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-gold font-bold">Senha Atual</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      required
                      placeholder="Senha atual mestre"
                      className="w-full bg-navy border border-gold/20 rounded-xl pl-12 pr-12 py-3 outline-none focus:border-gold transition-colors text-white text-sm"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-gold font-bold">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      required
                      placeholder="Nova senha"
                      className="w-full bg-navy border border-gold/20 rounded-xl pl-12 pr-12 py-3 outline-none focus:border-gold transition-colors text-white text-sm"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-gold font-bold">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      required
                      placeholder="Confirmar senha"
                      className="w-full bg-navy border border-gold/20 rounded-xl pl-12 pr-12 py-3 outline-none focus:border-gold transition-colors text-white text-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                  <div className="text-sm">
                    {changePasswordSuccess && <span className="text-green-400 font-semibold flex items-center gap-1.5">✓ {changePasswordSuccess}</span>}
                    {changePasswordError && <span className="text-red-400 font-semibold flex items-center gap-1.5">⚠ {changePasswordError}</span>}
                  </div>
                  <button 
                    type="submit"
                    disabled={changePasswordLoading}
                    className="bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 text-sm shadow-md cursor-pointer hover:scale-[1.02] transform"
                  >
                    {changePasswordLoading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            </div>

            {/* Action Bar */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 bg-navy-dark/40 border border-gold/15 p-6 rounded-2xl">
              <div>
                {saveSuccess && <span className="text-green-400 font-semibold text-sm flex items-center gap-1.5">✓ Configurações salvas com sucesso!</span>}
                {saveError && <span className="text-red-400 font-semibold text-sm flex items-center gap-1.5">⚠ {saveError}</span>}
                {!saveSuccess && !saveError && <span className="text-gray-400 text-sm">Lembre-se de salvar suas alterações para que tenham efeito.</span>}
              </div>
              <button 
                onClick={handleSaveSettings}
                disabled={saveLoading}
                className="bg-gold-gradient hover:bg-gold-gradient-hover text-navy-dark px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm shadow-lg shadow-gold/15 flex items-center gap-2 hover:scale-[1.02] transform cursor-pointer"
              >
                {saveLoading ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard icon={Users} label="Total de Leads" value={stats.total} color="text-white" />
              <StatCard icon={Clock} label="Novos" value={stats.novos} color="text-blue-400" />
              <StatCard icon={RefreshCw} label="Em Atendimento" value={stats.emAtendimento} color="text-gold" />
              <StatCard icon={CheckCircle2} label="Concluídos" value={stats.concluidos} color="text-green-400" />
            </div>

            {/* Filters and Search */}
            <div className="bg-navy/50 border border-gold/10 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome ou empresa..."
                  className="w-full bg-navy border border-gold/20 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-gold transition-colors text-white placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Filter className="text-gray-500" size={18} />
                <select 
                  className="bg-navy border border-gold/20 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors appearance-none min-w-[160px] text-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="todos">Todos os Status</option>
                  <option value="novo">Novos</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="concluido">Concluídos</option>
                  <option value="descartado">Descartados</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-navy/50 border border-gold/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gold/5 border-b border-gold/10">
                      <th className="px-6 py-4 text-sm font-bold text-gold uppercase tracking-wider">Lead</th>
                      <th className="px-6 py-4 text-sm font-bold text-gold uppercase tracking-wider">Empresa / Segmento</th>
                      <th className="px-6 py-4 text-sm font-bold text-gold uppercase tracking-wider">Faturamento / Regime</th>
                      <th className="px-6 py-4 text-sm font-bold text-gold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-sm font-bold text-gold uppercase tracking-wider">Data</th>
                      <th className="px-6 py-4 text-sm font-bold text-gold uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
                          Carregando leads...
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                          Nenhum lead encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gold/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{lead.nome}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <Mail size={12} /> {lead.email}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              <Phone size={12} /> {lead.whatsapp}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Building2 size={14} className="text-gold" /> {lead.empresa}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{lead.segmento}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-300">
                              <TrendingUp size={14} className="text-gold" /> {lead.faturamento}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{lead.regime}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                              {getStatusLabel(lead.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(lead.data).toLocaleDateString('pt-BR')}
                            <div className="text-xs opacity-50">{new Date(lead.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select 
                                className="bg-navy border border-gold/20 rounded-lg px-2 py-1 text-xs outline-none focus:border-gold transition-colors text-white cursor-pointer"
                                value={lead.status}
                                onChange={(e) => updateStatus(lead.id, e.target.value)}
                              >
                                <option value="novo" className="bg-navy-dark">Novo</option>
                                <option value="em_atendimento" className="bg-navy-dark">Em Atendimento</option>
                                <option value="concluido" className="bg-navy-dark">Concluído</option>
                                <option value="descartado" className="bg-navy-dark">Descartado</option>
                              </select>
                              <a 
                                href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} 
                                target="_blank"
                                className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                title="WhatsApp"
                              >
                                <MessageCircle size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-navy/50 border border-gold/10 rounded-2xl p-6 flex items-center gap-6">
      <div className={`w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center ${color}`}>
        <Icon size={28} />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}
