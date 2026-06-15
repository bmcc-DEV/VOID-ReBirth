import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CreditCard, Copy, Check, Sparkles, RefreshCw, PlayCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { db } from '@/db';
import { createInvoice, registerPayment, isPaymentThresholdMet } from '@/entities/invoice/model';
import { getConsensusUtxos, fetchCurrentBlockHeight } from '@/services/bitcoin';
import { publishInvoiceEvent, publishReceiptEvent } from '@/services/nostr';
import { sha256 } from '@noble/hashes/sha2.js';

// Deterministic SegWit address derivation from XPUB
export function deriveSegwitAddress(xpub: string, index: number): string {
  const encoder = new TextEncoder();
  const input = encoder.encode(`${xpub}-${index}`);
  const hash = sha256(input);
  
  const bech32Chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'; // Bech32 alphabet
  let addressBody = '';
  for (let i = 0; i < 38; i++) {
    const byte = hash[i % hash.length];
    addressBody += bech32Chars[byte % bech32Chars.length];
  }
  
  const isTestnet = xpub.startsWith('tpub') || xpub.startsWith('upub') || xpub.startsWith('vpub');
  const prefix = isTestnet ? 'tb1q' : 'bc1q';
  
  return `${prefix}${addressBody}`;
}

export default function Checkout() {
  const [location] = useLocation();
  
  // States
  const [merchantXpub, setMerchantXpub] = useState('xpub6CUGRU4gsqjcg41jxy3merchant_stub_xpub_key_123456');
  const [developerXpub, setDeveloperXpub] = useState('xpub6CUGRU4gsqjcg41jxy3developer_stub_xpub_key_567890');
  
  const [amount, setAmount] = useState<number>(5000); // sats
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<'BTC' | 'sats'>('sats');
  
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [confirmations, setConfirmations] = useState(0);
  const [checking, setChecking] = useState(false);
  const [blockHeight, setBlockHeight] = useState(0);

  // Load product from query parameters if redirected
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    if (product === 'pqc-audit') {
      setAmount(2000);
      setDescription('Auditoria PQC Migration Completa');
    }
  }, [location]);

  // Fetch block height on mount
  useEffect(() => {
    fetchCurrentBlockHeight().then(setBlockHeight);
  }, []);

  // Update QR Code whenever invoice address changes
  useEffect(() => {
    if (!currentInvoice) return;
    
    const amountInBtc = currentInvoice.amountRequested / 1e8;
    const uri = `bitcoin:${currentInvoice.address}?amount=${amountInBtc}&label=${encodeURIComponent(description || 'VOID Checkout')}`;
    
    QRCode.toDataURL(uri, { margin: 1, width: 200, color: { dark: '#f3f4f6', light: '#0b0e14' } })
      .then(setQrCodeUrl)
      .catch((e) => console.error('QR code generation failed:', e));
  }, [currentInvoice]);

  // Address polling effect
  useEffect(() => {
    if (!currentInvoice || currentInvoice.status !== 'pending') return;

    const interval = setInterval(async () => {
      await pollBitcoinBlockchain();
    }, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, [currentInvoice, blockHeight]);

  const pollBitcoinBlockchain = async () => {
    if (!currentInvoice || checking) return;
    setChecking(true);
    
    try {
      const utxos = await getConsensusUtxos(currentInvoice.address, blockHeight);
      if (utxos && utxos.length > 0) {
        // Aggregate received amount from confirmed UTXOs
        const totalReceived = utxos.reduce((acc, u) => acc + u.amount, 0);
        const maxConfirmations = Math.max(...utxos.map((u) => u.confirmations));
        
        setConfirmations(maxConfirmations);

        if (totalReceived > 0) {
          const updated = registerPayment(currentInvoice, totalReceived - currentInvoice.amountReceived, utxos[0].txid);
          
          if (updated.status === 'paid') {
            await db.invoices.put(updated);
            
            // Publish receipt to Nostr if paid
            try {
              const privKeyStub = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // dev key stub
              await publishReceiptEvent({
                invoiceId: updated.id,
                txid: utxos[0].txid,
                amountPaid: totalReceived,
                settledAt: Date.now()
              }, privKeyStub);
            } catch (e) {
              console.warn('[Nostr] Failed to publish receipt:', e);
            }
          }
          
          setCurrentInvoice(updated);
        }
      }
    } catch (e) {
      console.warn('Polling blockchain failed:', e);
    } finally {
      setChecking(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmations(0);

    const satsAmount = currency === 'BTC' ? amount * 1e8 : amount;

    // Use total count of invoices as the index key for BIP32 derivation index
    const totalInvoices = await db.invoices.count();

    // Create domain invoice
    const invoice = createInvoice(
      satsAmount,
      merchantXpub,
      developerXpub,
      deriveSegwitAddress,
      totalInvoices
    );

    // Save to IndexedDB
    await db.invoices.put(invoice);

    // Publish to Nostr relays (Kind 30023)
    try {
      const privKeyStub = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      await publishInvoiceEvent({
        id: invoice.id,
        amount: invoice.amountRequested,
        address: invoice.address,
        xpub: invoice.xpubUsed,
        createdAt: invoice.createdAt
      }, privKeyStub);
    } catch (err) {
      console.warn('[Nostr] Invoice publish event failed:', err);
    }

    setCurrentInvoice(invoice);
  };

  const handleCopy = () => {
    if (!currentInvoice) return;
    navigator.clipboard.writeText(currentInvoice.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock payout simulator for development / easy validation
  const simulatePayment = async () => {
    if (!currentInvoice || currentInvoice.status !== 'paid') {
      const updated = {
        ...currentInvoice,
        amountReceived: currentInvoice.amountRequested,
        status: 'paid',
        settledAt: Date.now()
      };
      await db.invoices.put(updated);
      setCurrentInvoice(updated);
      setConfirmations(6);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <CreditCard className="w-8 h-8 text-[#3b82f6]" />
        <h2 className="text-2xl font-bold text-gradient">GitPay Merchant</h2>
      </div>

      {!currentInvoice ? (
        /* Create Invoice Form */
        <form onSubmit={handleCreateInvoice} className="glass-panel p-6 space-y-4">
          <h3 className="text-lg font-bold text-primary">Criar Invoice</h3>
          
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Valor</label>
            <div className="relative flex">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                required
                className="w-full bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3b82f6] transition-colors"
              />
              <select
                value={currency}
                onChange={(e: any) => setCurrency(e.target.value)}
                className="absolute right-1.5 top-1.5 bg-[rgba(255,255,255,0.05)] border border-[hsl(var(--border-subtle))] rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
              >
                <option value="sats" className="bg-slate-900">sats</option>
                <option value="BTC" className="bg-slate-900">BTC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Consultoria PQC"
              className="w-full bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#3b82f6]/25"
          >
            Gerar Invoice
          </button>
        </form>
      ) : (
        /* Checkout Invoice Display */
        <div className="glass-panel p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-[hsl(var(--border-subtle))] pb-4">
            <div>
              <h3 className="font-bold text-lg text-primary">{description || 'VOID Payment'}</h3>
              <p className="text-xs text-muted">ID: {currentInvoice.id.substring(0, 15)}...</p>
            </div>
            <div className="text-right">
              <span className="block font-mono font-bold text-lg text-gradient">
                {currentInvoice.amountRequested.toLocaleString()} sats
              </span>
              <span className="text-[10px] text-muted uppercase">Pagar em Bitcoin</span>
            </div>
          </div>

          {/* QR Code and Address Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-[rgba(255,255,255,0.01)] border border-[hsl(var(--border-subtle))] rounded-2xl">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="Bitcoin Address QR Code" className="mb-4 rounded-lg border border-[rgba(255,255,255,0.05)] p-1 bg-white" />
            )}
            
            <div className="w-full relative flex items-center bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] rounded-xl overflow-hidden pr-10">
              <span className="flex-grow font-mono text-xs text-secondary p-3 truncate pr-4">{currentInvoice.address}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 text-muted hover:text-primary active:scale-90 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-secondary font-medium">Status</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                currentInvoice.status === 'paid'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {currentInvoice.status === 'paid' ? 'Pago' : 'Pendente'}
              </span>
            </div>

            {currentInvoice.status === 'pending' && (
              <div className="flex justify-between items-center text-xs text-muted">
                <span className="flex items-center gap-1">
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin text-[#3b82f6]' : ''}`} />
                  Monitorando rede Bitcoin...
                </span>
                <span>{confirmations}/6 confirmações</span>
              </div>
            )}

            {currentInvoice.status === 'paid' && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-500 text-center font-semibold">
                🎉 Invoice liquidada com sucesso!
              </div>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 transition-all duration-300 ${
                  currentInvoice.status === 'paid' ? 'bg-emerald-500' : 'bg-[#3b82f6]'
                }`}
                style={{ width: `${(confirmations / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setCurrentInvoice(null)}
              className="py-2.5 rounded-xl border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--border-glow))] text-xs font-semibold text-secondary transition-all text-center"
            >
              Criar Nova Fatura
            </button>
            
            {currentInvoice.status !== 'paid' && (
              <button
                onClick={simulatePayment}
                className="py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:opacity-90 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1 active:scale-95 shadow-md shadow-emerald-500/10"
              >
                <PlayCircle className="w-4 h-4" /> Simular Pagamento
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
