import { useState, useEffect, useRef } from "react";
import { FileText, Bold, Italic, List, Link as LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useNotesStore } from "@/store/useStore";

export function NotesModule() {
  const { notes, updateNotes } = useNotesStore();
  const [localContent, setLocalContent] = useState(notes.content);
  const [isSynced, setIsSynced] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep localContent in sync if store updates externally
  useEffect(() => {
    setLocalContent(notes.content);
  }, [notes.content]);

  const handleContentChange = (value: string) => {
    setLocalContent(value);
    setIsSynced(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateNotes(value);
      setIsSynced(true);
    }, 500);
  };

  const insertMarkdown = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localContent.substring(start, end);
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
      localContent.substring(0, start) + newText + localContent.substring(end);
    handleContentChange(updatedContent);
  };

  const charCount = localContent.length;
  const wordCount = localContent.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">NOTES</h3>
        </div>
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
        ref={textareaRef}
        value={localContent}
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
          {isSynced ? (
            <>
              <div className="w-2 h-2 rounded-full bg-success pulse-glow" />
              <span className="text-success">SYNCED</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-400">SAVING...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
