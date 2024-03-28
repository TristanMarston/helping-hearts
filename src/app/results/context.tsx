'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

type Event = {
    name: string;
    performance: string;
};

type Athlete = {
    _id: string;
    firstName: string;
    lastName: string;
    grade: string;
    events: Event[];
};

type Context = {
    athletesData: Athlete[];
};

// Create the context
const AthletesContext = createContext<Context | undefined>(undefined);

// Create a custom hook to use the context
export const useAthletesContext = () => useContext(AthletesContext);

// Create the provider component
export const MyProvider = ({ children }: any) => {
    const [athletesData, setAthletesData] = useState<Athlete[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/athletes`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setAthletesData(() => {
                    return [...data];
                });
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    return <AthletesContext.Provider value={{ athletesData }}>{children}</AthletesContext.Provider>;
};
