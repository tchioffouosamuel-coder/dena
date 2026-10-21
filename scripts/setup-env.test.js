const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dena-setup-env-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const directory of ['scripts', 'backend', 'frontend']) {
    fs.mkdirSync(path.join(root, directory));
  }
  const script = path.join(root, 'scripts', 'setup-env.js');
  fs.copyFileSync(path.join(__dirname, 'setup-env.js'), script);
  const example = 'DATABASE_URL="mysql://local:password@localhost:3306/local_db"\n';
  fs.writeFileSync(path.join(root, 'backend', '.env.example'), example);
  fs.writeFileSync(path.join(root, 'frontend', '.env.local.example'), 'NEXT_PUBLIC_API_URL=http://localhost:4000/api\n');
  const envPath = path.join(root, 'backend', '.env');
  function run(overrides = {}) {
    const env = { ...process.env };
    for (const key of ['NODE_ENV', 'DATABASE_URL', 'DOCKER_CONTAINER', 'IS_DOCKER']) delete env[key];
    return spawnSync(process.execPath, [script], { env: { ...env, ...overrides }, encoding: 'utf8' });
  }
  return { root, envPath, example, run };
}

test('preserves a configured database URL and the rest of an existing .env', t => {
  const { envPath, run } = fixture(t);
  const contents = '# Custom configuration\nDATABASE_URL="mysql://custom:secret@remote-db:3306/production"\nJWT_SECRET=custom\n';
  fs.writeFileSync(envPath, contents);
  assert.equal(run({ IS_DOCKER: '1' }).status, 0);
  assert.equal(fs.readFileSync(envPath, 'utf8'), contents);
});

test('initializes local development from the example', t => {
  const { envPath, example, run } = fixture(t);
  assert.equal(run().status, 0);
  assert.equal(fs.readFileSync(envPath, 'utf8'), example);
});

test('uses the Docker host only when creating a development environment', t => {
  const { envPath, run } = fixture(t);
  assert.equal(run({ IS_DOCKER: '1' }).status, 0);
  assert.match(fs.readFileSync(envPath, 'utf8'), /@db:3306\//);
});

test('does not create a backend .env when the host provides DATABASE_URL', t => {
  const { envPath, run } = fixture(t);
  assert.equal(run({ DATABASE_URL: 'mysql://host:password@remote-db:3306/app' }).status, 0);
  assert.equal(fs.existsSync(envPath), false);
});

test('production uses host variables without copying development files', t => {
  const { root, envPath, run } = fixture(t);
  assert.equal(run({ NODE_ENV: 'production', DATABASE_URL: 'mysql://host:password@remote-db:3306/app' }).status, 0);
  assert.equal(fs.existsSync(envPath), false);
  assert.equal(fs.existsSync(path.join(root, 'frontend', '.env.local')), false);
});

test('production reports a missing database configuration without creating a local fallback', t => {
  const { envPath, run } = fixture(t);
  const result = run({ NODE_ENV: 'production' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /DATABASE_URL/);
  assert.equal(fs.existsSync(envPath), false);
});
