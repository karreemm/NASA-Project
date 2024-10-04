"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faX, faPencil, faFloppyDisk, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import StarData from "./StarData"
import Form from "../Form/Form";

const StarField = ({ starPositions }) => {

  const [selectedStar, setSelectedStar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const [isFormOpen, setIsFormOpen] = useState(false);

  let drawing = false;
  let currentLine;
  const lines = useRef([]);

  const startDrawing = () => {
    setDrawingMode(true);
  }

  const stopDrawing = () => {
    setDrawingMode(false);
  }

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const captureScreenshot = () => {
    if (rendererRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const dataURL = rendererRef.current.domElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "drawing.png";
      link.click();
    }
  };

  const closePopup = () => {
    setShowModal(false);
  }

  const removeLastLine = () => {
    console.log("length of lines:", lines.current.length);
    if (lines.current.length > 0) {
      const lastLine = lines.current.pop(); 
      sceneRef.current.remove(lastLine);
      console.log('Removed last line:', lastLine);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    } else {
      console.log('No lines to remove');
    }
  };

  //Kemo Three
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,30,0);
    camera.lookAt(0,0,-40);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.5;
    controls.target.set(0,30,10);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });

    const starVertices = [];
    const starsInfo = [];
    
    const sphereRadius = 150;
    const starCount = starPositions?.length || 1000;
    
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2; // Random azimuthal angle
      const phi = Math.random() * Math.PI / 2; // Random polar angle in the upper hemisphere
      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);
    
      starVertices.push(x, y, z);
      starsInfo.push({ id: i, name: `Star ${i + 1}`, description: `Info about star ${i + 1}` });
    }
    
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);


    //Exoplanet Setup
    const exoPlanetSurfaceGeo = new THREE.PlaneGeometry(3000,3000,300,300);

    const exoPlanetTexturePath = '../assets/earth-color-map.jpg';
    const exoPlanetSurfaceTexture = new THREE.TextureLoader().load(exoPlanetTexturePath);
    
    const exoPlanetBumpMapPath = '../assets/earth-bump-map.jpg';
    const exoPlanetBumpMap = new THREE.TextureLoader().load(exoPlanetBumpMapPath);
    
    const exoPlanetDispMapPath = "../assets/earth-disp-map.jpg";
    const exoPlanetDispMap = new THREE.TextureLoader().load(exoPlanetDispMapPath);
    
    const exoPlanetMaterial = new THREE.MeshStandardMaterial({side:THREE.DoubleSide, 
    map:exoPlanetSurfaceTexture});
    exoPlanetMaterial.bumpMap = exoPlanetBumpMap;
    exoPlanetMaterial.bumpScale = 400;
    exoPlanetMaterial.displacementMap = exoPlanetDispMap;
    exoPlanetMaterial.displacementScale = 100;
    
    const exoPlanet = new THREE.Mesh(exoPlanetSurfaceGeo,exoPlanetMaterial);
    exoPlanet.position.set(0,0,0);
    exoPlanet.rotation.x = -Math.PI / 2;
    scene.add(exoPlanet);


    controls.update();

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
        if (drawingMode === true) {
          setShowModal(false);
        }
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
        lines.current.push(currentLine);
        console.log(lines);
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
          <StarData star={selectedStar} onClose={closePopup} />
        </div>
      )}

      <Form isOpen={isFormOpen} onClose={closeForm} />

      <div className="fixed top-10 left-10 flex space-x-5 w-full">
        <button
          onClick={startDrawing}
          className="bg-[#507687] w-10 h-10 text-xl rounded-full text-white hover:opacity-80 focus:outline-none flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPencil} />
        </button>
        {drawingMode && (
          <>
            <div className="flex justify-between w-[90%] mx-auto">
              <div className="flex gap-5">
                <button
                  onClick={removeLastLine}
                  className="bg-[#B8001F] w-10 h-10 text-xl rounded-full text-white hover:opacity-80 focus:outline-none flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                </button>
                <button
                  onClick={captureScreenshot}
                  className="bg-[#795757] w-10 h-10 text-xl rounded-full text-white hover:opacity-80 focus:outline-none flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <button
                  onClick={openForm}
                  className="bg-[#FD8B51] w-10 h-10 text-xl rounded-full text-white hover:opacity-80 focus:outline-none flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
              
              <button 
              className="text-black focus:outline-none text-xl w-10 h-10 rounded-md bg-gray-400 flex justify-center items-center hover:bg-gray-500"
              onClick={stopDrawing}            
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StarField;
