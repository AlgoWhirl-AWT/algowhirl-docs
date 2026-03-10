const { createApp, createConfig } = require('wagmi')
const { manualReconnect } = require('@wagmi/core')
const { mainnet, sepolia } = require('@wagmi/core/chains')
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query')
const { RainbowKitProvider, getDefaultWallets } = require('@rainbow-me/rainbowkit')
const { 
  http,
  createStorage,
  cookieStorage,
  indexedDBStorage 
} = require('viem')

const projectId = 'YOUR_PROJECT_ID' // Infura/Alchemy

const metadata = {
  name: 'AWT',
  description: 'AWT Token Landing',
  url: 'https://awt.algowhirl.com',
  icons: ['https://awt.algowhirl.com/favicon.ico']
}

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  storage: createStorage({
    storage: typeof window !== 'undefined' 
      ? window.localStorage 
      : undefined
  })
})

module.exports = config