/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return */
import Application from '@jxa/types/lib/Application';

const sys = Application.currentApplication();
sys.includeStandardAdditions = true;

const SystemEvents = Application('System Events');

type CliArgs = [url: string, browserName?: string];
/**
 * Assumes osascript -l JavaScript <this file name> "arg1" "arg2" ...
 */
const getArgs = () => {
  // @ts-ignore
  const args = $.NSProcessInfo.processInfo.arguments as {
    count: number;
    objectAtIndex: (i: number) => unknown;
  };
  const argv: string[] = [];
  for (let i = 4; i < args.count; i++) {
    // @ts-expect-error `ObjC` is global
    argv.push(ObjC.unwrap(args.objectAtIndex(i))); // collect arguments
  }
  return argv as CliArgs;
};

const [url, browserName] = getArgs();

interface BrowserTab {
  url: (() => string) | string;
  id: () => string;
}

interface BrowserWindow {
  id: () => number;
  tabs: (() => Array<BrowserTab>) & Array<BrowserTab>;
}

type BrowserApp = Omit<typeof Application, 'windows'> & {
  windows: () => Array<BrowserWindow>;
  Tab: {
    new (): BrowserTab;
  };
};

const findTab = (app: BrowserApp, url: string) => {
  for (const win of app.windows()) {
    for (const tab of win.tabs()) {
      if ((tab.url as () => string)().includes(url)) {
        return { win, tab };
      }
    }
  }
};

const getWinIndex = (app: BrowserApp, win: BrowserWindow) =>
  app.windows().findIndex(w => win.id() === w.id());

const bringWindowToFront = (app: BrowserApp, win: BrowserWindow) =>
  SystemEvents.perform(
    SystemEvents.processes[app.name()]
      .windows()
      [getWinIndex(browser, win)].actions.byName('AXRaise')
  );

const browser = Application<BrowserApp>(
  browserName ||
    (sys.systemAttribute('BROWSER') as string | null) ||
    'Google Chrome'
);

if (browser.windows().length === 0) {
  new browser.Window();
}

const { win, tab } = findTab(browser, url) ||
  findTab(browser, 'about:blank') ||
  findTab(browser, 'chrome://newtab/') || {
    win: browser.windows[0] as BrowserWindow,
    tab: new browser.Tab(),
  };

bringWindowToFront(browser, win);

// Activate tab and (re)load url
if (!tab.id) {
  win.tabs.push(tab);
}
const tabIndex = win.tabs().findIndex(t => t.id() === tab.id());
browser.windows[getWinIndex(browser, win)].activeTabIndex = tabIndex + 1;
tab.url = url;
