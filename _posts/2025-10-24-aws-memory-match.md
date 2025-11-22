---
title: "AWS Memory Match: A Card Game for Cloud Masochists"
date: 2025-10-24
categories: games aws
published: true
last_updated: 2025-10-24
---

Remember that time you confidently told your boss you knew the difference between ECS and EKS? Yeah, me neither. Let's fix that with a memory card game, because apparently, we need *yet another* way to procrastinate while pretending to learn AWS.

Built with Claude Code because manually creating 200+ AWS service cards would be a cry for help.

## The Game

AWS has approximately 87 billion services (citation needed), and half their icons look like the same orange square. This game will help you remember which orange square is which. Probably.

<div id="game-container">
  <div id="game-controls">
    <div class="control-row">
      <select id="difficulty">
        <option value="easy">Easy (8 cards)</option>
        <option value="medium">Medium (16 cards)</option>
        <option value="hard">Hard (24 cards)</option>
        <option value="expert">Expert (32 cards)</option>
      </select>
      <button id="new-game" class="btn">New Game</button>
      <button id="dark-mode-toggle" class="btn">🌙 Dark Mode</button>
    </div>
    <div class="stats-row">
      <span id="moves">Moves: 0</span>
      <span id="timer">Time: 0s</span>
      <span id="best-time">Best: --</span>
    </div>
  </div>

  <canvas id="particles-canvas"></canvas>
  <div id="game-board"></div>

  <div id="achievements">
    <h3>Achievements</h3>
    <div id="achievement-list"></div>
  </div>
</div>

<style>
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #222222;
  --text-secondary: #666666;
  --border-color: #dddddd;
  --card-bg: #ffffff;
  --card-back: linear-gradient(135deg, #ff9900 0%, #ff6b00 100%);
  --shadow: rgba(0, 0, 0, 0.1);
  --success: #00aa00;
  --error: #dd0000;
}

.dark-mode {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #404040;
  --card-bg: #2d2d2d;
  --shadow: rgba(0, 0, 0, 0.5);
}

#game-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow);
  position: relative;
  color: var(--text-primary);
}

#game-controls {
  margin-bottom: 2rem;
}

.control-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.stats-row {
  display: flex;
  gap: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #ff9900;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: #ff6b00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow);
}

#difficulty {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
}

#particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

#game-board {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
  perspective: 1000px;
}

.card {
  aspect-ratio: 1;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover:not(.flipped):not(.matched) {
  transform: scale(1.05);
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped .card-inner,
.card.matched .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  box-shadow: 0 4px 8px var(--shadow);
}

.card-back {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.card-back img {
  width: 80%;
  height: auto;
  max-height: 80%;
  object-fit: contain;
}

.card-front {
  background: var(--card-bg);
  color: var(--text-primary);
  transform: rotateY(180deg);
  border: 2px solid var(--border-color);
  flex-direction: column;
  gap: 0.5rem;
}

.card-icon-img {
  width: 70%;
  height: auto;
  max-height: 60%;
  object-fit: contain;
}

.card-name {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
}

.card.matched {
  opacity: 0.6;
}

#achievements {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

#achievements h3 {
  margin-top: 0;
  color: var(--text-primary);
}

#achievement-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.achievement {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 0.9rem;
  border: 2px solid var(--border-color);
}

.achievement.unlocked {
  background: var(--success);
  color: white;
  border-color: var(--success);
}

@media (max-width: 768px) {
  #game-container {
    padding: 1rem;
  }

  .control-row {
    flex-direction: column;
  }

  .card-icon-img {
    width: 60%;
    max-height: 50%;
  }

  .card-name {
    font-size: 0.65rem;
  }
}
</style>

<script>
// AWS Services database with icon URLs from GitHub
const ICON_BASE = 'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v20.0/dist';

