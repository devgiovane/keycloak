import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";

export function PrivateRoute(props) {
    const { auth } = useContext(AuthContext);
    if (!auth) {
        return <Navigate to='/login' />
    }
    return props.children;
}