const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const backend = path.resolve(__dirname, '..');

function deployment(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dena-deployment-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.cpSync(path.join(backend, 'dist'), path.join(directory, 'dist'), { recursive: true });
  fs.copyFileSync(path.join(backend, 'package.json'), path.join(directory, 'package.json'));
  fs.symlinkSync(path.join(backend, 'node_modules'), path.join(directory, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  return directory;
}

test('the deployed schema validates without the original Prisma directory', t => {
  const directory = deployment(t);
  assert.equal(fs.existsSync(path.join(directory, 'prisma')), false);
  const pkg = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['prisma:migrate'], 'prisma migrate deploy --schema=dist/prisma/schema.prisma');
  const result = spawnSync(process.execPath, [path.join(directory, 'node_modules', 'prisma', 'build', 'index.js'), 'validate', '--schema=dist/prisma/schema.prisma'], {
    cwd: directory,
    encoding: 'utf8',
    timeout: 30000,
    env: { ...process.env, CHECKPOINT_DISABLE: '1', DATABASE_URL: 'mysql://test:test@127.0.0.1:3306/deployment_test' },
  });
  assert.equal(result.status, 0, `${result.error || ''}\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /is valid/);
});

test('deployment contains the complete committed migration history', t => {
  const directory = deployment(t);
  const source = path.join(backend, 'prisma');
  const packaged = path.join(directory, 'dist', 'prisma');
  assert.deepEqual(fs.readFileSync(path.join(packaged, 'schema.prisma')), fs.readFileSync(path.join(source, 'schema.prisma')));
  const files = fs.readdirSync(path.join(source, 'migrations'), { recursive: true, withFileTypes: true }).filter(entry => entry.isFile());
  assert.ok(files.some(entry => entry.name === 'migration.sql'));
  for (const file of files) {
    const relative = path.relative(source, path.join(file.parentPath || file.path, file.name));
    assert.deepEqual(fs.readFileSync(path.join(packaged, relative)), fs.readFileSync(path.join(source, relative)), relative);
  }
});

for (const populated of [false, true]) {
  test(`compiled seed runs without TypeScript sources on ${populated ? 'an initialized' : 'an empty'} database`, t => {
    const directory = deployment(t);
    assert.equal(fs.existsSync(path.join(directory, 'tsconfig.json')), false);
    const pkg = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
    assert.equal(pkg.scripts['prisma:seed'], 'node dist/prisma/seed.js');
    const code = `
      const assert = require('node:assert/strict');
      const Module = require('node:module');
      const originalLoad = Module._load;
      const populated = ${populated};
      const result = { users: 0, dishes: 0, hashes: 0, disconnected: false };
      class PrismaClient {
        user = {
          findUnique: async ({ where }) => { assert.equal(where.email, process.env.SEED_ADMIN_EMAIL); return populated ? { id: 'existing-admin' } : null; },
          create: async ({ data }) => { assert.equal(data.email, process.env.SEED_ADMIN_EMAIL); assert.equal(data.passwordHash, 'test-hash'); result.users++; },
        };
        dish = {
          count: async () => populated ? 7 : 0,
          createMany: async ({ data }) => { assert.ok(data.length > 0); result.dishes += data.length; },
        };
        async $disconnect() { result.disconnected = true; console.log('DEPLOYMENT_RESULT=' + JSON.stringify(result)); }
      }
      Module._load = function (name, ...args) {
        if (name === '@prisma/client') return { PrismaClient, Role: { ADMIN: 'ADMIN' } };
        if (name === 'bcrypt') return { hash: async (password, rounds) => { assert.equal(password, process.env.SEED_ADMIN_PASSWORD); assert.equal(rounds, 10); result.hashes++; return 'test-hash'; } };
        return originalLoad.call(this, name, ...args);
      };
      require('./dist/prisma/seed.js');
    `;
    const result = spawnSync(process.execPath, ['-e', code], {
      cwd: directory,
      encoding: 'utf8',
      timeout: 10000,
      env: { ...process.env, SEED_ADMIN_EMAIL: 'admin@example.test', SEED_ADMIN_PASSWORD: 'SeedTestOnlyPassword!' },
    });
    assert.equal(result.status, 0, `${result.error || ''}\n${result.stdout}\n${result.stderr}`);
    const marker = result.stdout.split(/\r?\n/).find(line => line.startsWith('DEPLOYMENT_RESULT='));
    assert.ok(marker, result.stdout);
    const state = JSON.parse(marker.slice('DEPLOYMENT_RESULT='.length));
    assert.deepEqual(state, { users: populated ? 0 : 1, dishes: populated ? 0 : 7, hashes: populated ? 0 : 1, disconnected: true });
    assert.equal(result.stdout.includes('SeedTestOnlyPassword!'), false);
  });
}
