---
title: I told Claude to build me a browser game. It actually worked.
date: 2025-10-19
tags: [javascript, games, claude, web-development]
excerpt: No frameworks. No APIs. No bullshit. Just vanilla JS, Canvas, and the realization that modern browsers are actually good at stuff.
---

Remember when browser games meant Flash? And then Flash died and we all pretended mobile gaming filled the void?

It didn't. Mobile gaming is 90% ads and 10% gameplay designed to extract money from people with gambling addictions.

But modern browsers? They're actually capable of running real games. HTML5 Canvas, localStorage, responsive design—all the tools are there. No plugins required.

So I asked Claude: "Build me Hangman. Vanilla JS. Make it work."

Then I said: "Make it cooler."

Then I said: "Go wild."

Here's what happened.

## The Game

Play it below. It's Hangman. But not the Hangman you remember.

**Features:** 🎆 Particle effects • 🎯 Difficulty levels • 💡 Hints • 🌙 Dark mode • 🔊 Sound effects • 🏆 Achievements • 📤 Share your wins • 🤬 Potty mouth mode

<div id="game-wrapper" style="padding: 40px 20px; border-radius: 20px; margin: 20px 0; box-shadow: 0 20px 60px rgba(0,0,0,0.3); transition: background 0.5s ease; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
body.dark-mode #game-wrapper {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
}

#hangman-game {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Space Grotesk', sans-serif;
  text-align: center;
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

.difficulty-selector, .category-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.difficulty-btn, .category-btn {
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

.difficulty-btn:hover, .category-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.difficulty-btn.active, .category-btn.active {
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border-color: white;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

#hangman-canvas {
  border: none;
  border-radius: 16px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8);
  display: block;
  margin: 30px auto;
  max-width: 100%;
}

#word-display {
  font-size: 3em;
  letter-spacing: 0.4em;
  margin: 30px 0;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  min-height: 80px;
  font-family: 'JetBrains Mono', monospace;
}

#word-display .letter {
  display: inline-block;
  animation: letterReveal 0.5s ease-out;
}

@keyframes letterReveal {
  from {
    opacity: 0;
    transform: scale(0) rotate(180deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

#keyboard {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 30px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.key {
  width: 48px;
  height: 48px;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.08);
  border-radius: 12px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'JetBrains Mono', monospace;
  color: #667eea;
  position: relative;
}

.key:hover:not(:disabled) {
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.key:active:not(:disabled) {
  transform: translateY(-2px);
}

.key:disabled {
  background: linear-gradient(145deg, #e0e0e0, #d0d0d0);
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}

.key.correct {
  background: linear-gradient(145deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  animation: pop 0.3s ease-out;
}

.key.wrong {
  background: linear-gradient(145deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
  animation: shake 0.3s ease-out;
}

@keyframes pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-8px); }
  80% { transform: translateX(8px); }
}

#message {
  font-size: 1.6em;
  margin: 20px 0;
  min-height: 50px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

#message.win {
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

#message.lose {
  color: #fca5a5;
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

#word-definition {
  font-size: 0.95em;
  color: rgba(255, 255, 255, 0.9);
  margin: 15px 0;
  font-style: italic;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

#stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin: 30px 0;
  font-size: 1em;
}

.stat {
  padding: 18px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-radius: 16px;
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

#achievement-container {
  margin: 20px 0;
  min-height: 40px;
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

#new-game-btn, #hint-btn, #share-btn {
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
  transform: none;
}

#share-btn {
  background: linear-gradient(145deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

#share-btn:hover {
  background: linear-gradient(145deg, #2563eb, #1d4ed8);
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

@media (max-width: 600px) {
  #word-display {
    font-size: 2em;
    letter-spacing: 0.3em;
  }

  .key {
    width: 42px;
    height: 42px;
    font-size: 18px;
  }

  #message {
    font-size: 1.3em;
  }

  #stats {
    gap: 10px;
  }

  .stat {
    padding: 12px;
  }

  .stat > div:last-child {
    font-size: 1.5em;
  }
}
</style>

<canvas id="particles-canvas"></canvas>

