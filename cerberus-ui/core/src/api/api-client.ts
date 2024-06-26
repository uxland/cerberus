import {ApiClient} from "@cerberus/shared/src";
import {Axios} from 'axios';

const baseConfig = {
    baseURL: 'http://localhost:5222/api',
    headers: {
        'Content-Type': 'application/json'
    }
}

const axios = new Axios(baseConfig);

export class ApiClientImpl extends ApiClient{
    async get<T>(url: string, requestInit: RequestInit | undefined): Promise<T> {
        const response = await axios.get(url, {headers: this.getHeaders(requestInit)});
        return response.data;
    }

    async post<T>(url: string, requestInit: RequestInit): Promise<T> {
        let response = await axios.post(url, requestInit.body, {headers: this.getHeaders(requestInit)});
        return await response.data;
    }

    async put<T>(url: string, requestInit: RequestInit): Promise<T> {
        let response = await axios.put(url, requestInit.body, {headers: this.getHeaders(requestInit)});
        return await response.data;
    }

    async delete<T>(url: string): Promise<T> {
        let response = await axios.delete(url);
        return await response.data;
    }

    private getHeaders(requestInit: RequestInit | undefined): any {
        return requestInit?.headers || {};
    }
}