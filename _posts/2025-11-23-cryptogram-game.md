---
title: "Cryptogram: Because Solving Puzzles is Better Than Debugging Production"
date: 2025-11-23
tags: [javascript, games, puzzles, cryptography]
excerpt: Substitution ciphers, tech quotes, and an unhealthy amount of profanity. A browser game for people who think crosswords are for cowards.
---

Cryptograms are puzzles where every letter is replaced with another letter. You solve it by figuring out the substitution pattern. It's like debugging, except there's actually a correct answer at the end.

This game has tech quotes. Programming wisdom. Famous rants. And a Rated R category for when you need to remember that yes, other people hate JavaScript as much as you do.

## The Game

Crack the code. Click letters to map them. Timer's running. Good luck.

**Features:** 🎆 Particle effects • 🔊 Sound effects • 🌙 Dark mode • 💡 Hints • 🏆 Achievements • 📊 Stats • 🤬 Rated R mode

<div id="game-wrapper" style="padding: 40px 20px; border-radius: 20px; margin: 20px 0; box-shadow: 0 20px 60px rgba(0,0,0,0.3); transition: background 0.5s ease; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
body.dark-mode #game-wrapper {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
}

#cryptogram-game {
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Space Grotesk', sans-serif;
  position: relative;
}

#particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
}

.game-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 20px;
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-color: white;
}

.category-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 8px 16px;
  font-size: 0.85em;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.category-btn.active {
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border-color: white;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

#puzzle-container {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 16px;
  padding: 30px;
  margin: 30px 0;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  min-height: 200px;
}

#cipher-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.4em;
  line-height: 2.5em;
  letter-spacing: 0.05em;
  word-wrap: break-word;
  text-align: center;
  margin-bottom: 20px;
}

.cipher-letter {
  display: inline-block;
  text-align: center;
  margin: 0 2px;
  position: relative;
  vertical-align: top;
}

.cipher-char {
  display: block;
  color: #667eea;
  font-weight: 700;
  font-size: 1.2em;
  user-select: none;
}

.cipher-input {
  display: block;
  width: 1.5em;
  height: 1.8em;
  border: none;
  border-bottom: 3px solid #667eea;
  background: transparent;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  margin-top: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cipher-input:focus {
  outline: none;
  border-bottom-color: #764ba2;
  background: rgba(102, 126, 234, 0.1);
}

.cipher-input.correct {
  color: #10b981;
  border-bottom-color: #10b981;
  animation: correctPulse 0.5s ease-out;
}

.cipher-input.incorrect {
  color: #ef4444;
  border-bottom-color: #ef4444;
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.cipher-space {
  display: inline-block;
  width: 0.5em;
}

.cipher-punct {
  display: inline-block;
  font-size: 1.2em;
  color: #333;
  font-weight: 700;
  margin: 0 2px;
}

#keyboard-helper {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.key-mapping {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 45px;
}

.key-cipher {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1em;
  margin-bottom: 4px;
}

.key-arrow {
  color: #999;
  font-size: 0.8em;
}

.key-plain {
  font-weight: 700;
  color: #333;
  font-size: 1em;
  margin-top: 4px;
}

.key-mapping.complete .key-plain {
  color: #10b981;
}

#stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin: 30px 0;
}

.stat {
  padding: 18px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat:hover {
  transform: translateY(-4px);
}

.stat > div:first-child {
  font-size: 0.85em;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat > div:last-child {
  font-size: 1.8em;
  font-weight: 700;
  color: #333;
  font-family: 'JetBrains Mono', monospace;
}

#message {
  font-size: 1.6em;
  margin: 20px 0;
  min-height: 50px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  text-align: center;
}

#message.win {
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

#achievement-container {
  margin: 20px 0;
  min-height: 40px;
  text-align: center;
}

.achievement {
  display: inline-block;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.6);
  color: #ffd700;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  animation: achievementPop 0.6s ease-out;
  margin: 5px;
}

@keyframes achievementPop {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

#new-game-btn, #hint-btn, #clear-btn, #freq-btn {
  padding: 14px 32px;
  font-size: 1.1em;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

#new-game-btn {
  background: linear-gradient(145deg, #10b981, #059669);
  color: white;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

#new-game-btn:hover {
  background: linear-gradient(145deg, #059669, #047857);
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
}

#hint-btn {
  background: linear-gradient(145deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
}

#hint-btn:hover:not(:disabled) {
  background: linear-gradient(145deg, #d97706, #b45309);
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4);
}

#hint-btn:disabled {
  background: #999;
  cursor: not-allowed;
  opacity: 0.5;
}

