const { aliasPath } = require('esbuild-plugin-alias-path');
const path = require('node:path');
require('esbuild')
  .build({
    logLevel: 'info',
    entryPoints: ['src/main.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: 'dist/main.js',
    plugins: [
      aliasPath({
        alias: {
          '@/*': path.resolve(__dirname, './src'),
        },
      }),
    ],
  })
  .catch(() => process.exit(1));
