
import { useState, useEffect, useRef } from "react";

interface TypingPlaceholderProps {
  suggestions: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  onPlaceholderChange?: (placeholder: string) => void;
}

const TypingPlaceholder = ({
  suggestions,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  onPlaceholderChange,
}: TypingPlaceholderProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const currentText = useRef(suggestions[0]);
  const typingPosition = useRef(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false); // Start deleting
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isTyping) {
      // Typing animation
      if (typingPosition.current < currentText.current.length) {
        timeout = setTimeout(() => {
          typingPosition.current += 1;
          const newPlaceholder = currentText.current.substring(0, typingPosition.current);
          setCurrentPlaceholder(newPlaceholder);
          onPlaceholderChange?.(newPlaceholder);
        }, typingSpeed);
      } else {
        // Finished typing, now pause
        setIsPaused(true);
      }
    } else {
      // Deleting animation
      if (typingPosition.current > 0) {
        timeout = setTimeout(() => {
          typingPosition.current -= 1;
          const newPlaceholder = currentText.current.substring(0, typingPosition.current);
          setCurrentPlaceholder(newPlaceholder);
          onPlaceholderChange?.(newPlaceholder);
        }, deletingSpeed);
      } else {
        // Move to next suggestion
        const nextIndex = (currentIndex + 1) % suggestions.length;
        setCurrentIndex(nextIndex);
        currentText.current = suggestions[nextIndex];
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    currentPlaceholder,
    isTyping,
    isPaused,
    currentIndex,
    suggestions,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    onPlaceholderChange,
  ]);

  return null; // This is a non-visual component
};

export default TypingPlaceholder;