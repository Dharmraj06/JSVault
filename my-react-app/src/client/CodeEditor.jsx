import Editor from "@monaco-editor/react";
import { getMonacoLanguage } from "./languages";

export default function CodeEditor({ value, onChange, language }) {
  return (
    <div className="code-editor-wrapper">
      <Editor
        height="280px"
        language={getMonacoLanguage(language)}
        theme="vs"
        value={value}
        onChange={(newValue) => onChange(newValue || "")}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          lineNumbers: "on",
          tabSize: 2,
          insertSpaces: true,
          bracketPairColorization: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
