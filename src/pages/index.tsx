import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function HomePage() {
  return (
    <div>
      <Link href="/ultimate">アルティメット</Link>
    </div>
  );
}
