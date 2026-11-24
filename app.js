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
    ultimateChargeHits: 5,
    ultimateChargePerSecond: 0,
  },
  spikes: {
    id: "spikes",
    name: "Spikes Ball",
    maxHealth: 220,
    projectileDamage: 0,
    throwInterval: 0,
    projectileSpeed: 520,
    contactDamage: 18,
    ultimateName: "Spike Burst",
    ultimateDescription: "Throws spikes in every direction",
    ultimateChargePerSecond: 10,
    ultimateChargeHits: 0,
  },
  axe: {
    id: "axe",
    name: "Axe Ball",
    maxHealth: 230,
    projectileDamage: 0,
    throwInterval: 0,
    projectileSpeed: 520,
    contactDamage: 14,
    axeDamage: 12,
    ultimateName: "Future Step",
    ultimateDescription: "Teleports to where it will be in 5 seconds",
    ultimateChargePerSecond: 100 / 8,
    ultimateChargeHits: 0,
  },
};

const POWERUPS = {
  heal: {
    name: "Heal",
    symbol: "+",
    color: "#77eca5",
  },
  damage: {
    name: "Power",
    symbol: "×",
    color: "#ffb36a",
  },
  attackSpeed: {
    name: "Rapid",
    symbol: "»",
    color: "#8addf2",
  },
  moveSpeed: {
    name: "Haste",
    symbol: "›",
    color: "#c8a4ff",
  },
  shield: {
    name: "Shield",
    symbol: "◆",
    color: "#f1df78",
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
let selectedLeftBall = "dagger";
let selectedRightBall = "dagger";

const MOVEMENT_DRAW = [];
for (let seconds = 2; seconds <= 15; seconds += 1) {
  for (let ball = 0; ball < seconds; ball += 1) {
    MOVEMENT_DRAW.push(seconds);
  }
}

function drawMovementSeconds() {
  return MOVEMENT_DRAW[Math.floor(Math.random() * MOVEMENT_DRAW.length)];
}

function makeFighter(side, ballId) {
  const ball = BALLS[ballId];
  const movingRight = side === "left";
  const daggerHorizontalSpeed = 150;
  const daggerVerticalSpeed = 61;
  const initialSpeed = ball.id === "spikes" ? daggerHorizontalSpeed * 2 : daggerHorizontalSpeed;
  const initialVerticalSpeed = ball.id === "spikes" ? daggerVerticalSpeed * 2 : daggerVerticalSpeed;
  return {
    side,
    ball,
    health: ball.maxHealth,
    x: side === "left" ? 178 : 782,
    y: canvas.height / 2,
    radius: 48,
    vx: (movingRight ? 1 : -1) * initialSpeed,
    vy: side === "left" ? initialVerticalSpeed : -initialVerticalSpeed,
    heading: 0,
    turnTimer: drawMovementSeconds(),
    contactFlash: 0,
    flash: 0,
    nextThrow: 350,
    ultimateCharge: 0,
    ultActive: false,
    ultimateCooldownUntil: 0,
    shield: 0,
    contactDamageUntil: 0,
    damageBoostUntil: 0,
    attackSpeedUntil: 0,
    moveSpeedUntil: 0,
    successfulHits: 0,
    axeAngle: 0,
    pickupText: "",
    pickupTextUntil: 0,
    axeDamageUntil: 0,
  };
}

function startMatch() {
  setupScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  winnerOverlay.classList.add("hidden");
  roundLabel.textContent = "FIGHT";

  match = {
    left: makeFighter("left", selectedLeftBall),
    right: makeFighter("right", selectedRightBall),
    projectiles: [],
    impactParticles: [],
    powerups: [],
    powerupLabels: [],
    nextPowerup: 4500,
    elapsed: 0,
    ended: false,
  };

  leftHealth.style.width = "100%";
  rightHealth.style.width = "100%";
  leftUltimateFill.style.width = "0%";
  rightUltimateFill.style.width = "0%";
  updateMatchIdentity(match.left);
  updateMatchIdentity(match.right);
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
    regularDagger: true,
    ultimate: false,
  });
}

