export abstract class ApiClient{
    abstract get<T>(url: string, requestInit?: RequestInit | undefined): Promise<T>;
    abstract post<T>(url: string, requestInit: RequestInit): Promise<T>;
    abstract put<T>(url: string, requestInit: RequestInit): Promise<T>;
    abstract postFile<T>(url: string, requestInit: RequestInit): Promise<T>;
    abstract delete<T>(url: string, requestInit?: RequestInit | undefined): Promise<T>;
    abstract getFile(url: string, requestInit?: RequestInit | undefined): Promise<{filename: string | undefined, content: Blob}>;
}