#clear-btn {
  background: linear-gradient(145deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

#clear-btn:hover {
  background: linear-gradient(145deg, #dc2626, #b91c1c);
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(239, 68, 68, 0.4);
}

#freq-btn {
  background: linear-gradient(145deg, #8b5cf6, #7c3aed);
  color: white;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

#freq-btn:hover {
  background: linear-gradient(145deg, #7c3aed, #6d28d9);
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4);
}

#frequency-chart {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: none;
}

#frequency-chart.visible {
  display: block;
}

.freq-bar {
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
}

.freq-letter {
  font-weight: 700;
  color: #667eea;
  width: 30px;
}

.freq-graph {
  flex: 1;
  height: 20px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  margin: 0 10px;
  transition: width 0.3s ease;
}

.freq-count {
  color: #666;
  width: 40px;
  text-align: right;
}

@media (max-width: 768px) {
  #cipher-text {
    font-size: 1.1em;
    line-height: 2.2em;
  }

  .cipher-input {
    width: 1.2em;
    height: 1.5em;
    font-size: 0.8em;
  }

  #puzzle-container {
    padding: 20px 10px;
  }

  .button-group button {
    padding: 12px 24px;
    font-size: 0.9em;
  }
}
</style>

<canvas id="particles-canvas"></canvas>

<div id="cryptogram-game">
  <div class="game-controls">
    <button class="control-btn" id="dark-mode-btn">🌙 Dark Mode</button>
    <button class="control-btn" id="sound-btn">🔊 Sound: ON</button>
  </div>

  <div class="category-selector">
    <button class="category-btn active" data-category="tech">Tech Wisdom</button>
    <button class="category-btn" data-category="rants">Famous Rants</button>
    <button class="category-btn" data-category="bugs">Legendary Bugs</button>
    <button class="category-btn" data-category="profanity">Rated R 🔥</button>
  </div>

  <div id="puzzle-container">
    <div id="cipher-text"></div>
    <div id="keyboard-helper"></div>
    <div id="frequency-chart"></div>
  </div>

  <div id="message"></div>
  <div id="achievement-container"></div>

  <div id="stats">
    <div class="stat">
      <div>Time</div>
      <div id="timer">0s</div>
    </div>
    <div class="stat">
      <div>Solved</div>
      <div id="solved">0</div>
    </div>
    <div class="stat">
      <div>Hints Used</div>
      <div id="hints-used">0</div>
    </div>
    <div class="stat">
      <div>Best Time</div>
      <div id="best-time">--</div>
    </div>
  </div>

  <div class="button-group">
    <button id="hint-btn">💡 Hint (3 left)</button>
    <button id="freq-btn">📊 Frequency</button>
    <button id="clear-btn">🗑️ Clear</button>
    <button id="new-game-btn">New Puzzle</button>
  </div>
</div>

