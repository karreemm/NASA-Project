const starCount = starsData.length; // Assuming starsData is an array of star objects with RA, Dec, etc.
const sphereRadius = 100; // Adjust as needed for scaling

const starVertices = [];
const starsInfo = [];

for (let i = 0; i < starCount; i++) {
  const star = starsData[i];
  const ra = THREE.Math.degToRad(star.ra); // Convert RA to radians
  const dec = THREE.Math.degToRad(star.dec); // Convert Dec to radians

  // Use parallax to determine distance (optional, for more realism)
  const distance = sphereRadius / Math.tan(THREE.Math.degToRad(star.parallax / 1000)); // Convert parallax to distance

  // Convert to Cartesian coordinates
  const x = distance * Math.cos(dec) * Math.cos(ra);
  const y = distance * Math.cos(dec) * Math.sin(ra);
  const z = distance * Math.sin(dec);

  starVertices.push(x, y, z);
  starsInfo.push({ id: i, name: `Star ${i + 1}`, description: `Info about star ${i + 1}` });
}

// Create the star field
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);