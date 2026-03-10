// components/Hero.tsx
'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Brain, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-r from-purple-900 to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center w-32 h-32 bg-white/10 rounded-full mb-8 mx-auto">
          <Brain className="w-16 h-16 text-purple-400" />
        </div>
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
          AWT Token
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          AI-Web3 Token – Empowering Decentralized Intelligence
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-12 text-left max-w-4xl mx-auto">
          <div className="bg-white/5 p-6 rounded-xl">
            <div className="text-3xl font-bold text-purple-400">$0.01</div>
            <div>Price</div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl">
            <div className="text-3xl font-bold text-green-400">$10M</div>
            <div>Market Cap</div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl">
            <div className="text-3xl font-bold text-blue-400">1B</div>
            <div>Total Supply</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ConnectButton className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-full font-bold text-lg" />
          <a href="#tokenomics" className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-bold transition-all">
            Whitepaper
          </a>
        </div>
      </motion.div>
    </section>
  )
}