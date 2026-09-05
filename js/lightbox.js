/**
 * antfarm.systems photo lightbox
 * Click a photo to see it big on a dark field. Zero dependencies, deferred,
 * unminified on purpose like js/easter-eggs.js.
 *
 * Progressive enhancement: with JS off, a `figure.photo` is an ordinary inline
 * photo and nothing here is missed. Everything that makes it clickable — the
 * cursor, the tabindex, the button role — is added by this file, so the markup
 * never advertises an interaction that isn't there.
 *
 * Scoped to `figure.photo` on purpose. Book covers, the header ant and the
 * signoff scribble are furniture, not photographs, and shouldn't zoom.
 */
(function () {
  'use strict';

  var figures = document.querySelectorAll('.markdown-body figure.photo');
  if (!figures.length) return;

  var overlay = null;
  var overlayImg = null;
  var overlayCap = null;
  var closeBtn = null;
  var opener = null;
  var scrollLock = '';

  // ──────────────────────────────────────────────
  // 1. THE OVERLAY, BUILT ONCE AND REUSED
  // ──────────────────────────────────────────────
  // Appended to <body>, not left inside the post. Two reasons: `main` is
  // `overflow-hidden`, and the dark-mode rule at the bottom of style.css dims
  // every image inside .markdown-body — a photo you opened on purpose should
  // not be the dimmed copy.
  function build() {
    overlay = document.createElement('div');
    overlay.className = 'af-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.hidden = true;

    closeBtn = document.createElement('button');
    closeBtn.className = 'af-lightbox-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close photo');
    closeBtn.innerHTML = '&times;';

    overlayImg = document.createElement('img');
    overlayCap = document.createElement('p');
    overlayCap.className = 'af-lightbox-cap';

    overlay.appendChild(closeBtn);
    overlay.appendChild(overlayImg);
    overlay.appendChild(overlayCap);
    document.body.appendChild(overlay);

    // Anywhere on the dark field closes it, the image included — the cursor is
    // a zoom-out everywhere, so a click that did nothing would be a small lie.
    overlay.addEventListener('click', close);
  }

  // ──────────────────────────────────────────────
  // 2. OPEN / CLOSE
  // ──────────────────────────────────────────────
  function open(img, caption) {
    if (!overlay) build();

    // currentSrc, so a responsive srcset picks the copy the browser actually
    // fetched instead of re-downloading a different one.
    overlayImg.src = img.currentSrc || img.src;
    overlayImg.alt = img.alt || '';
    overlay.setAttribute('aria-label', img.alt ? 'Photo: ' + img.alt : 'Photo');

    overlayCap.textContent = caption || '';
    overlayCap.hidden = !caption;

    // The photo that opened it, so closing puts you back on it. NOT
    // document.activeElement: a mouse click on an image doesn't focus the image,
    // so that would hand focus to <body> and lose the reader's place on the page.
    // The img carries tabindex and role=button, so it's a legitimate focus
    // target, and :focus-visible means a mouse-driven return draws no ring.
    opener = img;
    overlay.hidden = false;

    // Lock the page behind it. Reading the inline style first so we restore
    // whatever was there rather than blanking it.
    scrollLock = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    // The opacity transition needs the browser to have seen the pre-open style
    // before the class lands, and reading a layout property forces exactly that.
    // Deliberately NOT requestAnimationFrame: rAF is throttled to nothing in a
    // background tab and stalls outright in headless Chrome, which would leave
    // this overlay un-faded at opacity 0 — an invisible modal swallowing every
    // click on the page. A forced reflow always happens.
    void overlay.offsetWidth;
    overlay.classList.add('is-open');

    closeBtn.focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow = scrollLock;

    // Wait out the fade before hiding, but don't trust transitionend to fire —
    // under `prefers-reduced-motion` style.css kills every transition, so the
    // event never arrives and the overlay would stay in the tree forever.
    setTimeout(function () {
      if (overlay.classList.contains('is-open')) return; // reopened meanwhile
      overlay.hidden = true;
      overlayImg.removeAttribute('src');
    }, 240);

    if (opener && opener.focus) opener.focus();
    opener = null;
  }

  // ──────────────────────────────────────────────
  // 3. WIRE UP EACH FIGURE
  // ──────────────────────────────────────────────
  Array.prototype.forEach.call(figures, function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    if (img.closest('a')) return; // already a link; don't fight it

    // The caption carried into the overlay: the prose line if there is one,
    // otherwise the EXIF, so the zoomed view still says what it was shot on.
    var capEl = fig.querySelector('.photo-caption') || fig.querySelector('.photo-exif');
    var caption = capEl ? capEl.textContent.trim() : '';

    // Marks the figure as live so style.css can set `cursor: zoom-in` only
    // where clicking actually does something.
    fig.classList.add('af-zoomable');

    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', img.alt ? 'Enlarge photo: ' + img.alt : 'Enlarge photo');

    img.addEventListener('click', function () { open(img, caption); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault(); // Space would scroll the page out from under it
        open(img, caption);
      }
    });
  });

  // ──────────────────────────────────────────────
  // 4. KEYBOARD, WHILE OPEN
  // ──────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (!overlay || overlay.hidden) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      close();
    } else if (e.key === 'Tab') {
      // The close button is the only thing in here, so the trap is just
      // "stay on it" rather than a real focus cycle.
      e.preventDefault();
      closeBtn.focus();
    }
  });
})();
