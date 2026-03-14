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
      // Subtle sepia for posts older than 6 months
      var sepiaAmount = Math.min((ageInDays - 180) / 700, 0.3);
      main.style.filter = 'sepia(' + sepiaAmount + ')';

      // Coffee stain for posts older than 2 years
      if (ageInDays > 730) {
        var stain = document.createElement('div');
        stain.style.cssText = 'position:absolute;top:60px;right:20px;width:120px;height:100px;border-radius:50%;background:radial-gradient(ellipse,rgba(139,90,43,0.08) 0%,rgba(139,90,43,0.04) 50%,transparent 70%);pointer-events:none;transform:rotate(-15deg);z-index:0;';
        main.appendChild(stain);

        // Second smaller stain
        var stain2 = document.createElement('div');
        stain2.style.cssText = 'position:absolute;bottom:120px;left:40px;width:80px;height:70px;border-radius:50%;background:radial-gradient(ellipse,rgba(139,90,43,0.06) 0%,rgba(139,90,43,0.03) 50%,transparent 70%);pointer-events:none;transform:rotate(30deg);z-index:0;';
        main.appendChild(stain2);
      }
    }
  }

})();
