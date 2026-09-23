const fs = require('fs');
const path = require('path');

function ensureFile(from, to) {
  if (fs.existsSync(to)) return;
  if (!fs.existsSync(from)) return;
  fs.copyFileSync(from, to);
}

function ensureDatabaseUrl(envPath, isDocker) {
  if (!fs.existsSync(envPath)) return;

  const host = isDocker ? 'db' : 'localhost';
  const targetUrl = `DATABASE_URL="postgresql://dena_user:changeme@${host}:5432/dena_db?schema=public"`;
  const contents = fs.readFileSync(envPath, 'utf8');
  if (contents.includes('DATABASE_URL=')) {
    const updated = contents.replace(/DATABASE_URL=.*/g, targetUrl);
    fs.writeFileSync(envPath, updated);
    return;
  }

  fs.appendFileSync(envPath, `\n${targetUrl}\n`);
}

const root = path.resolve(__dirname, '..');
const backendEnv = path.join(root, 'backend', '.env');
const frontendEnv = path.join(root, 'frontend', '.env.local');

ensureFile(
  path.join(root, 'backend', '.env.example'),
  backendEnv
);
ensureFile(
  path.join(root, 'frontend', '.env.local.example'),
  frontendEnv
);

const isDocker = !!process.env.DOCKER_CONTAINER || !!process.env.IS_DOCKER;
ensureDatabaseUrl(backendEnv, isDocker);
