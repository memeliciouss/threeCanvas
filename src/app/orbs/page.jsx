'use client';
import Orbs from './Orbs'
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <Orbs/>
      <Navbar/>
    </main>
  );
}
