import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-end gap-2 max-w-[70%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-[hsl(38,90%,50%)] flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4 text-secondary-foreground" />
        </div>

        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gradient-to-br from-secondary/90 to-secondary border border-secondary/30 shadow-md">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-secondary-foreground/60"
                animate={{
                  scale: [1, 1.3, 1],
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
        </div>
      </div>
    </motion.div>
  );
};
