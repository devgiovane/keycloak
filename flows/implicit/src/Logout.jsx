import { useEffect } from "react"
import { createLogoutUrl } from "./AuthHelper";

export function Logout() {
    useEffect(function () {
        const logoutUrl = createLogoutUrl();
        if (logoutUrl) {
            window.location.href = logoutUrl;
        }
    }, []);
    return <div>Loading...</div>
}