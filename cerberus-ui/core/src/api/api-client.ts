import {ApiClient} from "@cerberus/shared/src";
import {Axios, AxiosResponse} from 'axios';

const baseConfig = {
    baseURL: 'http://localhost:5222/api',
    headers: {
        'Content-Type': 'application/json',
    }
}

const axios = new Axios(baseConfig);

export class ApiClientImpl extends ApiClient{
    get<T>(url: string, requestInit: RequestInit | undefined): Promise<T> {
        const request = axios.get(url, {headers: this.getHeaders(requestInit)});
        return this.handleResponse(request)
    }

    post<T>(url: string, requestInit: RequestInit): Promise<T> {
        const request  = axios.post(url, requestInit.body, {headers: this.getHeaders(requestInit)});
        return this.handleResponse(request)
    }

    put<T>(url: string, requestInit: RequestInit): Promise<T> {
        const request = axios.put(url, requestInit.body, {headers: this.getHeaders(requestInit)});
        return this.handleResponse(request)
    }

    delete<T>(url: string): Promise<T> {
        const request = axios.delete(url);
        return this.handleResponse(request)
    }

    private getHeaders(requestInit: RequestInit | undefined): any {
        return requestInit?.headers || {};
    }

    private async handleResponse<T>(request: Promise<AxiosResponse>):Promise<T>{
        const response = await request;
        const data = response.data;
        return typeof data === 'string' ? JSON.parse(data) : data;
    }
}