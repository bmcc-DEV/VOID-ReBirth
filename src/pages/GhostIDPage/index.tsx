import React from 'react';
import { Link } from 'wouter';
import GhostIdGenerator from '@/features/ghostid-deploy/GhostIdGenerator';

export default function GhostIDPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1.5 mb-4"
        >
          ◀ Voltar ao catálogo
        </Link>
      </div>
      <GhostIdGenerator />
    </div>
  );
}
