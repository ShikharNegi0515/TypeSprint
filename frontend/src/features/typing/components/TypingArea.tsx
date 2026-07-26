import React, { useEffect, useLayoutEffect, useRef, useState, memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface TypingAreaProps {
  words: string;
  typedChars: string;
  ghostTypedChars?: string;
}

interface CharProps {
  char: string;
  typedChar?: string;
  ghostChar?: string;
  isCurrent: boolean;
  isGhostCurrent: boolean;
  setCurrentRef: (el: HTMLSpanElement | null) => void;
  setGhostCurrentRef: (el: HTMLSpanElement | null) => void;
}

const MemoizedChar = memo(({ 
  char, 
  typedChar, 
  ghostChar, 
  isCurrent, 
  isGhostCurrent, 
  setCurrentRef, 
  setGhostCurrentRef 
}: CharProps) => {
  let colorClass = 'text-muted-foreground opacity-50';

  if (typedChar !== undefined) {
    if (typedChar === char) {
      colorClass = 'text-foreground';
    } else {
      colorClass = 'text-destructive';
    }
  } else if (ghostChar !== undefined) {
    if (ghostChar === char) {
      colorClass = 'text-foreground opacity-30';
    } else {
      colorClass = 'text-destructive opacity-30';
    }
  }

  const isWrongSpace = typedChar === ' ' && typedChar !== char;
  const isGhostWrongSpace = ghostChar === ' ' && ghostChar !== char && typedChar === undefined;
  let bgClass = '';
  if (isWrongSpace) bgClass = 'bg-destructive/30';
  else if (isGhostWrongSpace) bgClass = 'bg-destructive/15';

  return (
    <span 
      ref={(el) => {
        if (isCurrent) setCurrentRef(el);
        if (isGhostCurrent) setGhostCurrentRef(el);
      }}
      className={`relative inline-block ${colorClass} ${bgClass}`}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
});

export const TypingArea: React.FC<TypingAreaProps> = ({ words, typedChars, ghostTypedChars }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const ghostCurrentRef = useRef<HTMLSpanElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
  const [showCaret, setShowCaret] = useState(false);
  const [ghostCaretPos, setGhostCaretPos] = useState({ top: 0, left: 0 });
  const [showGhostCaret, setShowGhostCaret] = useState(false);

  const setCurrentRef = useCallback((el: HTMLSpanElement | null) => {
    currentRef.current = el;
  }, []);

  const setGhostCurrentRef = useCallback((el: HTMLSpanElement | null) => {
    ghostCurrentRef.current = el;
  }, []);

  useLayoutEffect(() => {
    if (!currentRef.current || !containerRef.current) return;
    
    const offsetTop = currentRef.current.offsetTop;
    const offsetLeft = currentRef.current.offsetLeft;
    
    setCaretPos({ top: offsetTop, left: offsetLeft });
    setShowCaret(true);
    
    const lineHeight = 52;
    const scrollAmount = Math.max(0, offsetTop - lineHeight);
    setTranslateY(-scrollAmount);
  }, [typedChars.length, words]);

  useLayoutEffect(() => {
    if (!ghostCurrentRef.current || !containerRef.current) {
      setShowGhostCaret(false);
      return;
    }
    const offsetTop = ghostCurrentRef.current.offsetTop;
    const offsetLeft = ghostCurrentRef.current.offsetLeft;
    setGhostCaretPos({ top: offsetTop, left: offsetLeft });
    setShowGhostCaret(true);
  }, [ghostTypedChars?.length, words]);

  useEffect(() => {
    if (typedChars.length === 0) {
      setTranslateY(0);
    }
  }, [words, typedChars.length]);

  const wordElements = useMemo(() => {
    const elements = [];
    let currentWordChars: { char: string; index: number }[] = [];
    
    const chars = words.split('');
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      currentWordChars.push({ char, index: i });
      if (char === ' ') {
        elements.push(currentWordChars);
        currentWordChars = [];
      }
    }
    if (currentWordChars.length > 0) {
      elements.push(currentWordChars);
    }
    return elements;
  }, [words]);

  return (
    <div 
      className="relative text-[32px] font-mono leading-relaxed max-w-7xl w-full text-left outline-none cursor-default select-none overflow-hidden"
      style={{ height: '156px' }} 
    >
      <div 
        ref={containerRef}
        className="text-muted-foreground z-0 relative transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {showCaret && (
          <motion.div 
            className="absolute w-[3px] bg-primary rounded-full z-20"
            initial={false}
            animate={{ x: caretPos.left, y: caretPos.top + 5 }}
            transition={{ type: "tween", duration: 0.08, ease: "linear" }}
            style={{ 
              height: '42px',
              top: 0,
              left: 0,
              opacity: typedChars.length === words.length ? 0 : 1
            }} 
          />
        )}
        
        {showGhostCaret && ghostTypedChars !== undefined && (
          <motion.div 
            className="absolute w-[3px] bg-muted-foreground opacity-40 rounded-full z-10"
            initial={false}
            animate={{ x: ghostCaretPos.left, y: ghostCaretPos.top + 5 }}
            transition={{ type: "tween", duration: 0.08, ease: "linear" }}
            style={{ 
              height: '42px',
              top: 0,
              left: 0,
              opacity: ghostTypedChars.length === words.length ? 0 : 1
            }} 
          />
        )}

        {wordElements.map((word, wIdx) => (
          <div key={wIdx} className="inline-block mr-0">
            {word.map((item) => {
              const { char, index } = item;
              const typedChar = typedChars[index];
              const ghostChar = ghostTypedChars?.[index];
              const isCurrent = index === typedChars.length;
              const isGhostCurrent = ghostTypedChars !== undefined && index === ghostTypedChars.length;
              
              return (
                <MemoizedChar
                  key={index}
                  char={char}
                  typedChar={typedChar}
                  ghostChar={ghostChar}
                  isCurrent={isCurrent}
                  isGhostCurrent={isGhostCurrent}
                  setCurrentRef={setCurrentRef}
                  setGhostCurrentRef={setGhostCurrentRef}
                />
              );
            })}
          </div>
        ))}
        
        {typedChars.length === words.length && words.length > 0 && (
          <span ref={currentRef} className="inline-block w-[3px]" />
        )}
        {ghostTypedChars !== undefined && ghostTypedChars.length === words.length && words.length > 0 && (
          <span ref={ghostCurrentRef} className="inline-block w-[3px]" />
        )}
      </div>
    </div>
  );
};

