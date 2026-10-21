const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(__dirname, '..', 'prisma');
const destination = path.resolve(__dirname, '..', 'dist', 'prisma');

fs.mkdirSync(destination, { recursive: true });
fs.copyFileSync(path.join(source, 'schema.prisma'), path.join(destination, 'schema.prisma'));
fs.cpSync(path.join(source, 'migrations'), path.join(destination, 'migrations'), { recursive: true });

console.log('Schéma Prisma, migrations et seed JavaScript disponibles dans dist/prisma.');
