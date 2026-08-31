/**
 * antfarm.systems — the ants eat the 404
 *
 * /404.html is standalone (layout: null) and deliberately does NOT load
 * easter-eggs.js, whose idle colony would fight these ants for the cursor.
 *
 * The page renders intact, then ants come up from below the fold, break the
 * image into 16 pieces, and haul them off underground. The message and the
 * links are plain HTML — they work with JS off, with reduced motion on, and
 * before the swarm finishes.
 */
(function () {
  'use strict';

  var img = document.getElementById('af-404');
  var msg = document.getElementById('af-404-msg');
  if (!img) return;

  // Reduced motion gets the static page: image, message, links. No swarm.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var revealed = false;

  if (msg) {
    msg.style.transition = 'opacity 1.1s';
    msg.style.opacity = '0';
  }

  if (img.complete) {
    setTimeout(begin, 900);
  } else {
    img.addEventListener('load', function () { setTimeout(begin, 900); });
    img.addEventListener('error', reveal);
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    if (msg) msg.style.opacity = '1';
  }

  function begin() {
    var rect = img.getBoundingClientRect();
    if (!rect.width) { reveal(); return; }

    var COLS = 4, ROWS = 4;
    var tileW = rect.width / COLS;
    var tileH = rect.height / ROWS;
    var src = img.currentSrc || img.src;
    var vh = window.innerHeight;
    var remaining = COLS * ROWS;

    // Hidden, not removed — keeps the layout box so nothing jumps.
    img.style.visibility = 'hidden';

    // Bottom row first, so the image is eaten from the ground up.
    for (var r = ROWS - 1; r >= 0; r--) {
      for (var c = 0; c < COLS; c++) {
        spawn(r, c, (ROWS - 1 - r) * 260 + c * 60 + Math.random() * 200);
      }
    }

    // Don't make a lost visitor wait on the whole performance.
    setTimeout(reveal, 5000);

    function spawn(row, col, delay) {
      var tile = document.createElement('div');
      tile.style.cssText = 'position:fixed;z-index:6;pointer-events:none;background-repeat:no-repeat;';
      tile.style.backgroundImage = 'url("' + src + '")';
      tile.style.width = tileW + 'px';
      tile.style.height = tileH + 'px';
      tile.style.backgroundSize = rect.width + 'px ' + rect.height + 'px';
      tile.style.backgroundPosition = (-col * tileW) + 'px ' + (-row * tileH) + 'px';

      var tx = rect.left + col * tileW;
      var ty = rect.top + row * tileH;
      tile.style.left = tx + 'px';
      tile.style.top = ty + 'px';
      document.body.appendChild(tile);

      var ant = document.createElement('div');
      ant.textContent = '🐜';
      ant.setAttribute('aria-hidden', 'true');
      ant.style.cssText = 'position:fixed;z-index:7;font-size:18px;pointer-events:none;' +
        'opacity:0;transition:opacity .4s;';

      // Up from below the fold, and back down the same way with a piece.
      var sx = tx + tileW / 2 + (Math.random() - 0.5) * 220;
      var sy = vh + 30 + Math.random() * 90;
      ant.style.left = sx + 'px';
      ant.style.top = sy + 'px';
      document.body.appendChild(ant);

      var s = {
        el: ant,
        tile: tile,
        x: sx, y: sy,
        grabX: tx + tileW / 2, grabY: ty + tileH / 2,
        homeX: sx, homeY: vh + 90,
        carrying: false,
        done: false,
        wob: Math.random() * 6.28,
        last: 0
      };

      setTimeout(function () {
        ant.style.opacity = '1';   // fades in on its cue; without this it hauls invisibly
        s.last = performance.now();
        requestAnimationFrame(function step(now) {
          // Delta-timed, not per-frame: a 120Hz display would otherwise run
          // the whole swarm at double speed.
          var dt = Math.min((now - s.last) / 1000, 0.05);
          s.last = now;
          haul(s, dt);
          if (s.done) {
            ant.remove();
            tile.remove();
            reveal();
            remaining--;
            return;
          }
          requestAnimationFrame(step);
        });
      }, delay);
    }

    // px/sec, matching how this felt at 60Hz before it went delta-timed.
    // Hauling a piece of the page is heavier work than walking up to it.
    var APPROACH = 192, CARRY = 132;

    function haul(s, dt) {
      var goX = s.carrying ? s.homeX : s.grabX;
      var goY = s.carrying ? s.homeY : s.grabY;
      var dx = goX - s.x;
      var dy = goY - s.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var step = (s.carrying ? CARRY : APPROACH) * dt;

      if (dist > step) {
        s.x += (dx / dist) * step;
        s.y += (dy / dist) * step;
      } else {
        s.x = goX;
        s.y = goY;
      }
      s.wob += dt * 7;
      s.x += Math.sin(s.wob) * 0.6;

      s.el.style.left = s.x + 'px';
      s.el.style.top = s.y + 'px';
      s.el.style.transform = dx < 0 ? 'scaleX(-1)' : '';

      if (!s.carrying && dist <= step) s.carrying = true;

      if (s.carrying) {
        s.tile.style.left = (s.x - tileW / 2) + 'px';
        s.tile.style.top = (s.y - tileH) + 'px';
        s.tile.style.transform = 'rotate(' + (Math.sin(s.wob * 0.5) * 7) + 'deg)';
        if (s.y > vh + 80) s.done = true;
      }
    }
  }
})();
