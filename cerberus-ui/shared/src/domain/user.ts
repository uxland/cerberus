export interface User{
    authenticated: boolean;
    roles?: string[] | undefined;
    email?: string | undefined;
    name?: string | undefined;
    preferredUsername?: string | undefined;
    givenName?: string | undefined;
    familyName?: string | undefined;
    token?: string | undefined;
}