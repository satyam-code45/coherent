"use client";
import { GripVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export const RightPanel = ({ children }: { children: React.ReactNode }) => {
  const [chatWidth, setChatWidth] = useState(580);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;

      if (newWidth >= 280 && newWidth <= 700) {
        setChatWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  return (
    <aside
      className="relative flex flex-col bg-[#f5f7fb] boder-1"
      style={{ width: chatWidth }}
    >
      {/* Resizable handle */}
      <div
        ref={dragRef}
        onMouseDown={() => setIsDragging(true)}
        className={`absolute left-0 top-0 h-full w-2 cursor-col-resize ${isDragging ? "bg-blue-400/3" : "hover:bg-blue-300/20"}`}
      >
        <div className="absolute left-[-10px] top-1/2 -translate-y-1/2">
          <GripVertical size={16} />
        </div>
      </div>
      {children}
    </aside>
  );
};
