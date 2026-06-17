/* phaser-scenes.js — Phaser only for stars + planet. Characters are HTML/CSS. */

// ---- STARFIELD ----
class StarfieldScene extends Phaser.Scene {
  constructor() { super({ key: 'StarfieldScene' }); }
  create() {
    const W = this.scale.width, H = this.scale.height;
    this.stars = [];
    for (let i = 0; i < 200; i++) {
      const size = Phaser.Math.FloatBetween(0.5, 2.5);
      const g = this.add.graphics();
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.2, 0.9));
      g.fillCircle(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H), size);
      this.stars.push({ g, phase: Math.random() * Math.PI * 2 });
    }
    this.time.addEvent({ delay: Phaser.Math.Between(3000, 8000), callback: this.shootingStar, callbackScope: this, loop: true });
  }
  update(time) {
    this.stars.forEach(s => s.g.setAlpha(0.3 + 0.7 * Math.abs(Math.sin(time / 1500 + s.phase))));
  }
  shootingStar() {
    const x = Phaser.Math.Between(0, this.scale.width * 0.7);
    const y = Phaser.Math.Between(0, this.scale.height * 0.4);
    const line = this.add.graphics();
    line.lineStyle(1.5, 0xffffff, 0.9);
    line.beginPath(); line.moveTo(x, y); line.lineTo(x + 90, y + 45); line.strokePath();
    this.tweens.add({ targets: line, alpha: 0, x: 100, duration: 500, ease: 'Quad.easeOut', onComplete: () => line.destroy() });
  }
}

// ---- PLANET ----
class PlanetScene extends Phaser.Scene {
  constructor() { super({ key: 'PlanetScene' }); }
  create() {
    const cx = 110, cy = 110, r = 90;
    for (let i = 25; i > 0; i--) {
      const g = this.add.graphics();
      g.fillStyle(0xc0392b, i / 280);
      g.fillCircle(cx, cy, r + i * 1.6);
    }
    const planet = this.add.graphics();
    [[0xe8623a,r],[0xd4522a,r-10],[0xc0392b,r-22],[0xa02020,r-38],[0x7b1a0a,r-56],[0x3d0a04,r-72]].forEach(([col, rad]) => {
      planet.fillStyle(col, 1);
      planet.fillCircle(cx - (r-rad)*0.15, cy - (r-rad)*0.15, rad);
    });
    planet.fillStyle(0x000000, 0.32);
    planet.fillEllipse(cx + 28, cy + 22, r * 1.3, r * 1.5);
    [[cx-32,cy-18,11],[cx+22,cy+28,7],[cx-8,cy+38,5],[cx+38,cy-12,5]].forEach(([x,y,r2]) => {
      planet.fillStyle(0x000000, 0.2); planet.fillCircle(x, y, r2);
    });
    const hl = this.add.graphics();
    hl.fillStyle(0xffa070, 0.2); hl.fillEllipse(cx - 30, cy - 30, 48, 36);
    const moon = this.add.graphics();
    moon.fillStyle(0xaabbcc, 0.75); moon.fillCircle(0, 0, 4);
    let angle = 0;
    this.time.addEvent({ delay: 16, loop: true, callback: () => {
      angle += 0.018;
      moon.setPosition(cx + Math.cos(angle) * (r + 24), cy + Math.sin(angle) * (r + 24) * 0.4);
    }});
  }
}

// ---- INIT ----
function initPhaser() {
  new Phaser.Game({
    type: Phaser.CANVAS,
    width: window.innerWidth, height: window.innerHeight,
    transparent: true,
    parent: 'star-canvas',
    scene: [StarfieldScene],
    scale: { mode: Phaser.Scale.RESIZE },
    audio: { noAudio: true },
  });
  new Phaser.Game({
    type: Phaser.CANVAS,
    width: 220, height: 220,
    transparent: true,
    parent: 'phaser-planet',
    scene: [PlanetScene],
    audio: { noAudio: true },
  });
}

// ---- HTML CHARACTER SYSTEM ----
function initCharacterScene() {
  // Mansi
  const mansi = document.createElement('div');
  mansi.id = 'mansiChar';
  mansi.innerHTML = `
    <div class="char-bubble" id="mansiBubble"></div>
    <img src="assets/images/mansi.png" class="char-img" id="mansiImg" />
  `;
  document.body.appendChild(mansi);

  // Harsh
  const harsh = document.createElement('div');
  harsh.id = 'harshChar';
  harsh.innerHTML = `
    <div class="char-bubble harsh-bubble-style" id="harshBubble">Wait I'm coming to Mars too 😭</div>
    <img src="assets/images/harsh.png" class="char-img harsh-char-img" id="harshImg" />
  `;
  document.body.appendChild(harsh);

  setTimeout(() => showMansiBubble('Alright. Let\'s build an empire. 🚀'), 1000);
}

function showMansiBubble(text) {
  const bubble = document.getElementById('mansiBubble');
  if (!bubble) return;
  bubble.textContent = text;
  bubble.classList.add('show');
  setTimeout(() => bubble.classList.remove('show'), 3500);
}

function animateMansi(type) {
  const img = document.getElementById('mansiImg');
  if (!img) return;
  img.classList.remove('anim-bounce', 'anim-shake', 'anim-spin');
  void img.offsetWidth; // reflow
  if (type === 'bounce') img.classList.add('anim-bounce');
  else if (type === 'shake') img.classList.add('anim-shake');
  else if (type === 'spin') img.classList.add('anim-spin');
  setTimeout(() => img.classList.remove('anim-bounce', 'anim-shake', 'anim-spin'), 800);
  // show quote
  const quotes = ['Mine now 😌','Empire grows 🚀','No one can stop me 💅','Exactly as planned','Ambani funded the right person','49% forever 🔒'];
  showMansiBubble(quotes[Math.floor(Math.random() * quotes.length)]);
}

window.animateMansi = animateMansi;

window.showHarshChar = function() {
  const harsh = document.getElementById('harshChar');
  if (!harsh) return;
  harsh.classList.add('show');
  setTimeout(() => harsh.classList.remove('show'), 5000);
};

window.showCryingMansi = function() {
  const img = document.getElementById('mansiImg');
  if (!img) return;
  img.classList.add('anim-cry');
};

function initCryingScene() {
  // no Phaser needed — crying is CSS on the mansi img
}

document.addEventListener('DOMContentLoaded', initPhaser);
