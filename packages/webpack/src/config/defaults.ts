import {
  mergeBuilderConfig,
  getDefaultDevConfig,
  getDefaultOutputConfig,
  getDefaultHtmlConfig,
  getDefaultSourceConfig,
  getDefaultSecurityConfig,
  getDefaultPerformanceConfig,
  getDefaultToolsConfig,
} from '@rsbuild/shared';
import type { BuilderConfig } from '../types';

export const createDefaultConfig = (): BuilderConfig => ({
  dev: getDefaultDevConfig(),
  html: getDefaultHtmlConfig(),
  tools: {
    ...getDefaultToolsConfig(),
    cssExtract: {
      loaderOptions: {},
      pluginOptions: {},
    },
  },
  source: {
    ...getDefaultSourceConfig(),
    define: {},
  },
  output: getDefaultOutputConfig(),
  security: {
    ...getDefaultSecurityConfig(),
    sri: false,
  },
  experiments: {
    lazyCompilation: false,
    sourceBuild: false,
  },
  performance: getDefaultPerformanceConfig(),
});

export const withDefaultConfig = (config: BuilderConfig) =>
  mergeBuilderConfig<BuilderConfig>(createDefaultConfig(), config);
