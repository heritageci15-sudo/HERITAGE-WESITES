import React, { useEffect, useRef } from 'react';
import { Bold, Code2, Heading2, Italic, Link, List, ListOrdered, Quote, Redo2, RemoveFormatting, Underline, Undo2 } from 'lucide-react';

interface RichTextEditorProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const toolbar = [
  { command: 'bold', label: 'Gras', icon: Bold },
  { command: 'italic', label: 'Italique', icon: Italic },
  { command: 'underline', label: 'Souligné', icon: Underline },
  { command: 'formatBlock', value: 'h2', label: 'Titre', icon: Heading2 },
  { command: 'insertUnorderedList', label: 'Liste à puces', icon: List },
  { command: 'insertOrderedList', label: 'Liste numérotée', icon: ListOrdered },
  { command: 'formatBlock', value: 'blockquote', label: 'Citation', icon: Quote },
  { command: 'createLink', label: 'Lien', icon: Link },
  { command: 'undo', label: 'Annuler', icon: Undo2 },
  { command: 'redo', label: 'Rétablir', icon: Redo2 },
  { command: 'removeFormat', label: 'Retirer le format', icon: RemoveFormatting },
  { command: 'formatBlock', value: 'pre', label: 'Bloc de code', icon: Code2 }
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ id, label, value, onChange, hint }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value]);

  const execute = (command: string, commandValue?: string) => {
    if (command === 'createLink') {
      const url = window.prompt('Adresse du lien, par exemple https://…');
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, commandValue);
    }
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || '');
  };

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[#002141]">{label}</label>
      {hint && <p className="mt-1 text-xs leading-relaxed text-[#3A3A3A]">{hint}</p>}
      <div className="mt-2 overflow-hidden border border-[#002141]/20 bg-white focus-within:border-[#AC854B] focus-within:ring-2 focus-within:ring-[#AC854B]/20">
        <div className="flex flex-wrap gap-1 border-b border-[#002141]/15 bg-[#FAF9F7] p-2" role="toolbar" aria-label={`Outils pour ${label}`}>
          {toolbar.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={`${item.command}-${item.label}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => execute(item.command, item.value)}
                className="flex h-9 w-9 items-center justify-center text-[#002141] transition hover:bg-[#D6BB8F]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#AC854B]"
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <div
          ref={editorRef}
          id={id}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          onInput={(event) => onChange((event.currentTarget as HTMLDivElement).innerHTML)}
          className="admin-rich-editor min-h-56 px-4 py-3 text-sm leading-7 text-[#3A3A3A] outline-none"
        />
      </div>
      <p className="mt-2 text-right text-xs text-[#3A3A3A]">{value.replace(/<[^>]+>/g, '').trim().length} caractères</p>
    </div>
  );
};
