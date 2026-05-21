"use client";

import { useEffect, useRef } from "react";

interface EditableProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}

// contenteditable div that keeps the caret stable on React re-renders.
// Only writes textContent into the DOM when the external value changes
// (mount / programmatic reset). On each keystroke it forwards the raw text
// upward without re-setting the DOM, so re-renders never jump the caret.
export function Editable({
  value,
  onChange,
  className,
  placeholder,
  style,
  multiline = false,
}: EditableProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.textContent !== value) el.textContent = value || "";
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={(e) => onChange((e.currentTarget as HTMLElement).textContent ?? "")}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={className}
      style={style}
      data-placeholder={placeholder}
    />
  );
}
