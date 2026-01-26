import { motion } from 'framer-motion';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface ActionButtonsProps {
  greeting: string;
  onRegenerate: () => void;
  hasImage: boolean;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
}

export const ActionButtons = ({ 
  greeting, 
  onRegenerate, 
  hasImage,
  onGenerateImage,
  isGeneratingImage 
}: ActionButtonsProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(greeting);
      toast.success('贺词已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败，请重试');
    }
  };

  const handleDownload = async () => {
    try {
      const element = document.getElementById('greeting-card');
      if (!element) {
        toast.error('找不到贺卡元素');
        return;
      }

      toast.info('正在生成图片...');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('生成图片失败');
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `马年贺卡-${new Date().getTime()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('贺卡图片已下载');
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('下载失败，请重试');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-2xl mx-auto px-4"
    >
      <Button
        onClick={handleCopy}
        variant="outline"
        size="lg"
        className="flex-1 sm:flex-none border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all"
      >
        <Copy className="mr-2 h-4 w-4" />
        复制贺词
      </Button>

      {!hasImage && !isGeneratingImage && (
        <Button
          onClick={onGenerateImage}
          variant="gold"
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <Download className="mr-2 h-4 w-4" />
          生成图片
        </Button>
      )}

      <Button
        onClick={handleDownload}
        variant="festive"
        size="lg"
        className="flex-1 sm:flex-none"
      >
        <Download className="mr-2 h-4 w-4" />
        下载贺卡
      </Button>

      <Button
        onClick={onRegenerate}
        variant="outline"
        size="lg"
        className="flex-1 sm:flex-none border-accent/30 hover:bg-accent/5 hover:border-accent/50 transition-all"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        重新生成
      </Button>
    </motion.div>
  );
};
