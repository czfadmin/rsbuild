import { expect, describe, it } from 'vitest';
import { pluginStyledComponents } from '../src';
import { createStubRsbuild } from '@rsbuild/test-helper';
import { SCRIPT_REGEX } from '@rsbuild/shared';

describe('plugins/styled-components', () => {
  it('should enable ssr when target contain node', async () => {
    const rsbuild = await createStubRsbuild({
      rsbuildConfig: {},
      target: ['node', 'web'],
    });

    rsbuild.addPlugins([pluginStyledComponents()]);
    const configs = await rsbuild.initConfigs();

    for (const config of configs) {
      expect(
        config.module.rules.find(
          (r) => r.test.toString() === SCRIPT_REGEX.toString(),
        ),
      ).toMatchSnapshot();
    }
  });

  it('should works in rspack mode', async () => {
    const rsbuild = await createStubRsbuild({
      rsbuildConfig: {},
    });

    rsbuild.addPlugins([pluginStyledComponents()]);
    const config = await rsbuild.unwrapConfig();

    expect(
      config.module.rules.find(
        (r) => r.test.toString() === SCRIPT_REGEX.toString(),
      ),
    ).toMatchSnapshot();
  });
});
