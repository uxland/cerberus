import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const NotFoundView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex items-center justify-center h-[100%]">
            <div className="max-w-md w-full text-center bg-tableBg rounded-lg p-8">
                <div className="mb-6">
                    <div
                        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#FF2366' }}
                    >
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="mb-2">
                    <span
                        className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                            backgroundColor: '#FF2366',
                            color: 'white'
                        }}
                    >
                        Error 404
                    </span>
                </div>

                <h1
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'white' }}
                >
                    Página no encontrada
                </h1>

                <p
                    className="text-base mb-4 opacity-70"
                    style={{ color: 'white' }}
                >
                    La ruta <code className="bg-gray-800 px-2 py-1 rounded">{location.pathname}</code> no existe.
                </p>

                <p
                    className="text-base mb-8 opacity-70"
                    style={{ color: 'white' }}
                >
                    Verifica la URL e intenta nuevamente.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleGoHome}
                        className="px-4 py-2 font-medium rounded-lg transition-all duration-200 hover:brightness-110"
                        style={{
                            backgroundColor: '#ffc200',
                            color: '#1f1f1f',
                        }}
                        aria-label="Ir al inicio"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Ir al inicio
                        </span>
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 font-medium rounded-lg border-2 hover:brightness-110"
                        style={{
                            borderColor: 'white',
                            color: 'white'
                        }}
                        aria-label="Volver atrás"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Volver
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};