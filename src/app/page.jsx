'use client';

import Navbar from '../components/Navbar';
import WordArt from '../components/WordArt';

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <Navbar/>
      <WordArt />
    </main>
  );
}
