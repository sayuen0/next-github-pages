import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function HomePage() {
  /**
   * "/ultimate"へのリンクを作成する
   */
  return (
    <div>
      <a href="/ultimate">Ultimate</a>
    </div>
  );
}
