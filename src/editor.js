import {basicSetup} from "codemirror";
import {EditorView} from "@codemirror/view";
import {Compartment} from "@codemirror/state";
import {autocompletion, closeBrackets} from "@codemirror/autocomplete";

import init, {run_metta} from "../pkg/metta_playground.js";
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

async function main() {
  const output = document.getElementById("output");
  const runBtn = document.getElementById("runBtn");

  try {
    await init();
    output.textContent = "Wasm loaded. Start typing MeTTa.";
  } catch (err) {
    output.textContent = `Failed to initialize wasm: ${err}`;
    return;
  }

  runBtn?.addEventListener("click", () => {
    try {
      output.textContent = run_metta(currentCode());
    } catch (err) {
      output.textContent = `Runtime error: ${err}`;
    }
  });

  mountThemeSwitcher();
}

main();
