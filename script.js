// ================== SCENE SETUP ==================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // nền đen vũ trụ

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

// ================== ÁNH SÁNG ==================
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// ================== SAO (particle) ==================
const starsGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starVertices = [];
for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 200;
  const z = (Math.random() - 0.5) * 200;
  starVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// ================== TRĂNG ==================
const moonTexture = new THREE.TextureLoader().load("assets/trang.png");
const moonMaterial = new THREE.SpriteMaterial({ map: moonTexture, transparent: true });
const moon = new THREE.Sprite(moonMaterial);
moon.scale.set(3, 3, 1);
moon.position.set(-4, 4, -5);
scene.add(moon);

// ================== CÂY + ĐẤT ==================
const textureLoader = new THREE.TextureLoader();
const treeTexture = textureLoader.load("assets/cay2.png");
const treeMaterial = new THREE.SpriteMaterial({ map: treeTexture, transparent: true });
const tree = new THREE.Sprite(treeMaterial);
tree.scale.set(4, 4, 1);
scene.add(tree);

// ================== ĐÈN LỒNG BAY ==================
const lanternImages = ["assets/denlong1.png", "assets/denlong2.png", "assets/denlong3.png"];

function createLantern() {
  const texture = textureLoader.load(lanternImages[Math.floor(Math.random() * lanternImages.length)]);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const lantern = new THREE.Sprite(material);

  const size = Math.random() * 0.8 + 0.5;
  lantern.scale.set(size, size, 1);
  lantern.position.set((Math.random() - 0.5) * 8, -3, (Math.random() - 0.5) * 5);

  scene.add(lantern);

  const speed = Math.random() * 0.01 + 0.005;

  function animateLantern() {
    lantern.position.y += speed;
    lantern.position.x += Math.sin(Date.now() * 0.001) * 0.001;

    if (lantern.position.y > 6) {
      scene.remove(lantern);
    } else {
      requestAnimationFrame(animateLantern);
    }
  }
  animateLantern();
}
setInterval(createLantern, 3000);

// ================== QUÀ POPUP ==================
const giftButton = document.getElementById("gift-button");
const giftPopup = document.getElementById("gift-popup");
const closeButton = document.querySelector(".close-button");

setTimeout(() => {
  giftButton.style.display = "block";
}, 5000);

giftButton.addEventListener("click", () => {
  giftPopup.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  giftPopup.style.display = "none";
});

// ================== PHÁT NHẠC ==================
const music = document.getElementById("background-music");
window.addEventListener("click", () => {
  if (music.paused) music.play();
});

// ================== LOOP ==================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ================== PHÁO HOA ==================
function createFirework() {
  const geometry = new THREE.BufferGeometry();
  const count = 100 + Math.floor(Math.random() * 100); // số hạt
  const positions = [];
  const colors = [];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const r = Math.random() * 1.5; // bán kính nổ

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions.push(x, y, z);

    colors.push(Math.random(), Math.random(), Math.random()); // màu random
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 1
  });

  const firework = new THREE.Points(geometry, material);
  firework.position.set(
    (Math.random() - 0.5) * 6,
    Math.random() * 3 + 1,
    (Math.random() - 0.5) * 6
  );
  scene.add(firework);

  let opacity = 1;
  function animateFirework() {
    opacity -= 0.01;
    material.opacity = opacity;
    if (opacity <= 0) {
      scene.remove(firework);
    } else {
      requestAnimationFrame(animateFirework);
    }
  }
  animateFirework();
}

// Tạo pháo hoa liên tục
setInterval(createFirework, 2000);
