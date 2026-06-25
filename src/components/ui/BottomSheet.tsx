'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface BottomSheetProps {
  children: React.ReactNode;
  defaultHeight?: number; // porcentaje de altura: 40 = 40vh
}

export function BottomSheet({ children, defaultHeight = 40 }: BottomSheetProps) {
  const [height, setHeight] = useState(defaultHeight);
  const [dragging, setDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(defaultHeight);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setDragging(true);
      startY.current = e.touches[0].clientY;
      startHeight.current = height;
    },
    [height]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragging) return;
      const deltaY = startY.current - e.touches[0].clientY;
      const vh = window.innerHeight;
      const deltaPercent = (deltaY / vh) * 100;
      const newHeight = Math.min(90, Math.max(15, startHeight.current + deltaPercent));
      setHeight(newHeight);
    },
    [dragging]
  );

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
    // Snap a 20%, 50%, 90%
    if (height < 30) setHeight(20);
    else if (height < 70) setHeight(50);
    else setHeight(90);
  }, [height]);

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-2xl shadow-2xl transition-height duration-200 ease-out"
      style={{ height: `${height}vh` }}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      <div className="overflow-y-auto h-[calc(100%-2rem)] px-4 pb-4">
        {children}
      </div>
    </div>
  );
}
