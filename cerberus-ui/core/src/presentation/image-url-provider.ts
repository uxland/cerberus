// @ts-ignore
const urlBase = import.meta.env.VITE_CERBERUS_IMAGES_URL

type urlCategory = 'relative' | 'absolute' | 'base64';

const categorizeUrl = (url: string): urlCategory => {
    const absoluteUrlPattern = new RegExp('^(?:[a-z]+:)?//', 'i');
    const base64Pattern = new RegExp('^data:image\/[a-z]+;base64,', 'i');

    if (base64Pattern.test(url)) {
        return 'base64';
    }
    return absoluteUrlPattern.test(url) ? 'absolute' : 'relative';
}

export const getImageUrl= (url: string) =>
    categorizeUrl(url) === 'relative' ? `${urlBase}/${url}` : url;
