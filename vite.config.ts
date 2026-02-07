import { defineConfig, PluginOption } from "vite";
import { enterDevPlugin, enterProdPlugin } from 'vite-plugin-enter-dev';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    ...enterProdPlugin(),
  ];
  if (mode === 'development') {
    plugins.push(...enterDevPlugin());
  }
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: plugins.filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: '/',
     build: {
    chunkSizeWarningLimit: 1500, // 还是建议先提高阈值
    rollupOptions: {
      output: {
        // 手动分割依赖包，将每个npm包单独打包成一个文件
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 这将把 'node_modules/包名' 的包单独分割出来
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
    build: {
      outDir: 'dist',
    }
  };
});
