import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  outfile: 'serverless/index.js',
  platform: 'node',
  target: 'node18',
  bundle: true,
  minify: true,
});
