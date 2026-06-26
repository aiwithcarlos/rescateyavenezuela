'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Header() {
    const pathname = usePathname();
    const isReportPage = pathname === '/report'; // || pathname === '/voluntario' || pathname.startsWith('/incident/');

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 safe-area-top">
            <div className="flex items-center justify-between px-4 h-14">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                            RYV
                        </span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            RescateYA Venezuela
                        </h1>
                        <p className="text-sm text-gray-500 leading-tight">
                            Mapa de incidentes activos
                        </p>
                    </div>
                </Link>

                {!isReportPage && (
                    <Link
                        href="/report"
                        className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-full shadow-md hover:bg-red-700 active:scale-95 transition-all"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Reportar
                    </Link>
                )}
            </div>
            
        </header>
    );
}
