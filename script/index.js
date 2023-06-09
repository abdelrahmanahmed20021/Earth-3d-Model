var container;
var scene, camera, renderer;
var earth, moon;
var moonOrbitRadius = 1000;
var moonOrbitSpeed = 0.02;
var moonAngle = 0;
var scrollSpeed = 50; // adjust this value to control scroll speed

init();
animate();

function init() {
  container = document.getElementById("container");
  container.addEventListener("wheel", onScroll); // add scroll event listener

  scene = new THREE.Scene();

  // create starfield background
  var starGeometry = new THREE.BufferGeometry();
  var starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  var starVertices = [];
  for (var i = 0; i < 10000; i++) {
    var x = (Math.random() - 0.5) * 6000;
    var y = (Math.random() - 0.5) * 6000;
    var z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  var starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);

  function onScroll(event) {
    var delta = event.deltaY;
    camera.position.z += delta * scrollSpeed;

    // update earth rotation based on scroll delta
    earth.rotation.y += delta * 0.001;
  }

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 2000);
  var sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(1000, 1000, 1000);
  scene.add(sun);

  var textureLoader = new THREE.TextureLoader();
  var earthTexture = textureLoader.load(
    "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"
  );
  var earthGeometry = new THREE.SphereGeometry(500, 32, 32);
  var earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    specular: new THREE.Color("grey"),
    shininess: 5,
    side: THREE.DoubleSide,
  });

  earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  var moonGeometry = new THREE.SphereGeometry(60, 42, 42);
  var moonMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: new THREE.Color("grey"),
  });
  moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(moonOrbitRadius, 0, 0);
  scene.add(moon);

  var moonLight = new THREE.PointLight(0xffffff, 0.5, 1000);
  moon.add(moonLight);

  var moonLightAnimation = new TWEEN.Tween(moonLight)
    .to({ intensity: 0 }, 2000)
    .repeat(Infinity)
    .yoyo(true)
    .start();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.01;

  // Update moon position and rotation
  moonAngle += moonOrbitSpeed;
  var x = moonOrbitRadius * Math.cos(moonAngle);
  var z = moonOrbitRadius * Math.sin(moonAngle);
  moon.position.set(x, 0, z);
  moon.rotation.y += 0.05;

  renderer.render(scene, camera);
}
