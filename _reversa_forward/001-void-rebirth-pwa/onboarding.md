# Onboarding: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`
> Data: 2026-06-14

Este guia fornece as instruções necessárias para configurar, compilar e testar a PWA ET-COSMIC-Nova localmente no seu computador.

---

## Próximos Passos de Instalação e Execução

### Passo 1: Pré-requisitos do Sistema
Garantir que as ferramentas básicas estão instaladas:
* Node.js (versão 18+)
* npm (versão 9+)
* Rust + cargo (para o void_core WASM)
* `wasm-pack` (instalador global do compilador Rust WASM):
  ```bash
  cargo install wasm-pack
  ```

### Passo 2: Compilação do `void_core` (WASM)
Antes de rodar a PWA, o módulo criptográfico em Rust precisa ser compilado para WebAssembly:
1. Acesse o diretório do core Rust:
   ```bash
   cd ET-COSMIC/void_core
   ```
2. Execute a compilação do target web:
   ```bash
   wasm-pack build --target web --out-dir pkg
   ```
3. Verifique se a pasta `ET-COSMIC/void_core/pkg/` foi gerada contendo os arquivos `.js`, `.wasm` e `.d.ts`.

### Passo 3: Executar em Desenvolvimento
1. Retorne ao diretório do ecossistema e instale as dependências npm:
   ```bash
   npm install
   ```
2. Inicie o servidor do Vite:
   ```bash
   npm run dev
   ```
3. Abra `http://localhost:5173/` no seu navegador.

---

## Roteiro de Teste do Fluxo de Checkout Local

Para validar que o ecossistema está funcionando local-first e offline-first:

1. **Configuração de Chave**:
   - Vá ao painel de configurações na tela da PWA.
   - Insira uma chave XPUB Bitcoin válida (ou uma chave de teste `tpub...` para rede de testes).
2. **Checkout do Catálogo**:
   - Retorne à HomePage e selecione o produto **"GitPay Merchant"**.
   - Clique em **"Comprar"** para abrir o checkout integrado do GitPay.
3. **Simulação de Pagamento**:
   - O checkout exibirá o endereço Bitcoin determinístico gerado via WASM local.
   - Copie o endereço gerado e envie um pagamento simulado na rede de testes ou via simulação de mempool no console do desenvolvedor.
   - A PWA fará o consenso consultando os 3 provedores públicos configurados. Uma vez detectado, o status mudará para "Pago" e o recibo de compra será persistido localmente e publicado no Nostr Ledger de testes de forma encriptada.
