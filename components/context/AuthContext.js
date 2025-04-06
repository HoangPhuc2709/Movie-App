import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    const checkLogin = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const email = await AsyncStorage.getItem("userEmail");
            setIsLoggedIn(!!token);
            if (email) setUserEmail(email);
        } catch (error) {
            console.error("Error checking login status:", error);
            setIsLoggedIn(false);
        }
    };

    const login = async (token, email) => {
        try {
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("userEmail", email);
            setIsLoggedIn(true);
            setUserEmail(email);
        } catch (error) {
            console.error("Error saving login data:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userEmail");
            setIsLoggedIn(false);
            setUserEmail(null);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                userEmail,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
