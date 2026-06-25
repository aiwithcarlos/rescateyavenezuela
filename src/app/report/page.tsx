'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ReportForm } from '@/components/incident/ReportForm';

export default function ReportPage() {
    return (
        <div className="h-full flex flex-col bg-white">
            <Header />

            {/* Warning banner */}
            <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 mt-14">
                <p className="text-sm text-yellow-800 flex items-center gap-1">
                    <span>⚠️</span>
                    Solo para emergencias reales. Los reportes son públicos.
                </p>
            </div>

            {/* Título grande */}
            <h1 className="text-2xl font-extrabold text-gray-900 px-4 pt-5 pb-1">
                Reportar Incidente
            </h1>

            <ReportForm />

            {/* Botón Volver al mapa */}
            <div className="px-4 pb-6 pt-2">
                <Link
                    href="/"
                    className="w-full py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 flex items-center justify-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al mapa
                </Link>
            </div>
        </div>
    );
}
