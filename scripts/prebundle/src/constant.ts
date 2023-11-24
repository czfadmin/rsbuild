import path, { join } from 'path';
import type { TaskConfig } from './types';
import fs from 'fs-extra';
import { replaceFileContent } from './helper';

export const ROOT_DIR = join(__dirname, '..', '..', '..');
export const PACKAGES_DIR = join(ROOT_DIR, 'packages');
export const DIST_DIR = 'compiled';

export const DEFAULT_EXTERNALS = {
  // External caniuse-lite data, so users can update it manually.
  'caniuse-lite': 'caniuse-lite',
  '/^caniuse-lite(/.*)/': 'caniuse-lite$1',
  // External webpack, it's hard to bundle.
  webpack: 'webpack',
  '/^webpack(/.*)/': 'webpack$1',
  // External lodash because lots of packages will depend on it.
  lodash: 'lodash',
  '/^lodash(/.*)/': 'lodash$1',
  esbuild: 'esbuild',
  // ncc bundled wrong package.json, using external to avoid this problem
  './package.json': './package.json',
  '../package.json': './package.json',
  '../../package.json': './package.json',
  postcss: 'postcss',
  '@babel/core': '@babel/core',
};

export const TASKS: TaskConfig[] = [
  {
    packageDir: 'core',
    packageName: '@rsbuild/core',
    dependencies: [
      'open',
      'jiti',
      'dotenv',
      'dotenv-expand',
      'commander',
      'ws',
      {
        name: 'sirv',
        afterBundle(task) {
          replaceFileContent(
            join(task.distPath, 'sirv.d.ts'),
            (content) =>
              `${content.replace(
                "declare module 'sirv'",
                'declare namespace sirv',
              )}\nexport = sirv;`,
          );
        },
      },
      {
        name: 'http-compression',
        ignoreDts: true,
      },
      {
        name: 'connect-history-api-fallback',
        ignoreDts: true,
      },
    ],
  },
  {
    packageDir: 'shared',
    packageName: '@rsbuild/shared',
    dependencies: [
      'rslog',
      'deepmerge',
      'url-join',
      'fs-extra',
      'chokidar',
      'webpack-chain',
      'mime-types',
      'connect',
      'browserslist',
      'gzip-size',
      'json5',
      {
        name: 'webpack-sources',
        ignoreDts: true,
      },
      {
        name: 'postcss-value-parser',
        ignoreDts: true,
      },
      {
        name: 'loader-utils2',
        ignoreDts: true,
        externals: {
          json5: '../json5',
        },
      },
      {
        name: 'picocolors',
        beforeBundle({ depPath }) {
          const typesFile = path.join(depPath, 'types.ts');
          // Fix type bundle
          if (fs.existsSync(typesFile)) {
            fs.renameSync(typesFile, path.join(depPath, 'types.d.ts'));
          }
        },
      },
      {
        name: 'webpack-dev-middleware',
        externals: {
          'schema-utils/declarations/validate':
            'schema-utils/declarations/validate',
          'mime-types': '../mime-types',
        },
      },
      {
        name: 'autoprefixer',
        ignoreDts: true,
        externals: {
          picocolors: '../picocolors',
          browserslist: '../browserslist',
          'postcss-value-parser': '../postcss-value-parser',
        },
      },
      {
        name: 'http-proxy-middleware',
        externals: {
          // express is a peer dependency, no need to provide express type
          express: 'express',
        },
      },
    ],
  },
];
