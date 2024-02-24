const { aliasPath } = require('esbuild-plugin-alias-path');
const path = require('node:path');
require('esbuild')
  .build({
    logLevel: 'info',
    entryPoints: ['src/app/api.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: 'dist/api.js',
    plugins: [
      aliasPath({
        alias: {
          '@/*': path.resolve(__dirname, './src'),
        },
      }),
    ],
  })
  .catch(() => process.exit(1));
