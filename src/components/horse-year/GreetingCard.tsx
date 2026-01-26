import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface GreetingCardProps {
  greeting: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export const GreetingCard = ({ greeting, imageUrl, isGeneratingImage }: GreetingCardProps) => {
  return (
    <motion.div
      id="greeting-card"
      initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden border-2 border-primary/20 shadow-[var(--shadow-card)] bg-gradient-to-br from-background via-background to-muted/30">
        {/* 贺卡顶部装饰 */}
        <div className="h-3 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        
        <div className="p-6 md:p-8 space-y-6">
          {/* 贺词内容 */}
          <div className="relative">
            <div className="absolute -top-6 -left-4 text-6xl text-primary/10">"</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 text-lg md:text-xl leading-relaxed text-foreground font-medium text-center px-4 py-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-primary/10"
            >
              {greeting.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.05, delay: 0.3 + index * 0.02 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            <div className="absolute -bottom-2 -right-4 text-6xl text-primary/10">"</div>
          </div>

          {/* AI 生成的图片 */}
          {(imageUrl || isGeneratingImage) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[9/16] max-h-[400px] mx-auto rounded-lg overflow-hidden border-2 border-primary/20"
            >
              {isGeneratingImage ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
                  <div className="text-center space-y-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full"
                    />
                    <p className="text-sm text-muted-foreground">图片生成中...</p>
                  </div>
                </div>
              ) : imageUrl ? (
                <motion.img
                  src={imageUrl}
                  alt="马年贺卡"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8 }}
                  crossOrigin="anonymous"
                />
              ) : null}
            </motion.div>
          )}

          {/* 马年标识 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-primary/60"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              2026 马年大吉
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </motion.div>
        </div>

        {/* 贺卡底部装饰 */}
        <div className="h-3 bg-gradient-to-r from-accent via-secondary to-primary"></div>
      </Card>
    </motion.div>
  );
};
