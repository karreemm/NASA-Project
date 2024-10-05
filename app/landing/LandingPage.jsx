"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBookBookmark, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import PlanetImg from "../assets/planet.jpg"
import StarImg from "../assets/star.jpg"

function CameraController() {
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
    />
  );
}

export default function LandingPage() {

  const cameraRef = useRef();
  const [section, setSection] = useState("home");
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5));
  const animationRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [translateY, setTranslateY] = useState(-100);

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const moveCameraToPosition = (x, y, z, targetSection) => {
    const direction = x > targetPosition.current.x ? "right" : "left";
    targetPosition.current.set(x, y, z);

    setOpacity(0);

    setTimeout(() => {
      setSection(targetSection);
      setTranslateY(-100); // Move the content up off the screen

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const startTime = performance.now();
      const duration = 1000; // Animation duration in milliseconds

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1); // Normalized time
        const easedT = easeInOutCubic(t);

        // Update camera position based on direction
        if (cameraRef.current) {
          cameraRef.current.position.lerp(targetPosition.current, easedT);
          cameraRef.current.lookAt(0, 0, 0); // Ensure the camera looks at the origin
        }

        // Update opacity based on easing function
        setOpacity(easedT); // Fade in new content
        setTranslateY(-100 * (1 - easedT)); // Translate vertically

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animationRef.current = null; // Reset animation ref
          setTranslateY(0); // Reset translate for the next section
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, 500); // Match the timeout to the fade out duration
  };

  const moveCameraRight = () => {
    moveCameraToPosition(5, 0, 5, "statistics");
  };

  const moveCameraLeft = () => {
    moveCameraToPosition(-5, 0, 5, "references");
  };

  const moveCameraHome = () => {
    moveCameraToPosition(0, 0, 5, "home");
  };

  // Trigger home animation on component mount
  useEffect(() => {
    moveCameraHome();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
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

      {/* Buttons for camera movement */}
      <div className="w-full flex justify-center">
        <div className="z-30 absolute top-5 flex justify-between w-[90%]">
          <button
            onClick={moveCameraLeft}
            className="text-white border font-bold border-white flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg transition hover:opacity-80"
          >
            <FontAwesomeIcon icon={faBookBookmark} className="text-white" />
            <p className="hidden md:flex">References</p>
          </button>
          <button
            onClick={moveCameraHome}
            className="flex items-center border border-white font-bold justify-center gap-2 px-6 py-3 text-white rounded-full shadow-lg transition hover:opacity-80"
          >
            <FontAwesomeIcon icon={faHouse} className="" />
            <p className="hidden md:flex">Home</p>
          </button>
          <button
            onClick={moveCameraRight}
            className="flex items-center border border-white font-bold justify-center gap-2 px-6 py-3 text-white rounded-full shadow-lg transition hover:opacity-80"
          >
            <FontAwesomeIcon icon={faChartLine} className="" />
            <p className="hidden md:flex">Statistics</p>

          </button>
        </div>
      </div>

      {/* Section content with fade and translate effect */}
      {section === "home" && (
        <div
          className="w-[90%] md:w-[65%] mx-auto absolute inset-0 flex flex-col items-center justify-center gap-8 transition-all duration-500"
          style={{ opacity, transform: `translateY(${translateY}px)` }}
        >
          <p className="text-2xl md:text-4xl font-bold bg-gradient-nasa bg-clip-text text-transparent">
            Explore the Exosky: Your Space Adventure Starts Here!
          </p>
          <p className="md:text-xl text-white">
            Pick a planet and embark on an exciting journey to explore the stars!
            Use your creativity to draw and connect the stars, crafting your very
            own constellations. Once you're done, save your artwork and share it with
            us to contribute to our community!
          </p>
          <Link href="/planets">
            <span className="inline-block border border-white text-xl px-6 py-3 font-bold bg-gradient-nasa bg-clip-text text-transparent rounded-full shadow-lg transition-all duration-300 hover:opacity-90">
              Start Exploring
            </span>
          </Link>
        </div>
      )}

      {section === "statistics" && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-500"
          style={{ opacity, transform: `translateY(${translateY}px)` }}
        >
          <div className="text-center flex flex-col gap-10 w-full">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-nasa bg-clip-text text-transparent">Statistics</h2>
            <div className="mx-auto flex flex-col md:flex md:flex-row md:justify-center gap-10 text-gray-200">

              <div className="relative bg-gradient-to-b from-blue-900 to-black rounded-3xl px-10 md:py-48 py-10 shadow-lg transition-transform transform hover:scale-105">
                <img
                  src={PlanetImg.src}
                  alt="Planet"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-3xl pointer-events-none"
                />
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold">Number of Planets</h3>
                  <p className="text-2xl font-bold">5500+</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-b from-purple-900 to-black rounded-3xl px-10 md:py-48 py-10 shadow-lg transition-transform transform hover:scale-105">
                <img
                  src={StarImg.src}
                  alt="Stars"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-3xl pointer-events-none"
                />
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold">Stars per Planet</h3>
                  <p className="text-2xl font-bold">1000+</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {section === "references" && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-500"
          style={{ opacity, transform: `translateY(${translateY}px)` }}
        >
          <div className="text-center flex flex-col gap-5 w-[90%] md:w-[65%]">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-nasa bg-clip-text text-transparent">References</h2>
            <p className="text-white md:text-xl">
              We use NASA APIs to explore the universe! With their powerful tools, we gather information about different planets and the stars around them, including their positions. Discover the wonders of space with us!
              &nbsp;
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400"
              >
                Learn more about NASA APIs.
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}