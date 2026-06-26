'use client';

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
                    Permite a la aplicación utilizar tú ubicación para detectar
                    el lugar del incidente en tiempo real. Solo para emergencias
                    reales. Los reportes son públicos.
                </p>
            </div>

            {/* Título grande */}
            <h1 className="text-2xl font-extrabold text-gray-900 px-4 pt-5 pb-1">
                Reportar Incidente
            </h1>

            <ReportForm />
        </div>
    );
}
