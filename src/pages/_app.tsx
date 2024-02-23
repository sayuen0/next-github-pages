import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { GameProvider } from '@/lib/domain/model/game/texasHoldem/ultimate/ultimateContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  );
}
