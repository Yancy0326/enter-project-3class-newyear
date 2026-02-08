import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Pencil } from 'lucide-react';
import { FloatingElements } from '@/components/horse-year/FloatingElements';
const Home = () => {
  const navigate = useNavigate();
  const options = [{
    id: 'greeting',
    icon: '📝',
    title: '马年贺词',
    description: '生成独特的新春祝福',
    gradient: 'from-primary via-accent to-secondary',
    path: '/greeting'
  }, {
    id: 'fortune',
    icon: '🔮',
    title: '算算运势',
    description: 'AI 智能算命师',
    gradient: 'from-secondary via-[hsl(45,100%,51%)] to-[hsl(38,90%,60%)]',
    path: '/fortune'
  }, {
    id: 'travel',
    icon: '✈️',
    title: '旅行规划',
    description: '新春出游计划助手',
    gradient: 'from-accent via-primary to-[hsl(15,85%,55%)]',
    path: '/travel'
  }];
  return <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* 背景装饰元素 */}
      <FloatingElements />

      {/* 主要内容区域 */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col items-center justify-center">
        {/* 标题区域 */}
        <motion.div initial={{
        opacity: 0,
        y: -30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="text-center mb-12 md:mb-16">
          <motion.div className="inline-block mb-6" animate={{
          scale: [1, 1.05, 1]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}>
            <h1 className="md:text-7xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl Pro'] York'] font-['Poppins'] text-[57px] font-[800]">桃子祝你2026马年大吉</h1>
          </motion.div>
          
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.3
        }} className="text-lg md:text-xl text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            AI 陪你迎接崭新的一年
            <Sparkles className="w-5 h-5 text-secondary" />
          </motion.p>

          {/* 马年装饰 */}
          <motion.div className="text-6xl md:text-7xl mt-8" animate={{
          y: [0, -10, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}>
            🐴
          </motion.div>
        </motion.div>

        {/* 选项卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          {options.map((option, index) => <motion.div key={option.id} initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2 + index * 0.2
        }} whileHover={{
          y: -8,
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={() => navigate(option.path)} className="group relative cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-3xl blur transition-all duration-300" style={{
            background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)`
          }} />
              
              <div className="relative p-8 md:p-10 rounded-2xl bg-card border-2 border-border/50 hover:border-secondary/50 transition-all duration-300 shadow-[var(--shadow-card)] hover:shadow-2xl">
                {/* 图标 */}
                <motion.div className="text-6xl md:text-7xl mb-4" whileHover={{
              rotate: [0, -10, 10, -10, 0],
              scale: 1.1
            }} transition={{
              duration: 0.5
            }}>
                  {option.icon}
                </motion.div>

                {/* 标题 */}
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent`}>
                  {option.title}
                </h2>

                {/* 描述 */}
                <p className="text-muted-foreground text-sm md:text-base mb-4">
                  {option.description}
                </p>

                {/* 进入提示 */}
                <div className="flex items-center text-sm text-primary/70 group-hover:text-primary transition-colors">
                  <span>点击进入</span>
                  <motion.span className="ml-2" animate={{
                x: [0, 5, 0]
              }} transition={{
                duration: 1.5,
                repeat: Infinity
              }}>
                    →
                  </motion.span>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* 底部装饰 */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.8
      }} className="text-center text-sm text-muted-foreground/60 mt-12 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <span>马到成功</span>
            <span>·</span>
            <span>龙马精神</span>
            <span>·</span>
            <span>一马当先</span>
          </p>
          <p className="text-xs">祝您马年大吉，万事如意！
桃子第一个成功的小工具，请多支持！！！</p>
        </motion.div>
      </div>
    </div>;
};
export default Home;