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

:/ hook to handle click
import { useEffect } from "react";

type UseHandleClickProps = {
  disabled?: boolean;
  refs: React.RefObject<HTMLElement | HTMLButtonElement>[]; // Supports buttons or any element
  callback: () => void;
  stopPropagation?: boolean; // Optional: Stop event propagation
};

const useHandleClick = ({ disabled, refs, callback, stopPropagation = false }: UseHandleClickProps) => {
  useEffect(() => {
    if (disabled) return;

    const handleClick = (event: MouseEvent) => {
      if (stopPropagation) {
        event.stopPropagation();
      }

      // Check if the click is inside any of the provided refs
      const isInsideTarget = refs.some((ref) => ref.current?.contains(event.target as Node));

      if (isInsideTarget) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [disabled, refs, callback, stopPropagation]);
};

export default useHandleClick;


EXAMPLE USAGE

import React, { useRef } from "react";
import useHandleClick from "./useHandleClick";

const MyComponent = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const deletePopupRef = useRef<HTMLDivElement>(null);

  const handleToggleSelection = () => {
    console.log("Selection toggled!");
  };

  // Using the custom hook
  useHandleClick({
    disabled: false,
    refs: [headerRef, buttonRef, deletePopupRef],
    callback: handleToggleSelection,
    stopPropagation: true, // Prevent event propagation
  });

  return (
    <div>
      <div ref={headerRef}>Header (Click here)</div>
      <button ref={buttonRef}>Click Me (Button)</button>
      <div ref={deletePopupRef}>Delete Popup</div>
    </div>
  );
};

export default MyComponent;



import React from "react";

// A small subset of supported tags
const allowedTags = {
  p: (children, key) => <p key={key}>{children}</p>,
  strong: (children, key) => <strong key={key}>{children}</strong>,
  em: (children, key) => <em key={key}>{children}</em>,
  ul: (children, key) => <ul key={key}>{children}</ul>,
  ol: (children, key) => <ol key={key}>{children}</ol>,
  li: (children, key) => <li key={key}>{children}</li>,
  a: (children, key, attributes) => (
    <a key={key} href={attributes.href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  br: (_, key) => <br key={key} />,
};

function parseNode(node, key) {
  if (node.nodeType === 3) {
    // Text node
    return node.textContent;
  }

  if (node.nodeType !== 1 || !allowedTags[node.nodeName.toLowerCase()]) {
    return null; // unsupported tag
  }

  const tag = node.nodeName.toLowerCase();
  const children = Array.from(node.childNodes).map((child, i) => parseNode(child, i));
  const attributes = Object.fromEntries(Array.from(node.attributes || []).map(attr => [attr.name, attr.value]));

  return allowedTags[tag](children, key, attributes);
}

export function TiptapHTMLViewer({ html }) {
  const container = document.createElement("div");
  container.innerHTML = html;

  const content = Array.from(container.childNodes).map((node, i) => parseNode(node, i));

  return <>{content}</>;
}

// nexus install
nexus3-with-node-modules/
├── Dockerfile
├── package.json
└── README.md

Dockerfile
# Start from official Nexus 3 image
FROM sonatype/nexus3:3.68.0

USER root

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Create a working directory for installing npm packages
WORKDIR /tmp/npm-install

# Copy package.json to install dependencies
COPY package.json ./

# Set npm to use your Nexus registry (replace with actual URL)
RUN npm config set registry http://localhost:8081/repository/npm-group/

# Install dependencies and move them to a persistent location
RUN npm install && \
    mkdir -p /opt/node_modules && \
    cp -r node_modules /opt/node_modules && \
    rm -rf /tmp/npm-install

# Restore proper permissions for Nexus to run
RUN chown -R nexus /opt/node_modules

# Switch back to Nexus user
USER nexus

# Expose Nexus default port
EXPOSE 8081

# Entry point (run Nexus)
CMD ["/opt/sonatype/nexus/bin/nexus", "run"]


{
  "name": "offline-deps",
  "version": "1.0.0",
  "description": "Preload node_modules for airgapped environments",
  "dependencies": {
    "axios": "^1.6.5",
    "express": "^4.18.2"
  }
}


# Nexus3 with Preinstalled node_modules

This image:

- Starts Nexus 3
- Uses the internal Nexus npm proxy
- Installs dependencies from `package.json`
- Embeds `node_modules` at `/opt/node_modules`

## Build Image

```bash
podman build -t nexus3-with-deps .


Run Locally
podman run -d -p 8081:8081 nexus3-with-deps

Airgaped
podman save -o nexus3-with-deps.tar nexus3-with-deps

On machine
podman load -i nexus3-with-deps.tar
podman run -d -p 8081:8081 nexus3-with-deps

import { protocol } from 'electron'
import { readFile } from 'fs/promises'

app.whenReady().then(() => {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = new URL(request.url)
    const pathname = decodeURIComponent(url.pathname)
    const filePath = join(__dirname, '../renderer', pathname)
    callback({ path: filePath })
  })


export default defineConfig({
  base: './', // makes assets load as relative paths
  ...
})

  createWindow()
})

if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
} else {
  mainWindow.loadURL('app://index.html') // instead of loadFile()
}



main.ts

import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true, // Ensures cookie & CORS security
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load renderer
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadURL('app://index.html') // <-- Secure app protocol
  }
}

app.whenReady().then(() => {
  // Register custom secure app:// protocol
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = new URL(request.url)
    const pathname = decodeURIComponent(url.pathname)
    const fullPath = join(__dirname, '../renderer', pathname)
    callback({ path: fullPath })
  })

  // Set app ID for Windows notifications
  electronApp.setAppUserModelId('com.electron')

  // Enable default dev shortcuts in dev, disable refresh in prod
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



import { app, BrowserWindow, ipcMain, protocol, shell, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Global references to prevent garbage collection
let loginWindow: BrowserWindow | null = null
let mainWindow: BrowserWindow | null = null

// Create the login window
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      session: session.defaultSession, // share session
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true
    }
  })

  loginWindow.on('ready-to-show', () => {
    loginWindow?.show()
  })

  loginWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loginWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/login`)
  } else {
    loginWindow.loadURL('app://index.html#/login')
  }
}

