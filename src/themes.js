import {EditorView} from "@codemirror/view";
import {HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {tags} from "@lezer/highlight";

const shared = {
  ".cm-content": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "14px",
    lineHeight: "1.6"
  },
  ".cm-line": {
    padding: "0 8px"
  },
  ".cm-tooltip-autocomplete": {
    borderRadius: "10px",
    overflow: "hidden"
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    background: "rgba(59,130,246,0.18)"
  }
};

const darkChrome = EditorView.theme({
  ...shared,
  "&": {
    color: "#e5e7eb",
    backgroundColor: "#0f172a"
  },
  ".cm-gutters": {
    backgroundColor: "#111827",
    color: "#6b7280",
    border: "none"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(96,165,250,0.25)"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#93c5fd"
  },
  ".cm-panels": {
    backgroundColor: "#111827",
    color: "#e5e7eb"
  },
  ".cm-tooltip": {
    backgroundColor: "#111827",
    color: "#e5e7eb",
    border: "1px solid #374151"
  }
}, {dark: true});

const lightChrome = EditorView.theme({
  ...shared,
  "&": {
    color: "#111827",
    backgroundColor: "#ffffff"
  },
  ".cm-gutters": {
    backgroundColor: "#f8fafc",
    color: "#6b7280",
    border: "none"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(15,23,42,0.04)"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(15,23,42,0.04)"
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(59,130,246,0.18)"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#2563eb"
  },
  ".cm-panels": {
    backgroundColor: "#ffffff",
    color: "#111827"
  },
  ".cm-tooltip": {
    backgroundColor: "#ffffff",
    color: "#111827",
    border: "1px solid #d1d5db"
  }
}, {dark: false});

const darkSyntax = HighlightStyle.define([
  {tag: tags.comment, color: "#6b7280", fontStyle: "italic"},
  {tag: tags.keyword, color: "#c084fc"},
  {tag: [tags.operator, tags.punctuation], color: "#f472b6"},
  {tag: [tags.number, tags.bool], color: "#f59e0b"},
  {tag: tags.string, color: "#34d399"},
  {tag: tags.variableName, color: "#93c5fd"},
  {tag: tags.namespace, color: "#22d3ee"},
  {tag: [tags.atom, tags.labelName], color: "#f9fafb"},
  {tag: tags.typeName, color: "#fca5a5"}
]);

const lightSyntax = HighlightStyle.define([
  {tag: tags.comment, color: "#6b7280", fontStyle: "italic"},
  {tag: tags.keyword, color: "#7c3aed"},
  {tag: [tags.operator, tags.punctuation], color: "#db2777"},
  {tag: [tags.number, tags.bool], color: "#b45309"},
  {tag: tags.string, color: "#047857"},
  {tag: tags.variableName, color: "#2563eb"},
  {tag: tags.namespace, color: "#0891b2"},
  {tag: [tags.atom, tags.labelName], color: "#111827"},
  {tag: tags.typeName, color: "#dc2626"}
]);

export const editorThemes = {
  dark: [darkChrome, syntaxHighlighting(darkSyntax)],
  light: [lightChrome, syntaxHighlighting(lightSyntax)]
};
