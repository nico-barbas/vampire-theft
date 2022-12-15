# Webpack + TypeScript + SASS Starter

## Introduction

A simple starter project for personal use.

Some features:
- Runs a dev server with auto reload.
- Uses webpack to bundle index.html, .ts, .scss, and assets folder in `/dist`.
- Supports paths in `tsconfig.json` for relative imports.
- ESLint and TS rules have some personal preferences, but can be easily tweaked.
- Some minimal scaffolding in `/src` that you can modify or remove.
- No additional tools or frameworks, leaving you free to choose your own.

## Installation

First clone the project:

```bash
git clone https://github.com/stephenniemans/webpack-typescript-sass-starter.git
```

Remove the origin:

```bash
git remote rm origin
```

Install dependencies:

```bash
npm install
```

## Development Server

To start the development server with auto-reloading:

```bash
npm start
```

By default, the development server will be run on: `http://localhost/8080`

To use a different port, change the value in `webpack.config.js`:

```js
  // webpack.config.js
  devServer: {
    port: 8080 // <- Change this value
  }
```

## Build

To generate a bundle in the `dist` folder:

```bash
npm run build
```

To reinstall all dependencies and rebuild:

```bash
npm run rebuild
```

## Linter

To run Eslint:

```bash
npm run lint
```

Or:

```bash
npm run build
```

