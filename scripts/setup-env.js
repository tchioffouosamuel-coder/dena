const fs = require('fs');
const path = require('path');

function ensureFile(from, to) {
  if (fs.existsSync(to)) return;
  if (!fs.existsSync(from)) return;
  fs.copyFileSync(from, to);
}

const root = path.resolve(__dirname, '..');
ensureFile(
  path.join(root, 'backend', '.env.example'),
  path.join(root, 'backend', '.env')
);
ensureFile(
  path.join(root, 'frontend', '.env.local.example'),
  path.join(root, 'frontend', '.env.local')
);
