import React, { useEffect, useRef, useState } from 'react';

interface TypingAreaProps {
  words: string;
  typedChars: string;
}

export const TypingArea: React.FC<TypingAreaProps> = ({ words, typedChars }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
  const [showCaret, setShowCaret] = useState(false);

  useEffect(() => {
    if (!currentRef.current || !containerRef.current) return;
    
    // Get the top and left offsets of the current character relative to the inner container
    const offsetTop = currentRef.current.offsetTop;
    const offsetLeft = currentRef.current.offsetLeft;
    
    setCaretPos({ top: offsetTop, left: offsetLeft });
    setShowCaret(true);
    
    // We use a fixed line height based on text-[32px] and leading-relaxed (1.625)
    // 32 * 1.625 = 52px
    const lineHeight = 52;
    
    // Smooth scroll up when moving down lines.
    const scrollAmount = Math.max(0, offsetTop - lineHeight);
    setTranslateY(-scrollAmount);
    
  }, [typedChars.length, words]);

  useEffect(() => {
    if (typedChars.length === 0) {
      setTranslateY(0);
    }
  }, [words, typedChars.length]);

  // Group characters into words for proper CSS wrapping
  const wordElements = [];
  let currentWordChars: { char: string; index: number }[] = [];
  
  const chars = words.split('');
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    currentWordChars.push({ char, index: i });
    if (char === ' ') {
      wordElements.push(currentWordChars);
      currentWordChars = [];
    }
  }
  if (currentWordChars.length > 0) {
    wordElements.push(currentWordChars);
  }

  return (
    <div 
      className="relative text-[32px] font-mono leading-relaxed max-w-[1000px] w-full text-left outline-none cursor-default select-none overflow-hidden"
      style={{ height: '156px' }} // Height for exactly 3 lines (3 * 52px)
    >
      <div 
        ref={containerRef}
        className="text-muted-foreground z-0 relative transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {/* Smooth Caret */}
        {showCaret && (
          <div 
            className="absolute w-[3px] bg-primary rounded-full transition-all duration-100 ease-out z-20 animate-pulse"
            style={{ 
              top: `${caretPos.top + 5}px`, // Slight offset to visually center vertically
              left: `${caretPos.left}px`,
              height: '42px',
              opacity: typedChars.length === words.length ? 0 : 1
            }} 
          />
        )}

        {wordElements.map((word, wIdx) => (
          <div key={wIdx} className="inline-block mr-0">
            {word.map((item) => {
              const { char, index } = item;
              const typedChar = typedChars[index];
              let colorClass = 'text-muted-foreground opacity-50'; // Default un-typed color

              if (typedChar !== undefined) {
                if (typedChar === char) {
                  colorClass = 'text-foreground';
                } else {
                  colorClass = 'text-destructive';
                }
              }

              const isCurrent = index === typedChars.length;
              
              return (
                <span 
                  key={index} 
                  ref={isCurrent ? currentRef : null} 
                  className={`relative inline-block ${colorClass} ${typedChar === ' ' && typedChar !== char ? 'bg-destructive/30' : ''}`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        ))}
        
        {/* Invisible reference span at the end if we finished typing */}
        {typedChars.length === words.length && words.length > 0 && (
          <span ref={currentRef} className="inline-block w-[3px]" />
        )}
      </div>
    </div>
  );
};