const AWS_SERVICES = {
  easy: [
    { id: 's3', name: 'S3', category: 'Storage', icon: `${ICON_BASE}/Storage/SimpleStorageService.png` },
    { id: 'ec2', name: 'EC2', category: 'Compute', icon: `${ICON_BASE}/Compute/EC2.png` },
    { id: 'lambda', name: 'Lambda', category: 'Compute', icon: `${ICON_BASE}/Compute/Lambda.png` },
    { id: 'rds', name: 'RDS', category: 'Database', icon: `${ICON_BASE}/Database/RDS.png` },
    { id: 'dynamodb', name: 'DynamoDB', category: 'Database', icon: `${ICON_BASE}/Database/DynamoDB.png` },
    { id: 'cloudfront', name: 'CloudFront', category: 'Network', icon: `${ICON_BASE}/NetworkingContentDelivery/CloudFront.png` },
    { id: 'iam', name: 'IAM', category: 'Security', icon: `${ICON_BASE}/SecurityIdentityCompliance/IdentityandAccessManagement.png` },
    { id: 'vpc', name: 'VPC', category: 'Network', icon: `${ICON_BASE}/NetworkingContentDelivery/VPCVirtualprivatecloudVPC.png` }
  ],
  medium: [
    { id: 'sqs', name: 'SQS', category: 'Integration', icon: `${ICON_BASE}/ApplicationIntegration/SimpleQueueService.png` },
    { id: 'sns', name: 'SNS', category: 'Integration', icon: `${ICON_BASE}/ApplicationIntegration/SimpleNotificationService.png` },
    { id: 'kinesis', name: 'Kinesis', category: 'Analytics', icon: `${ICON_BASE}/Analytics/Kinesis.png` },
    { id: 'ecs', name: 'ECS', category: 'Compute', icon: `${ICON_BASE}/Containers/ElasticContainerService.png` },
    { id: 'route53', name: 'Route 53', category: 'Network', icon: `${ICON_BASE}/NetworkingContentDelivery/Route53.png` },
    { id: 'cloudwatch', name: 'CloudWatch', category: 'Management', icon: `${ICON_BASE}/ManagementGovernance/CloudWatch.png` },
    { id: 'eks', name: 'EKS', category: 'Compute', icon: `${ICON_BASE}/Containers/ElasticKubernetesService.png` },
    { id: 'elasticache', name: 'ElastiCache', category: 'Database', icon: `${ICON_BASE}/Database/ElastiCache.png` }
  ],
  hard: [
    { id: 'glue', name: 'Glue', category: 'Analytics', icon: `${ICON_BASE}/Analytics/Glue.png` },
    { id: 'athena', name: 'Athena', category: 'Analytics', icon: `${ICON_BASE}/Analytics/Athena.png` },
    { id: 'sagemaker', name: 'SageMaker', category: 'ML', icon: `${ICON_BASE}/ArtificialIntelligence/SageMakerAI.png` },
    { id: 'stepfunctions', name: 'Step Functions', category: 'Integration', icon: `${ICON_BASE}/ApplicationIntegration/StepFunctions.png` },
    { id: 'guardduty', name: 'GuardDuty', category: 'Security', icon: `${ICON_BASE}/SecurityIdentityCompliance/GuardDuty.png` },
    { id: 'macie', name: 'Macie', category: 'Security', icon: `${ICON_BASE}/SecurityIdentityCompliance/Macie.png` },
    { id: 'appsync', name: 'AppSync', category: 'Mobile', icon: `${ICON_BASE}/ApplicationIntegration/AppSync.png` },
    { id: 'eventbridge', name: 'EventBridge', category: 'Integration', icon: `${ICON_BASE}/ApplicationIntegration/EventBridge.png` }
  ],
  expert: [
    { id: 'iotcore', name: 'IoT Core', category: 'IoT', icon: `${ICON_BASE}/InternetOfThings/IoTCore.png` },
    { id: 'robomaker', name: 'RoboMaker', category: 'Robotics', icon: `${ICON_BASE}/Robotics/RoboMaker.png` },
    { id: 'groundstation', name: 'Ground Station', category: 'Satellite', icon: `${ICON_BASE}/Satellite/GroundStation.png` },
    { id: 'braket', name: 'Braket', category: 'Quantum', icon: `${ICON_BASE}/QuantumTechnologies/Braket.png` },
    { id: 'timestream', name: 'Timestream', category: 'Database', icon: `${ICON_BASE}/Database/Timestream.png` },
    { id: 'iotcoffeepot', name: 'IoT Button', category: 'IoT', icon: `${ICON_BASE}/InternetOfThings/IoTButton.png` },
    { id: 'deeplens', name: 'DeepLens', category: 'ML', icon: `${ICON_BASE}/ArtificialIntelligence/DeepLens.png` },
    { id: 'sumerian', name: 'Sumerian', category: 'AR/VR', icon: `${ICON_BASE}/ARVR/Sumerian.png` }
  ]
};

// Game state
let gameState = {
  difficulty: 'easy',
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  startTime: null,
  timerInterval: null,
  gameActive: false
};

// Audio context for sound effects
let audioContext;
let sounds = {};

// Particle system
let particles = [];

