import React, { createContext, useContext, useState } from "react";
import { IAuthResponse } from "@/types/IAuth";
import { removeAllCartItems } from "@/services/user/ShoppingCartService";

interface AuthContextType {
    authentication: IAuthResponse | null;
    login: (authData: IAuthResponse) => void;
    logout: () => void;
}

const AuthenticationContext = createContext<AuthContextType | null>(null);

const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authentication, setAuthentication] = useState<IAuthResponse | null>(() => {
        const savedAuth = localStorage.getItem("authentication");
        return savedAuth ? JSON.parse(savedAuth) : null;
    });

    const login = (authData: IAuthResponse) => {
        setAuthentication(authData);
        localStorage.setItem("authentication", JSON.stringify(authData));
    };

    const logout = () => {
        setAuthentication(null);
        localStorage.removeItem("authentication");
        localStorage.removeItem('pendingOrderData');
        localStorage.setItem('loggedOutUser', Date.now().toString());
        removeAllCartItems();
        window.location.href = '/';
    };

    return (
        <AuthenticationContext.Provider value={{ authentication, login, logout }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
export default AuthenticationProvider;

export const useAuthentication = () => {
    return useContext(AuthenticationContext);
};
