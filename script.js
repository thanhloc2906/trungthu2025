// ================== SCENE SETUP ==================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // nền đen vũ trụ

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 12;

// ================== ÁNH SÁNG ==================
scene.add(new THREE.AmbientLight(0xffffff, 1));

// ================== SAO ==================
const starsGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 2000; i++) {
  starVertices.push((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
}
starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
scene.add(new THREE.Points(starsGeometry, starsMaterial));

// ================== TRĂNG ==================
const moonTexture = new THREE.TextureLoader().load("assets/trang.png");
const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTexture, transparent: true }));
moon.scale.set(3, 3, 1);
moon.position.set(-4, 4, -5);
scene.add(moon);

// ================== CÂY + ĐẤT ==================
const treeTexture = new THREE.TextureLoader().load("assets/cay2.png");
const tree = new THREE.Sprite(new THREE.SpriteMaterial({ map: treeTexture, transparent: true }));
tree.scale.set(4, 4, 1);
tree.position.set(0, -1.5, 0);
scene.add(tree);

// ================== ĐÈN LỒNG BAY ==================
const lanternImages = [
  "assets/denlong1.png",
  "assets/denlong2.png",
  "assets/denlong3.png",
  "assets/cauchuc2.jpg",
  "assets/cauchuc3.jpg"
];

function createLantern() {
  const texture = new THREE.TextureLoader().load(
    lanternImages[Math.floor(Math.random() * lanternImages.length)]
  );
  const lantern = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true })
  );

  // tăng size để dễ nhìn rõ câu chúc
  const size = Math.random() * 2 + 1;
  lantern.scale.set(size, size * 2.5, 1); // câu chúc dài nên scale cao hơn
  lantern.position.set((Math.random() - 0.5) * 6, -3, 0);

  scene.add(lantern);

  const speed = Math.random() * 0.01 + 0.005;

  function animateLantern() {
    lantern.position.y += speed;
    if (lantern.position.y > 7) {
      scene.remove(lantern);
    } else {
      requestAnimationFrame(animateLantern);
    }
  }
  animateLantern();
}

setInterval(createLantern, 1500);

// ================== QUÀ POPUP & NHẠC ==================
const giftButton = document.getElementById("gift-button");
const giftPopup = document.getElementById("gift-popup");
const closeButton = document.querySelector(".close-button");
const music = document.getElementById("background-music");

// 🎶 Phát nhạc ngay khi load web
window.addEventListener("load", () => {
  music.muted = true;
  music.play().then(() => {
    setTimeout(() => (music.muted = false), 500); // bỏ mute sau 0.5s
  }).catch(err => console.log("⚠️ Autoplay bị chặn:", err));
});

setTimeout(() => {
  giftButton.style.display = "block";
}, 9000);

giftButton.addEventListener("click", () => {
  giftPopup.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  giftPopup.style.display = "none";
});

// ================== PHÁO HOA ==================
function createFirework() {
  const geometry = new THREE.BufferGeometry();
  const count = 300; // số hạt nhiều hơn
  const positions = [];
  const colors = [];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const r = Math.random() * 4; // bán kính nổ to hơn

    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    // màu sáng chói hơn
    colors.push(Math.random() * 1, Math.random() * 1, Math.random() * 1);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 1
  });

  const firework = new THREE.Points(geometry, material);
  firework.position.set((Math.random() - 0.5) * 10, Math.random() * 5 + 2, (Math.random() - 0.5) * 10);
  scene.add(firework);

  let opacity = 1;
  function animateFirework() {
    opacity -= 0.015; // mờ nhanh hơn
    material.opacity = opacity;
    if (opacity <= 0) scene.remove(firework);
    else requestAnimationFrame(animateFirework);
  }
  animateFirework();
}

// bắn nhiều pháo hoa liên tục
setInterval(() => {
  createFirework();
  createFirework();
}, 800); // nhanh hơn, nhiều hơn

// ================== LOOP ==================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
