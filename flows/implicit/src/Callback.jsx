import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthProvider";

export function Callback() {
    const { hash } = useLocation();
    const { auth, login } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log(auth);
    useEffect(function () {
        if (auth) {
            return navigate("/login");
        }
        const searchParams = new URLSearchParams(hash.replace("#", ""));
        const accessToken = searchParams.get("access_token");
        const idToken = searchParams.get("id_token");
        const state = searchParams.get("state");
        if (!accessToken || !idToken || !state) {
            return navigate('/login');
        }
        return login(accessToken, idToken, state);
    }, [hash, auth, login, navigate]);
    
    return <div>Loading...</div>;
}