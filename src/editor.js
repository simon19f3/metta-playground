import { EditorView, basicSetup } from "codemirror";
import {
  autocompletion,
  completeAnyWord,
  snippetCompletion
} from "@codemirror/autocomplete";

import init, { run_metta } from "../pkg/metta_playground.js";

const mettaLibrary = [
  snippetCompletion("!(${1:expr})", {
    label: "!()",
    type: "function",
    detail: "Evaluate expression"
  }),
  snippetCompletion("(match &self ${1:pattern} ${2:template})", {
    label: "match",
    type: "keyword",
    detail: "Pattern match template"
  }),
  snippetCompletion("(: ${1:name} ${2:type})", {
    label: "(:)",
    type: "keyword",
    detail: "Type declaration"
  }),
  snippetCompletion("(= (${1:name} ${2:arg}) ${3:body})", {
    label: "=",
    type: "keyword",
    detail: "Rule or function definition"
  }),
  { label: "if", type: "keyword", detail: "Conditional form" },
  { label: "quote", type: "keyword", detail: "Quoted expression" },
  { label: "eq", type: "keyword", detail: "Equality test" },
  { label: "&self", type: "variable", detail: "Current space" }
];

function mettaCompletion(context) {
  const word = context.matchBefore(/[!$&A-Za-z0-9_-]*/);
  const prevChar = context.state.sliceDoc(Math.max(0, context.pos - 1), context.pos);

  // Open suggestions immediately after typing "("
  if (prevChar === "(") {
    return {
      from: context.pos,
      options: mettaLibrary,
      validFor: /[!$&A-Za-z0-9_-]*/
    };
  }

  // No token and not explicitly requested -> do nothing
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  return {
    from: word.from,
    options: mettaLibrary,
    validFor: /[!$&A-Za-z0-9_-]*/
  };
}

const initialDoc = `!(+ 5 10)

(Parent Tom Bob)
!(match &self (Parent Tom $x) $x)
`;

const view = new EditorView({
  doc: initialDoc,
  extensions: [
    basicSetup,
    autocompletion({
      override: [mettaCompletion, completeAnyWord]
    })
  ],
  parent: document.getElementById("editor")
});

async function main() {
  const output = document.getElementById("output");
  const runBtn = document.getElementById("runBtn");

  try {
    await init();
    output.textContent = "Wasm loaded. Start typing MeTTa.";

    runBtn.addEventListener("click", () => {
      try {
        const code = view.state.doc.toString();
        const result = run_metta(code);
        output.textContent = result;
      } catch (err) {
        output.textContent = `Runtime error: ${err}`;
      }
    });
  } catch (err) {
    output.textContent = `Failed to initialize wasm: ${err}`;
  }
}

main();