// Create the main window after login
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      session: session.defaultSession, // share session
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/home`)
  } else {
    mainWindow.loadURL('app://index.html#/home')
  }
}

app.whenReady().then(() => {
  // Secure custom app:// protocol to avoid file:// issues
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = new URL(request.url)
    const pathname = decodeURIComponent(url.pathname)
    const fullPath = join(__dirname, '../renderer', pathname)
    callback({ path: fullPath })
  })

  // App model ID for Windows
  electronApp.setAppUserModelId('com.electron')

  // Enable F12 in dev, disable reload in prod
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC from renderer after successful login
  ipcMain.on('login-success', () => {
    if (loginWindow) {
      loginWindow.close()
      loginWindow = null
    }
    createMainWindow()
  })

  createLoginWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('path');

function sanitizeFilename(s) {
  return String(s ?? '')
    .replace(/[\/\\?%*:|"<>]/g, '-')     // strip illegal filename chars
    .replace(/\s+/g, ' ')
    .trim() || 'file';
}

function renderHTML(item) {
  // TODO: customize this template for your data
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>PDF</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body { font-family: system-ui, Arial, sans-serif; }
    h1 { margin: 0 0 12px; font-size: 20px; }
    .card { border: 1px solid #ddd; padding: 12px; border-radius: 8px; }
    .row { margin: 6px 0; }
    small { color: #666; }
  </style>
</head>
<body>
  <h1>${item.title ?? 'Untitled'}</h1>
  <div class="card">
    <div class="row"><strong>ID:</strong> ${item.id ?? '-'}</div>
    <div class="row"><strong>Name:</strong> ${item.name ?? '-'}</div>
    <div class="row"><strong>Description:</strong><br/><small>${item.description ?? '-'}</small></div>
    <!-- add whatever fields you need -->
  </div>
</body>
</html>`;
}

async function createPdfForItem(item, index) {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true,     // no visible window needed
    }
  });

  try {
    const html = renderHTML(item);
    // load HTML from a data URL so you don’t need a file
    await win.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(html));

    // wait for fonts/layout to settle a bit (optional but helps avoid blank PDFs)
    await win.webContents.executeJavaScript('document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()');

    const pdfData = await win.webContents.printToPDF({
      marginsType: 1,           // default
      printBackground: true,    // keep CSS backgrounds
      pageSize: 'A4',           // or 'Letter'
      landscape: false,
    });

    // resolve Downloads folder (Electron handles Linux correctly)
    let downloadsDir = app.getPath('downloads');
    if (!downloadsDir) {
      // ultra-conservative fallback for weird setups
      downloadsDir = path.join(app.getPath('home'), 'Downloads');
    }

    const base = sanitizeFilename(item.name || item.title || `item-${index + 1}`);
    const filePath = path.join(downloadsDir, `${base}.pdf`);

    await fs.writeFile(filePath, pdfData);
    return filePath;
  } finally {
    win.destroy();
  }
}

// Call this from renderer with the array of objects
ipcMain.handle('generate-pdfs', async (_evt, items = []) => {
  const outputs = [];
  for (let i = 0; i < items.length; i++) {
    // do them sequentially to avoid GPU/printing contention
    const p = await createPdfForItem(items[i], i);
    outputs.push(p);
  }
  return outputs;
});






