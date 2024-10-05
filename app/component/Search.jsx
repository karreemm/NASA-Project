import React, { useState } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
const Search = ({ dummyData }) => {
    const [query, setQuery] = useState(""); 
    const router = useRouter();
    
    const filteredResults = dummyData
        .filter((planet) => planet.pl_name.toLowerCase().startsWith(query.toLowerCase())) 
        .sort((a, b) => a.pl_name.localeCompare(b.pl_name)); 
    const routetoPlanet = (planet) => {
    //     router.push({
    //     pathname: '/planets', 
    //     query: {
    //         pl_name: planet.pl_name,
    //         hostname: planet.hostname,
    //         tran_flag: planet.tran_flag,
    //         pl_massj: planet.pl_massj,
    //         pl_orbper: planet.pl_orbper,
    //         ra: planet.ra,
    //         dec: planet.dec,
    //     },
    // });
    router.push(`/skyview?name=${planet.pl_name}&hostname=${planet.hostname}&tran_flag=${planet.tran_flag}&pl_massj=${planet.pl_massj}&pl_orbper=${planet.pl_orbper}&ra=${planet.ra}&dec=${planet.dec}`);
    }
    return (
        <div className='p-2 '>
            <h1 className='text-3xl sm:text-2xl font-bold py-5'>Search on planets</h1>
            <input
                type="text"
                placeholder="Search planet name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
                className='mt-2 p-3 w-full border-2 border-gray-300 rounded-md text-slate-800'
            />

                        
            
            <p className='mt-5 text-gray-300'>
                Search on exoplanety encyclopedia — continuously updated, with more than 5500 entries — interactive 3D models and detailed data on all confirmed exoplanets. Choose a planet name to see a visualization of each world and system.
            </p>
            

            
            {query && (
                <ul className='mt-2  border border-gray-300 rounded-md overflow-y-auto h-[200px]'>
                    {filteredResults.length > 0 ? (
                        filteredResults.map((planet) => (
                            <li key={planet.pl_name}>
                                <button onClick={() => routetoPlanet(planet)}>
                                    <div className='p-4 hover:bg-slate-100 hover:text-slate-800 cursor-pointer block'>
                                        {planet.pl_name} - {planet.hostname}
                                    </div>
                                </button>
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
