"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const StarField = ({ starPositions }) => {
  const [selectedStar, setSelectedStar] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [drawingMode, setDrawingMode] = useState(false);
  let drawing = false;
  let currentLine;
  const lines = [];

  const toggleDrawingMode = () => {
    setDrawingMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });

    const starVertices = [];
    const starsInfo = [];

    if (starPositions && starPositions.length > 0) {
      starPositions.forEach((pos, index) => {
        starVertices.push(pos.x, pos.y, pos.z);
        starsInfo.push({ id: index, name: `Star ${index + 1}`, description: `Info about star ${index + 1}` });
      });
    } else {
      const starCount = 1000;
      for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 500;
        starVertices.push(x, y, z);
        starsInfo.push({ id: i, name: `Star ${i + 1}`, description: `Info about star ${i + 1}` });
      }
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 50;

    const skyColor = new THREE.Color(0x000022);
    scene.fog = new THREE.FogExp2(skyColor, 0.001);
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(stars);

      if (intersects.length > 0) {
        const starIndex = intersects[0].index; 
        setSelectedStar(starsInfo[starIndex]); 
        setShowModal(true); 
      }
    };

    window.addEventListener("click", onMouseClick);

    if (drawingMode) {
      camera.position.set(0, 0, 200); 
      controls.enableRotate = false; 
    } else {
      camera.position.set(0, 0, 50);
      controls.enableRotate = true; 
    }
    controls.update();

    renderer.domElement.addEventListener("mousedown", (event) => {
      if (!drawingMode) return;
      drawing = true;
      const intersects = getIntersects(event);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        currentLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([point, point]),
          new THREE.LineBasicMaterial({ color: 0xff0000 })
        );
        scene.add(currentLine);
        lines.push(currentLine);
      }
    });

    renderer.domElement.addEventListener("mousemove", (event) => {
      if (!drawing || !currentLine) return;
      const intersects = getIntersects(event);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const positions = currentLine.geometry.attributes.position.array;
        positions[3] = point.x;
        positions[4] = point.y;
        positions[5] = point.z;
        currentLine.geometry.attributes.position.needsUpdate = true;
      }
    });

    renderer.domElement.addEventListener("mouseup", () => {
      drawing = false;
      currentLine = null;
    });

    function getIntersects(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObjects(scene.children);
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate(); 

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", onMouseClick);
      if (renderer.domElement && renderer.domElement.parentNode === document.body) {
        document.body.removeChild(renderer.domElement);
      }
    };

  }, [starPositions, drawingMode]);

  return (
    <>
      {showModal && selectedStar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{selectedStar.name}</h2>
            <p className="text-gray-600">{selectedStar.description}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fixed top-10 left-10 flex space-x-4">
        <button
          onClick={toggleDrawingMode}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          {drawingMode ? "Disable Drawing" : "Enable Drawing"}
        </button>
      </div>
    </>
  );
};

export default StarField;
