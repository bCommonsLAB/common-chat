'use client';

interface MainFooterProps {
  className?: string;
}

export function MainFooter({ className = '' }: MainFooterProps) {
  return (
    <footer className={`w-full bg-gray-100 py-4 px-6 sticky bottom-0 z-10 ${className}`}>
      powered by bCommonsLAB - {new Date().getFullYear()} - <a href="https://bcommonslab.org">bcommonslab.org</a>
    </footer>
  );
}