import { createContext, useState } from "react"

export const AuthContext = createContext({
    
});

export function AuthProvider({ props }) {
    const [] = useState({});
    return (
        <AuthContext.Provider >
            {props.childrean}
        </AuthContext.Provider>
    )
}