// scripts/initProject.cjs
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function createFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Criado: ${path.basename(filePath)}`);
  } else {
    console.log(`ℹ Já existe: ${path.basename(filePath)}`);
  }
}

const cwd = process.cwd();
const tsconfigPath = path.join(cwd, 'tsconfig.json');
const globalDtsPath = path.join(cwd, 'global.d.ts');
const nodeModulesPath = path.join(cwd, 'node_modules');
const lockfilePath = path.join(cwd, 'package-lock.json');

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

// 1) Instalação (pulando se já houver node_modules)
const hasNodeModules = fs.existsSync(nodeModulesPath) && fs.readdirSync(nodeModulesPath).length > 0;
if (hasNodeModules) {
  console.log('🧩 node_modules encontrado — pulando instalação.');
} else {
  const hasLockfile = fs.existsSync(lockfilePath);
  const installCmd = hasLockfile ? 'npm ci' : 'npm install';
  console.log(`📦 Instalando dependências (${installCmd})...`);
  execSync(installCmd, { stdio: 'inherit' });
}

// 2) Arquivos de config
createFileIfNotExists(tsconfigPath, tsconfigContent);
createFileIfNotExists(globalDtsPath, globalDtsContent);

// 3) Iniciar Dev Server
console.log('🚀 Inicialização concluída! Iniciando servidor de desenvolvimento...\n');
execSync('npm run dev', { stdio: 'inherit' });
