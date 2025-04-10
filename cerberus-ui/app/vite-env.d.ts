/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_CERBERUS_BACKEND_URL: string;
    readonly VITE_CERBERUS_STREAMING_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}