<div id="hangman-game">
  <div class="game-controls">
    <button class="control-btn" id="dark-mode-btn">🌙 Dark Mode</button>
    <button class="control-btn" id="sound-btn">🔊 Sound: ON</button>
  </div>

  <div class="difficulty-selector">
    <button class="difficulty-btn active" data-difficulty="easy">Easy</button>
    <button class="difficulty-btn" data-difficulty="medium">Medium</button>
    <button class="difficulty-btn" data-difficulty="hard">Hard</button>
    <button class="difficulty-btn" data-difficulty="expert">Expert</button>
  </div>

  <div class="category-selector">
    <button class="category-btn active" data-category="all">All</button>
    <button class="category-btn" data-category="languages">Languages</button>
    <button class="category-btn" data-category="web">Web Dev</button>
    <button class="category-btn" data-category="cloud">Cloud</button>
    <button class="category-btn" data-category="profanity">Potty Mouth 🤬</button>
  </div>

  <canvas id="hangman-canvas" width="300" height="300"></canvas>

  <div id="word-display"></div>
  <div id="word-definition"></div>

  <div id="keyboard"></div>

  <div id="message"></div>

  <div id="achievement-container"></div>

  <div id="stats">
    <div class="stat">
      <div>Wins</div>
      <div id="wins">0</div>
    </div>
    <div class="stat">
      <div>Losses</div>
      <div id="losses">0</div>
    </div>
    <div class="stat">
      <div>Streak</div>
      <div id="streak">0</div>
    </div>
    <div class="stat">
      <div>Best Streak</div>
      <div id="best-streak">0</div>
    </div>
  </div>

  <div class="button-group">
    <button id="hint-btn">💡 Hint (3 left)</button>
    <button id="new-game-btn">New Game</button>
    <button id="share-btn" style="display: none;">📤 Share</button>
  </div>
</div>

<script>
// Comprehensive word database with definitions and categories
const WORD_DATABASE = {
  languages: {
    easy: [
      { word: 'PYTHON', def: 'High-level programming language known for readability' },
      { word: 'JAVA', def: 'Object-oriented programming language' },
      { word: 'RUBY', def: 'Dynamic, object-oriented scripting language' },
    ],
    medium: [
      { word: 'JAVASCRIPT', def: 'The language of the web' },
      { word: 'TYPESCRIPT', def: 'JavaScript with types' },
      { word: 'KOTLIN', def: 'Modern JVM language' },
    ],
    hard: [
      { word: 'HASKELL', def: 'Purely functional programming language' },
      { word: 'CLOJURE', def: 'Lisp dialect for the JVM' },
    ],
    expert: [
      { word: 'OCAML', def: 'Functional language with ML heritage' },
    ]
  },
  web: {
    easy: [
      { word: 'HTML', def: 'Markup language for web pages' },
      { word: 'CSS', def: 'Stylesheet language for presentation' },
    ],
    medium: [
      { word: 'REACT', def: 'JavaScript library for building UIs' },
      { word: 'WEBPACK', def: 'Module bundler for JavaScript' },
      { word: 'NODEJS', def: 'JavaScript runtime built on V8' },
    ],
    hard: [
      { word: 'GRAPHQL', def: 'Query language for APIs' },
      { word: 'NEXTJS', def: 'React framework for production' },
    ],
    expert: [
      { word: 'WEBASSEMBLY', def: 'Binary instruction format for the web' },
    ]
  },
  cloud: {
    easy: [
      { word: 'AWS', def: 'Amazon Web Services cloud platform' },
      { word: 'AZURE', def: 'Microsoft cloud computing platform' },
    ],
    medium: [
      { word: 'LAMBDA', def: 'Serverless compute service' },
      { word: 'DOCKER', def: 'Container platform' },
      { word: 'TERRAFORM', def: 'Infrastructure as code tool' },
    ],
    hard: [
      { word: 'KUBERNETES', def: 'Container orchestration platform' },
      { word: 'SERVERLESS', def: 'Cloud computing execution model' },
    ],
    expert: [
      { word: 'ISTIO', def: 'Service mesh platform' },
    ]
  },
  all: {
    easy: [
      { word: 'CODE', def: 'Instructions written for computers' },
      { word: 'DATA', def: 'Information processed by computers' },
      { word: 'LOOP', def: 'Repeating sequence of instructions' },
    ],
    medium: [
      { word: 'ALGORITHM', def: 'Step-by-step problem-solving procedure' },
      { word: 'DATABASE', def: 'Organized collection of data' },
      { word: 'COMPILER', def: 'Translates code to machine language' },
      { word: 'RECURSION', def: 'Function that calls itself' },
      { word: 'VARIABLE', def: 'Named storage location in memory' },
    ],
    hard: [
      { word: 'POLYMORPHISM', def: 'Objects taking multiple forms' },
      { word: 'ABSTRACTION', def: 'Hiding complex implementation details' },
      { word: 'ENCRYPTION', def: 'Encoding data for security' },
    ],
    expert: [
      { word: 'MEMOIZATION', def: 'Optimization technique caching results' },
      { word: 'ISOMORPHIC', def: 'Code that runs on client and server' },
    ]
  },
  profanity: {
    easy: [
      { word: 'DAMN', def: 'Expressing frustration, usually at bugs' },
      { word: 'HELL', def: 'Where your code goes during production' },
      { word: 'CRAP', def: 'What your code becomes at 3am' },
      { word: 'PISS', def: 'What legacy code does to you off' },
    ],
    medium: [
      { word: 'BULLSHIT', def: 'Most tech job descriptions' },
      { word: 'SHITSHOW', def: 'Typical production deployment' },
      { word: 'CLUSTERFUCK', def: 'Microservices architecture gone wrong' },
      { word: 'ASSHOLE', def: 'That one tech lead who reviews PRs at midnight' },
      { word: 'BASTARD', def: 'The developer who wrote this without comments' },
    ],
    hard: [
      { word: 'MOTHERFUCKER', def: 'JavaScript trying to compare objects' },
      { word: 'SHITSTORM', def: 'When your AWS bill arrives' },
      { word: 'FUCKERY', def: 'CSS specificity rules' },
      { word: 'DICKHEAD', def: 'Whoever invented PHP array syntax' },
    ],
    expert: [
      { word: 'SHITFACED', def: 'How you debug production at 2am' },
      { word: 'FUCKSTICK', def: 'The PM who changes requirements daily' },
      { word: 'ASSCLOWN', def: 'Developer who commits directly to main' },
      { word: 'SHITBAG', def: 'That one npm package breaking everything' },
    ]
  }
};

