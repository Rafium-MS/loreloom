# LoreLoom

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green)
![Vite](https://img.shields.io/badge/Vite-7.1.3-646CFF?logo=vite&logoColor=white)
![License ISC](https://img.shields.io/badge/license-ISC-blue)

## Sobre

LoreLoom é uma aplicação web que combina um editor de ficção rico em recursos com ferramentas para criação de universos. Os dados são armazenados localmente usando uma base SQL embutida, permitindo organizar personagens, localidades, economias, religiões, linhas do tempo e idiomas de forma persistente no navegador.

## Funcionalidades

- **Editor de ficção** com formatação (negrito, itálico, cabeçalhos) e contagem de palavras.
- **Construtor de universo** para cadastrar e visualizar:
  - Personagens, localidades, economias, religiões, eventos em linha do tempo e idiomas.
  - Geração de dados aleatórios para testes e inspiração.
- **Persistência local**: todas as entidades são guardadas em `localStorage` com `sql.js`.

## Instalação

Requisitos:

- Node.js >= 18
- npm

```bash
npm install
```

## Execução

```bash
npm run dev       # modo desenvolvimento
npm run build     # gera a versão de produção
npm run preview   # pré-visualiza o build
npm run typecheck # checagem de tipos TypeScript
```

## API de armazenamento (`dataStore.ts`)

| Função | Descrição |
| --- | --- |
| `getCharacters` / `saveCharacter` / `removeCharacter` | Gerenciam personagens. |
| `getLocations` / `saveLocation` / `removeLocation` | Gerenciam locais do universo. |
| `getEconomies` / `saveEconomy` / `removeEconomy` | Gerenciam economias. |
| `getReligions` / `saveReligion` / `removeReligion` | Gerenciam religiões. |
| `getTimelines` / `saveTimeline` / `removeTimeline` | Gerenciam eventos em linhas do tempo. |
| `getLanguages` / `saveLanguage` / `removeLanguage` | Gerenciam idiomas. |

## Licença

Distribuído sob a licença ISC conforme especificado em `package.json`.
