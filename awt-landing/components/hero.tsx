import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-8">
          AWT Token
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
          AI-Web3 的原生代币。去中心化AI计算、数据&模型市场。TGE上线！
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-xl px-8 py-6">
            连接钱包
          </Button>
          <Button variant="outline" size="lg" className="text-xl px-8 py-6">
            白皮书
          </Button>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          <div>
            <div className="text-4xl font-bold text-green-400">$0.01</div>
            <div>当前价格</div>
          </div>
          <div>
            <div className="text-4xl font-bold">$10M</div>
            <div>FDV</div>
          </div>
          <div>
            <div className="text-4xl font-bold">1B</div>
            <div>总供应</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}