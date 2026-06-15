import React from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
import { Shield, CreditCard, Activity, Cpu, Sparkles } from 'lucide-react';

// Real page imports in FSD structure
import HomePage from '@/pages/HomePage';
import GitPayPage from '@/pages/GitPayPage';
import PqcAuditPage from '@/pages/PqcAuditPage';
import GhostIDPage from '@/pages/GhostIDPage';

export default function App() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Overview', icon: Cpu },
    { href: '/gitpay', label: 'GitPay', icon: CreditCard },
    { href: '/pqc-audit', label: 'PQC Audit', icon: Activity },
    { href: '/ghostid', label: 'GhostID', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-space">
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Premium Top Navigation Header */}
      <header className="border-b border-[hsl(var(--border-subtle))] bg-[rgba(5,7,10,0.75)] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center font-bold text-white shadow-lg shadow-[#3b82f6]/20">
              V
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wider text-gradient flex items-center gap-1">
                VOID-REBIRTH <Sparkles className="w-3 h-3 text-[#3b82f6]" />
              </h1>
              <span className="text-[10px] text-muted tracking-widest uppercase">Local-First PQC Merchant</span>
            </div>
          </div>

          <nav className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Shell Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/gitpay" component={GitPayPage} />
          <Route path="/pqc-audit" component={PqcAuditPage} />
          <Route path="/ghostid" component={GhostIDPage} />
          <Route>
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold mb-4 text-gradient">404 — Void Space</h2>
              <p className="text-secondary mb-6">The context path does not exist in this domain.</p>
              <Link
                href="/"
                className="btn-primary px-6 py-3 rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-all"
              >
                Return to Dashboard
              </Link>
            </div>
          </Route>
        </Switch>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border-subtle))] py-6 text-center text-xs text-muted">
        <p>© 2026 VOID-REBIRTH. Open Source under AGPL-3.0. Decentralized & Self-Custodial.</p>
      </footer>
    </div>
  );
}
