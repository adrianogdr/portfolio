# Portfolio — Adriano Gonçalves de Resende

Portfolio unificado (Programação ∩ Design) — Single page, vanilla HTML/CSS/JS, categorizado, responsivo, acessível.

**Live:** https://adrianogdr.vercel.app
**Repo:** https://github.com/adrianogdr/portfolio

---

## 🚀 Deploy Rápido (Vercel)

```bash
# 1. Clone ou crie o repo
git clone https://github.com/adrianogdr/portfolio.git
cd portfolio

# 2. Push para GitHub
git add .
git commit -m "init: portfolio unificado"
git branch -M main
git remote add origin https://github.com/adrianogdr/portfolio.git
git push -u origin main

# 3. No Vercel Dashboard:
#    - Import Project → adrianogdr/portfolio
#    - Framework: Other
#    - Build Command: (deixe vazio)
#    - Output Directory: (deixe vazio / ".")
#    - Deploy
```

---

## 📁 Estrutura

```
portfolio/
├── index.html          # HTML semântico, acessível (~180 linhas)
├── style.css           # Mobile-first, CSS custom props, dark/light (~350 linhas)
├── script.js           # Filtro, modal <dialog>, URL sync, lazy images (~100 linhas)
├── data/
│   └── projects.json   # Fonte única de verdade (10 projetos)
├── assets/
│   └── images/         # Thumbnails WebP (placeholders SVG iniciais)
├── vercel.json         # SPA fallback, headers segurança, cache
├── package.json        # Scripts dev (npx serve)
├── .gitignore
└── README.md
```

---

## ✨ Features

| Feature | Implementação |
|---------|---------------|
| **Categorias** | Design · Frontend · Backend · Fullstack |
| **Filtro** | Pills com keyboard nav (←→, Home, End) + URL hash sync |
| **Grid** | 1 col (<640px) → 2 col (640–1024px) → 3 col (>1024px, featured span 2) |
| **Modal** | `<dialog>` nativo + focus trap + ESC/backdrop fecha + deep link `#project=id` |
| **Imagens** | `<picture>` com srcset via jsDelivr CDN + fallback GitHub raw + placeholder SVG |
| **A11y** | WCAG 2.1 AA, landmarks, contraste 4.5:1, `prefers-reduced-motion` |
| **Performance** | Critical CSS inline, font preload, lazy loading, 100/100 Lighthouse alvo |
| **PWA Ready** | `manifest.json` + ícones maskable (adicionar depois se quiser) |

---

## 🖼️ Gerenciando Imagens (Thumbnails)

### Como funciona
- Imagens ficam em `assets/images/`
- Servidas via **jsDelivr CDN**: `https://cdn.jsdelivr.net/gh/adrianogdr/portfolio/assets/images/arquivo.webp`
- Fallback automático: GitHub Raw → Placeholder SVG colorido por categoria

### Placeholders iniciais
O portfolio já vem com placeholders SVG gerados inline (cores por categoria):
- **Design** → Rosa (`#f472b6`)
- **Frontend** → Cyan (`#22d3ee`)
- **Backend** → Roxo (`#a78bfa`)
- **Fullstack** → Verde (`#4ade80`)

### Substituindo por screenshots reais

```bash
# 1. Gere/exportes screenshots (640x400px, WebP, <100KB)
# 2. Substitua o arquivo correspondente
cp ~/screenshots/portal-dei-ias.webp assets/images/portal-dei-ias.webp

# 3. Commit + push (30s depois está no ar via CDN)
git add assets/images/portal-dei-ias.webp
git commit -m "feat: atualiza thumbnail Portal DEI IAs com screenshot real"
git push origin main
```

**Arquivos esperados em `assets/images/`:**
```
portal-dei-ias.webp
catalogo-whatsapp.webp
quilombo.webp
loja-organicos.webp
loja-lumina.webp
vibelink.webp
nextsite.webp
cortex-vision.webp
cortex-vision-1.webp
cortex-vision-2.webp
insta-gen.webp
design-assets.webp
psd-cortex.webp
psd-quilombo.webp
pixar-1.webp
pixar-2.webp
workshop-protagon.webp
```

> **Dica:** Use ferramentas como `squoosh.app` ou `sharp` para otimizar para WebP 640x400px <100KB.

---

## 📝 Adicionando Novos Projetos

1. Edite `data/projects.json` — adicione entrada seguindo o schema:
```json
{
  "id": "meu-novo-projeto",
  "title": "Meu Novo Projeto",
  "category": "fullstack",
  "subcategory": "apps",
  "description": "Descrição curta (1-2 frases).",
  "stack": ["Tech1", "Tech2", "Tech3"],
  "role": "Seu Papel",
  "year": 2025,
  "links": {
    "live": "https://...vercel.app",
    "code": "https://github.com/adrianogdr/...",
    "caseStudy": null
  },
  "thumbnail": "meu-novo-projeto.webp",
  "featured": false,
  "images": []
}
```

2. Adicione thumbnail em `assets/images/meu-novo-projeto.webp`
3. Commit + push → deploy automático

---

## 🛠️ Desenvolvimento Local

```bash
# Instala dependências (apenas serve)
npm install

# Inicia servidor local (porta 3000)
npm run dev

# Abre http://localhost:3000
```

---

## 🔧 Personalização

### Cores (CSS Custom Properties)
Edite `:root` em `style.css`:
```css
:root {
  --accent: #22d3ee;        /* Cyan - programação */
  --accent-design: #f472b6; /* Pink - design */
  --cat-design: #f472b6;
  --cat-frontend: #22d3ee;
  --cat-backend: #a78bfa;
  --cat-fullstack: #4ade80;
}
```

### Fonte
Troque `--font-sans` e `--font-mono` em `style.css` (preload no `index.html` também).

### Hero / Footer
Edite textos em `index.html`:
- Nome: `Adriano Gonçalves de Resende`
- Tagline: `Programação, Automação e Design`
- Email: `adrianogdr@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/adriano-gonçalves-de-resende-9883b156/`
- GitHub: `https://github.com/adrianogdr`

---

## ♿ Acessibilidade

Testado com:
- **NVDA** (Windows) / **VoiceOver** (macOS)
- **axe-core** (Lighthouse CI)
- Navegação 100% teclado (Tab, Enter, Esc, Setas, Home, End)
- `prefers-reduced-motion` respeitado
- Contraste ≥ 4.5:1 em ambos os temas

---

## 📊 Performance

Metas Lighthouse:
- **Performance:** 100
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

Otimizações:
- Critical CSS inline no `<head>`
- Font `preload` + `font-display: swap`
- Imagens `loading=lazy` + `decoding=async`
- Zero JS blocking (apenas 2KB gzipped)
- Cache headers otimizados via `vercel.json`

---

## 📄 Licença

MIT © 2025 Adriano Gonçalves de Resende

---

## 🤝 Contribuição

Sugestões e melhorias são bem-vindas! Abra uma issue ou PR.

1. Fork o projeto
2. Crie branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra Pull Request