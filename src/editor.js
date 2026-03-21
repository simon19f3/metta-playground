import {basicSetup} from "codemirror";
import {EditorView} from "@codemirror/view";
import {Compartment} from "@codemirror/state";
import {autocompletion, closeBrackets} from "@codemirror/autocomplete";

import {mettaLanguage} from "./metta-language.js";
import {mettaCompletionSource} from "./metta-context.js";
import {editorThemes} from "./themes.js";

const themeSlot = new Compartment();
const languageSlot = new Compartment();
const completionSlot = new Compartment();

const initialDoc = `; Try typing inside parentheses for MeTTa-aware suggestions
(: parent (-> Symbol Symbol Atom))
(Parent Tom Bob)
(Parent Tom Alice)

!(match &self (Parent Tom $x) $x)
`;

const view = new EditorView({
  doc: initialDoc,
  extensions: [
    basicSetup,
    closeBrackets(),
    languageSlot.of(mettaLanguage()),
    completionSlot.of(autocompletion({
      override: [mettaCompletionSource],
      activateOnTyping: true,
      maxRenderedOptions: 12
    })),
    themeSlot.of(editorThemes.dark)
  ],
  parent: document.getElementById("editor")
});

function currentCode() {
  return view.state.doc.toString();
}

function mountThemeSwitcher() {
  const select = document.getElementById("themeSelect");
  if (!select) return;

  select.addEventListener("change", (event) => {
    const mode = event.target.value === "light" ? "light" : "dark";
    view.dispatch({
      effects: themeSlot.reconfigure(editorThemes[mode])
    });
  });
}

function createMettaWorker() {
  return new Worker(new URL("./metta-worker.js", import.meta.url), {type: "module"});
}

function runMettaAsync(worker, code, requestId) {
  return new Promise((resolve, reject) => {
    const handleMessage = (event) => {
      const message = event.data;
      if (!message || message.requestId !== requestId) return;

      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);

      if (message.type === "result") {
        resolve(message.output);
      } else if (message.type === "error") {
        reject(new Error(message.error));
      }
    };

    const handleError = (event) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      reject(event.error || new Error(event.message || "Worker execution failed"));
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError, {once: true});
    worker.postMessage({type: "run", code, requestId});
  });
}

async function main() {
  const output = document.getElementById("output");
  const runBtn = document.getElementById("runBtn");
  const worker = createMettaWorker();
  let nextRequestId = 0;
  let activeRequestId = 0;

  try {
    output.textContent = "Initializing MeTTa worker...";
    worker.postMessage({type: "init"});
    output.textContent = "Wasm worker loading. Start typing MeTTa.";
  } catch (err) {
    output.textContent = `Failed to start worker: ${err}`;
    return;
  }

  runBtn?.addEventListener("click", async () => {
    const requestId = ++nextRequestId;
    activeRequestId = requestId;
    const code = currentCode();

    runBtn.disabled = true;
    runBtn.textContent = "Running...";
    output.textContent = "Running MeTTa in worker...";

    try {
      const result = await runMettaAsync(worker, code, requestId);
      if (requestId !== activeRequestId) return;
      output.textContent = result;
    } catch (err) {
      if (requestId !== activeRequestId) return;
      output.textContent = `Runtime error: ${err}`;
    } finally {
      if (requestId === activeRequestId) {
        runBtn.disabled = false;
        runBtn.textContent = "Run MeTTa";
      }
    }
  });

  mountThemeSwitcher();
}

main();