// Achievements
const ACHIEVEMENTS = [
  { id: 'first-win', name: 'First Match', description: 'Complete your first game', unlocked: false },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete Easy in under 30 seconds', unlocked: false },
  { id: 'perfect-memory', name: 'Perfect Memory', description: 'Complete Medium with minimum moves', unlocked: false },
  { id: 'cloud-expert', name: 'Cloud Expert', description: 'Complete Hard difficulty', unlocked: false },
  { id: 'aws-master', name: 'AWS Master', description: 'Complete Expert difficulty', unlocked: false },
  { id: 'no-mistakes', name: 'No Mistakes', description: 'Complete any game without a mismatch', unlocked: false }
];

// Initialize audio context
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Generate sound effects
function playSound(type) {
  if (!audioContext) initAudio();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const now = audioContext.currentTime;

  switch (type) {
    case 'flip':
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    case 'match':
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;
    case 'mismatch':
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
    case 'win':
      // Victory fanfare
      [600, 700, 800, 1000].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
      break;
  }
}

// Particle effects
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.life = 1.0;
    this.decay = 0.02;
    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    this.size = Math.random() * 5 + 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life -= this.decay;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createParticles(x, y, count = 30) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
  }
}

function animateParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => {
    const alive = p.update();
    if (alive) p.draw(ctx);
    return alive;
  });

  requestAnimationFrame(animateParticles);
}

// Initialize game
function initGame() {
  const difficulty = document.getElementById('difficulty').value;
  gameState.difficulty = difficulty;

  const cardCounts = { easy: 8, medium: 16, hard: 24, expert: 32 };
  const numPairs = cardCounts[difficulty] / 2;

  // Select services for this difficulty
  let services = [...AWS_SERVICES.easy];
  if (difficulty !== 'easy') services = services.concat(AWS_SERVICES.medium);
  if (difficulty === 'hard' || difficulty === 'expert') services = services.concat(AWS_SERVICES.hard);
  if (difficulty === 'expert') services = services.concat(AWS_SERVICES.expert);

  // Shuffle and pick pairs
  services.sort(() => Math.random() - 0.5);
  const selectedServices = services.slice(0, numPairs);

  // Create pairs
  gameState.cards = [];
  selectedServices.forEach((service, i) => {
    gameState.cards.push({ ...service, pairId: i, uniqueId: `${i}-a` });
    gameState.cards.push({ ...service, pairId: i, uniqueId: `${i}-b` });
  });

  // Shuffle cards
  gameState.cards.sort(() => Math.random() - 0.5);

  // Reset state
  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.moves = 0;
  gameState.startTime = Date.now();
  gameState.gameActive = true;

  // Start timer
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(updateTimer, 100);

  renderBoard();
  updateStats();
  loadBestTime();
}

function renderBoard() {
  const board = document.getElementById('game-board');
  const gridSizes = { easy: 4, medium: 4, hard: 6, expert: 8 };
  const cols = gridSizes[gameState.difficulty];

  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.innerHTML = '';

  gameState.cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.uniqueId = card.uniqueId;
    cardEl.dataset.pairId = card.pairId;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">
          <img src="https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/refs/heads/main/source/unofficial/AWS-Architecture-Icons_SVG_20200430/SVG%20Light/_Group%20Icons/AWS-Cloud-alt_light-bg.svg" alt="AWS Cloud" />
        </div>
        <div class="card-face card-front">
          <img src="${card.icon}" alt="${card.name}" class="card-icon-img" />
          <div class="card-name">${card.name}</div>
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => handleCardClick(cardEl, card));
    board.appendChild(cardEl);
  });
}

function handleCardClick(cardEl, card) {
  if (!gameState.gameActive) return;
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
  if (gameState.flippedCards.length >= 2) return;

  // Flip card
  cardEl.classList.add('flipped');
  gameState.flippedCards.push({ el: cardEl, card });
  playSound('flip');

  if (gameState.flippedCards.length === 2) {
    gameState.moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = gameState.flippedCards;

  if (first.card.pairId === second.card.pairId) {
    // Match!
    playSound('match');
    first.el.classList.add('matched');
    second.el.classList.add('matched');

    // Particle effect
    const rect = first.el.getBoundingClientRect();
    const canvas = document.getElementById('particles-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    createParticles(
      rect.left + rect.width / 2 - canvasRect.left,
      rect.top + rect.height / 2 - canvasRect.top
    );

    gameState.matchedPairs++;
    gameState.flippedCards = [];

    // Check win
    if (gameState.matchedPairs === gameState.cards.length / 2) {
      setTimeout(handleWin, 500);
    }
  } else {
    // No match
    playSound('mismatch');
    setTimeout(() => {
      first.el.classList.remove('flipped');
      second.el.classList.remove('flipped');
      gameState.flippedCards = [];
    }, 1000);
  }
}

function handleWin() {
  gameState.gameActive = false;
  clearInterval(gameState.timerInterval);
  playSound('win');

  const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);

  // Particle celebration
  const canvas = document.getElementById('particles-canvas');
  const rect = canvas.getBoundingClientRect();
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      createParticles(
        Math.random() * rect.width,
        Math.random() * rect.height / 2,
        10
      );
    }, i * 20);
  }

  // Save best time
  saveBestTime(elapsed);

  // Check achievements
  checkAchievements(elapsed);

  setTimeout(() => {
    alert(`🎉 You won!\n\nTime: ${elapsed}s\nMoves: ${gameState.moves}`);
  }, 500);
}

