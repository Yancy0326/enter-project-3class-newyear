import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TravelChatContainer } from '@/components/travel/TravelChatContainer';
import { ChatInput } from '@/components/fortune/ChatInput';
import { useTravelChat } from '@/hooks/use-travel-chat';
import { FloatingElements } from '@/components/horse-year/FloatingElements';

const Travel = () => {
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage, clearMessages } = useTravelChat();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden flex flex-col">
      {/* 背景装饰元素 */}
      <FloatingElements />

      {/* 顶部导航栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-border/50 bg-background/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-accent/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                新春旅行规划
              </h1>
              <p className="text-xs text-muted-foreground hidden md:block">
                AI 旅行规划助手
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="border-primary/30 hover:bg-primary/5"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              清空对话
            </Button>
          )}
        </div>
      </motion.div>

      {/* 聊天内容区域 */}
      <TravelChatContainer 
        messages={messages} 
        isLoading={isLoading}
        onQuestionClick={sendMessage}
      />

      {/* 输入框 */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default Travel;
