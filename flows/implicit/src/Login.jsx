import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "./AuthProvider";
import { createLoginUrl } from "./AuthHelper";

export function Login() {
    const { auth } = useContext(AuthContext);
    useEffect(function () {
        if (!auth) {
            window.location.href = createLoginUrl();
        }
    }, [auth]);
    return auth ? <Navigate to="/admin" /> : <div>Loading...</div>
}