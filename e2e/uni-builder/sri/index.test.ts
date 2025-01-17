import path from 'path';
import { test, expect } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';
import { pluginReact } from '@rsbuild/plugin-react';

// TODO: uni-builder
test.skip('security.sri', async ({ page }) => {
  const rsbuild = await build({
    cwd: __dirname,
    runServer: true,
    plugins: [pluginReact()],
    rsbuildConfig: {
      security: {
        // sri: true,
      },
    },
  });

  const files = await rsbuild.unwrapOutputJSON();
  const htmlFileName = Object.keys(files).find((f) => f.endsWith('.html'))!;

  const regex = /integrity=/g;

  const matches = files[htmlFileName].match(regex);

  // at least 1 js file and 1 css file
  expect(matches?.length).toBeGreaterThanOrEqual(2);

  await page.goto(getHrefByEntryName('index', rsbuild.port));

  const test = page.locator('#test');
  await expect(test).toHaveText('Hello Rsbuild!');

  await rsbuild.close();
});
