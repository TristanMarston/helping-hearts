import React, { createContext, useState, useContext } from 'react';

type Event = {
    name: string;
    performance: string;
};

type Athlete = {
    firstName: string;
    lastName: string;
    grade: string;
    events: Event[];
};

type Context = {
    athletes: Athlete[];
};

// Create the context
const AthletesContext = createContext<Context | undefined>(undefined);

// Create a custom hook to use the context
export const useAthletesContext = () => useContext(AthletesContext);

// Create the provider component
export const MyProvider = ({ children }: any) => {
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const [athletes, setAthletes] = useState<Athlete[]>([]);

    fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/athletes`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setAthletes(() => {
                setHasFetched(true);
                return [...data];
            });
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });

    return <AthletesContext.Provider value={{ athletes }}>{children}</AthletesContext.Provider>;
};
