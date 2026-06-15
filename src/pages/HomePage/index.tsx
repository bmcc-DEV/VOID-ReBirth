import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Shield, CreditCard, Activity, Cpu, Settings, ExternalLink, Library } from 'lucide-react';
import SettingsImport from '@/features/ghostid-deploy/SettingsImport';

export default function HomePage() {
  const [_, navigate] = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const catalogItems = [
    {
      title: 'GitPay Merchant',
      description: 'Processador de checkout soberano e local-first sem intermediários. Endereço e faturamento via chaves BIP32.',
      price: '1% tx support royalty',
      icon: CreditCard,
      action: () => navigate('/gitpay'),
      color: '#3b82f6'
    },
    {
      title: 'PQC Audit',
      description: 'Analise suas dependências legadas contra vulnerabilidades e prepare-as para criptografia pós-quântica.',
      price: '$2,000 (Relatório Completo)',
      icon: Activity,
      action: () => navigate('/pqc-audit'),
      color: '#8b5cf6'
    },
    {
      title: 'GhostID Deploy',
      description: 'Gere credenciais de identidade efêmeras baseadas em entropia biométrica e local com expiração automática.',
      price: 'Totalmente Gratuito',
      icon: Shield,
      action: () => navigate('/ghostid'),
      color: '#10b981'
    },
  ];

  return (
    <div className="space-y-10">
      {/* Banner / Hero Section */}
      <div className="glass-panel hero-banner p-8 md:p-12 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-4 max-w-xl">
          <span className="text-[10px] tracking-widest uppercase text-[#3b82f6] font-bold px-2.5 py-1 rounded-full bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] inline-block">
            Soberania Digital Local-First
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gradient">
            Infraestrutura sem hype e custo zero
          </h2>
          <p className="text-secondary text-sm md:text-base leading-relaxed">
            VOID-REBIRTH unifica criptografia pós-quântica (ML-KEM/ML-DSA), verificação redundante na blockchain do Bitcoin e chaves efêmeras locais sob uma stack serverless hospedada a custo $0/mês.
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--border-glow))] hover:bg-[rgba(255,255,255,0.04)] transition-all font-semibold text-sm active:scale-95"
        >
          <Settings className="w-4 h-4 text-secondary" /> Importar Banco Legado
        </button>
      </div>

      {/* Settings Modal (Expandable Import UI) */}
      {showSettings && (
        <div className="glass-panel p-6 border-b border-[hsl(var(--border-subtle))] bg-slate-950/40 relative animate-in fade-in slide-in-from-top-4 duration-300">
          <button
            onClick={() => setShowSettings(false)}
            className="absolute top-4 right-4 text-xs text-muted hover:text-primary transition-colors"
          >
            Fechar ✕
          </button>
          <SettingsImport />
        </div>
      )}

      {/* Catalog Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary tracking-wider uppercase">Catálogo de Ferramentas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalogItems.map((item, idx) => {
            const Icon = item.icon;
            const cardClasses = [
              'glass-panel',
              'card-border-top',
              'p-6',
              'flex',
              'flex-col',
              'justify-between',
              'items-start',
              'cursor-pointer',
              'transition-all',
              'group',
              'duration-300',
              idx === 0 ? 'card-merchant' : idx === 1 ? 'card-audit' : 'card-ghostid'
            ].join(' ');

            return (
              <div
                key={idx}
                onClick={item.action}
                className={cardClasses}
                style={{ '--card-color': item.color } as React.CSSProperties}
              >
                <div className="space-y-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-primary group-hover:text-[#3b82f6] transition-colors flex items-center gap-1.5">
                      {item.title} <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-secondary leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="mt-6 w-full flex justify-between items-center pt-4 border-t border-[rgba(255,255,255,0.03)] text-[10px] uppercase font-bold tracking-wider">
                  <span className="text-muted">Preço</span>
                  <span className="text-gradient">{item.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[hsl(var(--border-subtle))]">
        <div className="space-y-2">
          <h4 className="font-bold text-primary flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#3b82f6]" /> Filosofia Local-First
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Seus dados nunca saem do seu dispositivo. Transações, chaves e credenciais de identidades são armazenadas exclusivamente no IndexedDB local sob criptografia forte AES-GCM-256 baseada na WebCrypto API.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-primary flex items-center gap-2">
            <Library className="w-5 h-5 text-[#8b5cf6]" /> Licença AGPL-3.0 Livre
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Apoiamos o código aberto incondicional. Sem amarras artificiais de hardware DRM ou restrições proprietárias. O software é livre para rodar, auditar e modificar.
          </p>
        </div>
      </div>
    </div>
  );
}
