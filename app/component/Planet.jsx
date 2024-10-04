"use client";
import React from 'react';
import Link from 'next/link';
import { FaLink } from 'react-icons/fa';



const Planet = ({ planet }) => {
    return (
        <div className='bg-white rounded-md shadow-md p-4 m-2 relative'>
            <Link href="/" passHref>
                <img
                    src={planet.image}
                    alt={planet.pl_name}
                    className='w-full h-64 object-cover rounded-md'
                />
            </Link>
            <h2 className='text-xl font-semibold mt-2'>{planet.pl_name}</h2>
            <p className='text-gray-600'>{planet.hostname}</p>
            <p className='text-gray-500 text-sm'>Some interesting facts about {planet.pl_name}.</p>


        </div>
    );
};

export default Planet;
