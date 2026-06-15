import React, { useState } from 'react';
import { Upload, CheckCircle, Key, ShieldAlert } from 'lucide-react';
import { db, ensureSessionKey, encryptPayload } from '@/db';
import { convertLegacyKeys, type LegacyDevData } from './identityMigration';

interface ImportReport {
  total: number;
  successful: number;
  skipped: number;
  names: string[];
}

export default function SettingsImport() {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setReport(null);
    setImporting(true);

    try {
      const text = await file.text();
      const rawJson = JSON.parse(text);

      const sessionKey = await ensureSessionKey();
      
      // 1. Run the core cryptographic key conversion
      const { successful, skipped, identities } = await convertLegacyKeys(
        rawJson,
        sessionKey,
        encryptPayload
      );

      const names: string[] = [];

      // 2. Load the converted identities into the local IndexedDB
      for (const identity of identities) {
        await db.identities.put(identity);
        
        // Get name associated with the legacy key for display purposes
        const name = (rawJson[identity.id] as Partial<LegacyDevData>)?.name || identity.id;
        names.push(name);
      }

      setReport({
        total: Object.keys(rawJson).length,
        successful,
        skipped,
        names
      });
    } catch (err: any) {
      setError(err.message || "Falha ao processar arquivo. Verifique se o JSON está correto.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Key className="w-6 h-6 text-[#3b82f6]" />
        <h3 className="text-xl font-bold text-gradient">Importador de Banco Legado</h3>
      </div>

      <p className="text-sm text-secondary mb-4 leading-relaxed">
        Carregue o arquivo <code className="text-xs bg-[rgba(255,255,255,0.05)] px-1 py-0.5 rounded text-[#8b5cf6]">backup-apikeys.json</code> exportado do servidor Express. O sistema irá convertê-lo localmente em GhostIDs criptografados sob o IndexedDB com TTL padrão de 72h.
      </p>

      {/* Drag & Drop Zone */}
      <div
        className={`relative p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
          dragActive
            ? 'border-[#3b82f6] bg-[rgba(59,130,246,0.04)]'
            : 'border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--border-glow))] bg-[rgba(255,255,255,0.01)]'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".json"
          onChange={handleFileChange}
          disabled={importing}
        />
        
        <Upload className={`w-12 h-12 mb-4 transition-colors ${dragActive ? 'text-[#3b82f6]' : 'text-muted'}`} />
        
        {importing ? (
          <div className="text-center">
            <p className="text-sm font-semibold animate-pulse text-[#3b82f6]">Convertendo chaves criptográficas...</p>
            <p className="text-xs text-muted mt-1">Gerando chaves Ed25519 e encriptando com AES-GCM...</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold">Arraste o arquivo JSON aqui</p>
            <p className="text-xs text-muted mt-1">ou clique para selecionar do dispositivo</p>
          </div>
        )}
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="mt-4 p-4 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)] flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-400">Falha de Importação</h4>
            <p className="text-xs text-secondary mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success / Report Feedback */}
      {report && (
        <div className="mt-4 p-4 rounded-xl border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.04)] flex gap-3 items-start">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="w-full">
            <h4 className="text-sm font-bold text-emerald-400">Importação Concluída</h4>
            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="p-2 bg-[rgba(255,255,255,0.02)] rounded-lg">
                <span className="block text-lg font-bold text-gradient">{report.total}</span>
                <span className="text-[10px] text-muted uppercase">Lidos</span>
              </div>
              <div className="p-2 bg-[rgba(255,255,255,0.02)] rounded-lg">
                <span className="block text-lg font-bold text-[#10b981]">{report.successful}</span>
                <span className="text-[10px] text-muted uppercase">Migrados</span>
              </div>
              <div className="p-2 bg-[rgba(255,255,255,0.02)] rounded-lg">
                <span className="block text-lg font-bold text-[#f59e0b]">{report.skipped}</span>
                <span className="text-[10px] text-muted uppercase">Pulados</span>
              </div>
            </div>

            {report.names.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-secondary">Contas importadas:</span>
                <ul className="text-xs text-muted list-disc list-inside mt-1 max-h-24 overflow-y-auto">
                  {report.names.map((n, idx) => (
                    <li key={idx}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
