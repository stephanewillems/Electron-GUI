# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


extra info for splashscreen
const { app, BrowserWindow } = require('electron');

let mainWindow;
let splash;

app.on('ready', () => {
  // Create the splash screen
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  });
  splash.loadFile('splash.html');

  // Create the main window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Don't show until ready-to-show
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    splash.close();
    mainWindow.show();
  });
});





// wait for everything to be loaded
mainWindow.once('ready-to-show', () => {
  mainWindow.show();
});

// enable background COlor

  width: 800,
  height: 600,
  backgroundColor: '#2e2c29', // bg color
});


// If you’re using BrowserWindow.loadURL, listen for the DOMContentLoaded event to ensure the DOM is fully loaded before displaying the window.
mainWindow.webContents.once('dom-ready', () => {
  mainWindow.show();
});

