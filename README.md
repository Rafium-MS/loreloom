# LoreLoom

Servidor [Express](https://expressjs.com/) para organizar e persistir dados de mundos fictícios. 
Ele expõe uma API simples para salvar e carregar informações de personagens, locais, itens e demais detalhes
necessários em projetos de worldbuilding.

## Pré-requisitos
- [Node.js](https://nodejs.org/) 18 ou superior
- npm (geralmente instalado junto com o Node.js)

## Instalação
1. Instale as dependências:
   ```bash
   npm install
   ```
2. (Opcional) Inicialize o banco de dados e importe `data.json` se existir:
   ```bash
   npm run db:init
   ```

## Executando
Inicie o servidor:
```bash
npm start
```

Para abrir a interface como um aplicativo desktop via Electron:
```bash
npm run start:electron
```

O servidor escutará na porta definida pela variável `PORT` (padrão `3000`).
Por padrão os dados são armazenados em um arquivo SQLite local (`loreloom.db`).
Para uso em produção defina `DATABASE_URL` apontando para um banco PostgreSQL compatível antes de iniciar o servidor.

## Rotas principais
- `GET /` – entrega a interface web localizada em `public/`.
- `GET /characters` – lista todos os personagens cadastrados.
- `POST /characters` – adiciona um personagem após validação.
- `POST /save` – grava o estado completo do mundo.
- `GET /load` – carrega o estado completo do mundo.
- `GET /os` – retorna interfaces de rede detectadas para facilitar acesso remoto.

Todas as rotas aceitam e retornam JSON (exceto a rota raiz que serve um arquivo HTML).

## Scripts disponíveis
| Comando              | Descrição                                               |
|---------------------|---------------------------------------------------------|
| `npm start`         | Inicia o servidor Express.                              |
| `npm run start:electron` | Executa o aplicativo usando Electron.                |
| `npm test`          | Executa os testes (atualmente apenas um placeholder).   |
| `npm run db:init`   | Cria o banco de dados e importa `data.json` se existir. |
| `npm run build:css` | Gera `public/css/bundle.css` a partir dos imports CSS.  |

## Desenvolvimento
Os arquivos HTML e CSS residem em `public/`. Para empacotar os estilos utilize o comando
`npm run build:css` após modificar os arquivos em `public/css`.

## Licença
Distribuído sob a licença ISC. Consulte o arquivo `LICENSE` para mais detalhes.
