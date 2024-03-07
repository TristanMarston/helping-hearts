import React, { createContext, useState, useContext } from 'react';

type Context = {
    signedIn: boolean;
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create the context
const AuthenticationContext = createContext<Context | undefined>(undefined);

// Create a custom hook to use the context
export const useAuthenticationContext = () => useContext(AuthenticationContext);

// Create the provider component
export const MyProvider = ({ children }: any) => {
    const [signedIn, setSignedIn] = useState(false);

    return <AuthenticationContext.Provider value={{ signedIn, setSignedIn }}>{children}</AuthenticationContext.Provider>;
};
