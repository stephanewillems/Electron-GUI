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




