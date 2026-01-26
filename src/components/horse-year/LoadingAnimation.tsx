import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  message?: string;
}

export const LoadingAnimation = ({ message = '正在生成...' }: LoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      {/* 跳跃的马 */}
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="text-6xl">🐴</div>
        </motion.div>
        
        {/* 地面阴影 */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-muted rounded-full blur-md"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 旋转的灯笼装饰 */}
      <div className="flex items-center justify-center gap-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* 加载文本 */}
      <motion.p
        className="text-lg font-medium text-foreground"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        {message}
      </motion.p>

      {/* 副标题提示 */}
      <p className="text-sm text-muted-foreground max-w-xs text-center px-4">
        AI 正在精心创作，请稍候...
      </p>
    </div>
  );
};