// Particle system for visual effects
class Particle {
  constructor(x, y, type = 'confetti') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = type === 'confetti' ? (Math.random() * -10 - 5) : Math.random() * 3;
    this.gravity = type === 'confetti' ? 0.5 : 0.3;
    this.life = 1;
    this.decay = type === 'confetti' ? 0.01 : 0.015;
    this.size = Math.random() * 6 + 3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    this.color = type === 'confetti'
      ? ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
      : '#ef4444';

    if (type === 'letter') {
      this.letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
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

    if (this.type === 'letter') {
      ctx.font = `bold ${this.size * 3}px 'JetBrains Mono'`;
      ctx.fillStyle = this.color;
      ctx.fillText(this.letter, -this.size, this.size);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 2);
    }

    ctx.restore();
  }
}

// Sound effects using Web Audio API
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
    this.playTone(800, 0.1, 'sine');
    setTimeout(() => this.playTone(1000, 0.1, 'sine'), 50);
  }

  wrong() {
    this.playTone(200, 0.2, 'sawtooth');
  }

  win() {
    [400, 500, 600, 800].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine'), i * 100);
    });
  }

  lose() {
    [400, 350, 300, 200].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sawtooth'), i * 150);
    });
  }
}

// Main game class
class HangmanGame {
  constructor() {
    this.canvas = document.getElementById('hangman-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particlesCanvas = document.getElementById('particles-canvas');
    this.particlesCtx = this.particlesCanvas.getContext('2d');
    this.wordDisplay = document.getElementById('word-display');
    this.wordDefinition = document.getElementById('word-definition');
    this.keyboard = document.getElementById('keyboard');
    this.message = document.getElementById('message');
    this.achievementContainer = document.getElementById('achievement-container');
    this.newGameBtn = document.getElementById('new-game-btn');
    this.hintBtn = document.getElementById('hint-btn');
    this.shareBtn = document.getElementById('share-btn');
    this.darkModeBtn = document.getElementById('dark-mode-btn');
    this.soundBtn = document.getElementById('sound-btn');

    this.maxWrong = 6;
    this.difficulty = 'easy';
    this.category = 'all';
    this.hintsRemaining = 3;
    this.particles = [];
    this.darkMode = false;
    this.sounds = new SoundEffects();

    this.setupParticlesCanvas();
    this.loadStats();
    this.initKeyboard();
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
    this.shareBtn.addEventListener('click', () => this.shareResult());
    this.darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
    this.soundBtn.addEventListener('click', () => this.toggleSound());

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.setDifficulty(e.target.dataset.difficulty));
    });

    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.setCategory(e.target.dataset.category));
    });

    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
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

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
    this.newGame();
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
      wins: parseInt(localStorage.getItem('hangman_wins') || '0'),
      losses: parseInt(localStorage.getItem('hangman_losses') || '0'),
      streak: parseInt(localStorage.getItem('hangman_streak') || '0'),
      bestStreak: parseInt(localStorage.getItem('hangman_best_streak') || '0'),
      perfectGames: parseInt(localStorage.getItem('hangman_perfect') || '0'),
      totalHints: parseInt(localStorage.getItem('hangman_hints_used') || '0')
    };
    this.updateStatsDisplay();
  }

  saveStats() {
    localStorage.setItem('hangman_wins', this.stats.wins);
    localStorage.setItem('hangman_losses', this.stats.losses);
    localStorage.setItem('hangman_streak', this.stats.streak);
    localStorage.setItem('hangman_best_streak', this.stats.bestStreak);
    localStorage.setItem('hangman_perfect', this.stats.perfectGames);
    localStorage.setItem('hangman_hints_used', this.stats.totalHints);
  }

  updateStatsDisplay() {
    document.getElementById('wins').textContent = this.stats.wins;
    document.getElementById('losses').textContent = this.stats.losses;
    document.getElementById('streak').textContent = this.stats.streak;
    document.getElementById('best-streak').textContent = this.stats.bestStreak;
  }

  initKeyboard() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.keyboard.innerHTML = '';

    letters.forEach(letter => {
      const key = document.createElement('button');
      key.textContent = letter;
      key.className = 'key';
      key.dataset.letter = letter;
      key.addEventListener('click', () => this.guessLetter(letter));
      this.keyboard.appendChild(key);
    });
  }

  newGame() {
    const wordList = WORD_DATABASE[this.category][this.difficulty];
    const wordData = wordList[Math.floor(Math.random() * wordList.length)];

    this.word = wordData.word;
    this.definition = wordData.def;
    this.guessedLetters = new Set();
    this.wrongGuesses = 0;
    this.gameOver = false;
    this.usedHint = false;
    this.hintsRemaining = 3;

    this.message.textContent = '';
    this.message.className = '';
    this.wordDefinition.textContent = '';
    this.shareBtn.style.display = 'none';
    this.achievementContainer.innerHTML = '';
    this.hintBtn.textContent = `💡 Hint (${this.hintsRemaining} left)`;
    this.hintBtn.disabled = false;

    document.querySelectorAll('.key').forEach(key => {
      key.disabled = false;
      key.className = 'key';
    });

    this.updateDisplay();
    this.drawHangman();
  }

  useHint() {
    if (this.gameOver || this.hintsRemaining === 0) return;

    const unguessedLetters = this.word.split('')
      .filter(letter => !this.guessedLetters.has(letter));

    if (unguessedLetters.length === 0) return;

    const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
    this.guessLetter(hintLetter);
    this.hintsRemaining--;
    this.usedHint = true;
    this.stats.totalHints++;
    this.saveStats();

    this.hintBtn.textContent = `💡 Hint (${this.hintsRemaining} left)`;
    if (this.hintsRemaining === 0) {
      this.hintBtn.disabled = true;
    }
  }

  guessLetter(letter) {
    if (this.gameOver || this.guessedLetters.has(letter)) return;

    this.guessedLetters.add(letter);
    const key = document.querySelector(`[data-letter="${letter}"]`);

    if (this.word.includes(letter)) {
      key.classList.add('correct');
      this.sounds.correct();
      this.updateDisplay();
      this.checkWin();
    } else {
      key.classList.add('wrong');
      this.sounds.wrong();
      this.wrongGuesses++;
      this.drawHangman();
      this.checkLose();
    }

    key.disabled = true;
  }

  handleKeyPress(e) {
    if (this.gameOver) return;
    const letter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      this.guessLetter(letter);
    }
  }

  updateDisplay() {
    const letters = this.word.split('').map(letter => {
      if (this.guessedLetters.has(letter)) {
        return `<span class="letter">${letter}</span>`;
      }
      return '_';
    });
    this.wordDisplay.innerHTML = letters.join(' ');
  }

  checkWin() {
    const won = this.word.split('').every(letter => this.guessedLetters.has(letter));

    if (won) {
      this.gameOver = true;
      this.sounds.win();
      this.message.textContent = '🎉 You won!';
      this.message.className = 'win';
      this.wordDefinition.textContent = this.definition;
      this.shareBtn.style.display = 'inline-block';

      this.stats.wins++;
      this.stats.streak++;

      if (this.stats.streak > this.stats.bestStreak) {
        this.stats.bestStreak = this.stats.streak;
      }

      // Check achievements
      if (this.wrongGuesses === 0 && !this.usedHint) {
        this.stats.perfectGames++;
        this.showAchievement('🏆 Perfect Game!');
      }

      if (this.stats.streak === 5) {
        this.showAchievement('🔥 5 Win Streak!');
      }

      if (this.stats.streak === 10) {
        this.showAchievement('🚀 10 Win Streak!');
      }

      this.saveStats();
      this.updateStatsDisplay();
      this.disableKeyboard();
      this.spawnConfetti();
    }
  }

  checkLose() {
    if (this.wrongGuesses >= this.maxWrong) {
      this.gameOver = true;
      this.sounds.lose();
      this.message.textContent = `💀 You lost! The word was: ${this.word}`;
      this.message.className = 'lose';
      this.wordDefinition.textContent = this.definition;
      this.stats.losses++;
      this.stats.streak = 0;
      this.saveStats();
      this.updateStatsDisplay();
      this.disableKeyboard();
      this.wordDisplay.innerHTML = this.word.split('').map(l => `<span class="letter">${l}</span>`).join(' ');
      this.spawnFallingLetters();
    }
  }

  showAchievement(text) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.textContent = text;
    this.achievementContainer.appendChild(achievement);

    setTimeout(() => {
      achievement.style.opacity = '0';
      setTimeout(() => achievement.remove(), 500);
    }, 3000);
  }

  disableKeyboard() {
    document.querySelectorAll('.key').forEach(key => {
      if (!key.classList.contains('correct') && !key.classList.contains('wrong')) {
        key.disabled = true;
      }
    });
  }

  spawnConfetti() {
    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(centerX, centerY, 'confetti'));
    }
  }

  spawnFallingLetters() {
    const width = window.innerWidth;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      this.particles.push(new Particle(x, -20, 'letter'));
    }
  }

  animateParticles() {
    this.particlesCtx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);

    this.particles = this.particles.filter(particle => {
      particle.update();
      particle.draw(this.particlesCtx);
      return particle.life > 0;
    });

    requestAnimationFrame(() => this.animateParticles());
  }

  shareResult() {
    const wrongSquares = '🟥'.repeat(this.wrongGuesses);
    const remainingSquares = '⬜'.repeat(this.maxWrong - this.wrongGuesses);
    const shareText = `Hangman: ${this.word}\n${wrongSquares}${remainingSquares}\n${this.wrongGuesses}/${this.maxWrong} wrong guesses\n\nPlay at: ${window.location.href}`;

    if (navigator.share) {
      navigator.share({
        title: 'Hangman Game',
        text: shareText
      }).catch(() => this.copyToClipboard(shareText));
    } else {
      this.copyToClipboard(shareText);
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = this.shareBtn.textContent;
      this.shareBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        this.shareBtn.textContent = originalText;
      }, 2000);
    });
  }

  drawHangman() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Gallows
    if (this.wrongGuesses >= 0) {
      // Base
      ctx.beginPath();
      ctx.moveTo(20, 280);
      ctx.lineTo(180, 280);
      ctx.stroke();

      // Vertical pole
      ctx.beginPath();
      ctx.moveTo(60, 280);
      ctx.lineTo(60, 20);
      ctx.stroke();

      // Horizontal beam
      ctx.beginPath();
      ctx.moveTo(60, 20);
      ctx.lineTo(180, 20);
      ctx.stroke();

      // Rope
      ctx.beginPath();
      ctx.moveTo(180, 20);
      ctx.lineTo(180, 50);
      ctx.stroke();
    }

    // Head
    if (this.wrongGuesses >= 1) {
      ctx.beginPath();
      ctx.arc(180, 75, 25, 0, Math.PI * 2);
      ctx.stroke();

      // Sad face
      ctx.beginPath();
      ctx.arc(172, 70, 3, 0, Math.PI * 2);
      ctx.arc(188, 70, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(180, 82, 12, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    }

    // Body
    if (this.wrongGuesses >= 2) {
      ctx.beginPath();
      ctx.moveTo(180, 100);
      ctx.lineTo(180, 170);
      ctx.stroke();
    }

    // Left arm
    if (this.wrongGuesses >= 3) {
      ctx.beginPath();
      ctx.moveTo(180, 120);
      ctx.lineTo(145, 140);
      ctx.stroke();
    }

    // Right arm
    if (this.wrongGuesses >= 4) {
      ctx.beginPath();
      ctx.moveTo(180, 120);
      ctx.lineTo(215, 140);
      ctx.stroke();
    }

    // Left leg
    if (this.wrongGuesses >= 5) {
      ctx.beginPath();
      ctx.moveTo(180, 170);
      ctx.lineTo(155, 210);
      ctx.stroke();
    }

    // Right leg
    if (this.wrongGuesses >= 6) {
      ctx.beginPath();
      ctx.moveTo(180, 170);
      ctx.lineTo(205, 210);
      ctx.stroke();
    }
  }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new HangmanGame());
} else {
  new HangmanGame();
}
</script>
</div>

