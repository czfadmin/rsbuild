/**
 * The methods and types exported from this file are considered as
 * the public API of @rsbuild/core.
 */

// Methods
export { createRsbuild } from './createRsbuild';
export { mergeRsbuildConfig } from '@rsbuild/shared';
export { defineConfig } from './cli/config';

// Types
export type { Rspack } from './rspack-provider';
export type {
  // Config Types
  RsbuildConfig,
  NormalizedConfig,
  // Plugin Types
  RsbuildPlugin,
  RsbuildPluginAPI,
} from './types';
export type {
  Context as RsbuildContext,
  RsbuildMode,
  RsbuildEntry,
  RsbuildTarget,
  RsbuildInstance,
  CreateRsbuildOptions,
  InspectConfigOptions,
  // Hook Callback Types
  OnExitFn,
  OnAfterBuildFn,
  OnAfterCreateCompilerFn,
  OnAfterStartDevServerFn,
  OnAfterStartProdServerFn,
  OnBeforeBuildFn,
  OnBeforeStartDevServerFn,
  OnBeforeStartProdServerFn,
  OnBeforeCreateCompilerFn,
  OnDevCompileDoneFn,
  ModifyRsbuildConfigFn,
} from '@rsbuild/shared';