function fireUltimate(fighter, opponent) {
  if (fighter.ultimateCharge < 100 || fighter.ultActive) return;

  fighter.ultActive = true;
  fighter.ultimateCooldownUntil = match.elapsed + 1200;
  fighter.ultimateCharge = 0;
  if (fighter.ball.id === "dagger") fighter.successfulHits = 0;
  updateUltimateUI(fighter);

  const distance = Math.hypot(opponent.x - fighter.x, opponent.y - fighter.y);
  const travelTime = distance / fighter.ball.projectileSpeed;
  const aimX = opponent.x + opponent.vx * travelTime * 0.52;
  const aimY = opponent.y + opponent.vy * travelTime * 0.52;
  const baseAngle = Math.atan2(aimY - fighter.y, aimX - fighter.x);
  const spread = [-0.18, -0.09, 0, 0.09, 0.18];

  fighter.flash = 1.2;
  roundLabel.textContent = `${fighter.side === "left" ? "LEFT" : "RIGHT"} ULTIMATE`;

  if (fighter.ball.id === "axe") {
    const predictedX = fighter.x + fighter.vx * 5;
    const predictedY = fighter.y + fighter.vy * 5;
    fighter.x = Math.max(fighter.radius + 24, Math.min(canvas.width - fighter.radius - 24, predictedX));
    fighter.y = Math.max(fighter.radius + 24, Math.min(canvas.height - fighter.radius - 24, predictedY));
    createImpact(fighter.x, fighter.y, "#d9a06a");
  }

  if (fighter.ball.id === "spikes" || fighter.ball.id === "axe") {
    for (let i = 0; i < 16; i += 1) {
      const angle = (Math.PI * 2 * i) / 16;
      match.projectiles.push({
        x: fighter.x + Math.cos(angle) * 52,
        y: fighter.y + Math.sin(angle) * 52,
        vx: Math.cos(angle) * fighter.ball.projectileSpeed,
        vy: Math.sin(angle) * fighter.ball.projectileSpeed,
        angle,
        owner: fighter.side,
        damage: 10,
        ultimate: true,
        spike: true,
      });
    }
  }

  if (fighter.ball.id === "dagger") {
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
  }

  setTimeout(() => {
    if (match && !match.ended) roundLabel.textContent = "FIGHT";
  }, 900);
}

function updateUltimateUI(fighter) {
  const charge = Math.min(100, fighter.ultimateCharge);
  const fill = fighter.side === "left" ? leftUltimateFill : rightUltimateFill;
  fill.style.width = `${charge}%`;
  const bar = fighter.side === "left" ? leftUltimate : rightUltimate;
  bar.classList.toggle("charged", charge >= 100);
  if (fighter.ball.id === "dagger") {
    bar.setAttribute("aria-label", `${fighter.ball.name} ultimate ${fighter.successfulHits} of 5 successful hits`);
  } else {
    bar.setAttribute("aria-label", `${fighter.ball.name} ultimate ${Math.floor(charge)} percent charged`);
  }
}