## What's Actually Happening Here

This isn't just Hangman anymore. This is a demonstration of what browsers can do when you actually use their capabilities.

**Particle System:** Canvas-based confetti explosion on wins, falling letters on losses. No library. Just math and requestAnimationFrame. [1]

**Web Audio API:** Sound effects generated in real-time using oscillators. No audio files. Pure synthesized tones. Toggle-able because not everyone wants beeps. [2]

**Difficulty Levels:** Four difficulty tiers with categorized word lists. Easy mode for beginners, Expert mode for showing off.

**Hint System:** Reveals a random letter. Limited to 3 per game. Uses localStorage to track total hints used across sessions.

**Dark Mode:** CSS transitions and gradient changes. No flash, no flicker. Just smooth theme switching.

**Achievements:** Dynamic unlock system. Perfect games, win streaks, all tracked and celebrated.

**Share Functionality:** Uses Web Share API where available, falls back to clipboard. Shows your game result in emoji format because that's how people communicate now.

**Smooth Animations:** Letter reveals with rotation and scale. Key presses with pop and shake effects. Everything has a transition because janky UX is unacceptable.

**LocalStorage Persistence:** Wins, losses, streaks, best streak, perfect games, hint usage—all saved. No account needed.

**Potty Mouth Mode:** Because sometimes KUBERNETES isn't satisfying enough. Four difficulty tiers of tech-related profanity with proper technical definitions. You'll know it when you see it.

