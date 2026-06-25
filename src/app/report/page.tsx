'use client';

import Link from 'next/link';
import { ReportForm } from '@/components/incident/ReportForm';

export default function ReportPage() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-100 bg-white safe-area-top">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
        <h1 className="text-sm font-bold text-gray-900">Reportar incidente</h1>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Warning banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
        <p className="text-xs text-yellow-800 flex items-center gap-1">
          <span>⚠️</span>
          Solo para emergencias reales. Los reportes son públicos.
        </p>
      </div>

      <ReportForm />
    </div>
  );
}
