import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">index</Link>
      <Link href="/about">about</Link>
    </nav>
  );
}
