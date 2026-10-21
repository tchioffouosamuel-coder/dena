const fs = require('fs');
const path = require('path');

function ensureFile(from, to, transform = contents => contents) {
  if (fs.existsSync(to)) return;
  if (!fs.existsSync(from)) return;
  fs.writeFileSync(to, transform(fs.readFileSync(from, 'utf8')), { flag: 'wx' });
}

const root = path.resolve(__dirname, '..');
const backendEnv = path.join(root, 'backend', '.env');
const frontendEnv = path.join(root, 'frontend', '.env.local');

if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL && !fs.existsSync(backendEnv)) {
    throw new Error('DATABASE_URL doit être configurée dans les variables d’environnement de l’hébergeur avant le démarrage.');
  }
} else {
  // Les modèles servent uniquement au développement. Ne jamais réécrire un .env existant.
  if (!process.env.DATABASE_URL) {
    const isDocker = !!process.env.DOCKER_CONTAINER || !!process.env.IS_DOCKER;
    ensureFile(
      path.join(root, 'backend', '.env.example'),
      backendEnv,
      contents => isDocker ? contents.replace('@localhost:3306/', '@db:3306/') : contents
    );
  }

  ensureFile(
    path.join(root, 'frontend', '.env.local.example'),
    frontendEnv
  );
}
