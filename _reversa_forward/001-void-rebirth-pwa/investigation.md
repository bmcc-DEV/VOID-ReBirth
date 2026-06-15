# Investigation: void-rebirth-pwa

> Identificador: `001-void-rebirth-pwa`
> Data: 2026-06-14

## 1. Pesquisa de Fundo e Padrões Aplicáveis

### A. Feature-Sliced Design (FSD) no Contexto de Aplicações Estáticas
A arquitetura FSD organiza o frontend em camadas rígidas baseadas em escopo de responsabilidade, ordenadas de cima para baixo (sendo que elementos superiores não podem importar de inferiores):
1. **app/**: Configuração global, roteamento inicial, estilos globais e loaders.
2. **pages/**: Telas inteiras da aplicação (ex: HomePage, HistoryPage, MerchantSettingsPage).
3. **widgets/**: Combinações complexas de features e entities (ex: ProductGrid, InvoiceViewer).
4. **features/**: Lógica interativa de usuário que agrega valor de negócio (ex: GitPayCheckout, SyncNostrLedger).
5. **entities/**: Modelagem do domínio de dados do ecossistema (ex: Product, Invoice, Merchant).
6. **shared/**: Utilitários genéricos reutilizáveis (ex: UI components, API clients, WASM wrappers).

### B. Integração Rust WASM no Vite 7 com Vite Plugin WASM
A compilação de código Rust WASM tradicionalmente exige bundlers complexos como Webpack. No Vite 7, utilizamos o plugin `vite-plugin-wasm` acoplado ao `vite-plugin-top-level-await` para permitir carregamento nativo e importação assíncrona de arquivos `.wasm` no browser. O build estático deve assegurar que o binário `.wasm` gerado pelo `wasm-pack` seja embutido ou servido como asset estático de forma otimizada para o GitHub Pages.

### C. NIP-44: Criptografia Cíclica e Resistência Quântica no Nostr Ledger
Em vez do NIP-04 legado que usa curvas elípticas Secp256k1 vulneráveis a computação quântica e que não oculta o tamanho exato de payloads (abrindo margem para análise de tráfego), o NIP-44 utiliza cifragem simétrica moderna AES-256-GCM ou ChaCha20-Poly1305. Para a PWA, utilizaremos chaves efêmeras geradas deterministicamente pelo `void_core` associadas a cada fatura (GhostID) para cifrar metadados de compra.

---

## 2. Alternativas Avaliadas e Descartadas

### Alternativa 1: Arquitetura Monolítica Sem Separação FSD
* **Descrição**: Colocar todos os componentes de checkout do GitPay e controle na pasta `/src` tradicional do Vite, sem restrição de importações.
* **Prós**: Desenvolvimento rápido para os primeiros 3 produtos.
* **Contras**: Complexidade insustentável quando formos portar os drivers LoRa/BLE no futuro, além do risco elevado de dependências circulares entre a camada de criptografia Rust e a camada visual React.
* **Decisão**: **Descartada**. FSD garante robustez essencial e limites rígidos para o crescimento do produto.

### Alternativa 2: Servidor Node.js de Apoio para Checkout e WASM
* **Descrição**: Manter o servidor Express unificado fazendo as chamadas criptográficas do void_core e a geração de invoices em uma API REST centralizada.
* **Prós**: Facilidade de gerenciar o WASM em ambiente Node tradicional.
* **Contras**: Fere o princípio local-first e soberania financeira. Exige que o merchant confie no servidor central para verificar suas chaves privadas e faturas. Aumenta o custo de infraestrutura e impede deploy estático livre no GitHub Pages.
* **Decisão**: **Descartada**. Toda a lógica do void_core e do processador de checkout foi portada para o client-side e WASM locais no navegador.

### Alternativa 3: NIP-04 tradicional para Cifragem Nostr
* **Descrição**: Utilizar chaves públicas fixas do merchant para cifrar faturas enviadas no relay Nostr.
* **Prós**: Suporte nativo por todos os clients Nostr.
* **Contras**: Revela metadados de tamanho e tráfego de faturamento que violam o requisito de privacidade P2P de merchant.
* **Decisão**: **Descartada**. Adotamos cifragem AES-GCM (NIP-44) combinada com chaves efêmeras dinâmicas GhostID.
