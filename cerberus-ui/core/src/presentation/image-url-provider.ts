// @ts-ignore
const urlBase = import.meta.env.VITE_CERBERUS_BACKEND_URL
export const getImageUrl= (url: string) =>{
    return `${urlBase}/images/${url}`;
}