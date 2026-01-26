import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 左上角灯笼 */}
      <motion.div
        className="absolute top-8 left-4 md:left-12 w-16 h-20 md:w-20 md:h-24"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-full h-full relative animate-swing">
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-accent rounded-full opacity-80 blur-sm"></div>
          <div className="absolute inset-2 bg-gradient-to-b from-primary via-primary to-accent rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 bg-secondary rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-6 h-8 bg-secondary/80" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        </div>
      </motion.div>

      {/* 右上角灯笼 */}
      <motion.div
        className="absolute top-8 right-4 md:right-12 w-16 h-20 md:w-20 md:h-24"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="w-full h-full relative animate-swing" style={{ animationDelay: '1s' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-accent rounded-full opacity-80 blur-sm"></div>
          <div className="absolute inset-2 bg-gradient-to-b from-primary via-primary to-accent rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 bg-secondary rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-6 h-8 bg-secondary/80" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        </div>
      </motion.div>

      {/* 装饰性金币 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-secondary to-[hsl(38,90%,50%)] shadow-[var(--shadow-glow-gold)]" />
        </motion.div>
      ))}

      {/* 祥云装饰 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute"
          style={{
            top: `${30 + i * 20}%`,
            left: i % 2 === 0 ? '-10%' : 'auto',
            right: i % 2 === 1 ? '-10%' : 'auto',
          }}
          animate={{
            x: i % 2 === 0 ? ['-10%', '110%'] : ['110%', '-10%'],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="flex items-center gap-1 opacity-20">
            <div className="w-8 h-4 md:w-12 md:h-6 bg-primary/30 rounded-full blur-sm"></div>
            <div className="w-6 h-3 md:w-10 md:h-5 bg-primary/30 rounded-full blur-sm"></div>
            <div className="w-10 h-5 md:w-14 md:h-7 bg-primary/30 rounded-full blur-sm"></div>
          </div>
        </motion.div>
      ))}

      {/* 闪烁星星 */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
        </motion.div>
      ))}
    </div>
  );
};
