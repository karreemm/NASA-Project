/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useRef } from 'react';
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Search from '../component/Search';
import Planet from '../component/Planet';

function CameraController() {
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
    />
  );
}

const dummyData = [
  {
    "pl_name": "55 Cnc e",
    "hostname": "55 Cnc",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "AU Mic b",
    "hostname": "AU Mic",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "AU Mic b",
    "hostname": "AU Mic",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "AU Mic c",
    "hostname": "AU Mic",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "BD+20 594 b",
    "hostname": "BD+20 594",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "AU Mic c",
    "hostname": "AU Mic",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "BD+20 594 b",
    "hostname": "BD+20 594",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "BD+20 594 b",
    "hostname": "BD+20 594",
    "image": "https://via.placeholder.com/150",
  },
  {
    "pl_name": "BD-14 3065 b",
    "hostname": "BD-14 3065 A",
    "image": "https://via.placeholder.com/150",
  }
];

const Planets = () => {
  const [query, setQuery] = useState("");
  const cameraRef = useRef();

  const filteredResults = dummyData
    .filter((planet) => planet.pl_name.toLowerCase().startsWith(query.toLowerCase()))
    .sort((a, b) => a.pl_name.localeCompare(b.pl_name));

  if (cameraRef.current) {
    cameraRef.current.position.lerp(new THREE.Vector3(0, 0, 5), 0.1); // Update position smoothly
    cameraRef.current.lookAt(0, 0, 0); // Ensure the camera looks at the origin
  }

  return (

    <div className='w-full h-[2100px] bg-black'>

      <Canvas
        camera={{ position: [0, 0, 5] }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars
          radius={100}
          depth={60}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <CameraController />
      </Canvas>

      {/* Main content with flex layout */}
      <div className=' absolute top-0 mx-10  flex flex-col justify-center px-10 pt-10'>

        <div className='flex justify-between w-full  my-5'>

          {/* Planets Container */}
          <div className='w-[70%] text-white m-5 rounded-md flex flex-col'>
            <h1 className='text-3xl  sm:text-5xl font-bold p-5 mt-5'>
              Explore Planets
            </h1>
            <div className='w-[200px] border-b-4 border-gray-500 mb-10 ml-5'></div>
            <div className='text-xl sm:text-xl font-bold mb-5 p-5'>
              Exploring exoplanets—worlds orbiting stars beyond our solar system—represents an exciting frontier in astronomy.
              With advanced detection techniques like the transit method and radial velocity, scientists can uncover diverse planetary
              characteristics, from gas giants to rocky worlds in the habitable zone. Studying these exoplanets helps us understand their atmospheres,
              compositions,
              and potential for life, ultimately enriching our knowledge of the universe and our place within it.
            </div>

            {/* Displaying recommended planets as cards in a grid */}
            <div className='grid grid-cols-3 gap-10 py-10 px-5'>
              {filteredResults.map((planet) => (
                <Planet key={planet.pl_name} planet={planet} />
              ))}
            </div>
          </div>

          {/* Search Container */}
          <div className='w-[25%] text-white m-5 mt-20 p-5 rounded-lg flex flex-col h-[500px] border border-2 '>
            <Search dummyData={dummyData} setQuery={setQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planets;
