import Keycloak from 'keycloak-js';
import {Mediator} from "mediatr-ts";
import {UserAuthenticated, UserLoggedOut} from "./notifications.ts";
import {createUser} from "./utilities.ts";

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
    // @ts-ignore
    url: import.meta.env.VITE_AUTH_URL, realm: import.meta.env.VITE_AUTH_REALM, clientId: import.meta.env.VITE_AUTH_CLIENT_ID
});
keycloak.onTokenExpired = () => {
    keycloak.updateToken(30).then(refreshed => {
        console.log(refreshed ? 'Token refreshed': 'Failed to refresh token, will log in again');
    }).catch(() => {
        console.error('Failed to refresh token');
        keycloak.init({onLoad: 'login-required'});
    });
}
keycloak.onAuthSuccess =async () =>{
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
    redirectUri: "https://cerberus-react-ui:5173",
    checkLoginIframe: false,
};
const refreshToken = async () => {
    keycloak.updateToken(30).then(refreshed => {
        console.log(refreshed ? 'Token refreshed': 'Failed to refresh token, will log in again');
    }).catch(() => {
        console.error('Failed to refresh token');
        keycloak.init({onLoad: 'login-required'});
    });
}
export {
    keycloak,
    keycloakInitConfig,
    refreshToken
};

