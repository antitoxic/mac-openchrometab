import { execSync } from 'node:child_process';

export const DEFAULT_APP_NAME = 'Google Chrome' as const;

export const openChromeTab = (
  url: string,
  chromeBrowser: string = DEFAULT_APP_NAME
) =>
  execSync(
    `osascript -l JavaScript jxa/openchrometab.js "${encodeURI(
      url
    )}" "${chromeBrowser}"`,
    { cwd: __dirname, stdio: 'ignore' }
  );
