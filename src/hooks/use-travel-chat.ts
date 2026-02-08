import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseTravelChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const STORAGE_KEY = 'travel-chat-messages';
const SESSION_KEY = 'travel-chat-session';

export const useTravelChat = (): UseTravelChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // 从 localStorage 加载历史消息
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      const savedSession = localStorage.getItem(SESSION_KEY);
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      
      if (savedSession) {
        setSessionId(savedSession);
      }
    } catch (error) {
      console.error('Failed to load travel chat history:', error);
    }
  }, []);

  // 保存消息到 localStorage
  const saveMessages = useCallback((newMessages: Message[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save travel chat history:', error);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    // 立即添加用户消息
    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveMessages(updated);
      return updated;
    });

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-travel', {
        body: {
          prompt: content.trim(),
          sessionId: sessionId || undefined,
        },
      });

      if (error) throw error;

      if (data?.text) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.text,
          timestamp: Date.now(),
        };

        // 更新 session ID
        if (data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem(SESSION_KEY, data.sessionId);
        }

        setMessages(prev => {
          const updated = [...prev, assistantMessage];
          saveMessages(updated);
          return updated;
        });
      } else {
        throw new Error('无效的响应');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('发送消息失败，请重试');
      
      // 移除用户消息（因为发送失败）
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== userMessage.id);
        saveMessages(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, saveMessages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId('');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    toast.success('对话已清空');
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
