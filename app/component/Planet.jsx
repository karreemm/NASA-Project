/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import Link from 'next/link';
import EARTH from '../assets/earth.jpeg';

const Planet = ({ planet }) => {

    return (
        <div className="relative bg-gradient-to-b from-blue-900 h-[500px] to-black rounded-3xl px-10 md:py-32 py-10 shadow-lg transition-transform transform hover:scale-105">
            <Link href="/" passHref>
                <img
                    src={EARTH.src}
                    alt={planet.pl_name}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-3xl pointer-events-none"
                />
            </Link>
            
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
