import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      // 重置高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-border/50 bg-background/95 backdrop-blur-sm p-4"
    >
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="问问运势..."
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-secondary/30 bg-background/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
            }}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          size="icon"
          className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-[hsl(38,90%,50%)] hover:shadow-[var(--shadow-glow-gold)] transition-all disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* 提示文字 */}
      <div className="text-center text-xs text-muted-foreground mt-2">
        按 Enter 发送，Shift + Enter 换行
      </div>
    </motion.div>
  );
};
