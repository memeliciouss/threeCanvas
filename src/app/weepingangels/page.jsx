'use client';
import WeepingAngel from './WeepingAngel';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <WeepingAngel/>
      <Navbar/>
    </main>
  );
}
