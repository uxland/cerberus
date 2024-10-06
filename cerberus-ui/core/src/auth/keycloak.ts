import Keycloak from 'keycloak-js';

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
    });
}
export {
    keycloak
};