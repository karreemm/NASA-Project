"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Form = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [planetName, setPlanetName] = useState("");
  const [constellationName, setConstellationName] = useState("");
  const [drawing, setDrawing] = useState(null);

  const handleFileChange = (e) => {
    setDrawing(e.target.files[0]); // Capture the actual file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('planet_name', planetName);
    formData.append('constellation_name', constellationName);
    if (drawing) {
      formData.append('drawing', drawing); // Append the file directly
    }

    try {
      const response = await fetch('http://localhost:8000/submit_form/', { // Update this URL
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);

      // Clear the form after successful submission
      setFullName("");
      setEmail("");
      setPlanetName("");
      setConstellationName("");
      setDrawing(null); // Reset file input

      // Optional: Clear the actual file input element if necessary
      document.getElementById("drawing").value = null;

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"
            onClick={onClose}
          ></div>

          <div className="relative z-10 bg-gray-900 text-white p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 md:mx-0">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Share Your Constellation</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 mt-1 bg-gray-800 rounded-lg text-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mt-1 bg-gray-800 rounded-lg text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Planet Name */}
              <div>
                <label htmlFor="planetName" className="block text-sm font-medium">
                  Planet Name
                </label>
                <input
                  type="text"
                  id="planetName"
                  name="planetName"
                  value={planetName}
                  onChange={(e) => setPlanetName(e.target.value)}
                  className="w-full p-3 mt-1 bg-gray-800 rounded-lg text-white"
                  placeholder="Enter planet name"
                />
              </div>

              {/* Constellation Name */}
              <div>
                <label htmlFor="constellationName" className="block text-sm font-medium">
                  Constellation Name
                </label>
                <input
                  type="text"
                  id="constellationName"
                  name="constellationName"
                  value={constellationName}
                  onChange={(e) => setConstellationName(e.target.value)}
                  className="w-full p-3 mt-1 bg-gray-800 rounded-lg text-white"
                  placeholder="Enter constellation name"
                />
              </div>

              {/* Upload Drawing */}
              <div>
                <label htmlFor="drawing" className="block text-sm font-medium">
                  Upload Drawing
                </label>
                <input
                  type="file"
                  id="drawing"
                  name="drawing"
                  onChange={handleFileChange} // Handle file input change
                  className="w-full p-3 mt-1 bg-gray-800 rounded-lg text-white"
                  accept="image/*"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 p-3 rounded-full font-semibold hover:opacity-80 transition"
              >
                Submit
              </button>
            </form>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-9 right-6 text-gray-400 hover:text-white text-lg"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
