import { useState } from "react";
import { FileText, Save, Bold, Italic, List, Link as LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function NotesModule() {
  const [content, setContent] = useState("# Flight Log\n\nRecording mission notes...");
  const [isSaved, setIsSaved] = useState(true);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would save to localStorage or backend
    localStorage.setItem("mach-notes", content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(true), 2000);
  };

  const insertMarkdown = (type: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = "";

    switch (type) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        newText = `*${selectedText || "italic text"}*`;
        break;
      case "list":
        newText = `\n- ${selectedText || "list item"}`;
        break;
      case "link":
        newText = `[${selectedText || "link text"}](url)`;
        break;
    }

    const updatedContent =
      content.substring(0, start) + newText + content.substring(end);
    setContent(updatedContent);
    setIsSaved(false);
  };

  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).length;

  return (
    <div className="module-panel rounded-lg p-3 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">NOTES</h3>
        </div>
        <Button
          variant={isSaved ? "outline" : "cockpit"}
          size="sm"
          onClick={handleSave}
          disabled={isSaved}
          className="h-6 min-h-0 text-[10px]"
        >
          <Save className="w-3 h-3" />
          {isSaved ? "SAVED" : "SAVE"}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-1.5 mb-2 flex-shrink-0">
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("bold")}
          title="Bold"
          className="h-7 w-7 min-h-0 min-w-0 p-0"
        >
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("italic")}
          title="Italic"
          className="h-7 w-7 min-h-0 min-w-0 p-0"
        >
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("list")}
          title="List"
          className="h-7 w-7 min-h-0 min-w-0 p-0"
        >
          <List className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("link")}
          title="Link"
          className="h-7 w-7 min-h-0 min-w-0 p-0"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="flex-1 min-h-0 bg-secondary border-primary/30 text-foreground font-mono text-xs resize-none focus-visible:ring-primary"
        placeholder="Start writing your notes..."
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-muted-foreground flex-shrink-0">
        <div className="flex items-center gap-3">
          <span>{charCount} CHARS</span>
          <span>{wordCount} WORDS</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isSaved && (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-success pulse-glow" />
              <span className="text-success">AUTO-SAVED</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
