'use client';

import Link from 'next/link';

export function FabButton() {
  return (
    <Link
      href="/report"
      className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-red-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-red-700 active:scale-95 transition-all md:hidden"
      aria-label="Reportar incidente"
    >
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}
