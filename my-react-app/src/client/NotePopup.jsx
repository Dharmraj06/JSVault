import React from "react";
import Editor from "@monaco-editor/react";
import { getNoteSummary } from "./noteHelpers";
import { getMonacoLanguage } from "./languages";

export default function NotePopup({ selectedNote, onClose }) {
  if (!selectedNote) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">{selectedNote.title}</h2>
          <button
            type="button"
            className="popup-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="popup-details">
          <div className="detail-item">
            <span className="detail-label">Language:</span>
            <span className="detail-value">{selectedNote.language}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tags:</span>
            <span className="detail-value">
              {selectedNote.tags ? selectedNote.tags.join(", ") : "No tags"}
            </span>
          </div>
        </div>

        <div className="popup-code-block">
          <h4 className="code-heading">Code:</h4>
          <div className="code-editor-wrapper popup-code-editor">
            <Editor
              height="280px"
              language={getMonacoLanguage(selectedNote.language)}
              theme="vs"
              value={selectedNote.code || ""}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        <div className="popup-description">
          <h4 className="description-heading">Summary:</h4>
          <p>{getNoteSummary(selectedNote)}</p>
        </div>

        <div className="popup-description">
          <h4 className="description-heading">Code Details:</h4>
          <p>{selectedNote.codeDetails}</p>
        </div>
      </div>
    </div>
  );
}
