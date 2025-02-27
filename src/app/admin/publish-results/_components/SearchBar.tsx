import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AthleteData } from './PublishResultsScreen';

type FilteredResult = {
    firstName: string;
    lastName: string;
    events: string[];
    id: string;
};

const SearchBar = ({
    response,
    athlete,
    chosenAthlete,
    setChosenAthlete,
    index,
    onSubmit,
}: {
    response: any[];
    athlete: AthleteData;
    chosenAthlete: { firstName: string; lastName: string }[];
    setChosenAthlete: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string }[]>>;
    index: number;
    onSubmit: (firstName: string, lastName: string, events: string[], id: string) => void;
}) => {
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState<string>('');
    const initialResults = response.map((item) => ({ firstName: item.firstName, lastName: item.lastName, events: item.events, id: item._id }));
    const [filteredResults, setFilteredResults] = useState<FilteredResult[]>([]);

    const sortByLastName = (results: FilteredResult[]): FilteredResult[] => {
        return results.sort((a, b) => a.lastName.localeCompare(b.lastName));
    };

    useEffect(() => {
        if (query.trim() === '') {
            setFilteredResults(sortByLastName(initialResults.splice(0, 10)));
            return;
        } else
            setFilteredResults(sortByLastName(initialResults.filter((athlete) => `${athlete.firstName} ${athlete.lastName}`.toLowerCase().includes(query.toLowerCase())).splice(0, 10)));
    }, [query, response]);

    useEffect(() => {
        if (chosenAthlete[index]) {
            console.log('chosenAthlete', chosenAthlete);
            setQuery(`${chosenAthlete[index].firstName} ${chosenAthlete[index].lastName}`);
        }
    }, [chosenAthlete]);

    return (
        <div
            className={`bg-background h-fit w-full *:text-secondary relative ${
                focused ? 'shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]' : 'shadow-none'
            } transition-all`}
        >
            <input
                placeholder={'Athlete Name'}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`placeholder:text-gray-500 outline-none w-full bg-background text-secondary pl-10 pr-2 py-2.5`}
            />
            <Search className='absolute left-3 top-3 opacity-80 w-5 h-5' />
            <motion.div
                initial='collapsed'
                animate={focused ? 'open' : 'collapsed'}
                variants={{
                    open: { opacity: 1, height: `fit-content`, display: 'block', borderTop: '1px solid #ed3a5f' },
                    collapsed: { opacity: 0, height: '0px', display: 'none', borderTop: '0' },
                }}
                className={`absolute w-full bg-background rounded-b-xl overflow-hidden z-10 ${
                    focused ? 'shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]' : 'shadow-none'
                }`}
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
            >
                <section>
                    {filteredResults.length > 0 ? (
                        <div className='w-full h-fit flex flex-col gap-1'>
                            {filteredResults.map(({ firstName, lastName, id, events }, i) => (
                                <button
                                    onClick={() => {
                                        setChosenAthlete((prev) => {
                                            const prevAthletes = [...prev];
                                            prevAthletes[index] = { firstName, lastName };
                                            console.log(prevAthletes);
                                            return prevAthletes;
                                        });
                                        const newQuery = `${firstName} ${lastName}`;
                                        setQuery(() => newQuery);
                                        onSubmit(firstName, lastName, events, id);
                                    }}
                                    key={firstName + lastName}
                                >
                                    <span
                                        className={`${
                                            i === 0 ? 'pt-2 pb-1' : i === filteredResults.length - 1 ? 'pb-2 pt-1' : 'py-1'
                                        } px-4 flex justify-start w-full rounded-lg hover:bg-background-lightest capitalize hover:bg-background-light transition-all`}
                                    >
                                        {firstName.trim()} {lastName.trim()}
                                    </span>
                                </button>
                            ))}
                            {filteredResults.length === 10 && <span className='text-center text-primary-light font-bold py-2'>Showing 10 of {initialResults.length}</span>}
                        </div>
                    ) : (
                        <div className='py-3 flex flex-col items-center justify-center font-bold gap-1'>
                            <span>No results found.</span>
                            <span>Try searching again?</span>
                        </div>
                    )}
                </section>
            </motion.div>
        </div>
    );
};

export default SearchBar;
