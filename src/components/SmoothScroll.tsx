'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Synchronize Lenis scrolling states with GreenSock triggers
    gsap.registerPlugin(ScrollTrigger);
    
    const updateScrollTrigger = () => ScrollTrigger.update();
    ScrollTrigger.addEventListener('refresh', updateScrollTrigger);

    return () => {
      ScrollTrigger.removeEventListener('refresh', updateScrollTrigger);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
