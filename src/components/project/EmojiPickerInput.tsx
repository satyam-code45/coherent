"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type EmojiInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
};

export const EmojiPickerInput = ({
  value,
  onChange,
  placeholder,
  id,
  name,
}: EmojiInputProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const togglePicker = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const pickerHeight = 450;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow >= pickerHeight
          ? rect.bottom + 8
          : rect.top - pickerHeight - 8;
      setPos({ top, left: rect.left });
    }
    setOpen((prev) => !prev);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        ref={buttonRef}
        onClick={togglePicker}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-input bg-background text-xl hover:bg-accent"
        aria-label="Pick emoji"
      >
        {value || "😀"}
      </div>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      {open && (
        <div
          ref={pickerRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};
