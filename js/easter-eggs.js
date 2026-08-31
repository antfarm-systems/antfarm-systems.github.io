/**
 * antfarm.systems easter eggs
 * ~2.5KB minified. Zero dependencies. Deferred loading.
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

  function unleashAnts() {
    var count = 40;
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
  // Add ?moth or #moth to any URL to summon it on the other 364 days.
  (function () {
    var today = new Date();
    var forced = location.search.indexOf('moth') > -1 || location.hash === '#moth';
    if (!forced && !(today.getMonth() === 11 && today.getDate() === 9)) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var style = document.createElement('style');
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
  })();

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

  function resetIdle() {
    clearTimeout(idleTimer);
    if (idleAnts.length > 0) scatterAnts();
    idleTimer = setTimeout(spawnIdleAnts, 30000);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (idleAnts.length > 0) resetIdle();
  });
  document.addEventListener('keydown', resetIdle);
  document.addEventListener('click', resetIdle);
  resetIdle();

  function spawnIdleAnts() {
    for (var i = 0; i < 8; i++) {
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
      idleAnts.push({ el: ant, x: ax, y: ay, opacity: 0 });
    }
    idleAnimId = requestAnimationFrame(animateIdleAnts);
  }

  function animateIdleAnts() {
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

})();
