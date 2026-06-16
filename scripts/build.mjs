import { build } from 'esbuild';

await build({
  entryPoints: ['src/server.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/app.js',
  format: 'cjs',
  sourcemap: true,
  minify: false,
});

console.log('Build OK: dist/app.js');