function updateTimer() {
  if (!gameState.startTime) return;
  const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
  document.getElementById('timer').textContent = `Time: ${elapsed}s`;
}

function updateStats() {
  document.getElementById('moves').textContent = `Moves: ${gameState.moves}`;
}

function saveBestTime(time) {
  const key = `aws-match-best-${gameState.difficulty}`;
  const current = localStorage.getItem(key);
  if (!current || time < parseInt(current)) {
    localStorage.setItem(key, time);
    loadBestTime();
  }
}

function loadBestTime() {
  const key = `aws-match-best-${gameState.difficulty}`;
  const best = localStorage.getItem(key);
  document.getElementById('best-time').textContent = best ? `Best: ${best}s` : 'Best: --';
}

function checkAchievements(elapsed) {
  const minMoves = { easy: 8, medium: 16, hard: 24, expert: 32 };

  // First win
  if (!ACHIEVEMENTS[0].unlocked) {
    unlockAchievement(0);
  }

  // Speed demon (Easy < 30s)
  if (gameState.difficulty === 'easy' && elapsed < 30) {
    unlockAchievement(1);
  }

  // Perfect memory (Medium with minimum moves)
  if (gameState.difficulty === 'medium' && gameState.moves === minMoves.medium) {
    unlockAchievement(2);
  }

  // Cloud expert (Hard complete)
  if (gameState.difficulty === 'hard') {
    unlockAchievement(3);
  }

  // AWS master (Expert complete)
  if (gameState.difficulty === 'expert') {
    unlockAchievement(4);
  }

  renderAchievements();
}

function unlockAchievement(index) {
  ACHIEVEMENTS[index].unlocked = true;
  const key = `aws-match-achievement-${ACHIEVEMENTS[index].id}`;
  localStorage.setItem(key, 'true');
}

function loadAchievements() {
  ACHIEVEMENTS.forEach((achievement, i) => {
    const key = `aws-match-achievement-${achievement.id}`;
    if (localStorage.getItem(key) === 'true') {
      ACHIEVEMENTS[i].unlocked = true;
    }
  });
  renderAchievements();
}

function renderAchievements() {
  const list = document.getElementById('achievement-list');
  list.innerHTML = ACHIEVEMENTS.map(a =>
    `<div class="achievement ${a.unlocked ? 'unlocked' : ''}" title="${a.description}">
      ${a.unlocked ? '🏆' : '🔒'} ${a.name}
    </div>`
  ).join('');
}

// Dark mode
function toggleDarkMode() {
  document.getElementById('game-container').classList.toggle('dark-mode');
  const isDark = document.getElementById('game-container').classList.contains('dark-mode');
  localStorage.setItem('aws-match-dark-mode', isDark);
  document.getElementById('dark-mode-toggle').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function loadDarkMode() {
  const isDark = localStorage.getItem('aws-match-dark-mode') === 'true';
  if (isDark) {
    document.getElementById('game-container').classList.add('dark-mode');
    document.getElementById('dark-mode-toggle').textContent = '☀️ Light Mode';
  }
}

// Event listeners
document.getElementById('new-game').addEventListener('click', initGame);
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
document.getElementById('difficulty').addEventListener('change', () => {
  loadBestTime();
});

// Initialize
loadDarkMode();
loadAchievements();
animateParticles();
initGame();
</script>


Another vibe coded game. 

Remember: Matching AWS service icons is easier than explaining to your manager why the S3 bill is $3000 this month.

Now go forth and memorize those orange squares. Your on-call rotation depends on it.

---

*Built with Claude Code because manually coding 32 card flip animations is not covered by my health insurance.*
