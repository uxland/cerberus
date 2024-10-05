import {Container} from "inversify";
import Keycloak from "keycloak-js";
import {AuthClient} from "./auth-client.ts";
import {TYPES} from "../ioc/types.ts";
export const bootstrapAuth: (container: Container) => Container = (container) => {
    const keycloak = createAuthMiddleware();
    setupRefreshToken(keycloak);
    const authClient = new AuthClientImpl(keycloak);
    container.bind<AuthClient>(TYPES.authClient).toConstantValue(authClient);
    return container;
}

export const teardownAuth: (container: Container) => void = (container) => {
    container.isBound(TYPES.authClient) && container.unbind(TYPES.authClient);
}

const createAuthMiddleware = () => new Keycloak({
    // @ts-ignore
    url: import.meta.env.VITE_AUTH_URL, realm: import.meta.env.VITE_AUTH_REALM, clientId: import.meta.env.VITE_AUTH_CLIENT_ID
});

class AuthClientImpl implements AuthClient {
    constructor(private keycloak: Keycloak) {
    }
    get token() {
        return this.keycloak.token;
    }
    set token(token: string) {
        this.keycloak.token = token;
    }
    init(): Promise<boolean> {
        return this.keycloak.init({onLoad: 'login-required'});
    }
}

const setupRefreshToken = (keycloak: Keycloak) => {
    keycloak.onTokenExpired = () => {
        keycloak.updateToken(30).then(refreshed => {
            console.log(refreshed ? 'Token refreshed': 'Failed to refresh token, will log in again');
        }).catch(() => {
            console.error('Failed to refresh token');
        });
    }
}