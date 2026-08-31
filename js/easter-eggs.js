/**
 * antfarm.systems easter eggs
 * ~9KB gzipped over the wire, unminified on purpose so it can be read.
 * Zero dependencies. Deferred loading.
 *
 * Console entry point: antfarm.help() — see §13.
 */
(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. KONAMI CODE
  // ──────────────────────────────────────────────
  var konamiSeq = [38,38,40,40,37,39,37,39,66,65];
  var konamiPos = 0;

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === konamiSeq[konamiPos]) {
      konamiPos++;
      if (konamiPos === konamiSeq.length) {
        konamiPos = 0;
        unleashAnts();
      }
    } else {
      konamiPos = 0;
    }
  });

  function unleashAnts(count) {
    // Console callers (§13) can ask for a different swarm; 200 is where my
    // laptop starts to sound like it's thinking about it.
    count = Math.max(1, Math.min(Math.floor(count) || 40, 200));
    var ants = [];
    for (var i = 0; i < count; i++) {
      var ant = document.createElement('div');
      ant.textContent = '\uD83D\uDC1C';
      ant.style.cssText = 'position:fixed;font-size:20px;z-index:99999;pointer-events:none;transition:none;';
      ant.style.left = Math.random() * window.innerWidth + 'px';
      ant.style.top = window.innerHeight + 10 + 'px';
      document.body.appendChild(ant);
      ants.push({
        el: ant,
        x: parseFloat(ant.style.left),
        y: parseFloat(ant.style.top),
        speed: 1 + Math.random() * 2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03
      });
    }

    var banner = document.createElement('div');
    banner.innerHTML = 'THE COLONY RISES';
    banner.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);font-family:Cousine,monospace;font-size:2rem;font-weight:bold;color:#357edd;z-index:100000;pointer-events:none;opacity:0;transition:opacity 0.5s;text-shadow:0 2px 10px rgba(0,0,0,0.3);';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.style.opacity = '1'; });
    setTimeout(function () { banner.style.opacity = '0'; }, 2500);
    setTimeout(function () { banner.remove(); }, 3000);

    function march() {
      var done = true;
      for (var i = 0; i < ants.length; i++) {
        var a = ants[i];
        a.wobble += a.wobbleSpeed;
        a.x += Math.sin(a.wobble) * 1.5;
        a.y -= a.speed;
        a.el.style.left = a.x + 'px';
        a.el.style.top = a.y + 'px';
        if (a.y > -30) done = false;
      }
      if (!done) {
        requestAnimationFrame(march);
      } else {
        for (var j = 0; j < ants.length; j++) ants[j].el.remove();
      }
    }
    requestAnimationFrame(march);
  }

  // ──────────────────────────────────────────────
  // 2. CONSOLE EASTER EGG
  // ──────────────────────────────────────────────
  console.log('%c' +
    '     \\     /\n' +
    '      \\   /\n' +
    '      (o o)\n' +
    '     /| | |\\\n' +
    '    / | | | \\\n' +
    '       d b\n\n' +
    '  You\'re inspecting a blog.\n' +
    '  Go touch grass.\n\n' +
    '  Or don\'t: antfarm.help()\n\n' +
    '  antfarm.systems',
    'font-family:monospace;font-size:13px;color:#357edd;'
  );

  // ──────────────────────────────────────────────
  // 3. HIGHLIGHT PROFANITY CONFETTI
  // ──────────────────────────────────────────────
  var profanityPattern = /\b(fuck|shit|damn|ass|hell|bastard|crap|bullshit)\b/i;

  document.addEventListener('mouseup', function () {
    var sel = window.getSelection();
    if (!sel || !sel.toString()) return;
    if (profanityPattern.test(sel.toString())) {
      burstConfetti(lastMouseX, lastMouseY);
    }
  });

  var lastMouseX = 0, lastMouseY = 0;
  document.addEventListener('mousemove', function (e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  function burstConfetti(x, y) {
    var colors = ['#ff9900', '#357edd', '#e7040f', '#19a974', '#9c27b0', '#ff6300'];
    for (var i = 0; i < 20; i++) {
      var dot = document.createElement('div');
      var size = 4 + Math.random() * 6;
      dot.style.cssText = 'position:fixed;border-radius:50%;pointer-events:none;z-index:99998;';
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(dot);
      animateParticle(dot, x, y);
    }
  }

  function animateParticle(el, startX, startY) {
    var vx = (Math.random() - 0.5) * 10;
    var vy = -3 - Math.random() * 6;
    var gravity = 0.25;
    var life = 1;
    var x = startX, y = startY;

    function tick() {
      vx *= 0.98;
      vy += gravity;
      x += vx;
      y += vy;
      life -= 0.02;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.opacity = life;
      if (life > 0) {
        requestAnimationFrame(tick);
      } else {
        el.remove();
      }
    }
    requestAnimationFrame(tick);
  }

  // ──────────────────────────────────────────────
  // 4. GRACE HOPPER'S MOTH — DECEMBER 9 ONLY
  // ──────────────────────────────────────────────
  // She was born Dec 9, 1906. The moth is the one taped into the Mark II
  // logbook on Sept 9, 1947: "First actual case of bug being found."
  // Add ?moth or #moth to any URL to summon it on the other 364 days,
  // or call antfarm.moth() from the console (§13).
  (function () {
    var today = new Date();
    var forced = location.search.indexOf('moth') > -1 || location.hash === '#moth';
    if (forced || (today.getMonth() === 11 && today.getDate() === 9)) summonMoth();
  })();

  function summonMoth() {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.getElementById('af-moth-css')) {
      var style = document.createElement('style');
      style.id = 'af-moth-css'; // console callers can summon a second moth; one stylesheet is enough
      style.textContent =
        '@keyframes af-flutter{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.5)}}' +
        '.af-moth{position:fixed;z-index:99995;line-height:0;' +
          'filter:drop-shadow(0 1px 2px rgba(0,0,0,.28))}' +
        '.af-moth-wings{transform-box:fill-box;transform-origin:center;' +
          'animation:af-flutter .17s ease-in-out infinite}' +
        '.af-moth-rest .af-moth-wings{animation:none;transform:scaleX(.84)}' +
        '.af-moth-note{position:fixed;z-index:99995;max-width:15rem;' +
          'font-family:Cousine,monospace;font-size:11px;line-height:1.55;color:#5b5344;' +
          'background:rgba(255,255,255,.95);border:1px solid #ddd6c6;border-radius:3px;' +
          'padding:7px 9px;opacity:0;transition:opacity .7s;pointer-events:none}';
      document.head.appendChild(style);
    }

    var moth = document.createElement('a');
    moth.className = 'af-moth';
    moth.href = '/posts/happy-birthday-grace-hopper';
    moth.title = 'First actual case of bug being found. — Mark II logbook, September 9, 1947';
    moth.setAttribute('aria-label', "Grace Hopper's moth — happy birthday, Grace");
    moth.innerHTML = '<svg width="34" height="27" viewBox="0 0 40 32">' +
      '<g class="af-moth-wings">' +
        '<path d="M20 19C7 3 1 10 4.5 18.5 6.5 24 14.5 24.5 20 19Z" fill="#a2957d"/>' +
        '<path d="M20 19C33 3 39 10 35.5 18.5 33.5 24 25.5 24.5 20 19Z" fill="#8d8069"/>' +
        '<path d="M20 19C12 12 8 13 6 17c2 4 8 5 14 2Z" fill="#776c58" opacity=".5"/>' +
        '<path d="M20 19c8-7 12-6 14-2-2 4-8 5-14 2Z" fill="#6b6050" opacity=".5"/>' +
      '</g>' +
      '<ellipse cx="20" cy="20" rx="2.5" ry="7" fill="#4a4335"/>' +
      '<circle cx="20" cy="13.4" r="2.5" fill="#3c362b"/>' +
      '<path d="M18.8 11.6 15 6.5M21.2 11.6 25 6.5" stroke="#3c362b" stroke-width="1.1" ' +
        'fill="none" stroke-linecap="round"/>' +
      '</svg>';
    document.body.appendChild(moth);

    var mx, my, elapsed = 0, flit = 0, stopX, last = 0;

    if (reduced) {
      mx = window.innerWidth * 0.72;
      my = window.innerHeight * 0.32;
      place();
      settle();
    } else {
      mx = -50;
      my = window.innerHeight * (0.35 + Math.random() * 0.28);
      stopX = window.innerWidth * (0.55 + Math.random() * 0.22);
      place();
      last = performance.now();
      requestAnimationFrame(crawl);
    }

    function place() {
      moth.style.left = mx + 'px';
      moth.style.top = my + 'px';
    }

    // Moths do not travel in straight lines. Mostly a slow drift, punctuated
    // by short panicked bursts in roughly the right direction. Speeds are
    // px/sec against a delta clock so a 120Hz display doesn't double them.
    function crawl(now) {
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      if (flit > 0) {
        flit -= dt;
        mx += 150 * dt;
        my += Math.sin(elapsed * 27) * 130 * dt;
      } else {
        mx += 45 * dt;
        my += Math.sin(elapsed * 3) * 24 * dt;
        if (Math.random() < dt * 0.72) flit = 0.66; // a flit every ~1.4s
      }
      my = Math.max(30, Math.min(my, window.innerHeight - 60));
      place();
      if (mx >= stopX) { settle(); return; }
      requestAnimationFrame(crawl);
    }

    function settle() {
      moth.classList.add('af-moth-rest');
      var note = document.createElement('div');
      note.className = 'af-moth-note';
      note.innerHTML = 'Grace Hopper, born December 9, 1906.<br>The moth is from the logbook.';
      document.body.appendChild(note);
      note.style.left = Math.max(8, Math.min(mx + 28, window.innerWidth - 260)) + 'px';
      note.style.top = (my + 26) + 'px';
      requestAnimationFrame(function () { note.style.opacity = '1'; });
      setTimeout(function () { note.style.opacity = '0'; }, 7000);
      setTimeout(function () { note.remove(); }, 7800);
    }
  }

  // ──────────────────────────────────────────────
  // 5. WORD THEFT
  // ──────────────────────────────────────────────
  // Double-click a word in a post: two ants walk up, drag it off the line,
  // lose interest, and drop it back where they found it.
  //
  // Deliberately exclusive with the confetti in #3. A double-click fires
  // mouseup (which #3 listens on, with the word already selected) before it
  // fires dblclick, so without a guard a swear would get glitter AND a theft
  // on the same gesture. Both tests use profanityPattern, so exactly one of
  // them can ever claim a word: spicy words get confetti, the rest get stolen.
  var thieving = false;

  document.addEventListener('dblclick', function () {
    if (thieving) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var body = document.querySelector('.markdown-body');
    if (!body) return;

    var sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    var raw = sel.toString();
    var word = raw.replace(/\s+$/, ''); // Chrome's double-click takes the trailing space too
    if (!/^[A-Za-z0-9'’-]{2,24}$/.test(word)) return; // one ordinary word, nothing else
    if (profanityPattern.test(word)) return;               // #3 has dibs on this one

    var range = sel.getRangeAt(0).cloneRange();
    if (!body.contains(range.commonAncestorContainer)) return; // post text only, not the nav
    if (raw.length !== word.length) {
      try {
        range.setEnd(range.endContainer, range.endOffset - (raw.length - word.length));
      } catch (e) {
        return;
      }
    }

    var span = document.createElement('span');
    span.className = 'af-stolen';
    // inline-block because transforms don't apply to inline non-replaced boxes.
    span.style.cssText = 'display:inline-block;will-change:transform;';
    try {
      range.surroundContents(span);
    } catch (e) {
      return; // selection straddled markup; not worth forcing
    }
    sel.removeAllRanges(); // otherwise it reads as a highlight glitch, not theft
    stealWord(span);
  });

  function easeInOut(p) {
    p = p < 0 ? 0 : (p > 1 ? 1 : p);
    return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  }

  function spawnThief(rect, frac, offset) {
    var ant = document.createElement('div');
    ant.className = 'af-thief';
    ant.textContent = '🐜';
    ant.setAttribute('aria-hidden', 'true');
    // Absolute, not fixed: in document space the ants scroll with the word
    // they're carrying instead of sliding off it.
    ant.style.cssText = 'position:absolute;z-index:99994;font-size:14px;pointer-events:none;opacity:0;';
    var gx = rect.left + window.pageXOffset + rect.width * frac - 7;
    var gy = rect.bottom + window.pageYOffset - 4;
    var sx = gx + offset;
    var sy = gy + 46;
    ant.style.left = sx + 'px';
    ant.style.top = sy + 'px';
    if (offset > 0) ant.style.transform = 'scaleX(-1)';
    document.body.appendChild(ant);
    return { el: ant, sx: sx, sy: sy, gx: gx, gy: gy, wob: Math.random() * 6.28 };
  }

  function unwrapWord(span) {
    var parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
    if (parent.normalize) parent.normalize(); // re-heal the split text node
  }

  function stealWord(span) {
    thieving = true;
    var rect = span.getBoundingClientRect();
    var thieves = [spawnThief(rect, 0.25, -34), spawnThief(rect, 0.75, 34)];

    // Far enough that the word is clearly gone from its line, and a random
    // sideways direction so two thefts in a row don't look identical. The
    // tilt leans whichever way it's being dragged.
    var dir = Math.random() < 0.5 ? -1 : 1;
    var DRIFT_X = 58 * dir, DRIFT_Y = 150, TILT = 15 * dir;
    // seconds: walk up, carry off, hold, put it back, wander away
    var A = 0.45, C = 1.25, H = 0.18, R = 0.55, OUT = 0.45;
    var t = 0, last = performance.now();

    requestAnimationFrame(function step(now) {
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      var wx = 0, wy = 0, tilt = 0, grip = 0, antOp = 1, antDrift = 0, p;

      if (t < A) {
        grip = easeInOut(t / A);
        antOp = Math.min(1, t / (A * 0.6));
      } else if (t < A + C) {
        grip = 1;
        p = easeInOut((t - A) / C);
        wx = DRIFT_X * p; wy = DRIFT_Y * p; tilt = TILT * p;
      } else if (t < A + C + H) {
        grip = 1;
        wx = DRIFT_X; wy = DRIFT_Y; tilt = TILT;
      } else if (t < A + C + H + R) {
        grip = 1;
        p = 1 - easeInOut((t - A - C - H) / R);
        wx = DRIFT_X * p; wy = DRIFT_Y * p; tilt = TILT * p;
      } else if (t < A + C + H + R + OUT) {
        grip = 1;
        p = (t - A - C - H - R) / OUT;
        antOp = 1 - p;
        antDrift = 44 * p;
      } else {
        for (var k = 0; k < thieves.length; k++) thieves[k].el.remove();
        unwrapWord(span);
        thieving = false;
        return;
      }

      span.style.transform = 'translate(' + wx.toFixed(2) + 'px,' + wy.toFixed(2) +
        'px) rotate(' + tilt.toFixed(2) + 'deg)';

      for (var i = 0; i < thieves.length; i++) {
        var th = thieves[i];
        th.wob += dt * 9;
        th.el.style.left = (th.sx + (th.gx - th.sx) * grip + wx + Math.sin(th.wob) * 0.7) + 'px';
        th.el.style.top = (th.sy + (th.gy - th.sy) * grip + wy + antDrift) + 'px';
        th.el.style.opacity = antOp;
      }
      requestAnimationFrame(step);
    });
  }

  // ──────────────────────────────────────────────
  // 6. THE UNDERGROUND — dark mode
  // ──────────────────────────────────────────────
  // Dark mode isn't this page with the lights off. It's the inside of the farm.
  // The soil, the dirt grain and the chamber the text sits in are all in
  // stylesheets/style.css, so someone with JS off still gets the underground.
  // This part digs the tunnels through the soil around the chamber, walks ants
  // along them, and puts eyes in the dark.
  //
  // Add ?dark to any URL — or call antfarm.nocturnal() — to go under while your
  // system is still in light mode.
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var forcedDark = location.search.indexOf('dark') > -1 || location.hash === '#dark';
  var layer = null, eyes = [], tunnelAnts = [], undergroundLast = 0;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function isDark() {
    return forcedDark || !!(darkQuery && darkQuery.matches);
  }

  // A tunnel is a random walk in quadratic curves. Ants don't dig straight and
  // neither does this.
  function tunnelPath(x, y, dx, w, h) {
    var d = 'M' + x.toFixed(0) + ' ' + y.toFixed(0);
    var cx = x, cy = y, steps = 4 + Math.floor(Math.random() * 4);
    // Turn back at the far wall instead of running off it. Seven unchecked steps
    // can carry a tunnel 1300px sideways, and an ant patrolling that spends most
    // of its walk off-screen where nobody can see it.
    for (var i = 0; i < steps; i++) {
      var run = 70 + Math.random() * 120;
      if (cx + dx * run < -30 || cx + dx * run > w + 30) dx = -dx;
      var nx = cx + dx * run;
      var ny = Math.max(8, Math.min(h - 8, cy + (Math.random() - 0.5) * 200));
      var qx = cx + dx * (30 + Math.random() * 70);
      var qy = Math.max(8, Math.min(h - 8, cy + (Math.random() - 0.5) * 140));
      d += ' Q' + qx.toFixed(0) + ' ' + qy.toFixed(0) + ' ' + nx.toFixed(0) + ' ' + ny.toFixed(0);
      cx = nx; cy = ny;
    }
    return d;
  }

  // Eyeshine only reads against soil, so both of these keep it off the content
  // card: 14px of slack so an eye never half-tucks under the card's edge.
  function onCard(box, x, y) {
    return x > box.left - 14 && x < box.right + 14 &&
           y > box.top - 14 && y < box.bottom + 14;
  }

  // The soil left over around the card, as up to four rectangles. Picks one at
  // random among those with room to spare; returns null if the card fills the
  // window (phones in portrait, mostly) and there's nowhere to look from.
  function pickGutter(box, w, h) {
    var gutters = [], min = 30;
    if (box.left > min) gutters.push([10, 10, box.left - 24, h - 20]);
    if (w - box.right > min) gutters.push([box.right + 14, 10, w - box.right - 24, h - 20]);
    if (box.top > min) gutters.push([10, 10, w - 20, box.top - 24]);
    if (h - box.bottom > min) gutters.push([10, box.bottom + 14, w - 20, h - box.bottom - 24]);
    if (!gutters.length) return null;
    var g = gutters[Math.floor(Math.random() * gutters.length)];
    return { x: g[0] + Math.random() * Math.max(1, g[2]),
             y: g[1] + Math.random() * Math.max(1, g[3]) };
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
    return el;
  }

  function digUnderground() {
    if (layer) return;
    var w = window.innerWidth, h = window.innerHeight;

    layer = document.createElement('div');
    layer.className = 'af-underground';
    layer.setAttribute('aria-hidden', 'true');
    // z-index -1 puts this behind the page's own content but above the soil
    // background, so the opaque chamber occludes the middle of every tunnel —
    // which is exactly right. They pass behind the room you're reading in.
    layer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'z-index:-1;pointer-events:none;overflow:hidden;';

    var svg = svgEl('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h });
    svg.style.cssText = 'position:absolute;top:0;left:0;';
    layer.appendChild(svg);

    // Dig from both side walls plus a couple down from the surface.
    var mouths = [], i;
    var sides = 3 + Math.floor(Math.random() * 2);
    for (i = 0; i < sides; i++) {
      mouths.push({ x: -20, y: h * (0.1 + Math.random() * 0.85), dx: 1 });
      mouths.push({ x: w + 20, y: h * (0.1 + Math.random() * 0.85), dx: -1 });
    }
    mouths.push({ x: w * (0.1 + Math.random() * 0.3), y: -20, dx: 1 });
    mouths.push({ x: w * (0.6 + Math.random() * 0.3), y: -20, dx: -1 });

    var voids = [];
    for (i = 0; i < mouths.length; i++) {
      var m = mouths[i];
      var d = tunnelPath(m.x, m.y, m.dx, w, h);
      // Two strokes: the excavated wall, and the void inside it.
      var wall = svgEl('path', {
        d: d, fill: 'none', stroke: '#33291c',
        'stroke-width': 11 + Math.random() * 7, 'stroke-linecap': 'round'
      });
      var hole = svgEl('path', {
        d: d, fill: 'none', stroke: '#080604',
        'stroke-width': 4 + Math.random() * 3, 'stroke-linecap': 'round'
      });
      svg.appendChild(wall);
      svg.appendChild(hole);
      voids.push(hole);

      // Chambers where a tunnel widens out.
      var len = hole.getTotalLength();
      var rooms = Math.random() < 0.7 ? 1 : 2;
      for (var c = 0; c < rooms; c++) {
        var pt = hole.getPointAtLength(len * (0.25 + Math.random() * 0.6));
        svg.appendChild(svgEl('circle', {
          cx: pt.x.toFixed(1), cy: pt.y.toFixed(1), r: (9 + Math.random() * 8).toFixed(1),
          fill: '#080604', stroke: '#33291c', 'stroke-width': 3
        }));
      }

      // The dig itself: each tunnel draws in, staggered, like it's being cut.
      if (!reducedMotion()) {
        (function (wall, hole, len, delay) {
          var wl = wall.getTotalLength();
          wall.style.cssText = 'stroke-dasharray:' + wl + ';stroke-dashoffset:' + wl +
            ';transition:stroke-dashoffset 1.5s ease-out ' + delay + 's';
          hole.style.cssText = 'stroke-dasharray:' + len + ';stroke-dashoffset:' + len +
            ';transition:stroke-dashoffset 1.5s ease-out ' + (delay + 0.12) + 's';
          requestAnimationFrame(function () {
            wall.style.strokeDashoffset = '0';
            hole.style.strokeDashoffset = '0';
          });
        })(wall, hole, len, i * 0.09);
      }
    }

    // Eyes. Every ant you can't see is still looking at you.
    var card = document.querySelector('.bg-white');
    var box = card ? card.getBoundingClientRect() : null;
    var wanted = Math.max(6, Math.min(22, Math.round((w * h) / 42000)));
    for (i = 0; i < wanted; i++) {
      var ex, ey, tries = 0;
      do {
        ex = 10 + Math.random() * (w - 20);
        ey = 10 + Math.random() * (h - 20);
        tries++;
      } while (box && onCard(box, ex, ey) && tries < 24);
      // On a narrow window the card covers most of the soil and random darts
      // keep landing on it, so place this one in a gutter on purpose. If there
      // isn't a gutter wide enough, skip the eye rather than hide it behind the
      // card where nobody would ever see it blink.
      if (box && onCard(box, ex, ey)) {
        var spot = pickGutter(box, w, h);
        if (!spot) continue;
        ex = spot.x;
        ey = spot.y;
      }

      // Outer element owns the wink (set from mousemove), inner owns the blink,
      // so the two can't fight over one opacity value.
      var eye = document.createElement('div');
      eye.style.cssText = 'position:absolute;transition:opacity .22s;';
      eye.style.left = ex.toFixed(0) + 'px';
      eye.style.top = ey.toFixed(0) + 'px';
      var lit = document.createElement('div');
      // One 2px dot plus a second via box-shadow: a pair of eyes, not a speck.
      lit.style.cssText = 'width:2px;height:2px;border-radius:50%;background:#d9c98a;' +
        'box-shadow:5px 0 0 0 #d9c98a;opacity:.16;';
      if (!reducedMotion()) {
        lit.style.animation = 'af-blink ' + (3.5 + Math.random() * 6).toFixed(1) +
          's ease-in-out ' + (Math.random() * 5).toFixed(1) + 's infinite';
      }
      eye.appendChild(lit);
      layer.appendChild(eye);
      eyes.push({ el: eye, x: ex, y: ey });
    }

    if (!document.getElementById('af-underground-css')) {
      var css = document.createElement('style');
      css.id = 'af-underground-css';
      css.textContent = '@keyframes af-blink{0%,42%,100%{opacity:.16}46%,50%{opacity:.02}}';
      document.head.appendChild(css);
    }

    // Ants in the tunnels, walking the void stroke of a real path.
    var antCount = Math.max(3, Math.min(8, Math.round(w / 210)));
    for (i = 0; i < antCount; i++) {
      var path = voids[Math.floor(Math.random() * voids.length)];
      var el = document.createElement('div');
      el.textContent = '🐜';
      el.style.cssText = 'position:absolute;font-size:12px;opacity:.85;will-change:transform;';
      layer.appendChild(el);
      tunnelAnts.push({
        el: el, path: path, len: path.getTotalLength(),
        d: Math.random() * path.getTotalLength(),
        dir: Math.random() < 0.5 ? -1 : 1,
        speed: 26 + Math.random() * 22,
        wait: Math.random() * 2
      });
    }

    document.body.appendChild(layer);
    if (!reducedMotion()) {
      undergroundLast = performance.now();
      requestAnimationFrame(patrol);
    } else {
      for (i = 0; i < tunnelAnts.length; i++) placeTunnelAnt(tunnelAnts[i]);
    }
  }

  function placeTunnelAnt(a) {
    var p = a.path.getPointAtLength(a.d);
    var q = a.path.getPointAtLength(Math.max(0, Math.min(a.len, a.d + 3 * a.dir)));
    var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    // Flip when it's heading left so it isn't walking on its back. Orientation
    // is approximate — at 11px nobody is auditing ant anatomy.
    var flip = Math.abs(ang) > 90 ? ' scaleY(-1)' : '';
    a.el.style.transform = 'translate(' + (p.x - 5.5).toFixed(1) + 'px,' +
      (p.y - 5.5).toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg)' + flip;
  }

  function patrol(now) {
    if (!layer) return;
    var dt = Math.min((now - undergroundLast) / 1000, 0.05);
    undergroundLast = now;

    for (var i = 0; i < tunnelAnts.length; i++) {
      var a = tunnelAnts[i];
      if (a.wait > 0) {
        a.wait -= dt;
      } else {
        a.d += a.speed * a.dir * dt;
        if (a.d <= 0 || a.d >= a.len) {          // hit the end of the tunnel
          a.d = Math.max(0, Math.min(a.len, a.d));
          a.dir *= -1;
          a.wait = 0.3 + Math.random() * 1.1;    // think about it, then head back
        } else if (Math.random() < dt * 0.06) {
          a.wait = 0.4 + Math.random() * 1.6;    // stop for no reason at all
        }
      }
      placeTunnelAnt(a);
    }
    requestAnimationFrame(patrol);
  }

  // Cursor gets close, the eyes look away. You can never catch one looking.
  var eyeTick = false;
  document.addEventListener('mousemove', function (e) {
    if (!eyes.length || eyeTick) return;
    eyeTick = true;
    var mx = e.clientX, my = e.clientY;
    requestAnimationFrame(function () {
      eyeTick = false;
      for (var i = 0; i < eyes.length; i++) {
        var dx = eyes[i].x - mx, dy = eyes[i].y - my;
        eyes[i].el.style.opacity = (dx * dx + dy * dy) < 22000 ? '0' : '1';
      }
    });
  }, { passive: true });

  function fillInUnderground() {
    if (!layer) return;
    var doomed = layer;
    layer = null;
    eyes = [];
    tunnelAnts = [];
    doomed.style.transition = 'opacity .5s';
    doomed.style.opacity = '0';
    setTimeout(function () { doomed.remove(); }, 600);
  }

  // Forced mode has to bring the palette with it, since the CSS is keyed to
  // prefers-color-scheme. Rather than keep a second copy of every color, lift
  // the rules straight out of the dark media block and re-emit them unwrapped.
  function paintDarkPalette() {
    if (document.getElementById('af-forced-dark')) return;
    var out = '';
    for (var s = 0; s < document.styleSheets.length; s++) {
      var rules;
      try {
        rules = document.styleSheets[s].cssRules; // throws on a cross-origin sheet
      } catch (e) {
        continue; // the tachyons CDN sheet, most likely. Keep looking.
      }
      if (!rules) continue;
      for (var r = 0; r < rules.length; r++) {
        var rule = rules[r];
        if (rule.media && rule.conditionText &&
            rule.conditionText.indexOf('prefers-color-scheme') > -1 &&
            rule.conditionText.indexOf('dark') > -1) {
          for (var k = 0; k < rule.cssRules.length; k++) out += rule.cssRules[k].cssText + '\n';
        }
      }
    }
    if (!out) return;
    var style = document.createElement('style');
    style.id = 'af-forced-dark';
    style.textContent = out;
    document.head.appendChild(style);
  }

  if (isDark()) {
    if (forcedDark) paintDarkPalette();
    digUnderground();
  }

  // Almost nobody flips their system theme mid-page. The ones who do should
  // get something for it.
  if (darkQuery && darkQuery.addEventListener) {
    darkQuery.addEventListener('change', function (e) {
      if (e.matches) {
        digUnderground();
        if (reducedMotion()) return;
        // The lights go out: for a beat there's nothing but eyeshine.
        var blackout = document.createElement('div');
        blackout.setAttribute('aria-hidden', 'true');
        blackout.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
          'background:#14100b;z-index:99992;pointer-events:none;opacity:1;transition:opacity 1.3s';
        document.body.appendChild(blackout);
        for (var i = 0; i < eyes.length; i++) {
          eyes[i].el.style.zIndex = '99993';
          eyes[i].el.style.transform = 'scale(1.6)';
        }
        requestAnimationFrame(function () { blackout.style.opacity = '0'; });
        setTimeout(function () {
          blackout.remove();
          for (var j = 0; j < eyes.length; j++) {
            eyes[j].el.style.zIndex = '';
            eyes[j].el.style.transform = '';
          }
        }, 1400);
      } else {
        // Caught in the open. Everything bolts.
        if (idleAnts.length) scatterAnts();
        fillInUnderground();
      }
    });
  }

  // ──────────────────────────────────────────────
  // 7. ANT SCROLL PROGRESS BAR
  // ──────────────────────────────────────────────
  var progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:3px;z-index:99997;pointer-events:none;';
  var progressTrail = document.createElement('div');
  progressTrail.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,transparent 0%,#357edd 60%,#357edd 100%);transition:width 0.1s;border-top-right-radius:2px;border-bottom-right-radius:2px;';
  progressBar.appendChild(progressTrail);
  var progressAnt = document.createElement('div');
  progressAnt.textContent = '\uD83D\uDC1C';
  progressAnt.style.cssText = 'position:absolute;top:-8px;font-size:14px;transition:left 0.1s;transform:scaleX(-1);';
  progressBar.appendChild(progressAnt);
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressTrail.style.width = pct + '%';
    progressAnt.style.left = 'calc(' + pct + '% - 7px)';
  }, { passive: true });

  // ──────────────────────────────────────────────
  // 8. SWEAR JAR
  // ──────────────────────────────────────────────
  var jarPattern = /\b(fuck|fucking|fucked|fucker|shit|shitty|bullshit|damn|damned|ass|asshole|bastard|crap|crappy|hell)\b/gi;

  function countSwears() {
    var body = document.querySelector('.markdown-body');
    if (!body) return 0;
    var text = body.textContent || '';
    var matches = text.match(jarPattern);
    return matches ? matches.length : 0;
  }

  var swearCount = countSwears();
  if (swearCount > 0) {
    var jar = document.createElement('div');
    jar.style.cssText = 'text-align:center;color:#aaa;font-family:Cousine,monospace;font-size:11px;margin-top:8px;cursor:pointer;';
    jar.textContent = 'Swear jar: $' + (swearCount * 0.25).toFixed(2);
    jar.title = swearCount + ' spicy words detected';
    jar.addEventListener('click', function () {
      jar.textContent = swearCount + ' spicy words. This post owes $' + (swearCount * 0.25).toFixed(2) + ' to the jar.';
    });
    var footer = document.querySelector('footer');
    if (footer) footer.appendChild(jar);
  }

  // ──────────────────────────────────────────────
  // 9. IDLE CURSOR ANT COLONY
  // ──────────────────────────────────────────────
  var idleTimer = null;
  var idleAnts = [];
  var idleAnimId = null;
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;

  // Ants are nocturnal. Underground (§6) they lose patience sooner, come in
  // twice the numbers, and disturb the dirt behind them.
  function resetIdle() {
    clearTimeout(idleTimer);
    if (idleAnts.length > 0) scatterAnts();
    idleTimer = setTimeout(spawnIdleAnts, isDark() ? 20000 : 30000);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (idleAnts.length > 0) resetIdle();
  });
  document.addEventListener('keydown', resetIdle);
  document.addEventListener('click', resetIdle);
  resetIdle();

  var idleFrame = 0;

  function spawnIdleAnts() {
    var dark = isDark();
    for (var i = 0; i < (dark ? 16 : 8); i++) {
      var ant = document.createElement('div');
      ant.textContent = '\uD83D\uDC1C';
      ant.style.cssText = 'position:fixed;font-size:14px;z-index:99996;pointer-events:none;transition:none;opacity:0;';
      var angle = Math.random() * Math.PI * 2;
      var dist = 200 + Math.random() * 200;
      var ax = mouseX + Math.cos(angle) * dist;
      var ay = mouseY + Math.sin(angle) * dist;
      ant.style.left = ax + 'px';
      ant.style.top = ay + 'px';
      document.body.appendChild(ant);

      // Four reused dots per ant rather than a stream of new ones \u2014 a trail
      // that costs a fixed number of elements no matter how long you sit still.
      var trail = null;
      if (dark) {
        trail = [];
        for (var t = 0; t < 4; t++) {
          var dot = document.createElement('div');
          dot.style.cssText = 'position:fixed;width:3px;height:3px;border-radius:50%;' +
            'background:#d9c98a;z-index:99995;pointer-events:none;opacity:' +
            (0.2 - t * 0.045).toFixed(3) + ';';
          document.body.appendChild(dot);
          trail.push(dot);
        }
      }
      idleAnts.push({ el: ant, x: ax, y: ay, opacity: 0, trail: trail, past: [] });
    }
    idleAnimId = requestAnimationFrame(animateIdleAnts);
  }

  function animateIdleAnts() {
    idleFrame++;
    for (var i = 0; i < idleAnts.length; i++) {
      var a = idleAnts[i];
      var dx = mouseX - a.x;
      var dy = mouseY - a.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        a.x += (dx / dist) * 1.2;
        a.y += (dy / dist) * 1.2;
        // Add slight wobble
        a.x += Math.sin(Date.now() * 0.003 + i) * 0.5;
        a.y += Math.cos(Date.now() * 0.003 + i * 1.5) * 0.5;
      }
      if (a.opacity < 1) a.opacity = Math.min(1, a.opacity + 0.02);
      a.el.style.left = a.x + 'px';
      a.el.style.top = a.y + 'px';
      a.el.style.opacity = a.opacity;
      // Flip ant to face cursor
      a.el.style.transform = dx < 0 ? 'scaleX(-1)' : '';

      if (a.trail && idleFrame % 6 === 0) {
        a.past.unshift({ x: a.x, y: a.y });
        a.past.length = Math.min(a.past.length, a.trail.length);
        for (var t = 0; t < a.past.length; t++) {
          a.trail[t].style.left = (a.past[t].x + 4) + 'px';
          a.trail[t].style.top = (a.past[t].y + 10) + 'px';
        }
      }
    }
    idleAnimId = requestAnimationFrame(animateIdleAnts);
  }

  function scatterAnts() {
    cancelAnimationFrame(idleAnimId);
    for (var i = 0; i < idleAnts.length; i++) {
      var a = idleAnts[i];
      a.el.style.transition = 'opacity 0.3s, top 0.6s, left 0.6s';
      a.el.style.opacity = '0';
      var angle = Math.random() * Math.PI * 2;
      a.el.style.left = (a.x + Math.cos(angle) * 300) + 'px';
      a.el.style.top = (a.y + Math.sin(angle) * 300) + 'px';
      if (a.trail) {
        for (var t = 0; t < a.trail.length; t++) {
          a.trail[t].style.transition = 'opacity 0.3s';
          a.trail[t].style.opacity = '0';
          (function (dot) { setTimeout(function () { dot.remove(); }, 400); })(a.trail[t]);
        }
      }
      (function (el) {
        setTimeout(function () { el.remove(); }, 600);
      })(a.el);
    }
    idleAnts = [];
  }

  // ──────────────────────────────────────────────
  // 12. POST AGING
  // ──────────────────────────────────────────────
  var main = document.querySelector('main[data-post-date]');
  if (main) {
    var postDate = new Date(main.getAttribute('data-post-date'));
    var ageInDays = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays > 180) {
      var sepiaAmount = Math.min((ageInDays - 180) / 700, 0.3);
      main.style.filter = 'sepia(' + sepiaAmount + ')';

      // Coffee stain for posts older than 2 years
      if (ageInDays > 730) {
        var stain = document.createElement('img');
        stain.src = '/images/coffee-stain-png-9.png';
        stain.style.cssText = 'position:absolute;top:40px;right:10px;width:150px;height:150px;pointer-events:none;transform:rotate(-15deg);z-index:0;opacity:0.6;';
        main.appendChild(stain);
      }
    }
  }

  // ──────────────────────────────────────────────
  // 13. CONSOLE API
  // ──────────────────────────────────────────────
  // §2 tells you to go touch grass. This is for the people who don't, and
  // it's the thing /humans.txt promises is waiting down here.
  //
  // Every command returns an ant instead of `undefined`, because the console
  // echoes the return value either way and one of those is funnier.
  var ANT = '🐜';
  var MONO = 'font-family:Cousine,monospace;font-size:12px;line-height:1.7;';
  var BLUE = MONO + 'color:#357edd;';
  var DIM = MONO + 'color:#999;';

  function help() {
    console.log(
      '%c  antfarm.systems, from the inside\n' +
      '%c' +
      '  antfarm.help()      this\n' +
      '  antfarm.ants(n)     release the colony (default 40, max 200)\n' +
      '  antfarm.steal()     ants haul a word out of this page\n' +
      '  antfarm.confetti()  glitter, no swearing required\n' +
      '  antfarm.nocturnal() go underground, whatever your system says\n' +
      '  antfarm.surface()   come back up\n' +
      '  antfarm.moth()      Grace Hopper\'s moth, any day of the year\n' +
      '  antfarm.hopper()    a better line than anything I\'ve written\n' +
      '  antfarm.stats()     what this page is made of\n' +
      '  antfarm.eggs()      every egg on the site, spoiled\n' +
      '%c\n' +
      '  The Konami code still works if you\'d rather use your hands:\n' +
      '  ↑ ↑ ↓ ↓ ← → ← → B A\n',
      MONO + 'font-size:13px;font-weight:bold;color:#357edd;', BLUE, DIM
    );
    return ANT;
  }

  // Pick a word out of the post and hand it to the same thieves as §5.
  function stealRandomWord() {
    if (thieving) {
      console.log('%c  The ants already have their hands full. Wait for them.', DIM);
      return null;
    }
    var body = document.querySelector('.markdown-body');
    if (!body) {
      console.log('%c  Nothing to steal — this page has no post text.', DIM);
      return null;
    }

    var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);
    var all = [], onScreen = [], node, host, rect;
    while ((node = walker.nextNode())) {
      if (!/[A-Za-z]{4,}/.test(node.nodeValue)) continue;
      host = node.parentNode;
      // Code, headings and an in-progress theft are load-bearing. Leave them.
      if (host.closest && host.closest('pre, code, h1, h2, h3, .af-stolen')) continue;
      all.push(node);
      rect = host.getBoundingClientRect();
      if (rect.top > 40 && rect.bottom < window.innerHeight - 40) onScreen.push(node);
    }

    // Stealing a word you can't see is just a stall, so prefer the viewport.
    var pool = onScreen.length ? onScreen : all;
    for (var tries = 0; tries < 12 && pool.length; tries++) {
      var target = pool[Math.floor(Math.random() * pool.length)];
      var words = [], re = /[A-Za-z][A-Za-z'’-]{3,15}/g, m;
      while ((m = re.exec(target.nodeValue))) {
        if (!profanityPattern.test(m[0])) words.push(m); // §3's words, not the ants' to take
      }
      if (!words.length) continue;

      var pick = words[Math.floor(Math.random() * words.length)];
      var range = document.createRange();
      range.setStart(target, pick.index);
      range.setEnd(target, pick.index + pick[0].length);

      var span = document.createElement('span');
      span.className = 'af-stolen';
      span.style.cssText = 'display:inline-block;will-change:transform;';
      try {
        range.surroundContents(span);
      } catch (e) {
        continue; // straddled some markup; try a different word
      }
      stealWord(span);
      console.log('%c  ' + ANT + ' They\'re taking "' + pick[0] + '". They\'ll bring it back.', BLUE);
      return pick[0];
    }

    console.log('%c  The ants looked, and found nothing worth carrying.', DIM);
    return null;
  }

  function pageStats() {
    var body = document.querySelector('.markdown-body');
    var text = body ? (body.textContent || '') : '';
    var words = (text.match(/\S+/g) || []).length;
    var swears = countSwears();
    var out = {
      words: words,
      // No reading-time estimate. /humans.txt takes a position on that.
      paragraphs: document.querySelectorAll('.markdown-body p').length,
      swears: swears,
      owedToTheSwearJar: '$' + (swears * 0.25).toFixed(2),
      links: document.querySelectorAll('.markdown-body a').length
    };
    var dated = document.querySelector('main[data-post-date]');
    if (dated) {
      var published = dated.getAttribute('data-post-date');
      var days = Math.floor((Date.now() - new Date(published).getTime()) / 86400000);
      out.published = published;
      out.daysOld = days;
      // Mirrors §12 so the number matches the yellowing you can actually see.
      out.yellowing = days > 180
        ? 'sepia(' + Math.min((days - 180) / 700, 0.3).toFixed(2) + ')' + (days > 730 ? ' + coffee stain' : '')
        : 'none';
    }
    return out;
  }

  function eggs() {
    console.table([
      { egg: 'Konami code',        where: 'anywhere',        how: '↑↑↓↓←→←→BA — the colony marches up the page' },
      { egg: 'Console art',        where: 'anywhere',        how: 'you found this one already' },
      { egg: 'Profanity confetti', where: 'any post',        how: 'select a swear' },
      { egg: 'Word theft',         where: 'any post',        how: 'double-click a word — swears excluded, they belong to the confetti' },
      { egg: 'The underground',    where: 'anywhere',        how: 'dark mode — tunnels get dug in the soil and something walks them. ?dark forces it' },
      { egg: "Hopper's moth",      where: 'anywhere',        how: 'December 9, or add ?moth to any URL' },
      { egg: 'Scroll ant',         where: 'anywhere',        how: 'the bar at the top of the page is being carried' },
      { egg: 'Swear jar',          where: 'spicy posts',     how: 'in the footer, at 25¢ a word. Click it' },
      { egg: 'Idle colony',        where: 'anywhere',        how: 'take your hands off the mouse for 30 seconds' },
      { egg: 'Post aging',         where: 'old posts',       how: 'sepia after 6 months, coffee stain after 2 years' },
      { egg: 'Ants eat the 404',   where: '/anything-fake',  how: 'they carry the graphic off the page' },
      { egg: 'humans.txt',         where: '/humans.txt',     how: 'the colophon' },
      { egg: 'This',               where: 'the console',     how: 'antfarm.help()' }
    ]);
    return ANT;
  }

  function hopper() {
    console.log(
      '%c  "The most dangerous phrase in the language is:\n' +
      '   we\'ve always done it this way."\n' +
      '%c  — Grace Hopper, Rear Admiral, USN\n' +
      '  antfarm.systems/posts/happy-birthday-grace-hopper',
      BLUE, DIM
    );
    return ANT;
  }

  // Don't clobber anything that got here first.
  if (!window.antfarm) {
    window.antfarm = {
      help: help,
      ants: function (n) { unleashAnts(n); return ANT; },
      steal: stealRandomWord,
      confetti: function () {
        burstConfetti(window.innerWidth / 2, window.innerHeight / 3);
        return ANT;
      },
      nocturnal: function () {
        forcedDark = true;
        paintDarkPalette();
        digUnderground();
        return ANT;
      },
      surface: function () {
        forcedDark = false;
        var forced = document.getElementById('af-forced-dark');
        if (forced) forced.remove();
        if (!isDark()) fillInUnderground(); // your system may still say night
        return ANT;
      },
      // Asking for the moth out loud outranks prefers-reduced-motion the same
      // way ?moth does — it still settles instead of fluttering if you've set it.
      moth: function () { summonMoth(); return ANT; },
      hopper: hopper,
      stats: pageStats,
      eggs: eggs
    };
  }

})();
