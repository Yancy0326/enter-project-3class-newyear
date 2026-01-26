import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '@/hooks/use-chat';
import { Sparkles } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onQuestionClick?: (question: string) => void;
}

export const ChatContainer = ({ messages, isLoading, onQuestionClick }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-2"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--secondary)) transparent',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 && !isLoading ? (
          // 欢迎界面
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl md:text-7xl"
            >
              🔮
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                马年运势算命
              </h2>
              <p className="text-muted-foreground text-sm md:text-base flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                AI 智能算命师为您解答
                <Sparkles className="w-4 h-4 text-secondary" />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-2xl px-4">
              {[
                '我想知道今年的整体运势',
                '马年的财运如何？',
                '事业发展会怎样？',
                '感情方面有什么建议吗？',
              ].map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onQuestionClick?.(question)}
                  className="p-3 rounded-lg border border-secondary/30 bg-gradient-to-br from-muted/30 to-muted/10 hover:border-secondary/50 hover:shadow-md transition-all text-sm text-left"
                >
                  💬 {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          // 消息列表
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isTyping={index === messages.length - 1 && message.role === 'assistant'}
              />
            ))}

            <AnimatePresence>
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
          </>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