function updateMatchIdentity(fighter) {
  const isLeft = fighter.side === "left";
  const name = document.querySelector(isLeft ? "#leftMatchName" : "#rightMatchName");
  const mini = document.querySelector(isLeft ? "#leftMiniBall" : "#rightMiniBall");
  const descriptionName = document.querySelector(isLeft ? "#leftDescriptionName" : "#rightDescriptionName");
  const descriptionText = document.querySelector(isLeft ? "#leftDescriptionText" : "#rightDescriptionText");

  name.textContent = fighter.ball.name;
  const ballClass = fighter.ball.id === "spikes" ? "spikes-ball" : fighter.ball.id === "axe" ? "axe-ball" : "dagger-ball";
  mini.className = `mini-ball ${ballClass}${isLeft ? "" : " purple"}`;
  descriptionName.textContent = fighter.ball.name;
  descriptionText.textContent = fighter.ball.id === "spikes"
    ? "18 damage on touch · Spike Burst charges over 10 sec"
    : fighter.ball.id === "axe"
      ? "12 damage per axe hit · Future Step teleports every 8 sec"
      : "Dagger every 1.8 sec · Dagger Storm charges from 5 successful hits";
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

    const aSpeed = Math.hypot(a.vx, a.vy);
    const bSpeed = Math.hypot(b.vx, b.vy);
    const aNormal = a.vx * nx + a.vy * ny;
    const bNormal = b.vx * nx + b.vy * ny;

    if (aNormal > 0 || bNormal < 0) {
      a.vx -= 2 * aNormal * nx;
      a.vy -= 2 * aNormal * ny;
      b.vx -= 2 * bNormal * nx;
      b.vy -= 2 * bNormal * ny;

      const aNewSpeed = Math.hypot(a.vx, a.vy);
      const bNewSpeed = Math.hypot(b.vx, b.vy);
      if (aNewSpeed > 0) {
        a.vx = (a.vx / aNewSpeed) * aSpeed;
        a.vy = (a.vy / aNewSpeed) * aSpeed;
      }
      if (bNewSpeed > 0) {
        b.vx = (b.vx / bNewSpeed) * bSpeed;
        b.vy = (b.vy / bNewSpeed) * bSpeed;
      }
    }

    a.contactFlash = 1;
    b.contactFlash = 1;

    if (a.ball.id === "spikes") damageOnContact(a, b);
    if (b.ball.id === "spikes") damageOnContact(b, a);
  }
}

function damageOnContact(attacker, target) {
  if (attacker.contactDamageUntil > match.elapsed) return;
  attacker.contactDamageUntil = match.elapsed + 700;

  if (target.shield > 0) {
    target.shield = 0;
  } else {
    target.health = Math.max(0, target.health - attacker.ball.contactDamage);
  }
  attacker.flash = 1;
  target.flash = 1;
  createImpact(target.x, target.y, "#e9a55c");
  updateHealthUI(target);
  if (target.health <= 0) endMatch(attacker.side);
}

function spawnPowerup() {
  const types = Object.keys(POWERUPS);
  const type = types[Math.floor(Math.random() * types.length)];
  const padding = 130;
  match.powerups.push({
    type,
    x: padding + Math.random() * (canvas.width - padding * 2),
    y: 90 + Math.random() * (canvas.height - 180),
    radius: 24,
    age: 0,
  });
  const elapsedSeconds = match.elapsed / 1000;
  const speedScale = Math.min(1, elapsedSeconds / 60);
  const minimumDelay = 4000 - speedScale * 2000;
  const randomDelay = 3000 - speedScale * 1000;
  match.nextPowerup = minimumDelay + Math.random() * randomDelay;
}

function applyPowerup(fighter, powerup) {
  const info = POWERUPS[powerup.type];
  fighter.pickupText = info.name;
  fighter.pickupTextUntil = match.elapsed + 1400;

  if (powerup.type === "heal") {
    fighter.health = Math.min(fighter.ball.maxHealth, fighter.health + 20);
  } else if (powerup.type === "damage") {
    fighter.damageBoostUntil = match.elapsed + 9000;
  } else if (powerup.type === "attackSpeed") {
    fighter.attackSpeedUntil = match.elapsed + 9000;
  } else if (powerup.type === "moveSpeed") {
    fighter.moveSpeedUntil = match.elapsed + 9000;
  } else if (powerup.type === "shield") {
    fighter.shield = 1;
  }

  match.powerupLabels.push({
    text: `+ ${info.name}`,
    x: fighter.x,
    y: fighter.y - 60,
    life: 1,
    color: info.color,
  });

  updateHealthUI(fighter);
}

function updateHealthUI(fighter) {
  const fill = fighter.side === "left" ? leftHealth : rightHealth;
  fill.style.width = `${(fighter.health / fighter.ball.maxHealth) * 100}%`;
}

