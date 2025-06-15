import {ApiClient} from "@cerberus/shared/src";
import {Axios, AxiosResponse} from 'axios';
import { keycloak } from "../auth";

// @ts-ignore
const urlBase = import.meta.env.VITE_CERBERUS_BACKEND_URL
const baseConfig = {
    baseURL: `${urlBase}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
}

const axios = new Axios(baseConfig);
const getPayload = (requestInit: RequestInit) => requestInit.body ? JSON.stringify(requestInit.body) : undefined;

export class ApiClientImpl extends ApiClient{
    async getFile(url: string, requestInit?: RequestInit | undefined): Promise<{ filename: string | undefined; content: Blob; }> {
        const response = await axios.get(url, {
            headers: this.getHeaders(requestInit),
            responseType: 'blob',
            transformResponse: []
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = undefined;
        if (contentDisposition) {
            const matches = contentDisposition.match(/filename="?([^";]+)"?/);
            if (matches?.[1]) {
                filename = matches[1];
            }
        }

        return {filename, content: response.data};
    }


    get<T>(url: string, requestInit: RequestInit | undefined): Promise<T> {
        const request = axios.get(url, {
                headers: this.getHeaders(requestInit),
                responseType: 'json'
            }
        );
        return this.handleResponse(request)
    }

    post<T>(url: string, requestInit: RequestInit): Promise<T> {
        const request  = axios.post(url, getPayload(requestInit), {headers: this.getHeaders(requestInit)});
        return this.handleResponse(request)
    }
    postFile<T>(url: string, requestInit: RequestInit): Promise<T> {
        const request = axios.post(url, requestInit.body, {headers: this.getHeaders(requestInit)});
        return this.handleResponse(request);
    }

    put<T>(url: string, requestInit: RequestInit): Promise<T> {
        const request = axios.put(url, getPayload(requestInit), {headers: this.getHeaders(requestInit)});
        return this.handleResponse(request)
    }

    delete<T>(url: string): Promise<T> {
        const request = axios.delete(url);
        return this.handleResponse(request)
    }

    private getHeaders(requestInit: RequestInit | undefined): any {
        const authHeader = {Authorization: `Bearer ${keycloak.token}`};
        const requestHeaders = requestInit?.headers || {};
        return {...baseConfig.headers, ...authHeader, ...requestHeaders};
    }

    private async handleResponse<T>(request: Promise<AxiosResponse>):Promise<T>{
        const response = await request;
        return parseResponse(response);
    }
}

const parseResponse = (response: AxiosResponse) => {
    if(response.status >= 400)
        throw new Error(response.data);
    if((response.headers['content-type'] || '').includes('application/json')){
        const result = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        return typeof result === 'string' ? JSON.parse(result) : result;
    }
    return response.data;
};