<script>
// Quote database
const QUOTES = {
  tech: [
    "Talk is cheap. Show me the code.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "First, solve the problem. Then, write the code.",
    "The best error message is the one that never shows up.",
    "Code is like humor. When you have to explain it, it's bad.",
    "Programming isn't about what you know; it's about what you can figure out.",
    "Make it work, make it right, make it fast.",
    "There are only two hard things in computer science: cache invalidation and naming things.",
    "A language that doesn't affect the way you think about programming is not worth knowing.",
    "Simplicity is the soul of efficiency.",
    "The most dangerous phrase in the language is: We've always done it this way.",
    "Debugging is twice as hard as writing the code in the first place.",
    "Deleted code is debugged code.",
    "Documentation is a love letter that you write to your future self.",
    "Measuring programming progress by lines of code is like measuring aircraft building progress by weight."
  ],
  rants: [
    "XML is a classic example of fixing a problem you don't have.",
    "I think Microsoft named .NET so it wouldn't show up in a Unix directory listing.",
    "PHP is a minor evil perpetrated and created by incompetent amateurs, whereas Perl is a great and insidious evil perpetrated by skilled but perverted professionals.",
    "Java is to JavaScript what Car is to Carpet.",
    "There are two ways to write error-free programs; only the third one works.",
    "C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do it blows your whole leg off.",
    "In theory, theory and practice are the same. In practice, they're not.",
    "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
    "Before software can be reusable it first has to be usable.",
    "Hofstadter's Law: It always takes longer than you expect, even when you take into account Hofstadter's Law."
  ],
  bugs: [
    "It's not a bug, it's a feature.",
    "Works on my machine.",
    "That's weird, it worked yesterday.",
    "I didn't change anything.",
    "It must be a hardware problem.",
    "Somebody must have changed my code.",
    "It worked in the test environment.",
    "How is that possible?",
    "Where were you when the program blew up?",
    "I can't test everything.",
    "This will be fixed in the next release.",
    "It's just a warning, not an error.",
    "The user is doing it wrong.",
    "That error is impossible.",
    "Why would anyone ever do that?"
  ],
  profanity: [
    "JavaScript was a fucking mistake and we all know it but we're too deep to quit now.",
    "Every goddamn PHP tutorial on the internet teaches SQL injection as best practice.",
    "CSS is black magic horseshit that makes no fucking sense and anyone who says otherwise is lying.",
    "RegEx is what happens when God decides to punish programmers for their sins.",
    "Kubernetes is fucking overkill for ninety-nine percent of what people use it for.",
    "YAML is just fucking JSON for people who hate happiness and clarity.",
    "Docker is great until you have to debug some bullshit networking issue at three in the morning.",
    "Blockchain is a solution desperately searching for a problem that doesn't exist.",
    "Microservices are distributed monoliths with extra steps and network latency.",
    "Agile is just waterfall with more fucking meetings.",
    "JavaScript frameworks have a half-life shorter than a fruit fly's attention span.",
    "Git rebase is black magic that will fuck up your repository if you breathe wrong.",
    "OAuth is security theater designed by sadists who hate developers.",
    "Every time you use eval(), a senior developer has a fucking aneurysm.",
    "MongoDB is what happens when you let webscale buzzwords make architectural decisions.",
    "The cloud is just someone else's computer that costs ten times more than your own server.",
    "REST APIs are theoretical perfection that nobody actually implements correctly.",
    "Node.js proved that JavaScript on the server was technically possible but morally wrong.",
    "Stack Overflow is the only reason half of us still have jobs.",
    "Production is just another test environment that users have access to."
  ]
};

// Particle system
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() * -10) - 5;
    this.gravity = 0.5;
    this.life = 1;
    this.decay = 0.01;
    this.size = Math.random() * 6 + 3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    this.color = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotationSpeed;
    this.life -= this.decay;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 2);
    ctx.restore();
  }
}

// Sound effects
class SoundEffects {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  correct() {
    this.playTone(600, 0.1, 'sine');
  }

  wrong() {
    this.playTone(200, 0.15, 'sawtooth');
  }

  win() {
    [400, 500, 600, 800].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine'), i * 100);
    });
  }
}

// Main game class
class CryptogramGame {
  constructor() {
    this.particlesCanvas = document.getElementById('particles-canvas');
    this.particlesCtx = this.particlesCanvas.getContext('2d');
    this.cipherText = document.getElementById('cipher-text');
    this.keyboardHelper = document.getElementById('keyboard-helper');
    this.frequencyChart = document.getElementById('frequency-chart');
    this.message = document.getElementById('message');
    this.achievementContainer = document.getElementById('achievement-container');
    this.newGameBtn = document.getElementById('new-game-btn');
    this.hintBtn = document.getElementById('hint-btn');
    this.clearBtn = document.getElementById('clear-btn');
    this.freqBtn = document.getElementById('freq-btn');
    this.darkModeBtn = document.getElementById('dark-mode-btn');
    this.soundBtn = document.getElementById('sound-btn');

    this.category = 'tech';
    this.quote = '';
    this.cipher = {};
    this.reverseCipher = {};
    this.userMapping = {};
    this.hintsRemaining = 3;
    this.hintsUsed = 0;
    this.particles = [];
    this.darkMode = false;
    this.sounds = new SoundEffects();
    this.startTime = null;
    this.timerInterval = null;
    this.gameOver = false;

    this.setupParticlesCanvas();
    this.loadStats();
    this.setupEventListeners();
    this.newGame();
    this.animateParticles();
  }

