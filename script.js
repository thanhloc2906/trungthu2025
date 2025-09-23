// ======= Nhạc =======
const bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.6;
document.body.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

// ======= Three.js scene =======
const sceneContainer = document.getElementById("scene-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
sceneContainer.appendChild(renderer.domElement);

// OrbitControls để xoay/phóng to/thu nhỏ
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;

// Load ảnh cây + đất
const textureLoader = new THREE.TextureLoader();
const treeTexture = textureLoader.load("assets/cay2.png");
const treeMaterial = new THREE.SpriteMaterial({ map: treeTexture, transparent: true });
const tree = new THREE.Sprite(treeMaterial);
tree.scale.set(3, 3, 1);
scene.add(tree);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ======= Hiện nút quà sau 5s =======
const giftBtn = document.getElementById("gift-btn");
const giftPopup = document.getElementById("gift-popup");

setTimeout(() => {
  giftBtn.style.display = "block";
}, 5500);

giftBtn.addEventListener("click", () => {
  giftPopup.classList.add("show");
});

// ======= Pháo hoa canvas =======
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor(x, y, radius, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.alpha = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.02;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function createFirework() {
  const x = random(0, canvas.width);
  const y = random(0, canvas.height / 2);
  const colors = ["#ff0", "#f0f", "#0ff", "#f00", "#0f0", "#fff"];
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = random(1, 4);
    fireworks.push(new Firework(
      x,
      y,
      2,
      colors[Math.floor(Math.random() * colors.length)],
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    ));
  }
}

function fireworksLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();
    if (fw.alpha <= 0) fireworks.splice(i, 1);
  });
  requestAnimationFrame(fireworksLoop);
}

setInterval(createFirework, 1500);
fireworksLoop();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
  camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
  camera.updateProjectionMatrix();
});
