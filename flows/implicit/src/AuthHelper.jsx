import cookie from "js-cookie";

function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

export function getPayload() {
    const token = cookie.get('access_token');
    if (!token) {
        return null;
    }
    return decodeJwt(token);
}

export function login(access_token, id_token, state) {
    if (state !== cookie.get("state")) {
        throw new Error('invalidate state');
    }
    const payload = decodeJwt(access_token);
    if (payload.nonce !== cookie.get('nonce')) {
        throw new Error('invalidate nonce');
    }
    cookie.set("access_token", access_token);
    cookie.set("id_token", id_token);
    return payload;
}   

export function createLoginUrl() {
    const nonce = window.crypto.randomUUID();
    const state = window.crypto.randomUUID();
    cookie.set("nonce", nonce);
    cookie.set("state", state);
    const loginParams = new URLSearchParams({
        client_id: "duck",
        redirect_uri: "http://localhost:5173/callback",
        response_type: "token id_token",
        nonce,
        state
    });
    return `http://localhost:8080/realms/master/protocol/openid-connect/auth?${loginParams}`;
}

export function createLogoutUrl() {
    if (!cookie.get("id_token")) {
        return null;
    }
    const logoutParams = new URLSearchParams({
        // client_id: "duck",
        id_token_hint: cookie.get("id_token"),
        post_logout_redirect_uri: "http://localhost:5173/login",
    });
    cookie.remove("access_token");
    cookie.remove("id_token");
    cookie.remove("nonce");
    cookie.remove("state");
    return `http://localhost:8080/realms/master/protocol/openid-connect/logout?${logoutParams}`;
}