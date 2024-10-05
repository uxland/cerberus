export interface AuthClient {
    token?: string;
    init(): Promise<boolean>;
}
