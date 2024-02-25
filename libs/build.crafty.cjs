const { aliasPath } = require('esbuild-plugin-alias-path');
const path = require('node:path');
require('esbuild')
  .build({
    logLevel: 'info',
    entryPoints: ['src/*.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outdir: 'dist',
    plugins: [
      aliasPath({
        alias: {
          '@/*': path.resolve(__dirname, './src'),
        },
      }),
    ],
  })
  .catch(() => process.exit(1));
