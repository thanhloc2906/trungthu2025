// ================== SCENE SETUP ==================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ================== LIGHT ==================
scene.add(new THREE.AmbientLight(0xffffff, 1));

// ================== STARS ==================
const starsGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 2000; i++) {
  starVertices.push((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
}
starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })));

// ================== MOON ==================
const moonTexture = new THREE.TextureLoader().load("assets/trang.png");
const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTexture, transparent: true }));
moon.scale.set(3, 3, 1);
moon.position.set(-4, 4, -5);
scene.add(moon);

// ================== TREE ==================
const treeTexture = new THREE.TextureLoader().load("assets/cay2.png");
const tree = new THREE.Sprite(new THREE.SpriteMaterial({ map: treeTexture, transparent: true }));
tree.scale.set(6, 8, 1);
tree.position.set(6, -3, -3);
scene.add(tree);

// ================== LANTERNS ==================
const lanternImages = ["assets/denlong1.png", "assets/denlong2.png", "assets/denlong3.png"];
function createLantern() {
  const texture = new THREE.TextureLoader().load(
    lanternImages[Math.floor(Math.random() * lanternImages.length)]
  );
  const lantern = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));

  const size = Math.random() * 1.2 + 0.8;
  lantern.scale.set(size, size, 1);
  lantern.position.set((Math.random() - 0.5) * 8, -4, 0);
  scene.add(lantern);

  const speed = Math.random() * 0.01 + 0.005;
  function animateLantern() {
    lantern.position.y += speed;
    if (lantern.position.y > 8) {
      scene.remove(lantern);
    } else requestAnimationFrame(animateLantern);
  }
  animateLantern();
}

// ================== BLESSINGS ==================
const blessingImages = ["assets/cauchuc2.jpg", "assets/cauchuc3.jpg", "assets/cauchuc1.jpg"];
function createBlessing() {
  const loader = new THREE.TextureLoader();
  loader.load(blessingImages[Math.floor(Math.random() * blessingImages.length)], (tex) => {
    const aspect = tex.image.width / tex.image.height;
    const height = 3; // nhỏ bằng đèn lồng
    const width = aspect * height;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true });
    const blessing = new THREE.Mesh(geometry, material);

    blessing.position.set((Math.random() - 0.5) * 12, -5, 0);
    scene.add(blessing);

    const speed = Math.random() * 0.01 + 0.005;
    function animateBlessing() {
      blessing.position.y += speed;
      blessing.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
      if (blessing.position.y > 8) {
        scene.remove(blessing);
        geometry.dispose();
        material.dispose();
      } else requestAnimationFrame(animateBlessing);
    }
    animateBlessing();
  });
}

// ================== FIREWORKS ==================
function createFirework() {
  const geometry = new THREE.BufferGeometry();
  const count = 100;
  const positions = [];
  const colors = [];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const r = Math.random() * 2;

    positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    colors.push(Math.random(), Math.random(), Math.random());
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 1 });
  const firework = new THREE.Points(geometry, material);
  firework.position.set((Math.random() - 0.5) * 10, Math.random() * 4 + 2, (Math.random() - 0.5) * 10);
  scene.add(firework);

  let opacity = 1;
  function animateFirework() {
    opacity -= 0.02;
    material.opacity = opacity;
    if (opacity <= 0) scene.remove(firework);
    else requestAnimationFrame(animateFirework);
  }
  animateFirework();
}
setInterval(() => createFirework(), 400);

// ================== GIFT POPUP + MUSIC ==================
const giftButton = document.getElementById("gift-button");
const giftPopup = document.getElementById("gift-popup");
const closeButton = document.querySelector(".close-button");
const music = document.getElementById("background-music");

// Phát nhạc ngay khi load
window.addEventListener("load", () => {
  music.play().catch(err => console.log("⚠️ Autoplay bị chặn:", err));
});

// Hiện nút quà
setTimeout(() => {
  giftButton.style.display = "block";
}, 9000);

giftButton.addEventListener("click", () => (giftPopup.style.display = "flex"));
closeButton.addEventListener("click", () => (giftPopup.style.display = "none"));

// ================== LOOP ==================
setInterval(createLantern, 2000);
setInterval(createBlessing, 4000);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