## The Potty Mouth Origin Story

Me: "this is really neat. add some potty mouth words."

Claude: *proceeds to add profanity to the blog post text*

Me: "I meant to the game."

Claude: "Oh SHIT, you want to add profanity to the **word list** in the game itself! That's way better."

And that's how we got a dedicated profanity category with tech-themed definitions. Play the game to find out which colorful terms made the cut.

## The Technical Bits

- **Zero dependencies:** No React, Vue, jQuery, or any framework
- **No build step:** Copy the source, it just works
- **Web Audio API:** Synthesized sound effects in 15 lines of code
- **Canvas particle physics:** Gravity, rotation, life decay—all calculated per frame
- **Responsive:** Works on phone, tablet, desktop
- **Accessible:** Keyboard navigation, screen reader friendly

## Why This Matters

You don't need a package.json with 200 dependencies to build something fun and functional.

You don't need a framework for interactivity.

You don't need a build pipeline for basic JavaScript.

The browser is genuinely powerful. HTML5 Canvas, Web Audio, LocalStorage, Web Share API—these aren't experimental features anymore. They're standard. They work. Use them.

## What's Next

Maybe Chess next. Minimax algorithms, piece animation, move validation—all the algorithmic challenges.

Or Tetris. Or Snake. Or something completely new.

The point remains: modern browsers make this easy. Claude makes it even easier. And you don't need to npm install anything to have fun.

---
*Built with Claude Sonnet 4.5 - who has no idea what fun is but can definitely help you code it*

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
