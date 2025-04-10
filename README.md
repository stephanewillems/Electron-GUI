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