  setupParticlesCanvas() {
    this.particlesCanvas.width = window.innerWidth;
    this.particlesCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.particlesCanvas.width = window.innerWidth;
      this.particlesCanvas.height = window.innerHeight;
    });
  }

  setupEventListeners() {
    this.newGameBtn.addEventListener('click', () => this.newGame());
    this.hintBtn.addEventListener('click', () => this.useHint());
    this.clearBtn.addEventListener('click', () => this.clearAll());
    this.freqBtn.addEventListener('click', () => this.toggleFrequency());
    this.darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
    this.soundBtn.addEventListener('click', () => this.toggleSound());

    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.setCategory(e.target.dataset.category));
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    const wrapper = document.getElementById('game-wrapper');

    if (this.darkMode) {
      wrapper.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
      this.darkModeBtn.textContent = '☀️ Light Mode';
    } else {
      wrapper.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      this.darkModeBtn.textContent = '🌙 Dark Mode';
    }
  }

  toggleSound() {
    const enabled = this.sounds.toggle();
    this.soundBtn.textContent = enabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
  }

  setCategory(category) {
    this.category = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
    this.newGame();
  }

  loadStats() {
    this.stats = {
      solved: parseInt(localStorage.getItem('crypto_solved') || '0'),
      hintsTotal: parseInt(localStorage.getItem('crypto_hints_total') || '0'),
      bestTime: parseInt(localStorage.getItem(`crypto_best_${this.category}`) || '0'),
      perfectSolves: parseInt(localStorage.getItem('crypto_perfect') || '0')
    };
    this.updateStatsDisplay();
  }

  saveStats() {
    localStorage.setItem('crypto_solved', this.stats.solved);
    localStorage.setItem('crypto_hints_total', this.stats.hintsTotal);
    localStorage.setItem(`crypto_best_${this.category}`, this.stats.bestTime);
    localStorage.setItem('crypto_perfect', this.stats.perfectSolves);
  }

  updateStatsDisplay() {
    document.getElementById('solved').textContent = this.stats.solved;
    document.getElementById('hints-used').textContent = this.hintsUsed;
    document.getElementById('best-time').textContent = this.stats.bestTime ? `${this.stats.bestTime}s` : '--';
  }

  generateCipher(text) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffled = [...letters].sort(() => Math.random() - 0.5);

    const cipher = {};
    letters.forEach((letter, i) => {
      cipher[letter] = shuffled[i];
    });

    // Make sure at least some letters are different
    let differentCount = 0;
    letters.forEach(letter => {
      if (cipher[letter] !== letter) differentCount++;
    });

    // If too many letters map to themselves, regenerate
    if (differentCount < letters.length * 0.7) {
      return this.generateCipher(text);
    }

    return cipher;
  }

  newGame() {
    const quotes = QUOTES[this.category];
    this.quote = quotes[Math.floor(Math.random() * quotes.length)].toUpperCase();
    this.cipher = this.generateCipher(this.quote);

    // Create reverse cipher for checking
    this.reverseCipher = {};
    Object.keys(this.cipher).forEach(key => {
      this.reverseCipher[this.cipher[key]] = key;
    });

    this.userMapping = {};
    this.hintsUsed = 0;
    this.hintsRemaining = 3;
    this.gameOver = false;
    this.startTime = Date.now();

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);

    this.message.textContent = '';
    this.message.className = '';
    this.achievementContainer.innerHTML = '';
    this.hintBtn.textContent = `💡 Hint (${this.hintsRemaining} left)`;
    this.hintBtn.disabled = false;
    this.frequencyChart.classList.remove('visible');

    this.renderPuzzle();
    this.renderKeyboard();
    this.updateStatsDisplay();
  }

  renderPuzzle() {
    let html = '';

    for (let i = 0; i < this.quote.length; i++) {
      const char = this.quote[i];

      if (char === ' ') {
        html += '<span class="cipher-space"></span>';
      } else if (!/[A-Z]/.test(char)) {
        html += `<span class="cipher-punct">${char}</span>`;
      } else {
        const cipherChar = this.cipher[char];
        html += `
          <span class="cipher-letter">
            <span class="cipher-char">${cipherChar}</span>
            <input
              type="text"
              maxlength="1"
              class="cipher-input"
              data-cipher="${cipherChar}"
              data-plain="${char}"
              value="${this.userMapping[cipherChar] || ''}"
            />
          </span>
        `;
      }
    }

    this.cipherText.innerHTML = html;

    // Add event listeners to inputs
    document.querySelectorAll('.cipher-input').forEach(input => {
      input.addEventListener('input', (e) => this.handleInput(e));
      input.addEventListener('focus', (e) => this.handleFocus(e));
    });
  }

  handleFocus(e) {
    e.target.select();
  }

  handleInput(e) {
    const input = e.target;
    const value = input.value.toUpperCase();
    const cipherChar = input.dataset.cipher;
    const correctChar = input.dataset.plain;

    if (value === '') {
      delete this.userMapping[cipherChar];
      input.className = 'cipher-input';
      this.updateAllInputs();
      return;
    }

    if (!/[A-Z]/.test(value)) {
      input.value = '';
      return;
    }

    input.value = value;
    this.userMapping[cipherChar] = value;

    // Update all inputs with same cipher character
    this.updateAllInputs();

    // Check if correct
    if (value === correctChar) {
      input.classList.add('correct');
      input.classList.remove('incorrect');
      this.sounds.correct();
    } else {
      input.classList.add('incorrect');
      input.classList.remove('correct');
      this.sounds.wrong();
    }

    this.renderKeyboard();
    this.checkWin();

    // Move to next empty input
    const inputs = Array.from(document.querySelectorAll('.cipher-input'));
    const currentIndex = inputs.indexOf(input);
    const nextInput = inputs.slice(currentIndex + 1).find(i => !i.value);
    if (nextInput) {
      nextInput.focus();
    }
  }

  updateAllInputs() {
    document.querySelectorAll('.cipher-input').forEach(input => {
      const cipherChar = input.dataset.cipher;
      const correctChar = input.dataset.plain;
      const value = this.userMapping[cipherChar] || '';

      if (input.value !== value) {
        input.value = value;

        if (value === correctChar) {
          input.classList.add('correct');
          input.classList.remove('incorrect');
        } else if (value) {
          input.classList.add('incorrect');
          input.classList.remove('correct');
        } else {
          input.className = 'cipher-input';
        }
      }
    });
  }

  renderKeyboard() {
    const usedLetters = new Set(this.quote.match(/[A-Z]/g));
    const mappings = [];

    usedLetters.forEach(letter => {
      const cipherChar = this.cipher[letter];
      const userGuess = this.userMapping[cipherChar] || '?';
      const isComplete = userGuess === letter;

      mappings.push({
        cipher: cipherChar,
        plain: userGuess,
        complete: isComplete
      });
    });

    mappings.sort((a, b) => a.cipher.localeCompare(b.cipher));

    this.keyboardHelper.innerHTML = mappings.map(m => `
      <div class="key-mapping ${m.complete ? 'complete' : ''}">
        <div class="key-cipher">${m.cipher}</div>
        <div class="key-arrow">↓</div>
        <div class="key-plain">${m.plain}</div>
      </div>
    `).join('');
  }

  useHint() {
    if (this.gameOver || this.hintsRemaining === 0) return;

    // Find an incorrect or empty input
    const inputs = Array.from(document.querySelectorAll('.cipher-input'));
    const incorrectInputs = inputs.filter(i => !i.classList.contains('correct'));

    if (incorrectInputs.length === 0) return;

    const hintInput = incorrectInputs[Math.floor(Math.random() * incorrectInputs.length)];
    const correctChar = hintInput.dataset.plain;
    const cipherChar = hintInput.dataset.cipher;

    this.userMapping[cipherChar] = correctChar;
    this.hintsUsed++;
    this.hintsRemaining--;
    this.stats.hintsTotal++;

    this.updateAllInputs();
    this.renderKeyboard();
    this.checkWin();

    this.hintBtn.textContent = `💡 Hint (${this.hintsRemaining} left)`;
    if (this.hintsRemaining === 0) {
      this.hintBtn.disabled = true;
    }

    this.updateStatsDisplay();
  }

  clearAll() {
    if (this.gameOver) return;

    this.userMapping = {};
    this.updateAllInputs();
    this.renderKeyboard();

    const firstInput = document.querySelector('.cipher-input');
    if (firstInput) firstInput.focus();
  }

  toggleFrequency() {
    const chart = this.frequencyChart;

    if (chart.classList.contains('visible')) {
      chart.classList.remove('visible');
      return;
    }

    // Calculate letter frequency
    const letterCounts = {};
    const cipherLetters = this.quote.match(/[A-Z]/g) || [];

    cipherLetters.forEach(letter => {
      const cipherChar = this.cipher[letter];
      letterCounts[cipherChar] = (letterCounts[cipherChar] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(letterCounts));
    const sortedLetters = Object.keys(letterCounts).sort((a, b) => letterCounts[b] - letterCounts[a]);

    chart.innerHTML = '<h4 style="margin-top: 0; color: #667eea;">Letter Frequency</h4>' +
      sortedLetters.map(letter => {
        const count = letterCounts[letter];
        const width = (count / maxCount) * 100;
        return `
          <div class="freq-bar">
            <div class="freq-letter">${letter}</div>
            <div class="freq-graph" style="width: ${width}%"></div>
            <div class="freq-count">${count}</div>
          </div>
        `;
      }).join('');

    chart.classList.add('visible');
  }

  checkWin() {
    const allCorrect = Array.from(document.querySelectorAll('.cipher-input'))
      .every(input => input.classList.contains('correct'));

    if (allCorrect && !this.gameOver) {
      this.handleWin();
    }
  }

  handleWin() {
    this.gameOver = true;
    clearInterval(this.timerInterval);
    this.sounds.win();

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);

    this.message.textContent = '🎉 Solved!';
    this.message.className = 'win';

    this.stats.solved++;

    if (!this.stats.bestTime || elapsed < this.stats.bestTime) {
      this.stats.bestTime = elapsed;
    }

    if (this.hintsUsed === 0) {
      this.stats.perfectSolves++;
      this.showAchievement('🏆 Perfect Solve - No Hints!');
    }

    if (this.stats.solved === 1) {
      this.showAchievement('🎯 First Solve!');
    }

    if (this.stats.solved === 10) {
      this.showAchievement('💯 10 Puzzles Solved!');
    }

    if (elapsed < 30 && this.hintsUsed === 0) {
      this.showAchievement('⚡ Speed Demon - Under 30s!');
    }

    this.saveStats();
    this.updateStatsDisplay();
    this.spawnConfetti();

    // Disable all inputs
    document.querySelectorAll('.cipher-input').forEach(input => {
      input.disabled = true;
    });
  }

  showAchievement(text) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.textContent = text;
    this.achievementContainer.appendChild(achievement);

    setTimeout(() => {
      achievement.style.opacity = '0';
      achievement.style.transition = 'opacity 0.5s';
      setTimeout(() => achievement.remove(), 500);
    }, 3000);
  }

  spawnConfetti() {
    const rect = this.particlesCanvas.getBoundingClientRect();

    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const x = rect.width / 2 + (Math.random() - 0.5) * 200;
        const y = rect.height / 3;
        this.particles.push(new Particle(x, y));
      }, i * 10);
    }
  }

  animateParticles() {
    this.particlesCtx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);

    this.particles = this.particles.filter(particle => {
      const alive = particle.update();
      if (alive) particle.draw(this.particlesCtx);
      return alive;
    });

    requestAnimationFrame(() => this.animateParticles());
  }

  updateTimer() {
    if (!this.startTime || this.gameOver) return;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    document.getElementById('timer').textContent = `${elapsed}s`;
  }
}