function update(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  if (!match.ended) {
    match.elapsed += delta * 1000;
    match.nextPowerup -= delta * 1000;
    if (match.nextPowerup <= 0) spawnPowerup();

    for (const fighter of [match.left, match.right]) {
      fighter.flash = Math.max(0, fighter.flash - delta * 4);
      fighter.contactFlash = Math.max(0, fighter.contactFlash - delta * 5);
      fighter.axeAngle = (fighter.axeAngle || 0) + delta * 3.8;
      if (fighter.ultActive && match.elapsed >= fighter.ultimateCooldownUntil) {
        fighter.ultActive = false;
      }
      if (fighter.ball.id === "spikes" || fighter.ball.id === "axe") {
        fighter.ultimateCharge = Math.min(
          100,
          fighter.ultimateCharge + delta * fighter.ball.ultimateChargePerSecond
        );
      }
      updateUltimateUI(fighter);

      if (fighter.ultimateCharge >= 100 && !fighter.ultActive) {
        const opponent = fighter.side === "left" ? match.right : match.left;
        fireUltimate(fighter, opponent);
      }
      fighter.turnTimer -= delta;


      if (fighter.turnTimer <= 0) {
        const boosted = fighter.moveSpeedUntil > match.elapsed;
        const baseSpeed = fighter.ball.id === "spikes" ? 196 : 98;
        const randomSpeed = fighter.ball.id === "spikes" ? 68 : 34;
        const speed = (baseSpeed + Math.random() * randomSpeed) * (boosted ? 1.5 : 1);
        const towardCenter = fighter.side === "left" ? 1 : -1;
        const horizontalTarget = towardCenter * (0.4 + Math.random() * 0.6);
        const angle = Math.atan2((Math.random() - 0.5) * 1.3, horizontalTarget);
        fighter.vx = Math.cos(angle) * speed;
        fighter.vy = Math.sin(angle) * speed;
        fighter.turnTimer = drawMovementSeconds();
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

      if (fighter.ball.id === "dagger" && fighter.nextThrow <= 0) {
        const opponent = fighter.side === "left" ? match.right : match.left;
        throwDagger(fighter, opponent);
        const boosted = fighter.attackSpeedUntil > match.elapsed;
        fighter.nextThrow = boosted
          ? fighter.ball.throwInterval * 0.5
          : fighter.ball.throwInterval;
      }
    }

    separateFighters(match.left, match.right);

    for (const fighter of [match.left, match.right]) {
      if (fighter.ball.id !== "axe") continue;
      const opponent = fighter.side === "left" ? match.right : match.left;
      const axeDistance = 82;
      const axeX = fighter.x + Math.cos(fighter.axeAngle) * axeDistance;
      const axeY = fighter.y + Math.sin(fighter.axeAngle) * axeDistance;
      if (Math.hypot(axeX - opponent.x, axeY - opponent.y) < opponent.radius - 8) {
        if (fighter.axeDamageUntil > match.elapsed) continue;
        fighter.axeDamageUntil = match.elapsed + 650;
        if (opponent.shield > 0) {
          opponent.shield = 0;
        } else {
          opponent.health = Math.max(0, opponent.health - fighter.ball.axeDamage);
          updateHealthUI(opponent);
        }
        createImpact(axeX, axeY, "#d9a06a");
        if (opponent.health <= 0) endMatch(fighter.side);
      }
    }

    for (const powerup of match.powerups) {
      powerup.age += delta;
      for (const fighter of [match.left, match.right]) {
        const dx = powerup.x - fighter.x;
        const dy = powerup.y - fighter.y;
        if (Math.hypot(dx, dy) <= fighter.radius + powerup.radius) {
          applyPowerup(fighter, powerup);
          powerup.collected = true;
        }
      }
    }
    match.powerups = match.powerups.filter((powerup) => !powerup.collected);

    for (const projectile of match.projectiles) {
      projectile.x += projectile.vx * delta;
      projectile.y += projectile.vy * delta;

      const opponent = projectile.owner === "left" ? match.right : match.left;
      const dx = projectile.x - opponent.x;
      const dy = projectile.y - opponent.y;
      if (Math.hypot(dx, dy) <= opponent.radius - 8) {
        if (opponent.shield > 0) {
          opponent.shield = 0;
          createImpact(projectile.x, projectile.y, "#f1df78");
        } else {
          const owner = projectile.owner === "left" ? match.left : match.right;
              const damageMultiplier = owner.damageBoostUntil > match.elapsed ? 2 : 1;
          opponent.health = Math.max(0, opponent.health - projectile.damage * damageMultiplier);
        }
        opponent.flash = 1;
        createImpact(projectile.x, projectile.y, projectile.owner === "left" ? "#8addf2" : "#c397e5");
        projectile.hit = true;
        if (projectile.regularDagger && projectile.owner === "left") {
          const owner = match.left;
          if (owner.ball.id === "dagger") {
            owner.successfulHits = Math.min(5, owner.successfulHits + 1);
            owner.ultimateCharge = owner.successfulHits * 20;
            if (owner.ultimateCharge >= 100) owner.ultimateCharge = 100;
          }
        } else if (projectile.regularDagger) {
          const owner = match.right;
          if (owner.ball.id === "dagger") {
            owner.successfulHits = Math.min(5, owner.successfulHits + 1);
            owner.ultimateCharge = owner.successfulHits * 20;
            if (owner.ultimateCharge >= 100) owner.ultimateCharge = 100;
          }
        }

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

    for (const label of match.powerupLabels) {
      label.y -= 24 * delta;
      label.life -= delta;
    }
    match.powerupLabels = match.powerupLabels.filter((label) => label.life > 0);
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

  for (const powerup of match.powerups) {
    const info = POWERUPS[powerup.type];
    ctx.save();
    ctx.translate(powerup.x, powerup.y);
    ctx.rotate(powerup.age * 1.4);
    ctx.beginPath();
    ctx.arc(0, 0, powerup.radius, 0, Math.PI * 2);
    ctx.fillStyle = info.color;
    ctx.shadowColor = info.color;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.rotate(-powerup.age * 1.4);
    ctx.fillStyle = "#10202b";
    ctx.font = "900 22px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(info.symbol, 0, 1);
    ctx.restore();
  }

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

  for (const label of match.powerupLabels) {
    ctx.globalAlpha = Math.max(0, label.life);
    ctx.fillStyle = label.color;
    ctx.font = "900 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label.text, label.x, label.y);
  }
  ctx.globalAlpha = 1;
}

function drawFighter(fighter) {
  ctx.save();
  ctx.translate(fighter.x, fighter.y);

  if (fighter.shield > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, fighter.radius + 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#f1df78";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#f1df78";
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.beginPath();
  ctx.ellipse(0, 54, 48, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fill();

  const left = fighter.side === "left";
  const base = ctx.createRadialGradient(-16, -20, 4, 0, 0, fighter.radius);
  if (fighter.ball.id === "spikes") {
    base.addColorStop(0, "#fff0c9");
    base.addColorStop(0.12, "#deb27a");
    base.addColorStop(0.48, "#a66e43");
    base.addColorStop(0.82, "#75513e");
    base.addColorStop(1, "#4a3931");
  } else if (fighter.ball.id === "axe") {
    base.addColorStop(0, "#f2f1df");
    base.addColorStop(0.12, "#aaa894");
    base.addColorStop(0.48, "#777365");
    base.addColorStop(0.82, "#625e55");
    base.addColorStop(1, "#4b473f");
  } else if (left) {
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
  if (fighter.ball.id === "spikes") {
    ctx.shadowColor = "rgba(231, 171, 99, 0.42)";
  }
  ctx.shadowBlur = 26;
  ctx.fill();
  ctx.shadowBlur = 0;

  if (fighter.ball.id === "spikes") {
    ctx.fillStyle = "#e0b16f";
    ctx.strokeStyle = "#4a3931";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(fighter.radius - 2, 0);
      ctx.lineTo(fighter.radius + 18, -9);
      ctx.lineTo(fighter.radius + 18, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  if (fighter.ball.id === "axe") {
    ctx.save();
    ctx.rotate(fighter.axeAngle || 0);
    ctx.strokeStyle = "#9a7655";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(82, 0);
    ctx.stroke();
    ctx.translate(82, 0);
    ctx.fillStyle = "#d3d0c3";
    ctx.strokeStyle = "#5f5548";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, -14);
    ctx.lineTo(24, -20);
    ctx.lineTo(20, 0);
    ctx.lineTo(24, 20);
    ctx.lineTo(-6, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

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
  const winner = winnerSide === "left" ? match.left : match.right;
  winnerName.textContent = `${winner.ball.name} wins`;
  winnerOverlay.classList.remove("hidden");
}

document.querySelector("#fightButton").addEventListener("click", startMatch);
const BALL_DETAILS = {
  dagger: {
    name: "Dagger Ball",
    role: "Ranged thrower",
    description: "A precise ranged fighter that charges Dagger Storm by landing 5 successful dagger hits.",
    attack: "Dagger",
    health: "200",
    ultimate: "5 hits",
  },
  spikes: {
    name: "Spikes Ball",
    role: "Close-contact bruiser",
    description: "A high-contact attacker that deals heavy damage when colliding and bursts spikes in every direction.",
    attack: "18 touch",
    health: "220",
    ultimate: "10 sec",
  },
  axe: {
    name: "Axe Ball",
    role: "Orbiting weapon",
    description: "Rotates an axe for heavy close-range hits and teleports to its 5-second future position.",
    attack: "12 axe",
    health: "230",
    ultimate: "8 sec",
  },
};

function showSideDetails(side, ballId) {
  const details = BALL_DETAILS[ballId];
  const prefix = side === "left" ? "left" : "right";
  const role = document.querySelector(`#${prefix}DetailRole`);
  const name = document.querySelector(`#${prefix}DetailName`);
  const description = document.querySelector(`#${prefix}DetailDescription`);
  if (role) role.textContent = details.role;
  if (name) name.textContent = details.name;
  if (description) description.textContent = details.description;
  const detailOrb = document.querySelector(`#${prefix}DetailBall`);
  if (detailOrb) {
    const orbClass = ballId === "spikes" ? "spikes-ball" : ballId === "axe" ? "axe-ball" : "dagger-ball";
    detailOrb.className = `detail-orb ${orbClass}`;
    detailOrb.innerHTML = ballId === "spikes"
      ? '<span class="detail-spike">◆</span>'
      : ballId === "axe"
        ? '<span class="detail-spike">⚒</span>'
        : '<span class="detail-face"><i></i><i></i></span>';
  }
}

function updateSelectionButtonStates(side) {
  const selectedBall = side === "left" ? selectedLeftBall : selectedRightBall;
  document.querySelectorAll(`.side-ball[data-side="${side}"]`).forEach((button) => {
    const selected = button.dataset.ball === selectedBall;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}

document.querySelectorAll(".side-ball").forEach((button) => {
  button.addEventListener("click", () => {
    const side = button.dataset.side;
    const ballId = button.dataset.ball;
    if (side === "left") selectedLeftBall = ballId;
    else selectedRightBall = ballId;

    document.querySelectorAll(`.side-ball[data-side="${side}"]`).forEach((option) => {
      option.classList.toggle("selected", option === button);
    });

    const sideName = document.querySelector(side === "left" ? "#leftSideName" : "#rightSideName");
    sideName.textContent = BALL_DETAILS[ballId].name;
    showSideDetails(side, ballId);
    updateSelectionButtonStates(side);
  });
});

showSideDetails("left", "dagger");
showSideDetails("right", "dagger");
updateSelectionButtonStates("left");
updateSelectionButtonStates("right");
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
