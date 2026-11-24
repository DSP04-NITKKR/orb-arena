const BALLS = {
  dagger: {
    id: "dagger",
    name: "Dagger Ball",
    maxHealth: 200,
    projectileDamage: 5,
    throwInterval: 1800,
    projectileSpeed: 420,
    ultimateName: "Dagger Storm",
    ultimateDescription: "Summons 5 predictive daggers",
    ultimateChargePerSecond: 10,
  },
};

const setupScreen = document.querySelector("#setupScreen");
const battleScreen = document.querySelector("#battleScreen");
const canvas = document.querySelector("#arena");
const ctx = canvas.getContext("2d");
const leftHealth = document.querySelector("#leftHealth");
const rightHealth = document.querySelector("#rightHealth");
const leftUltimate = document.querySelector("#leftUltimate");
const rightUltimate = document.querySelector("#rightUltimate");
const leftUltimateFill = document.querySelector("#leftUltimateFill");
const rightUltimateFill = document.querySelector("#rightUltimateFill");
const roundLabel = document.querySelector("#roundLabel");
const winnerOverlay = document.querySelector("#winnerOverlay");
const winnerName = document.querySelector("#winnerName");

let animationFrame = 0;
let lastTime = 0;
let match = null;

function makeFighter(side, ballId) {
  const ball = BALLS[ballId];
  const movingRight = side === "left";
  return {
    side,
    ball,
    health: ball.maxHealth,
    x: side === "left" ? 178 : 782,
    y: canvas.height / 2,
    radius: 48,
    vx: (movingRight ? 1 : -1) * 58,
    vy: side === "left" ? 24 : -24,
    heading: 0,
    turnTimer: 2 + Math.random() * 13,
    contactFlash: 0,
    flash: 0,
    nextThrow: 350,
    ultimateCharge: 0,
    ultActive: false,
  };
}

function startMatch() {
  setupScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  winnerOverlay.classList.add("hidden");
  roundLabel.textContent = "FIGHT";

  match = {
    left: makeFighter("left", "dagger"),
    right: makeFighter("right", "dagger"),
    projectiles: [],
    impactParticles: [],
    elapsed: 0,
    ended: false,
  };

  leftHealth.style.width = "100%";
  rightHealth.style.width = "100%";
  leftUltimateFill.style.width = "0%";
  rightUltimateFill.style.width = "0%";
  lastTime = performance.now();
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(update);
}

function throwDagger(fighter, opponent) {
  const direction = fighter.side === "left" ? 1 : -1;
  const distance = Math.hypot(opponent.x - fighter.x, opponent.y - fighter.y);
  const travelTime = distance / fighter.ball.projectileSpeed;
  const aimX = opponent.x + opponent.vx * travelTime * 0.52;
  const aimY = opponent.y + opponent.vy * travelTime * 0.52;
  const angle = Math.atan2(aimY - fighter.y, aimX - fighter.x);
  match.projectiles.push({
    x: fighter.x + direction * 50,
    y: fighter.y,
    vx: Math.cos(angle) * fighter.ball.projectileSpeed,
    vy: Math.sin(angle) * fighter.ball.projectileSpeed,
    angle,
    owner: fighter.side,
    damage: fighter.ball.projectileDamage,
  });
}

function fireUltimate(fighter, opponent) {
  if (fighter.ultimateCharge < 100 || fighter.ultActive) return;

  fighter.ultActive = true;
  fighter.ultimateCharge = 0;
  updateUltimateUI(fighter);

  const distance = Math.hypot(opponent.x - fighter.x, opponent.y - fighter.y);
  const travelTime = distance / fighter.ball.projectileSpeed;
  const aimX = opponent.x + opponent.vx * travelTime * 0.52;
  const aimY = opponent.y + opponent.vy * travelTime * 0.52;
  const baseAngle = Math.atan2(aimY - fighter.y, aimX - fighter.x);
  const spread = [-0.18, -0.09, 0, 0.09, 0.18];

  fighter.flash = 1.2;
  roundLabel.textContent = `${fighter.side === "left" ? "LEFT" : "RIGHT"} ULTIMATE`;

  for (const offset of spread) {
    const angle = baseAngle + offset;
    match.projectiles.push({
      x: fighter.x + Math.cos(baseAngle) * 50,
      y: fighter.y + Math.sin(baseAngle) * 50,
      vx: Math.cos(angle) * fighter.ball.projectileSpeed * 1.08,
      vy: Math.sin(angle) * fighter.ball.projectileSpeed * 1.08,
      angle,
      owner: fighter.side,
      damage: 8,
      ultimate: true,
    });
  }

  setTimeout(() => {
    if (match && !match.ended) roundLabel.textContent = "FIGHT";
  }, 900);
  fighter.ultActive = false;
}

