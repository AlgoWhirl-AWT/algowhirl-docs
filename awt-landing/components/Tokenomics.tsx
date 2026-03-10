// components/Tokenomics.tsx
'use client'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  labels: ['Liquidity', 'Rewards', 'Ecosystem', 'Team', 'Marketing', 'Burn'],
  datasets: [{
    data: [20, 30, 20, 15, 10, 5],
    backgroundColor: [
      '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'
    ],
  }],
}

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-32 px-4 bg-black/50">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="text-5xl font-bold mb-8"
        >
          Tokenomics
        </motion.h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Total Supply: 1,000,000,000 AWT | Deflationary 1% Tax
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <Pie data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
      </div>
    </section>
  )
}