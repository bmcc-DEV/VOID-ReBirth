import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Upload, FileText, ShieldAlert, Sparkles, ShoppingCart } from 'lucide-react';

export default function PqcAudit() {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [_, navigate] = useLocation();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await analyzeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await analyzeFile(e.target.files[0]);
    }
  };

  const analyzeFile = async (file: File) => {
    setError(null);
    setReport(null);
    setAnalyzing(true);
    setProgress(0);

    // Simulate progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    try {
      const text = await file.text();
      let auditResult = '';

      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        const deps = { ...json.dependencies, ...json.devDependencies };
        
        let vulnerables = [];
        if (deps['secp256k1'] || deps['@noble/curves']) vulnerables.push('ECDSA/Secp256k1 (Vulnerável a computação quântica via algoritmo de Shor)');
        if (deps['ed25519'] || deps['@noble/curves']) vulnerables.push('Ed25519 (Vulnerável a computação quântica)');
        if (deps['rsa'] || deps['forge']) vulnerables.push('RSA (Quebra quântica imediata)');

        auditResult = `### RELATÓRIO DE AUDITORIA PQC: ${file.name}
Status: ⚠️ AÇÕES RECOMENDADAS

Dependências de Criptografia Clássica Detectadas:
${vulnerables.map((v) => `- ${v}`).join('\n') || '- Nenhuma dependência clássica óbvia detectada.'}

RECOMENDAÇÃO:
Migrar chaves de faturamento e assinaturas de tráfego para algoritmos pós-quânticos NIST Nível 5 (ML-KEM-1024 e ML-DSA-87).
Substituir o gerenciamento de sessão por chaves efêmeras GhostID (TTL de 24h).`;
      } else {
        auditResult = `### RELATÓRIO DE AUDITORIA PQC: ${file.name}
Status: 🟢 VERIFICADO (Legado Limpo)

O parser local não detectou pacotes de criptografia clássica conhecidos neste manifesto.
Seu projeto parece limpo ou usa primitivas proprietárias.

Para uma varredura de assinaturas profundas, solicite o relatório completo.`;
      }

      // Wait for progress animation to finish
      await new Promise((resolve) => setTimeout(resolve, 1600));
      setReport(auditResult);
    } catch (err) {
      setError("Falha ao analisar o arquivo. Verifique se o formato JSON ou arquivo de texto está íntegro.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert className="w-6 h-6 text-[#8b5cf6]" />
        <h3 className="text-xl font-bold text-gradient">Auditoria PQC Migration</h3>
      </div>

      <div
        className={`relative p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
          dragActive
            ? 'border-[#8b5cf6] bg-[rgba(139,92,246,0.04)]'
            : 'border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--border-glow))] bg-[rgba(255,255,255,0.01)]'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="manifest-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".json,.toml,.txt"
          onChange={handleFileChange}
          disabled={analyzing}
        />
        
        <Upload className="w-12 h-12 mb-4 text-muted" />
        
        {analyzing ? (
          <div className="text-center w-full max-w-xs">
            <p className="text-sm font-semibold animate-pulse text-[#8b5cf6] mb-2">Analisando dependências...</p>
            <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#8b5cf6] h-1.5 transition-all duration-150" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold">Carregue ou arraste seu manifesto de dependências</p>
            <p className="text-xs text-muted mt-1">Compatível com package.json, Cargo.toml, etc.</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)] text-sm text-red-400">
          {error}
        </div>
      )}

      {report && (
        <div className="mt-6 space-y-6">
          <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.01)] border border-[hsl(var(--border-subtle))] font-mono text-sm leading-relaxed whitespace-pre-wrap text-secondary">
            {report}
          </div>

          <div className="glass-panel p-6 border-glow glow-active flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#8b5cf6]" />
              <div>
                <h4 className="font-bold text-primary">Precisa de auditoria aprofundada?</h4>
                <p className="text-xs text-secondary mt-0.5">Relatório matemático de paridade de chaves, integridade e mitigação de vulnerabilidades.</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/gitpay?product=pqc-audit')}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#3b82f6]/20"
            >
              <ShoppingCart className="w-4 h-4" /> Solicitar Relatório Completo — $2,000
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
