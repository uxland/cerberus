import {KeycloakTokenParsed} from "keycloak-js";
import {User} from "@cerberus/shared/src/domain/user.ts";
import {keycloak} from "./keycloak.ts";

const createUser = (): User => {
    const token: KeycloakTokenParsed = keycloak.tokenParsed;
    return {
        authenticated: true,
        email: token.email,
        name: token.name,
        preferredUsername: token.preferred_username,
        givenName: token.given_name,
        familyName: token.family_name,
        token: keycloak.token,
        roles: token.resource_access?.cerberus?.roles
    };
}
export {createUser};