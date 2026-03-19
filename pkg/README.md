# MeTTa WebAssembly Playground

A browser-based **MeTTa playground** built with **Rust**, **Hyperon**, **WebAssembly**, **Vite**, and **CodeMirror 6**.

This project lets users:

- write MeTTa code in a browser editor
- get editor suggestions while typing
- run MeTTa from the browser using a Rust WebAssembly module
- deploy the app as a static frontend

---

## Overview

The project combines a Rust backend compiled to WebAssembly with a modern browser editor.

At a high level, the flow is:

1. The user types MeTTa code in the CodeMirror editor.
2. JavaScript reads the editor content.
3. JavaScript calls the exported Rust function through `wasm-bindgen`.
4. The Rust code uses Hyperon to parse and run the MeTTa code.
5. The result is returned as a string and displayed in the UI.

---

## Features

- **Browser-based MeTTa execution** using Rust + WebAssembly
- **Code editor with autocomplete** using CodeMirror 6
- **Fast frontend build** with Vite
- **Simple static deployment**
- **Current deployment approach:** commit the generated `pkg/` folder so hosting platforms do not need to build Rust during deployment

---

## Tech Stack

### Frontend
- HTML
- JavaScript (ES modules)
- Vite
- CodeMirror 6

### Rust / Wasm
- Rust
- `wasm-bindgen`
- `wasm-pack`
- Hyperon / MeTTa runtime

### Deployment
- Vercel

---

## How the Implementation Works

### 1. Rust side
The Rust code lives in `src/lib.rs`.

Its job is to:

- receive the MeTTa code as a string
- create a Hyperon MeTTa environment
- parse the code using `SExprParser`
- execute the code
- convert the result into a string that JavaScript can display

The exported entry point looks like this conceptually:

```rust
#[wasm_bindgen]
pub fn run_metta(code: &str) -> String {
    // create environment
    // parse MeTTa code
    // run it
    // return result as text
}
```

### 2. WebAssembly bridge
`wasm-bindgen` creates the bridge between Rust and JavaScript.

It generates JavaScript glue code and lets the browser call the Rust function as if it were a normal JavaScript function.

### 3. Generated browser package
Running:

```bash
wasm-pack build --target web
```

creates a `pkg/` folder.

That folder contains:

- the compiled `.wasm` binary
- a JavaScript wrapper used to load and call the wasm module
- package metadata files

### 4. Editor and UI
The frontend uses CodeMirror 6 for editing.

The editor:

- shows the code input area
- provides suggestions while typing
- sends the current editor content to `run_metta()`
- shows the execution output in the browser

### 5. Frontend bundling
Vite bundles the frontend for development and production.

---

## Project Structure

```text
.
├── .cargo/
│   └── config.toml
├── pkg/
│   ├── metta_playground.js
│   ├── metta_playground_bg.wasm
│   └── ...
├── src/
│   ├── editor.js
│   └── lib.rs
├── .gitignore
├── Cargo.toml
├── Cargo.lock
├── index.html
├── package.json
├── package-lock.json
└── vercel.json
```


## Why `pkg/` Is Included in This Project

This project currently commits the generated `pkg/` folder.

### Why that was done
This avoids rebuilding Rust and WebAssembly on the hosting platform.

That makes deployment simpler because Vercel only needs to build the frontend, not install the Rust toolchain and run `wasm-pack`.

### Tradeoff
If Rust source code changes and `pkg/` is not rebuilt locally before pushing, the deployed app may use outdated wasm artifacts.

### Rule to follow
Whenever `src/lib.rs` changes, run:

```bash
wasm-pack build --target web
```

before committing and pushing.

---

## Prerequisites

Install these tools before running the project locally.

### Required
- Rust
- `wasm-pack`
- Node.js
- npm

### Helpful commands

Install `wasm-pack`:

```bash
cargo install wasm-pack
```

Add wasm target:

```bash
rustup target add wasm32-unknown-unknown
```

---

## Local Development

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Build the WebAssembly package

```bash
wasm-pack build --target web
```

### 3. Start the frontend development server

```bash
npm run dev
```

### 4. Open the app

Vite will print a local URL, usually something like:

```text
http://localhost:5173
```

---

## Production Build

Build the wasm package first:

```bash
wasm-pack build --target web
```

Then build the frontend:

```bash
npm run build
```

This produces a production-ready frontend build.

---

## Deployment to Vercel

This project is currently deployed by **pushing the prebuilt `pkg/` folder**.


## Future Improvements

Possible next upgrades:

- MeTTa syntax highlighting
- smarter autocomplete based on current document context
- parse-aware suggestions
- editor themes
- keyboard shortcuts for running code
- error panels with richer diagnostics
- CI workflow to rebuild and validate `pkg/` automatically

---

