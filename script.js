// Khởi tạo các đối tượng chính của Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Khởi tạo các biến global
let controls;
const loader = new THREE.TextureLoader();
const objects = {};
const leaves = [];
const fireworks = [];

// Thiết lập điều khiển 3D
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Cho hiệu ứng quay mượt hơn
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;
camera.position.set(0, 5, 20);
controls.update();

// Ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Load và thêm các đối tượng vào scene
function loadAssets() {
    const assetMap = {
        cay2: 'assets/images/cay2.png',
        trang: 'assets/images/trang.png',
        denlong: 'assets/images/denlong.png',
        denongsao: 'assets/images/denongsao.png'
    };

    const promises = Object.keys(assetMap).map(key => {
        return new Promise(resolve => {
            loader.load(assetMap[key], texture => {
                const material = new THREE.SpriteMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(10, 10, 1);
                objects[key] = sprite;
                resolve();
            });
        });
    });

    Promise.all(promises).then(() => {
        // Đặt đất và cây vào giữa
        objects.cay2.position.set(0, 0, 0);
        scene.add(objects.cay2);

        // Đặt trăng
        objects.trang.scale.set(8, 8, 1);
        objects.trang.position.set(-15, 15, -20);
        scene.add(objects.trang);

        // Tạo nhiều đèn lồng
        for (let i = 0; i < 5; i++) {
            const lantern = objects.denlong.clone();
            lantern.scale.set(3, 3, 1);
            lantern.position.set(Math.random() * 20 - 10, Math.random() * 5, Math.random() * 20 - 10);
            lantern.initialY = lantern.position.y;
            scene.add(lantern);
        }
    });
}

// Tạo hiệu ứng lá vàng rơi
function createLeaf() {
    loader.load('assets/images/denongsao.png', texture => { // Dùng tạm ảnh denongsao cho lá
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
        const leaf = new THREE.Sprite(material);
        leaf.scale.set(0.5, 0.5, 1);
        leaf.position.set(Math.random() * 5 - 2.5, 5, Math.random() * 5 - 2.5);
        leaf.velocity = new THREE.Vector3(Math.random() * 0.05 - 0.025, -0.05, Math.random() * 0.05 - 0.025);
        leaves.push(leaf);
        scene.add(leaf);
    });
}

// Tạo hiệu ứng pháo hoa
function createFireworks() {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const position = new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 10 + 15, Math.random() * 20 - 10);
    for (let i = 0; i < 50; i++) {
        const firework = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            new THREE.MeshBasicMaterial({ color: color })
        );
        firework.position.copy(position);
        firework.velocity = new THREE.Vector3(
            Math.random() * 0.5 - 0.25,
            Math.random() * 0.5 - 0.25,
            Math.random() * 0.5 - 0.25
        );
        firework.alpha = 1;
        fireworks.push(firework);
        scene.add(firework);
    }
}

// Vòng lặp chính để render scene
function animate() {
    requestAnimationFrame(animate);

    // Cập nhật điều khiển 3D
    controls.update();

    // Cập nhật vị trí đèn lồng bay lên
    scene.children.forEach(child => {
        if (child.material && child.material.map && child.material.map.image.src.includes('denlong')) {
            child.position.y += 0.01;
            // Reset đèn lồng khi bay quá cao
            if (child.position.y > 20) {
                child.position.y = child.initialY;
            }
        }
    });

    // Cập nhật hiệu ứng lá rơi
    leaves.forEach(leaf => {
        leaf.position.add(leaf.velocity);
        if (leaf.position.y < -5) {
            leaf.position.y = 5;
            leaf.position.x = Math.random() * 5 - 2.5;
            leaf.position.z = Math.random() * 5 - 2.5;
        }
    });

    // Cập nhật hiệu ứng pháo hoa
    fireworks.forEach((fw, index) => {
        if (fw.alpha > 0) {
            fw.position.add(fw.velocity);
            fw.velocity.multiplyScalar(0.98);
            fw.alpha -= 0.01;
            fw.material.opacity = fw.alpha;
        } else {
            scene.remove(fw);
            fireworks.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

// Xử lý thay đổi kích thước màn hình
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Phát nhạc tự động
window.addEventListener('load', () => {
    const music = document.getElementById('background-music');
    music.play().catch(error => {
        console.log("Tự động phát nhạc bị chặn:", error);
        // Yêu cầu người dùng tương tác để phát nhạc
        document.body.addEventListener('click', () => music.play(), { once: true });
    });
});

// Hiển thị nút nhận quà sau 5 giây
setTimeout(() => {
    const giftButton = document.getElementById('gift-button');
    giftButton.style.display = 'block';
}, 5000);

// Xử lý sự kiện khi click nút nhận quà
document.getElementById('gift-button').addEventListener('click', () => {
    document.getElementById('gift-popup').style.display = 'flex';
});

// Xử lý sự kiện khi đóng popup
document.querySelector('.close-button').addEventListener('click', () => {
    document.getElementById('gift-popup').style.display = 'none';
});

// Chạy các hàm
loadAssets();
setInterval(createLeaf, 1000); // Tạo lá rơi mỗi 1 giây
setInterval(createFireworks, 2500); // Tạo pháo hoa mỗi 2.5 giây
animate();