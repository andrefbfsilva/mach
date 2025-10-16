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
    <div className="module-panel rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">NOTES</h3>
        </div>
        <Button
          variant={isSaved ? "outline" : "cockpit"}
          size="sm"
          onClick={handleSave}
          disabled={isSaved}
        >
          <Save className="w-4 h-4" />
          {isSaved ? "SAVED" : "SAVE"}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4">
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("list")}
          title="List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="switch"
          size="sm"
          onClick={() => insertMarkdown("link")}
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="flex-1 bg-secondary border-primary/30 text-foreground font-mono text-sm resize-none focus-visible:ring-primary"
        placeholder="Start writing your notes..."
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{charCount} CHARS</span>
          <span>{wordCount} WORDS</span>
        </div>
        <div className="flex items-center gap-2">
          {isSaved && (
            <>
              <div className="w-2 h-2 rounded-full bg-success pulse-glow" />
              <span className="text-success">AUTO-SAVED</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
