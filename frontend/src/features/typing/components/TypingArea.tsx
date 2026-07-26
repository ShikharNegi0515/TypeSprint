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
  isExtra: boolean;
  isCurrent: boolean;
  isGhostCurrent: boolean;
  setCurrentRef: (el: HTMLSpanElement | null) => void;
  setGhostCurrentRef: (el: HTMLSpanElement | null) => void;
}

const MemoizedChar = memo(({ 
  char, 
  typedChar, 
  ghostChar,
  isExtra,
  isCurrent, 
  isGhostCurrent, 
  setCurrentRef, 
  setGhostCurrentRef 
}: CharProps) => {
  let colorClass = 'text-muted-foreground opacity-50';

  if (isExtra) {
    colorClass = 'text-destructive opacity-80'; // Extra characters are dark red
  } else if (typedChar !== undefined) {
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

  const actualWords = useMemo(() => words.split(' '), [words]);
  const typedWordsList = useMemo(() => typedChars.split(' '), [typedChars]);
  const ghostWordsList = useMemo(() => ghostTypedChars ? ghostTypedChars.split(' ') : undefined, [ghostTypedChars]);

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
            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
            style={{ 
              height: '42px',
              top: 0,
              left: 0,
              opacity: typedChars.length >= words.length && typedChars.length > 0 ? 0 : 1
            }} 
          />
        )}
        
        {showGhostCaret && ghostTypedChars !== undefined && (
          <motion.div 
            className="absolute w-[3px] bg-muted-foreground opacity-40 rounded-full z-10"
            initial={false}
            animate={{ x: ghostCaretPos.left, y: ghostCaretPos.top + 5 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
            style={{ 
              height: '42px',
              top: 0,
              left: 0,
              opacity: ghostTypedChars.length >= words.length && ghostTypedChars.length > 0 ? 0 : 1
            }} 
          />
        )}

        {actualWords.map((actualWord, wIdx) => {
          const typedWord = typedWordsList[wIdx];
          const ghostWord = ghostWordsList?.[wIdx];
          
          const isCurrentWord = wIdx === typedWordsList.length - 1;
          const isGhostCurrentWord = ghostWordsList && wIdx === ghostWordsList.length - 1;
          
          const maxLen = Math.max(actualWord.length, typedWord?.length || 0, ghostWord?.length || 0);
          const chars = [];
          
          for (let cIdx = 0; cIdx <= maxLen; cIdx++) {
            const isCurrentChar = isCurrentWord && cIdx === (typedWord?.length || 0);
            const isGhostCurrentChar = isGhostCurrentWord && cIdx === (ghostWord?.length || 0);
            
            if (cIdx < actualWord.length) {
              // Normal character
              chars.push(
                <MemoizedChar
                  key={cIdx}
                  char={actualWord[cIdx]}
                  typedChar={typedWord?.[cIdx]}
                  ghostChar={ghostWord?.[cIdx]}
                  isExtra={false}
                  isCurrent={isCurrentChar}
                  isGhostCurrent={isGhostCurrentChar}
                  setCurrentRef={setCurrentRef}
                  setGhostCurrentRef={setGhostCurrentRef}
                />
              );
            } else if (cIdx < (typedWord?.length || 0) || cIdx < (ghostWord?.length || 0)) {
              // Extra character
              chars.push(
                <MemoizedChar
                  key={cIdx}
                  char={typedWord?.[cIdx] || ghostWord?.[cIdx] || ''}
                  typedChar={typedWord?.[cIdx]}
                  ghostChar={ghostWord?.[cIdx]}
                  isExtra={true}
                  isCurrent={isCurrentChar}
                  isGhostCurrent={isGhostCurrentChar}
                  setCurrentRef={setCurrentRef}
                  setGhostCurrentRef={setGhostCurrentRef}
                />
              );
            } else if (isCurrentChar || isGhostCurrentChar) {
               // Render an empty phantom span just for the caret to attach to at the end of the word if it's strictly longer than actualWord
               chars.push(
                <span 
                  key={cIdx} 
                  ref={(el) => {
                    if (isCurrentChar) setCurrentRef(el);
                    if (isGhostCurrentChar) setGhostCurrentRef(el);
                  }} 
                  className="inline-block" 
                >
                  &#8203;
                </span>
               );
            }
          }
          
          // Add space at the end of the word
          const isCurrentSpace = isCurrentWord && typedWord?.length === maxLen && maxLen > actualWord.length;
          // Note: caret handling for the space is tricky. If we are exactly at the end of the correct word, the caret should be on the space.
          // Wait, if typedWord === actualWord, cIdx will reach actualWord.length. The loop goes up to maxLen, so if maxLen == actualWord.length, cIdx reaches actualWord.length.
          // In that case, `cIdx < actualWord.length` is false, `cIdx < typedWord.length` is false, it falls to the third branch and renders phantom span.
          // This is fine. But we also have an actual space character that belongs to the string.
          // Let's render the space.
          
          return (
            <div key={wIdx} className="inline-block mr-0">
              {chars}
              {wIdx < actualWords.length - 1 && (
                <MemoizedChar
                  key="space"
                  char=" "
                  typedChar={wIdx < typedWordsList.length - 1 ? ' ' : undefined}
                  ghostChar={ghostWordsList && wIdx < ghostWordsList.length - 1 ? ' ' : undefined}
                  isExtra={false}
                  isCurrent={false} // Caret is handled by the phantom span at the end of the word
                  isGhostCurrent={false}
                  setCurrentRef={setCurrentRef}
                  setGhostCurrentRef={setGhostCurrentRef}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

