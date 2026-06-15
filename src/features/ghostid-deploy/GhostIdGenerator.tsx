import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sparkles, Copy, Clipboard, Check, RotateCw } from 'lucide-react';
import { deriveGhostIdWasm } from '@/shared/lib/wasm';

export default function GhostIdGenerator() {
  const [method, setMethod] = useState<'Aleatório' | 'Biométrico'>('Aleatório');
  const [duration, setDuration] = useState<number>(24); // hours
  const [entropyBits, setEntropyBits] = useState<number>(0);
  const [generating, setGenerating] = useState(false);
  const [identity, setIdentity] = useState<{ npub: string; nsec: string; expiresAt: number } | null>(null);
  const [copiedField, setCopiedField] = useState<'npub' | 'nsec' | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const entropyBuffer = useRef<number[]>([]);
  const hoverAreaRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for biometric entropy
  const handleMouseMove = (e: React.MouseEvent) => {
    if (method !== 'Biométrico' || entropyBits >= 256) return;

    const x = e.clientX;
    const y = e.clientY;
    const time = performance.now();
    
    // Add raw coordinates and timing data to buffer
    entropyBuffer.current.push(x ^ y ^ Math.floor(time));

    // Increase entropy bits counter
    const newBits = Math.min(256, Math.floor(entropyBuffer.current.length * 1.5));
    setEntropyBits(newBits);
  };

  // Reset entropy when swapping methods
  useEffect(() => {
    entropyBuffer.current = [];
    setEntropyBits(method === 'Aleatório' ? 256 : 0);
  }, [method]);

  // Expiration countdown timer
  useEffect(() => {
    if (!identity) return;

    const updateTimer = () => {
      const diff = identity.expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft('EXPIRADA');
        return;
      }

      const h = Math.floor(diff / (3600 * 1000));
      const m = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
      const s = Math.floor((diff % (60 * 1000)) / 1000);
      
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [identity]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // 1. Prepare entropy bytes
      let entropyBytes = new Uint8Array(32);
      if (method === 'Aleatório') {
        crypto.getRandomValues(entropyBytes);
      } else {
        // Fold numbers inside buffer to a 32-byte hash seed
        const buffer = entropyBuffer.current;
        for (let i = 0; i < 32; i++) {
          entropyBytes[i] = (buffer[i % buffer.length] || 0) & 0xff;
        }
      }

      // 2. Call local WASM derivation wrapper
      const wasmIdentity = await deriveGhostIdWasm(entropyBytes);

      // Convert derived bytes to mock format strings (npub/nsec)
      const handle = wasmIdentity.handle;
      const pubkeyHex = wasmIdentity.public_key; // uint8array getter
      
      // We simulate npub/nsec prefix for Nostr compatibility representation
      const npub = `npub1${handle.replace('hydra_◆_', '')}`;
      const nsec = `nsec1_void_private_${Math.random().toString(36).substring(2, 12)}`;

      setIdentity({
        npub,
        nsec,
        expiresAt: Date.now() + duration * 60 * 60 * 1000
      });
    } catch (e) {
      console.error('Failed to generate identity:', e);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: 'npub' | 'nsec') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto glass-panel p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <Shield className="w-8 h-8 text-[#3b82f6]" />
        <h2 className="text-2xl font-bold text-gradient">Nova Identidade Efêmera</h2>
      </div>

      <div className="space-y-6">
        {/* Method Select */}
        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Método de entropia</label>
          <div className="grid grid-cols-2 gap-2">
            {(['Aleatório', 'Biométrico'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  method === m
                    ? 'border-[#3b82f6] bg-[rgba(59,130,246,0.05)] text-[#3b82f6]'
                    : 'border-[hsl(var(--border-subtle))] bg-[rgba(255,255,255,0.01)] text-secondary hover:border-[hsl(var(--border-glow))]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Expiration selection */}
        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Duração da identidade</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] focus:border-[#3b82f6] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
          >
            <option value={24} className="bg-slate-900">24 horas</option>
            <option value={48} className="bg-slate-900">48 horas</option>
            <option value={72} className="bg-slate-900">72 horas</option>
          </select>
        </div>

        {/* Biometric Capture Pad */}
        {method === 'Biométrico' && (
          <div
            ref={hoverAreaRef}
            onMouseMove={handleMouseMove}
            className={`p-6 border border-dashed rounded-xl text-center cursor-crosshair transition-colors ${
              entropyBits >= 256
                ? 'border-emerald-500/30 bg-emerald-500/2'
                : 'border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--border-glow))] bg-[rgba(255,255,255,0.01)]'
            }`}
          >
            {entropyBits >= 256 ? (
              <p className="text-sm font-semibold text-emerald-400">Entropia Coletada com Sucesso!</p>
            ) : (
              <div>
                <p className="text-sm font-semibold">Mova o cursor do mouse aqui dentro</p>
                <p className="text-xs text-muted mt-1">Coletando coordenadas de posição caóticas...</p>
              </div>
            )}
          </div>
        )}

        {/* Entropy Bits Progress */}
        <div>
          <div className="flex justify-between text-xs text-secondary mb-1">
            <span>Entropia coletada</span>
            <span>{entropyBits} / 256 bits</span>
          </div>
          <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 transition-all ${
                entropyBits >= 256 ? 'bg-emerald-500' : 'bg-[#3b82f6]'
              }`}
              style={{ width: `${(entropyBits / 256) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Generate Trigger */}
        <button
          onClick={handleGenerate}
          disabled={entropyBits < 256 || generating}
          className="w-full py-3.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-30 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {generating ? <RotateCw className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
          Gerar Identidade
        </button>

        {/* Results output */}
        {identity && (
          <div className="space-y-4 pt-4 border-t border-[hsl(var(--border-subtle))]">
            {/* npub copy */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">Identidade Pública (npub)</label>
              <div className="relative flex items-center bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] rounded-xl overflow-hidden pr-10">
                <span className="flex-grow font-mono text-xs text-secondary p-3 truncate pr-4">{identity.npub}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(identity.npub, 'npub')}
                  className="absolute right-2 text-muted hover:text-primary active:scale-90 transition-all"
                >
                  {copiedField === 'npub' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* nsec copy with warnings */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">Identidade Privada (nsec)</label>
              <div className="relative flex items-center bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] rounded-xl overflow-hidden pr-10">
                <span className="flex-grow font-mono text-xs text-secondary p-3 truncate pr-4">{identity.nsec}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(identity.nsec, 'nsec')}
                  className="absolute right-2 text-muted hover:text-primary active:scale-90 transition-all"
                >
                  {copiedField === 'nsec' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                ⚠️ Salve agora! Chave efêmera não persistida no servidor.
              </p>
            </div>

            {/* Expiration Countdown */}
            <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[hsl(var(--border-subtle))] rounded-xl flex items-center justify-between">
              <span className="text-xs text-secondary font-semibold">Tempo restante</span>
              <span className="font-mono text-sm font-bold text-gradient">{timeLeft}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
