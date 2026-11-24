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
    axeDamage: 15,
    ultimateName: "Future Step",
    ultimateDescription: "Teleports to where it will be in 5 seconds",
    ultimateChargePerSecond: 100 / 8,
    ultimateChargeHits: 0,
  },
  laser: {
    id: "laser", name: "Laser Ball", maxHealth: 190, projectileDamage: 12,
    throwInterval: 1900, projectileSpeed: 680, ultimateName: "Laser Net",
    ultimateDescription: "Creates a net of cross-cutting lasers", ultimateChargePerSecond: 12,
  },
  fire: {
    id: "fire", name: "Fire Ball", maxHealth: 210, projectileDamage: 9,
    throwInterval: 1700, projectileSpeed: 470, ultimateName: "Inferno Ring",
    ultimateDescription: "Launches a ring of fireballs", ultimateChargePerSecond: 11,
  },
  vines: {
    id: "vines", name: "Vines Ball", maxHealth: 220, projectileDamage: 7,
    throwInterval: 2100, projectileSpeed: 380, ultimateName: "Vine Snare",
    ultimateDescription: "Deploys entangling vines across the arena", ultimateChargePerSecond: 10,
  },
  seed: {
    id: "seed", name: "Seed Bomb Ball", maxHealth: 200, projectileDamage: 12,
    throwInterval: 2200, projectileSpeed: 330, ultimateName: "Seedstorm",
    ultimateDescription: "Drops a cluster of explosive seeds", ultimateChargePerSecond: 9,
  },
  multishots: {
    id: "multishots", name: "Multishots Ball", maxHealth: 180, projectileDamage: 5,
    throwInterval: 1900, projectileSpeed: 500, ultimateName: "Triple Torrent",
    ultimateDescription: "Fires a wide torrent of shots", ultimateChargePerSecond: 10,
  },
  electric: {
    id: "electric", name: "Electric Ball", maxHealth: 195, projectileDamage: 10,
    throwInterval: 1600, projectileSpeed: 610, ultimateName: "Storm Grid",
    ultimateDescription: "Creates an electrified arena grid", ultimateChargePerSecond: 11,
  },
  multiplier: {
    id: "multiplier", name: "Multiplier Ball", maxHealth: 210, projectileDamage: 6,
    throwInterval: 1800, projectileSpeed: 440, ultimateName: "Overdrive",
    ultimateDescription: "Multiplies every active projectile", ultimateChargePerSecond: 10,
  },
  gravity: {
    id: "gravity", name: "Gravity Ball", maxHealth: 215, projectileDamage: 8,
    throwInterval: 2100, projectileSpeed: 360, ultimateName: "Gravity Vortex",
    ultimateDescription: "Creates a pulling vortex", ultimateChargePerSecond: 10,
  },
  mirror: {
    id: "mirror", name: "Mirror Ball", maxHealth: 205, projectileDamage: 8,
    throwInterval: 1800, projectileSpeed: 460, ultimateName: "Reflection Pulse",
    ultimateDescription: "Returns a wall of reflected shots", ultimateChargePerSecond: 10,
  },
  time: {
    id: "time", name: "Time Ball", maxHealth: 190, projectileDamage: 9,
    throwInterval: 2000, projectileSpeed: 440, ultimateName: "Time Freeze",
    ultimateDescription: "Briefly freezes the opposing fighter", ultimateChargePerSecond: 10,
  },
  magnet: {
    id: "magnet", name: "Magnet Ball", maxHealth: 220, projectileDamage: 7,
    throwInterval: 1900, projectileSpeed: 400, ultimateName: "Magnetic Pull",
    ultimateDescription: "Pulls every powerup toward the fighter", ultimateChargePerSecond: 10,
  },
  ice: {
    id: "ice", name: "Ice Ball", maxHealth: 210, projectileDamage: 8,
    throwInterval: 1800, projectileSpeed: 430, ultimateName: "Frost Ring",
    ultimateDescription: "Creates a widening frost ring", ultimateChargePerSecond: 10,
  },
  shield: {
    id: "shield", name: "Shield Ball", maxHealth: 260, projectileDamage: 0,
    throwInterval: 0, projectileSpeed: 0, contactDamage: 11,
    ultimateName: "Shield Shells", ultimateDescription: "Deploys rotating shield shells",
    ultimateChargePerSecond: 10,
  },
  shadow: {
    id: "shadow", name: "Shadow Ball", maxHealth: 200, projectileDamage: 7,
    throwInterval: 1900, projectileSpeed: 480, ultimateName: "Shadow Swap",
    ultimateDescription: "Swaps positions with the opponent", ultimateChargePerSecond: 10,
  },
  bomb: {
    id: "bomb", name: "Bomb Ball", maxHealth: 210, projectileDamage: 12,
    throwInterval: 2200, projectileSpeed: 300, ultimateName: "Blast Ring",
    ultimateDescription: "Detonates a ring of delayed blasts", ultimateChargePerSecond: 10,
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
  let initialSpeed = daggerHorizontalSpeed;
  let initialVerticalSpeed = daggerVerticalSpeed;
  if (ball.id === "spikes") {
    initialSpeed *= 2;
    initialVerticalSpeed *= 2;
  } else if (ball.id === "axe") {
    initialSpeed = daggerHorizontalSpeed * 1.25;
    initialVerticalSpeed = daggerVerticalSpeed * 1.25;
  } else if (["laser", "electric", "shadow"].includes(ball.id)) {
    initialSpeed *= 1.18;
    initialVerticalSpeed *= 1.18;
  } else if (["seed", "gravity", "shield"].includes(ball.id)) {
    initialSpeed *= 0.85;
    initialVerticalSpeed *= 0.85;
  }
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
    axeSpinDirection: 1,
    pickupText: "",
    pickupTextUntil: 0,
    axeDamageUntil: 0,
    axeCollisionFlipUntil: 0,
    gravityUntil: 0,
    timeFrozenUntil: 0,
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
  const offsets = fighter.ball.id === "multishots"
    ? [-0.16, -0.08, 0, 0.08, 0.16]
    : fighter.ball.id === "laser"
      ? [-0.025, 0, 0.025]
      : [0];

  for (const offset of offsets) {
    const projectileAngle = angle + offset;
    match.projectiles.push({
      x: fighter.x + direction * 50,
      y: fighter.y,
      vx: Math.cos(projectileAngle) * fighter.ball.projectileSpeed,
      vy: Math.sin(projectileAngle) * fighter.ball.projectileSpeed,
      angle: projectileAngle,
      owner: fighter.side,
      damage: fighter.ball.projectileDamage,
      regularDagger: fighter.ball.id === "dagger",
      ultimate: false,
      projectileType: fighter.ball.id,
    });
  }
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

  if (fighter.ball.id === "spikes") {
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

  if (fighter.ball.id === "laser") {
    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 520, vy: Math.sin(angle) * 520,
        angle, owner: fighter.side, damage: 6, ultimate: true,
        spike: false, laser: true,
      });
    }
  } else if (fighter.ball.id === "fire") {
    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 390, vy: Math.sin(angle) * 390,
        angle, owner: fighter.side, damage: 8, ultimate: true, fire: true,
      });
    }
  } else if (fighter.ball.id === "vines") {
    for (let i = -2; i <= 2; i += 1) {
      const angle = baseAngle + i * 0.28;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 260, vy: Math.sin(angle) * 260,
        angle, owner: fighter.side, damage: 7, ultimate: true, vine: true,
      });
    }
  } else if (fighter.ball.id === "seed") {
    for (let i = 0; i < 8; i += 1) {
      const angle = baseAngle - 0.5 + i * 0.14;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 280, vy: Math.sin(angle) * 280,
        angle, owner: fighter.side, damage: 12, ultimate: true, seed: true,
      });
    }
  } else if (fighter.ball.id === "multishots") {
    for (let i = -6; i <= 6; i += 1) {
      const angle = baseAngle + i * 0.08;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 520, vy: Math.sin(angle) * 520,
        angle, owner: fighter.side, damage: 5, ultimate: true, multishot: true,
      });
    }
  } else if (fighter.ball.id === "electric") {
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 560, vy: Math.sin(angle) * 560,
        angle, owner: fighter.side, damage: 9, ultimate: true, electric: true,
      });
    }
  } else if (fighter.ball.id === "multiplier") {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 430, vy: Math.sin(angle) * 430,
        angle, owner: fighter.side, damage: 6, ultimate: true, multiplier: true,
      });
    }
  } else if (fighter.ball.id === "gravity") {
    fighter.gravityUntil = match.elapsed + 6000;
  } else if (fighter.ball.id === "mirror") {
    match.projectiles.forEach((projectile) => {
      if (projectile.owner !== fighter.side) {
        projectile.vx *= -1;
        projectile.vy *= -1;
        projectile.owner = fighter.side;
      }
    });
  } else if (fighter.ball.id === "time") {
    opponent.timeFrozenUntil = match.elapsed + 1800;
  } else if (fighter.ball.id === "magnet") {
    for (const powerup of match.powerups) {
      powerup.x = fighter.x;
      powerup.y = fighter.y;
    }
  } else if (fighter.ball.id === "ice") {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 350, vy: Math.sin(angle) * 350,
        angle, owner: fighter.side, damage: 7, ultimate: true, ice: true,
      });
    }
  } else if (fighter.ball.id === "shield") {
    fighter.shield = 3;
  } else if (fighter.ball.id === "shadow") {
    const swapX = opponent.x;
    const swapY = opponent.y;
    opponent.x = fighter.x;
    opponent.y = fighter.y;
    fighter.x = swapX;
    fighter.y = swapY;
  } else if (fighter.ball.id === "bomb") {
    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12;
      match.projectiles.push({
        x: fighter.x, y: fighter.y,
        vx: Math.cos(angle) * 300, vy: Math.sin(angle) * 300,
        angle, owner: fighter.side, damage: 11, ultimate: true, bomb: true,
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

function normalizeVelocityMagnitude(fighter, magnitude) {
  const speed = Math.hypot(fighter.vx, fighter.vy);
  if (speed <= 0) return;
  fighter.vx = (fighter.vx / speed) * magnitude;
  fighter.vy = (fighter.vy / speed) * magnitude;
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

    if (a.ball.id === "axe" && match.elapsed >= (a.axeCollisionFlipUntil || 0)) {
      a.axeSpinDirection *= -1;
      a.axeCollisionFlipUntil = match.elapsed + 400;
    }
    if (b.ball.id === "axe" && match.elapsed >= (b.axeCollisionFlipUntil || 0)) {
      b.axeSpinDirection *= -1;
      b.axeCollisionFlipUntil = match.elapsed + 400;
    }

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
      if (fighter.timeFrozenUntil > match.elapsed) continue;
      fighter.flash = Math.max(0, fighter.flash - delta * 4);
      fighter.contactFlash = Math.max(0, fighter.contactFlash - delta * 5);
      fighter.axeAngle = (fighter.axeAngle || 0) + delta * 3.8 * (fighter.axeSpinDirection || 1);
      if (fighter.ultActive && match.elapsed >= fighter.ultimateCooldownUntil) {
        fighter.ultActive = false;
      }
      if (fighter.ball.id !== "dagger") {
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
        const speed = Math.hypot(fighter.vx, fighter.vy) * (boosted ? 1.5 : 1);
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
        const speed = Math.hypot(fighter.vx, fighter.vy);
        fighter.x = 24 + fighter.radius;
        fighter.vx = Math.abs(fighter.vx);
        fighter.vy += (canvas.height / 2 - fighter.y) * 0.018;
        normalizeVelocityMagnitude(fighter, speed);
        if (fighter.ball.id === "axe") fighter.axeSpinDirection *= -1;
      } else if (fighter.x + fighter.radius > canvas.width - 24) {
        const speed = Math.hypot(fighter.vx, fighter.vy);
        fighter.x = canvas.width - 24 - fighter.radius;
        fighter.vx = -Math.abs(fighter.vx);
        fighter.vy += (canvas.height / 2 - fighter.y) * 0.018;
        normalizeVelocityMagnitude(fighter, speed);
        if (fighter.ball.id === "axe") fighter.axeSpinDirection *= -1;
      }

      if (fighter.y - fighter.radius < 24) {
        const speed = Math.hypot(fighter.vx, fighter.vy);
        fighter.y = 24 + fighter.radius;
        fighter.vy = Math.abs(fighter.vy);
        normalizeVelocityMagnitude(fighter, speed);
        if (fighter.ball.id === "axe") fighter.axeSpinDirection *= -1;
      } else if (fighter.y + fighter.radius > canvas.height - 24) {
        const speed = Math.hypot(fighter.vx, fighter.vy);
        fighter.y = canvas.height - 24 - fighter.radius;
        fighter.vy = -Math.abs(fighter.vy);
        normalizeVelocityMagnitude(fighter, speed);
        if (fighter.ball.id === "axe") fighter.axeSpinDirection *= -1;
      }

      fighter.nextThrow -= delta * 1000;

      if (fighter.ball.id !== "spikes" && fighter.ball.id !== "axe" && fighter.nextThrow <= 0) {
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
      const axeDistance = 118;
      const axeX = fighter.x + Math.cos(fighter.axeAngle) * axeDistance;
      const axeY = fighter.y + Math.sin(fighter.axeAngle) * axeDistance;
      if (Math.hypot(axeX - opponent.x, axeY - opponent.y) < opponent.radius + 18) {
        if (fighter.axeDamageUntil > match.elapsed) continue;
        fighter.axeDamageUntil = match.elapsed + 650;
        const beforeSpeed = Math.hypot(fighter.vx, fighter.vy);
        fighter.vx = -fighter.vx;
        fighter.vy = -fighter.vy;
        fighter.axeSpinDirection *= -1;
        normalizeVelocityMagnitude(fighter, beforeSpeed);
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
      for (const gravityFighter of [match.left, match.right]) {
        if (gravityFighter.ball.id !== "gravity" || gravityFighter.gravityUntil <= match.elapsed) continue;
        const dx = gravityFighter.x - projectile.x;
        const dy = gravityFighter.y - projectile.y;
        const distance = Math.max(40, Math.hypot(dx, dy));
        projectile.vx += (dx / distance) * 80 * delta;
        projectile.vy += (dy / distance) * 80 * delta;
      }
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
    const colorByType = {
      laser: "#75aaff", fire: "#ff8a4c", vines: "#77b86d", seed: "#d6b85c",
      multishots: "#e9a8ff", electric: "#75eaff", multiplier: "#f6ed78",
      gravity: "#9b8cff", mirror: "#dffcff", time: "#d69cff", magnet: "#ff789f",
      ice: "#9cecff", shield: "#f1df78", shadow: "#9c84c7", bomb: "#ff6a4d",
    };
    ctx.fillStyle = colorByType[projectile.projectileType] || (projectile.owner === "left" ? "#dffaff" : "#ead8ff");
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
  } else if (BALL_DETAILS[fighter.ball.id]) {
    const palette = {
      laser: ["#d9efff", "#79a8d8", "#4d72c4", "#263f73", "#17284e"],
      fire: ["#ffe1ba", "#ff9a54", "#b85b32", "#7a3528", "#44231e"],
      vines: ["#d8efc6", "#86bd73", "#507e4a", "#355d38", "#243e2b"],
      seed: ["#f3e5a8", "#d1bc67", "#9b8a45", "#6f6034", "#493e27"],
      multishots: ["#f1d7ff", "#b77fd1", "#8a57a8", "#5d3c75", "#3a294c"],
      electric: ["#dcfbff", "#82dbe8", "#46a9bb", "#367d8b", "#254b58"],
      multiplier: ["#fff7b5", "#e2d36b", "#b19c3e", "#7d6e35", "#4c4628"],
      gravity: ["#d9d2ff", "#9a8ed0", "#685ba8", "#4a4077", "#302d4e"],
      mirror: ["#efffff", "#afd7da", "#79a7ae", "#55777e", "#3a5358"],
      time: ["#eadcff", "#a78bd2", "#7d5ba8", "#5a4477", "#382e50"],
      magnet: ["#ffd7e4", "#bd7a95", "#9a5570", "#71404f", "#472b35"],
      ice: ["#efffff", "#a6dce5", "#70aeb9", "#4d7d87", "#34545b"],
      shield: ["#f4ecc2", "#c1b879", "#9a8c58", "#70643e", "#49432b"],
      shadow: ["#d9d4ef", "#8177a1", "#514b6f", "#3d3657", "#29253b"],
      bomb: ["#ffd1b5", "#c96d53", "#a84d3d", "#78372f", "#4b2824"],
    }[fighter.ball.id];
    if (palette) {
      base.addColorStop(0, palette[0]);
      base.addColorStop(0.12, palette[1]);
      base.addColorStop(0.48, palette[2]);
      base.addColorStop(0.82, palette[3]);
      base.addColorStop(1, palette[4]);
    }
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

  if (!["dagger", "spikes", "axe"].includes(fighter.ball.id) && BALL_DETAILS[fighter.ball.id]) {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(0, 0, fighter.radius - 12, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.38)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#effaff";
    ctx.font = "900 28px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fighter.ball.name.charAt(0), 0, 1);
  }

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
    ctx.lineTo(118, 0);
    ctx.stroke();
    ctx.translate(118, 0);
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
    attack: "15 axe",
    health: "230",
    ultimate: "8 sec",
  },
  laser: { name:"Laser Ball", role:"Beam specialist", description:"Fires tight piercing laser shots and an expanding Laser Net.", attack:"12 beam", health:"190", ultimate:"12 sec" },
  fire: { name:"Fire Ball", role:"Area attacker", description:"Throws ember shots and launches an Inferno Ring.", attack:"9 fire", health:"210", ultimate:"10 sec" },
  vines: { name:"Vines Ball", role:"Control attacker", description:"Launches snaring vine shots and deploys a vine net.", attack:"7 vine", health:"220", ultimate:"10 sec" },
  seed: { name:"Seed Bomb Ball", role:"Explosive thrower", description:"Drops timed explosive seeds and a clustered Seedstorm.", attack:"12 seed", health:"200", ultimate:"11 sec" },
  multishots: { name:"Multishots Ball", role:"Volley attacker", description:"Fires predictable fan shots and a dense Triple Torrent.", attack:"5 × 5", health:"180", ultimate:"10 sec" },
  electric: { name:"Electric Ball", role:"Arc specialist", description:"Launches arcing shock shots and a radial Storm Grid.", attack:"10 arc", health:"195", ultimate:"9 sec" },
  multiplier: { name:"Multiplier Ball", role:"Projectile amplifier", description:"Duplicates attacks and overdrives every active shot.", attack:"6 ×", health:"210", ultimate:"10 sec" },
  gravity: { name:"Gravity Ball", role:"Control specialist", description:"Bends projectiles inward and creates a Gravity Vortex.", attack:"8 pull", health:"215", ultimate:"10 sec" },
  mirror: { name:"Mirror Ball", role:"Counter attacker", description:"Reflects incoming shots and fires a Reflection Pulse.", attack:"8 mirror", health:"205", ultimate:"10 sec" },
  time: { name:"Time Ball", role:"Arena controller", description:"Slows the field and freezes the enemy during Time Freeze.", attack:"9 time", health:"190", ultimate:"10 sec" },
  magnet: { name:"Magnet Ball", role:"Powerup collector", description:"Pulls nearby powerups and attracts every powerup for its ultimate.", attack:"7 pull", health:"220", ultimate:"10 sec" },
  ice: { name:"Ice Ball", role:"Slow specialist", description:"Leaves frost effects and casts a widening Frost Ring.", attack:"8 ice", health:"210", ultimate:"10 sec" },
  shield: { name:"Shield Ball", role:"Defensive bruiser", description:"Uses contact attacks and rotating shield shells.", attack:"11 touch", health:"260", ultimate:"10 sec" },
  shadow: { name:"Shadow Ball", role:"Position trickster", description:"Uses rapid shots and swaps with the enemy using Shadow Swap.", attack:"7 shadow", health:"200", ultimate:"10 sec" },
  bomb: { name:"Bomb Ball", role:"Blast attacker", description:"Launches blast shots and detonates a delayed Blast Ring.", attack:"12 blast", health:"210", ultimate:"10 sec" },
};

function showSideDetails(side, ballId) {
  const details = BALL_DETAILS[ballId];
  if (!details) return;
  const prefix = side === "left" ? "left" : "right";
  const role = document.querySelector(`#${prefix}DetailRole`);
  const name = document.querySelector(`#${prefix}DetailName`);
  const description = document.querySelector(`#${prefix}DetailDescription`);
  if (role) role.textContent = details.role;
  if (name) name.textContent = details.name;
  if (description) description.textContent = details.description;
  const detailOrb = document.querySelector(`#${prefix}DetailBall`);
  if (detailOrb) {
    const orbClass = ballId === "spikes"
      ? "spikes-ball"
      : ballId === "axe"
        ? "axe-ball"
        : `${ballId}-ball`;
    detailOrb.className = `detail-orb ${orbClass}`;
    detailOrb.innerHTML = ballId === "spikes"
      ? '<span class="detail-spike">◆</span>'
      : ballId === "axe"
        ? '<span class="detail-spike">⚒</span>'
        : `<span class="detail-letter">${BALL_DETAILS[ballId].name.charAt(0)}</span>`;
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
