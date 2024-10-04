import React, { useState } from 'react';
import Link from 'next/link'; 

const Search = ({ dummyData }) => {
    const [query, setQuery] = useState(""); 

    
    const filteredResults = dummyData
        .filter((planet) => planet.pl_name.toLowerCase().startsWith(query.toLowerCase())) 
        .sort((a, b) => a.pl_name.localeCompare(b.pl_name)); 

    return (
        <div className='p-2'>
            <h1 className='text-3xl sm:text-2xl font-bold py-5 '>Search on planets</h1>
            <input
                type="text"
                placeholder="Search planet name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
                className='mt-2 p-2 w-full border-2 border-gray-300 rounded-md'
            />

            
            {!query && (
                <p className='mt-2 text-gray-500'>
                    Search on exoplanety encyclopedia — continuously updated, with more than 5500 entries — interactive 3D models and detailed data on all confirmed exoplanets. Choose a planet name to see a visualization of each world and system.
                </p>
            )}

            
            {query && (
                <ul className='mt-2 bg-white border border-gray-300 rounded-md overflow-y-auto max-h-[335px]'>
                    {filteredResults.length > 0 ? (
                        filteredResults.map((planet) => (
                            <li key={planet.pl_name}>
                                <Link href={`/`}>
                                    <div className='p-2 hover:bg-slate-100 cursor-pointer block'>
                                        {planet.pl_name} - {planet.hostname}
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className='p-2'>No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Search;
