import React from 'react';
import { Link } from 'wouter';
import PqcAudit from '@/features/pqc-audit/PqcAudit';

export default function PqcAuditPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1.5 mb-4"
        >
          ◀ Voltar ao catálogo
        </Link>
      </div>
      <PqcAudit />
    </div>
  );
}