function updateUltimateUI(fighter) {
  const charge = Math.min(100, fighter.ultimateCharge);
  const fill = fighter.side === "left" ? leftUltimateFill : rightUltimateFill;
  fill.style.width = `${charge}%`;
  const bar = fighter.side === "left" ? leftUltimate : rightUltimate;
  bar.classList.toggle("charged", charge >= 100);
  bar.setAttribute("aria-label", `${fighter.ball.name} ultimate ${Math.floor(charge)} percent charged`);
}

function createImpact(x, y, color) {
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.25;
    const speed = 70 + Math.random() * 110;
    match.impactParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.45,
      color,
    });
  }
}

function separateFighters(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  const minimumDistance = a.radius + b.radius - 12;

  if (distance > 0 && distance < minimumDistance) {
    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = (minimumDistance - distance) / 2;

    a.x -= nx * overlap;
    a.y -= ny * overlap;
    b.x += nx * overlap;
    b.y += ny * overlap;

    const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (relativeVelocity < 0) {
      const impulse = -relativeVelocity * 0.65;
      a.vx -= nx * impulse;
      a.vy -= ny * impulse;
      b.vx += nx * impulse;
      b.vy += ny * impulse;
    }

    a.contactFlash = 1;
    b.contactFlash = 1;
  }
}

