import Keycloak from 'keycloak-js';
import { Mediator } from "mediatr-ts";
import { UserAuthenticated, UserLoggedOut } from "./notifications.ts";
import { createUser } from "./utilities.ts";

// Save the current path before authentication
const saveCurrentPath = () => {
    if (window.location.pathname !== '/' && !window.location.pathname.includes('keycloak')) {
        sessionStorage.setItem('redirectPath', window.location.pathname + window.location.search);
    }
};

// Save path on initial load 
if (typeof window !== 'undefined') {
    saveCurrentPath();
}

// Setup Keycloak instance as needed
const keycloak = new Keycloak({
    // @ts-ignore
    url: import.meta.env.VITE_AUTH_URL, realm: import.meta.env.VITE_AUTH_REALM, clientId: import.meta.env.VITE_AUTH_CLIENT_ID
});

keycloak.onTokenExpired = () => {
    saveCurrentPath();
    keycloak.updateToken(30).then(refreshed => {
        console.log(refreshed ? 'Token refreshed' : 'Failed to refresh token, will log in again');
    }).catch(() => {
        console.error('Failed to refresh token');
        keycloak.init({ onLoad: 'login-required' });
    });
}

keycloak.onAuthSuccess = async () => {
    try {
        await new Mediator().publish(new UserAuthenticated(createUser()));
    }
    catch (e) {
        console.error(e);
    }
};

keycloak.onAuthLogout = async () => {
    try {
        await new Mediator().publish(new UserLoggedOut());
    }
    catch (e) {
        console.error(e);
    }
}

const keycloakInitConfig = {
    onLoad: "login-required",
    redirectUri: window.location.origin,
    checkLoginIframe: false,
};

const refreshToken = async () => {
    saveCurrentPath();
    keycloak.updateToken(30).then(refreshed => {
        console.log(refreshed ? 'Token refreshed' : 'Failed to refresh token, will log in again');
    }).catch(() => {
        console.error('Failed to refresh token');
        keycloak.init({ onLoad: 'login-required' });
    });
}

export {
    keycloak,
    keycloakInitConfig,
    refreshToken
};