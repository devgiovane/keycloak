import { createContext, useCallback, useState } from "react"

import * as AuthHelper from "./AuthHelper";

export const AuthContext = createContext({
    auth: null,
    login: () => {}
});

export function AuthProvider(props) {
    const login = useCallback(function(access_token, id_token, state) {
        const authPayload = AuthHelper.login(access_token, id_token, state);
        setData(function (oldState) {
            return ({
                payload: authPayload,
                login: oldState.login
            });
        });
    }, []);
    const [ data, setData ] = useState({
        auth: AuthHelper.getPayload(),
        login: login
    });
    return (
        <AuthContext.Provider value={data}>
            {props.children}
        </AuthContext.Provider>
    )
}