// scripts/initProject.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Função para criar arquivo caso não exista
function createFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Criado: ${path.basename(filePath)}`);
  } else {
    console.log(`ℹ Já existe: ${path.basename(filePath)}`);
  }
}

// Caminhos dos arquivos
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
const globalDtsPath = path.join(process.cwd(), 'global.d.ts');

// Conteúdo padrão do tsconfig.json
const tsconfigContent = `{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@styles/*": ["src/styles/*"],
      "@assets/*": ["src/assets/*"],
      "@utils/*": ["src/utils/*"],
      "@core/*": ["src/core/*"],
      "@hooks/*": ["src/hooks/*"],
      "@state/*": ["src/state/*"],
      "@services/*": ["src/services/*"],
      "@layout/*": ["src/layout/*"],
      "@modules/*": ["src/modules/*"]
    }
  },
  "include": ["src", "global.d.ts"],
  "exclude": ["node_modules", "dist"]
}
`;

// Conteúdo padrão do global.d.ts
const globalDtsContent = `/// <reference types="vite/client" />

declare module '@/*';
declare module '@components/*';
declare module '@styles/*';
declare module '@assets/*';
declare module '@utils/*';
declare module '@core/*';
declare module '@hooks/*';
declare module '@state/*';
declare module '@services/*';
declare module '@layout/*';
declare module '@modules/*';
`;

// 1️⃣ Instalar dependências
console.log('📦 Instalando dependências...');
execSync('npm install', { stdio: 'inherit' });

// 2️⃣ Criar arquivos de configuração se não existirem
createFileIfNotExists(tsconfigPath, tsconfigContent);
createFileIfNotExists(globalDtsPath, globalDtsContent);

// 3️⃣ Iniciar servidor de desenvolvimento
console.log('🚀 Inicialização concluída! Iniciando servidor de desenvolvimento...\n');
execSync('npm run dev', { stdio: 'inherit' });
