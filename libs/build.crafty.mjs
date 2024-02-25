import { aliasPath } from 'esbuild-plugin-alias-path';
import path from 'node:path';
import { dTSPathAliasPlugin } from 'esbuild-plugin-d-ts-path-alias';

import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

build({
  logLevel: 'info',
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  plugins: [
    aliasPath({
      alias: {
        '@/*': path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          './src'
        ),
      },
    }),
    dTSPathAliasPlugin(),
  ],
})
  .then(() => {})
  .catch(() => process.exit(1));
