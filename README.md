# `@antitoxic/mac-openchrometab`

- `npm` package which offers a single function called `openChromeTab`
- `openChromeTab` opens a URL in `Google Chrome` (_or other Chromium
  alternative_), reusing tab if present
- if tab is not opened already, it will attempt to load the URL in a tab which
  is blank (`about:blank`) or create a new tab
- if `Google Chrome` is not running, it will start it
- if `Google Chrome` window is unfocused or minimized, it will respectively
  focus & un-minimize

To make work, this package uses a
[`JXA`](https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/Introduction.html#//apple_r 'JavaScript for Automation')
script written in `TypeScript`. Even though `JXA` is outdated and unsupported
`JavaScript`, the `TypeScript` offers more familiar development environment than
the usual `AppleScript` used for automating mac.

## Usage

```ts
import { openChromeTab } from '@antitoxic/mac-openchrometab';
//...
openChromeTab('http://localhost:8080');
// or 
openChromeTab('http://localhost:8080', 'Chromium');
```

## Use cases

- During active web development, you can automatically open or reuse already
  opened tab
- Writing scripts to focus on specific tab you know the url of.
