'use client';

import { useEffect, useState } from 'react';
import { getPublicResults } from '../actions/results';
import { YouthAthlete } from '../results/ResultsHome';

const page = () => {
    const [data, setData] = useState<any>(null);

    const getResults = async () => {
        const res = await getPublicResults('youth');

        if (res.success) {
            const formattedAthletes: YouthAthlete[] = (res.data || []).map((athlete: any) => ({
                id: athlete.id,
                name: athlete.name,
                year: athlete.year,
                dob: athlete.dob,
                events: athlete.events.map((result: any) => ({
                    id: result.id,
                    name: result.name,
                    dob: athlete.dob,
                    performance: result.performance,
                    unit: result.unit,
                    year: result.year,
                    athleteId: result.athleteId,
                    athleteName: athlete.name,
                })),
            }));

            return formattedAthletes;
        } else return null;
    };

    useEffect(() => {
        const getData = async () => {
            const athletes = await getResults();

            if (athletes) {
                setData(athletes);
            }
        };

        getData();
    }, []);

    return (
        <>
            <div>test</div>
            <div>{JSON.stringify(data)}</div>
        </>
    );
};

export default page;
