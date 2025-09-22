// ⭐ Nền sao
const stars = document.getElementById('stars');
const ctx = stars.getContext('2d');
stars.width = window.innerWidth;
stars.height = window.innerHeight;

function drawStars() {
  ctx.clearRect(0,0,stars.width,stars.height);
  for(let i=0;i<150;i++) {
    ctx.fillStyle = "white";
    ctx.fillRect(Math.random()*stars.width, Math.random()*stars.height, 2, 2);
  }
}
drawStars();

// 🎆 Pháo hoa
const fireworks = new Fireworks.default(document.getElementById('fireworks'), {
  autoresize: true,
  opacity: 0.5,
  acceleration: 1.05,
  particles: 50,
  trace: 3,
  explosion: 6,
  intensity: 15,
});
fireworks.start();

// 🎐 Thả đèn lồng
const lanterns = document.getElementById('lanterns');
function releaseLantern() {
  const lantern = document.createElement('img');
  lantern.src = `assets/denlong${Math.ceil(Math.random()*3)}.png`;
  lantern.style.left = Math.random()*window.innerWidth + "px";
  lantern.style.bottom = "-100px";
  lantern.style.width = "60px";
  lanterns.appendChild(lantern);

  anime({
    targets: lantern,
    translateY: -window.innerHeight-200,
    duration: 8000 + Math.random()*4000,
    easing: 'linear',
    complete: () => lantern.remove()
  });
}
setInterval(releaseLantern, 1000);

// 🍂 Lá rơi
const leaves = document.getElementById('leaves');
function fallLeaf() {
  const leaf = document.createElement('img');
  leaf.src = 'assets/cay.png';
  leaf.style.width = "20px";
  leaf.style.left = Math.random()*window.innerWidth + "px";
  leaves.appendChild(leaf);

  anime({
    targets: leaf,
    translateY: window.innerHeight + 100,
    duration: 6000 + Math.random()*4000,
    easing: 'linear',
    rotate: 360,
    complete: () => leaf.remove()
  });
}
setInterval(fallLeaf, 2000);

// 📜 Lời chúc
const wishes = document.getElementById('wishes');
function showWish() {
  const wish = document.createElement('img');
  wish.src = `assets/cauchuc${Math.ceil(Math.random()*3)}.jpg`;
  wish.style.left = Math.random()*window.innerWidth + "px";
  wish.style.top = Math.random()*window.innerHeight/2 + "px";
  wish.style.width = "150px";
  wishes.appendChild(wish);

  setTimeout(()=>wish.remove(), 6000);
}
setInterval(showWish, 8000);

// ⏰ Sau 5s hiện nút nhận quà
setTimeout(()=>{
  document.getElementById('giftBtn').classList.add('show');
}, 5000);

// 🎁 Click để sang cảnh lân + quà
document.getElementById('giftBtn').addEventListener('click', ()=>{
  document.body.innerHTML = `
    <div style="text-align:center; padding-top:100px; color:white">
      <h1>🦁 Chúc Trung Thu Vui Vẻ 🏮</h1>
      <img src="assets/quatang.jpg" style="width:300px;">
    </div>
  `;
});
