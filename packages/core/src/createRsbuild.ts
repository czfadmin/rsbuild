import {
  pick,
  debug,
  createPluginStore,
  type RsbuildInstance,
  type RsbuildProvider,
  type CreateRsbuildOptions,
} from '@rsbuild/shared';
import { plugins } from './plugins';
import type { RsbuildConfig } from './types';

const getRspackProvider = async (rsbuildConfig: RsbuildConfig) => {
  const { rspackProvider } = await import('./rspack-provider');

  return rspackProvider({
    rsbuildConfig,
  });
};

export async function createRsbuild<
  P extends ({ rsbuildConfig }: { rsbuildConfig: T }) => RsbuildProvider,
  T extends RsbuildConfig,
>(
  options: CreateRsbuildOptions & {
    rsbuildConfig: T;
    provider?: P;
  },
): Promise<RsbuildInstance<ReturnType<P>>> {
  const { rsbuildConfig } = options;

  const provider = options.provider
    ? options.provider({ rsbuildConfig })
    : await getRspackProvider(rsbuildConfig as RsbuildConfig);

  const rsbuildOptions: Required<CreateRsbuildOptions> = {
    cwd: process.cwd(),
    target: ['web'],
    ...options,
  };

  const pluginStore = createPluginStore();
  const {
    build,
    preview,
    pluginAPI,
    publicContext,
    initConfigs,
    inspectConfig,
    createCompiler,
    startDevServer,
    applyDefaultPlugins,
  } = await provider({
    pluginStore,
    rsbuildOptions,
    plugins,
  });

  debug('add default plugins');
  await applyDefaultPlugins(pluginStore);
  debug('add default plugins done');

  const rsbuild = {
    ...pick(pluginStore, ['addPlugins', 'removePlugins', 'isPluginExists']),
    ...pick(pluginAPI, [
      'onBeforeBuild',
      'onBeforeCreateCompiler',
      'onBeforeStartDevServer',
      'onBeforeStartProdServer',
      'onAfterBuild',
      'onAfterCreateCompiler',
      'onAfterStartDevServer',
      'onAfterStartProdServer',
      'onDevCompileDone',
      'onExit',
      'getHTMLPaths',
      'getRsbuildConfig',
      'getNormalizedConfig',
    ]),
    build,
    preview,
    createCompiler,
    initConfigs,
    inspectConfig,
    startDevServer,
    context: publicContext,
  };

  if (rsbuildConfig.plugins) {
    rsbuild.addPlugins(rsbuildConfig.plugins);
  }

  return rsbuild;
}
