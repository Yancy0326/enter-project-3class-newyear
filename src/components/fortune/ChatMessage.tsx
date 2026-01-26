import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/hooks/use-chat';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export const ChatMessage = ({ message, isTyping = false }: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const isUser = message.role === 'user';

  // 打字机效果
  useEffect(() => {
    if (!isTyping || isUser) {
      setDisplayedText(message.content);
      return;
    }

    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < message.content.length) {
        setDisplayedText(message.content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [message.content, isTyping, isUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* 头像 */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-[hsl(38,90%,50%)] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-secondary-foreground" />
          </div>
        )}

        {/* 消息气泡 */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-sm'
              : 'bg-gradient-to-br from-secondary/90 to-secondary text-secondary-foreground rounded-bl-sm border border-secondary/30'
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
            {displayedText}
          </p>
          
          {/* 时间戳 */}
          <div className={`text-xs mt-1 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* 用户头像 */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg shadow-md">
            🐴
          </div>
        )}
      </div>
    </motion.div>
  );
};