function update(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  if (!match.ended) {
    match.elapsed += delta * 1000;

    for (const fighter of [match.left, match.right]) {
      fighter.flash = Math.max(0, fighter.flash - delta * 4);
      fighter.contactFlash = Math.max(0, fighter.contactFlash - delta * 5);
      fighter.ultimateCharge = Math.min(
        100,
        fighter.ultimateCharge + delta * fighter.ball.ultimateChargePerSecond
      );
      updateUltimateUI(fighter);

      if (fighter.ultimateCharge >= 100) {
        const opponent = fighter.side === "left" ? match.right : match.left;
        fireUltimate(fighter, opponent);
      }
      fighter.turnTimer -= delta;

      if (fighter.turnTimer <= 0) {
        const speed = 58 + Math.random() * 24;
        const towardCenter = fighter.side === "left" ? 1 : -1;
        const horizontalTarget = towardCenter * (0.4 + Math.random() * 0.6);
        const angle = Math.atan2((Math.random() - 0.5) * 1.3, horizontalTarget);
        fighter.vx = Math.cos(angle) * speed;
        fighter.vy = Math.sin(angle) * speed;
        fighter.turnTimer = 2 + Math.random() * 13;
      }

      fighter.x += fighter.vx * delta;
      fighter.y += fighter.vy * delta;
      fighter.heading = Math.atan2(fighter.vy, fighter.vx);

      if (fighter.x - fighter.radius < 24) {
        fighter.x = 24 + fighter.radius;
        fighter.vx = Math.abs(fighter.vx);
        fighter.vy += (canvas.height / 2 - fighter.y) * 0.018;
      } else if (fighter.x + fighter.radius > canvas.width - 24) {
        fighter.x = canvas.width - 24 - fighter.radius;
        fighter.vx = -Math.abs(fighter.vx);
        fighter.vy += (canvas.height / 2 - fighter.y) * 0.018;
      }

      if (fighter.y - fighter.radius < 24) {
        fighter.y = 24 + fighter.radius;
        fighter.vy = Math.abs(fighter.vy);
      } else if (fighter.y + fighter.radius > canvas.height - 24) {
        fighter.y = canvas.height - 24 - fighter.radius;
        fighter.vy = -Math.abs(fighter.vy);
      }

      fighter.nextThrow -= delta * 1000;

      if (fighter.nextThrow <= 0) {
        const opponent = fighter.side === "left" ? match.right : match.left;
        throwDagger(fighter, opponent);
        fighter.nextThrow = fighter.ball.throwInterval;
      }
    }

    separateFighters(match.left, match.right);

    for (const projectile of match.projectiles) {
      projectile.x += projectile.vx * delta;
      projectile.y += projectile.vy * delta;

      const opponent = projectile.owner === "left" ? match.right : match.left;
      const dx = projectile.x - opponent.x;
      const dy = projectile.y - opponent.y;
      if (Math.hypot(dx, dy) <= opponent.radius - 8) {
        opponent.health = Math.max(0, opponent.health - projectile.damage);
        opponent.flash = 1;
        createImpact(projectile.x, projectile.y, projectile.owner === "left" ? "#8addf2" : "#c397e5");
        projectile.hit = true;

        if (opponent.side === "left") {
          leftHealth.style.width = `${(opponent.health / opponent.ball.maxHealth) * 100}%`;
        } else {
          rightHealth.style.width = `${(opponent.health / opponent.ball.maxHealth) * 100}%`;
        }

        if (opponent.health <= 0) {
          endMatch(projectile.owner);
        }
      }
    }

    match.projectiles = match.projectiles.filter((projectile) =>
      !projectile.hit &&
      projectile.x > -40 &&
      projectile.x < canvas.width + 40 &&
      projectile.y > -40 &&
      projectile.y < canvas.height + 40
    );

    for (const particle of match.impactParticles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 70 * delta;
      particle.life -= delta;
    }
    match.impactParticles = match.impactParticles.filter((particle) => particle.life > 0);
  }

  draw();
  animationFrame = requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(480, 270, 20, 480, 270, 520);
  gradient.addColorStop(0, "#142638");
  gradient.addColorStop(1, "#09111c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(136, 190, 214, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 80; x < canvas.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 60; y < canvas.height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(136, 190, 214, 0.08)";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  drawFighter(match.left);
  drawFighter(match.right);

  for (const projectile of match.projectiles) {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.angle);
    ctx.fillStyle = projectile.owner === "left" ? "#dffaff" : "#ead8ff";
    ctx.shadowColor = projectile.owner === "left" ? "#69d6f1" : "#b88ad9";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-12, -7);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-12, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#7e9ca8";
    ctx.fillRect(-23, -3, 13, 6);
    ctx.restore();
  }

  for (const particle of match.impactParticles) {
    ctx.globalAlpha = Math.max(0, particle.life / 0.45);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFighter(fighter) {
  ctx.save();
  ctx.translate(fighter.x, fighter.y);

  ctx.beginPath();
  ctx.ellipse(0, 54, 48, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fill();

  const left = fighter.side === "left";
  const base = ctx.createRadialGradient(-16, -20, 4, 0, 0, fighter.radius);
  if (left) {
    base.addColorStop(0, "#dafaff");
    base.addColorStop(0.12, "#9fddea");
    base.addColorStop(0.48, "#65abc4");
    base.addColorStop(0.82, "#2d7290");
    base.addColorStop(1, "#173d54");
  } else {
    base.addColorStop(0, "#f4e4ff");
    base.addColorStop(0.12, "#c9addd");
    base.addColorStop(0.48, "#966cad");
    base.addColorStop(0.82, "#63417b");
    base.addColorStop(1, "#38274e");
  }

  ctx.beginPath();
  ctx.arc(0, 0, fighter.radius + fighter.flash * 5, 0, Math.PI * 2);
  ctx.fillStyle = base;
  ctx.shadowColor = left ? "rgba(111, 208, 237, 0.38)" : "rgba(184, 130, 215, 0.38)";
  ctx.shadowBlur = 26;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#102232";
  ctx.beginPath();
  ctx.arc(-14, -7, 6, 0, Math.PI * 2);
  ctx.arc(14, -7, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function endMatch(winnerSide) {
  match.ended = true;
  roundLabel.textContent = "K.O.";
  winnerName.textContent = `${winnerSide === "left" ? "Dagger Ball" : "Dagger Ball"} wins`;
  winnerOverlay.classList.remove("hidden");
}

document.querySelector("#fightButton").addEventListener("click", startMatch);
document.querySelector("#rematchButton").addEventListener("click", startMatch);
document.querySelector("#changeButton").addEventListener("click", () => {
  cancelAnimationFrame(animationFrame);
  battleScreen.classList.add("hidden");
  setupScreen.classList.remove("hidden");
});

document.querySelector("#resetButton").addEventListener("click", () => {
  cancelAnimationFrame(animationFrame);
  battleScreen.classList.add("hidden");
  setupScreen.classList.remove("hidden");
});
