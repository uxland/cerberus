import React from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface ErrorViewProps {
    error: AxiosError;
    customMessages?: { [statusCode: number]: string };
    onRefresh?: () => void;
    onGoBack?: () => void;
}

const DEFAULT_ERROR_MESSAGES: { [key: number]: string } = {
    400: 'Solicitud incorrecta',
    401: 'No autorizado',
    403: 'Acceso denegado',
    404: 'No encontrado',
    409: 'Conflicto',
    422: 'Datos no válidos',
    429: 'Demasiadas solicitudes',
    500: 'Error del servidor',
    502: 'Error de conexión',
    503: 'Servicio no disponible',
    504: 'Tiempo de espera agotado'
};

export const ErrorView: React.FC<ErrorViewProps> = ({
    error,
    customMessages,
    onRefresh,
    onGoBack
}) => {
    const navigate = useNavigate();

    const getErrorMessage = (): { code: number | null; message: string } => {
        const statusCode = error.response?.status;

        if (!statusCode) {
            return {
                code: null,
                message: 'Ha ocurrido un error inesperado'
            };
        }

        // Prioridad 1: Mensaje personalizado
        if (customMessages?.[statusCode]) {
            return {
                code: statusCode,
                message: customMessages[statusCode]
            };
        }

        // Prioridad 2: Mensaje por defecto
        if (DEFAULT_ERROR_MESSAGES[statusCode]) {
            return {
                code: statusCode,
                message: DEFAULT_ERROR_MESSAGES[statusCode]
            };
        }

        // Prioridad 3: Mensaje genérico
        return {
            code: statusCode,
            message: 'Ha ocurrido un error inesperado'
        };
    };

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        } else {
            navigate(-1);
        }
    };

    const { code, message } = getErrorMessage();

    return (
        <div className="flex items-center justify-center h-[100%]">
            <div className="max-w-md w-full text-center bg-tableBg rounded-lg p-8 ">
                {/* Icono de error */}
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
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Código de error */}
                {code && (
                    <div className="mb-2">
                        <span
                            className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                            style={{
                                backgroundColor: '#FF2366',
                                color: 'white'
                            }}
                        >
                            Error {code}
                        </span>
                    </div>
                )}

                {/* Mensaje de error */}
                <h1
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'white' }}
                >
                    {message}
                </h1>

                <p
                    className="text-base mb-8 opacity-70"
                    style={{ color: 'white' }}
                >
                    {code
                        ? 'Por favor, verifica la información e intenta nuevamente.'
                        : 'Revisa tu conexión a internet e intenta nuevamente.'
                    }
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 font-medium rounded-lg transition-all duration-200 hover:brightness-110"
                            style={{
                                backgroundColor: '#ffc200',
                                color: '#1f1f1f',
                            }}
                            aria-label="Reintentar la acción"
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
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Reintentar
                            </span>
                        </button>
                    )}

                    {/* ✅ Botón "Volver" siempre presente */}
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 font-medium rounded-lg border-2 hover:brightness-110"
                        style={{
                            borderColor: 'white',
                            color: 'white'
                        }}
                        aria-label="Volver a la vista anterior"
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