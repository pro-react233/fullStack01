import { createPath } from "rd-url-utils";

declare const API_URL: string;
declare const LOGIN_URL: string;

interface TokenInfo {
    auth_token: string;
    refresh_token: string;
}

export const StoreTokenUrl = createPath("/signin");

export function apiUrl(path: string): string {
    return `${(API_URL || "").replace(/\/$/, "")}/${(path || "").replace(
        /^\//,
        ""
    )}`;
}

export function customFetch(request: Request): Promise<Response> {
    request = prepareRequest(request);

    return fetch(request).then((res: Response) => {
        if (res.status === 401) {
            redirectToLogin() as any; // otherwise infinite loop
            return res;
        }

        return res;
    });
}

export function storeTokens(tokens: TokenInfo): void {
    const tokenStr = JSON.stringify(tokens);
    localStorage.setItem("rd-erp.Auth", tokenStr);
}

function prepareRequest(request: Request): Request {
    const tokens = getTokens();

    return new Request(request, {
        credentials: "include",
        mode: "cors",
        headers: {
            Authorization: tokens ? `Bearer ${tokens.auth_token}` : undefined,
            "Content-Type": "application/json"
        }
    });
}

function redirectToLogin(): void {
    const params = {
        redirect_uri: window.location.origin + StoreTokenUrl.format({}),
        client_id: "rd",
        scope: "rd-erp",
        response_type: "token",
        state: window.location.toString()
    };

    const querystring = Object.keys(params)
        .map(k => `${k}=${encodeURIComponent(params[k])}`)
        .join("&");

    const url = `${LOGIN_URL}?${querystring}`;

    window.location.assign(url);
}

function getTokens(): TokenInfo | undefined {
    const tokenStr = localStorage.getItem("rd-erp.Auth");
    if (tokenStr) {
        return JSON.parse(tokenStr);
    }

    return undefined;
}
