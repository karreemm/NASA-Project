/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import Link from 'next/link';
import EARTH from '../assets/earth.jpeg';
import { useRouter } from 'next/navigation';

const Planet = ({ planet }) => {
    const router = useRouter();
    const routetoPlanet = (planet) => {
        router.push(`/skyview?name=${planet.pl_name}&hostname=${planet.hostname}&tran_flag=${planet.tran_flag}&pl_massj=${planet.pl_massj}&pl_orbper=${planet.pl_orbper}&ra=${planet.ra}&dec=${planet.dec}`);
    }
    return (
        <div className="relative bg-gradient-to-b from-blue-900 h-[500px] to-black rounded-3xl px-10 md:py-32 py-10 shadow-lg transition-transform transform hover:scale-105">
            <button onClick={() => routetoPlanet(planet)}>
                <img
                    src={EARTH.src}
                    alt={planet.pl_name}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-3xl pointer-events-none"
                />
            </button>
            
            {/* Planet details positioned at bottom-left */}
            <div className=' absolute z-10 bottom-10 left-10'>
                <h2 className='text-xl font-semibold mt-2 text-white'>{planet.pl_name}</h2>
                <p className='text-gray-300'>{planet.hostname}</p>
                <p className='text-gray-400 text-sm'>Some interesting facts about {planet.pl_name}.</p>
            </div>
        </div>
    );
};

export default Planet;
