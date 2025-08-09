'use client';
import Navbar from '@/components/Navbar';
import Starry from './starry';

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
        <Starry/>
      <Navbar/>
    </main>
  );
}
