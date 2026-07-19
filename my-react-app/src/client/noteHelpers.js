export function getNoteSummary(note) {
  if (note.summary && note.summary.trim()) {
    return note.summary;
  }

  return "No summary available. Edit this note to generate one.";
}