// Initialize game
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CryptogramGame());
} else {
  new CryptogramGame();
}
</script>
</div>

## How It Works

**Substitution Cipher:** Every letter gets replaced with another letter. A→K, B→Q, etc. The pattern stays consistent throughout.

**Letter Frequency:** The frequency analysis button shows which encrypted letters appear most often. In English, E, T, A, O, N are the most common. Use this to make educated guesses.

**Hints:** Reveals a random letter. Limited to 3 per puzzle because where's the fun in unlimited hints?

**Auto-Fill:** When you map one letter, it fills in all instances of that letter automatically. Like find-and-replace but for solving puzzles.

## Why Cryptograms

Because they're the perfect balance of logic, pattern recognition, and educated guessing. Also because crosswords are for people who own decorative throw pillows.

They teach you to think about patterns. To question your assumptions. To realize that sometimes "the" is spelled wrong and you've wasted 10 minutes mapping T→X.

Also, the Rated R category exists because sometimes you need to be reminded that other people hate CSS as much as you do.

## The Tech Stack

- **Vanilla JavaScript** - No frameworks died in the making of this game
- **Canvas API** - Particle effects on solve
- **Web Audio API** - Synthesized sound effects
- **localStorage** - Stats persistence
- **CSS Grid** - Responsive layout that actually works
- **Pure CSS animations** - No jQuery slideToggle() bullshit

Same formula as the other games. Self-contained. No dependencies. Works on mobile. Dark mode because it's 2025 and light mode is a war crime.

---

*Built with Claude Code because hand-writing cipher generation algorithms is what Stack Overflow was invented for.*

*The Rated R quotes are real things people say about JavaScript. We're just saying them louder.*

*Thanks to [Daniel](https://sildani.github.io/cryptogrmz/index.html) for the cryptogram inspiration.*
