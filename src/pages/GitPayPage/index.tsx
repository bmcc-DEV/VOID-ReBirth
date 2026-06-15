import React from 'react';
import { Link } from 'wouter';
import Checkout from '@/features/gitpay-merchant/Checkout';

export default function GitPayPage() {
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
      <Checkout />
    </div>
  );
}
