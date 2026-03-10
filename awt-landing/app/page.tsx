import { ConnectButton } from 'rainbowkit';
import { Button } from '@/components/ui/button'; // TODO: shadcn later
import { Hero } from '@/components/hero';
import { Tokenomics } from '@/components/tokenomics';
// etc.

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AWT</div>
        <ConnectButton />
      </nav>
      <Hero />
      <Tokenomics />
      {/* Roadmap, Team, etc. */}
    </main>
  );
}