import './globals.css'
import { RainbowKitProvider, getDefaultWallets } from 'rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { darkTheme } from 'rainbowkit';

const queryClient = new QueryClient();
const { chains, publicClient } = configureChains([mainnet], [...w ethersProviders]);
const { connectors } = getDefaultWallets({ appName: 'AWT', projectId: 'YOUR_PROJECT_ID', chains });
const wagmiClient = createConfig({ chains, publicClient, connectors });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={wagmiClient}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider chains={chains} theme={darkTheme()}>{children}</RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}