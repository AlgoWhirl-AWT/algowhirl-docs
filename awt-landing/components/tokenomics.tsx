export function Tokenomics() {
  // Chart.js pie chart mock
  return (
    <section id="tokenomics" className="py-32 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-20">Tokenomics</h2>
        {/* Mock pie chart placeholder */}
        <div className="w-96 h-96 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold">
          饼图
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 border border-gray-700 rounded-xl">
            <div className="text-3xl font-bold text-green-400">20%</div>
            <div>流动性</div>
          </div>
          {/* More allocations */}
        </div>
      </div>
    </section>
  );
}