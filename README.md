# LoreLoom — Story Forge

Aplicativo de escrita para fantasia e ficção científica.

## Instalação

```bash
npm install
npm run dev
```

Abra http://localhost:5173 no navegador.

## Build para produção

```bash
npm run build
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── Sidebar.jsx          # Navegação lateral
│   ├── Topbar.jsx           # Barra superior
│   ├── EditorPanel.jsx      # Editor de texto + capítulos + rascunhos
│   ├── WorldPanel.jsx       # Painel reutilizável (personagens, lugares, objetos)
│   ├── TimelinePanel.jsx    # Linha do tempo
│   ├── StatsPanel.jsx       # Estatísticas do projeto
│   └── Modal.jsx            # Modal de criação de entidades
├── data/
│   └── seed.js              # Dados iniciais de exemplo
├── App.jsx                  # Componente raiz + estado global
└── index.css                # Variáveis CSS e reset global
```

## Paleta de Cores

- **Roxo** `#534AB7` — cor primária da interface
- **Azul** `#185FA5` — cor secundária
- **Dourado** `#C9A227` — destaques, ações principais
