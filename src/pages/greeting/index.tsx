import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FloatingElements } from '@/components/horse-year/FloatingElements';
import { LoadingAnimation } from '@/components/horse-year/LoadingAnimation';
import { GreetingCard } from '@/components/horse-year/GreetingCard';
import { ActionButtons } from '@/components/horse-year/ActionButtons';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Greeting = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const generateGreeting = async () => {
    setIsGenerating(true);
    setGreeting('');
    setImageUrl('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-greeting');

      if (error) throw error;

      if (data?.greeting) {
        setGreeting(data.greeting);
        toast.success('贺词生成成功！');
      } else {
        throw new Error('生成失败');
      }
    } catch (error) {
      console.error('Error generating greeting:', error);
      toast.error('生成贺词失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!greeting) {
      toast.error('请先生成贺词');
      return;
    }

    setIsGeneratingImage(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-card-image', {
        body: { greeting },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        toast.success('贺卡图片生成成功！');
      } else {
        throw new Error('图片生成失败');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('生成图片失败，请重试');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* 背景装饰元素 */}
      <FloatingElements />

      {/* 主要内容区域 */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
        {/* 返回按钮和标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-accent/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>

          <div className="text-center">
            <motion.div
              className="inline-block mb-4"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-lg">
                马年新春贺词
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-secondary" />
              AI 为您创作独特的马年祝福
              <Sparkles className="w-5 h-5 text-secondary" />
            </motion.p>
          </div>
        </motion.div>

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 pb-8">
          {!greeting && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8 max-w-md mx-auto px-4"
            >
              <div className="space-y-4">
                <div className="text-6xl md:text-7xl animate-float">🐴</div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  点击下方按钮
                </h2>
                <p className="text-muted-foreground">
                  让 AI 为您创作专属的马年新春贺词
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={generateGreeting}
                  variant="festive"
                  size="xl"
                  className="w-full md:w-auto px-12 text-lg font-bold shadow-[var(--shadow-glow)] animate-pulse-glow"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  生成马年贺词
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <p>✨ AI 智能创作，独一无二</p>
                <p>🎨 可生成精美贺卡图片</p>
                <p>📱 支持一键复制和下载</p>
              </div>
            </motion.div>
          )}

          {isGenerating && <LoadingAnimation message="正在创作马年贺词..." />}

          {greeting && !isGenerating && (
            <>
              <GreetingCard 
                greeting={greeting} 
                imageUrl={imageUrl}
                isGeneratingImage={isGeneratingImage}
              />
              <ActionButtons
                greeting={greeting}
                onRegenerate={generateGreeting}
                hasImage={!!imageUrl}
                onGenerateImage={generateImage}
                isGeneratingImage={isGeneratingImage}
              />
            </>
          )}
        </div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground/60 py-4"
        >
          <p>马到成功 · 龙马精神 · 一马当先</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Greeting;
