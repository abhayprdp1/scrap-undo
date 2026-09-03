'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-up' | 'fade-left' | 'fade-right';
  delay?: 'delay-100' | 'delay-200' | 'delay-300' | 'delay-400' | 'delay-500';
  bidirectional?: boolean; // Re-trigger on both scroll down AND scroll up
}

export default function ScrollReveal({
  children,
  className = '',
  variant = 'fade-up',
  delay,
  bidirectional = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!bidirectional) {
            observer.unobserve(el);
          }
        } else if (bidirectional) {
          // Reset visibility when element leaves viewport so it animates again on scroll up
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [bidirectional]);

  const variantClass =
    variant === 'fade-left'
      ? 'reveal-scroll-left'
      : variant === 'fade-right'
      ? 'reveal-scroll-right'
      : 'reveal-scroll';

  return (
    <div
      ref={ref}
      className={`${variantClass} ${delay || ''} ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
