# LoreLoom

Servidor Express para gerenciamento de dados de mundos fictícios.

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicialize o banco de dados (opcionalmente importa `data.json` existente):
   ```bash
   npm run db:init
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

Por padrão é utilizado um banco SQLite local (`loreloom.db`).
Para produção, defina a variável `DATABASE_URL` apontando para um banco
PostgreSQL compatível antes de executar os comandos acima.
