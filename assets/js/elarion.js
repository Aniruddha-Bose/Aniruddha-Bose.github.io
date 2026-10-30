// "The Shadow of Elarion" — page-flip book reader.
// Vanilla JS: prev/next with a 3D page-turn animation, zoom, and hand-tool panning.

(function () {
  var frame = document.getElementById('book-frame');
  if (!frame) return;

  var total = parseInt(frame.dataset.pages, 10) || 1;
  var base = frame.dataset.base || '';
  var ext = frame.dataset.ext || 'jpg';

  var viewport = document.getElementById('viewport');
  var canvas = document.getElementById('canvas');
  var img = document.getElementById('page-img');
  var prevBtn = document.getElementById('prev');
  var nextBtn = document.getElementById('next');
  var indicator = document.getElementById('page-indicator');
  var zoomInBtn = document.getElementById('zoom-in');
  var zoomOutBtn = document.getElementById('zoom-out');
  var zoomLabel = document.getElementById('zoom-label');
  var handBtn = document.getElementById('tool-hand');
  var fullscreenBtn = document.getElementById('fullscreen');
  var reader = frame.closest('.reader');

  var current = 1;
  var scale = 1, tx = 0, ty = 0;
  var handActive = false, animating = false, dragging = false;
  var sx = 0, sy = 0, stx = 0, sty = 0;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }
  function src(n) {
    return base + 'page-' + pad(n) + '.' + ext;
  }
  function preload(n) {
    if (n >= 1 && n <= total) {
      var i = new Image();
      i.src = src(n);
    }
  }

  function applyTransform() {
    canvas.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }
  function clampPan() {
    var mx = (viewport.clientWidth * (scale - 1)) / 2;
    var my = (viewport.clientHeight * (scale - 1)) / 2;
    tx = Math.max(-mx, Math.min(mx, tx));
    ty = Math.max(-my, Math.min(my, ty));
  }
  function resetZoom() {
    scale = 1; tx = 0; ty = 0;
    applyTransform();
  }
  function setZoom(v) {
    scale = Math.max(1, Math.min(4, Math.round(v * 100) / 100));
    if (scale === 1) { tx = 0; ty = 0; }
    clampPan();
    applyTransform();
    updateChrome();
  }

  function updateChrome() {
    indicator.textContent = 'Page ' + current + ' / ' + total;
    prevBtn.disabled = current <= 1 || animating;
    nextBtn.disabled = current >= total || animating;
    zoomLabel.textContent = Math.round(scale * 100) + '%';
    frame.classList.toggle('pannable', handActive || scale > 1);
  }

  function flip(dir) {
    if (animating) return;
    var target = current + dir;
    if (target < 1 || target > total) return;

    animating = true;
    resetZoom();
    updateChrome();

    var flipEl = document.createElement('div');
    flipEl.className = 'flip-page';
    var fimg = document.createElement('img');
    var shade = document.createElement('div');
    shade.className = 'flip-shade';
    flipEl.appendChild(fimg);
    flipEl.appendChild(shade);

    var fromDeg, toDeg;
    if (dir === 1) {
      // Forward: the flipping page shows the CURRENT page and turns away,
      // revealing the TARGET page placed underneath.
      fimg.src = src(current);
      img.src = src(target);
      fromDeg = 0;
      toDeg = -180;
    } else {
      // Backward: the flipping page shows the TARGET (previous) page and
      // swings in from the spine over the still-visible current page.
      fimg.src = src(target);
      fromDeg = -180;
      toDeg = 0;
    }

    flipEl.style.transform = 'rotateY(' + fromDeg + 'deg)';
    frame.appendChild(flipEl);

    var anim = flipEl.animate(
      [{ transform: 'rotateY(' + fromDeg + 'deg)' }, { transform: 'rotateY(' + toDeg + 'deg)' }],
      { duration: 650, easing: 'ease-in-out', fill: 'forwards' }
    );
    shade.animate(
      [{ opacity: 0 }, { opacity: 0.5 }, { opacity: 0 }],
      { duration: 650, easing: 'ease-in-out' }
    );

    anim.onfinish = function () {
      if (dir === -1) { img.src = src(target); }
      if (flipEl.parentNode) flipEl.parentNode.removeChild(flipEl);
      current = target;
      animating = false;
      updateChrome();
      preload(current + 1);
      preload(current - 1);
    };
  }

  // --- Navigation ---
  prevBtn.addEventListener('click', function () { flip(-1); });
  nextBtn.addEventListener('click', function () { flip(1); });

  // --- Zoom ---
  zoomInBtn.addEventListener('click', function () { setZoom(scale + 0.25); });
  zoomOutBtn.addEventListener('click', function () { setZoom(scale - 0.25); });
  zoomLabel.addEventListener('click', function () { resetZoom(); updateChrome(); });

  // --- Fullscreen ---
  function fullscreenEl() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }
  function toggleFullscreen() {
    if (fullscreenEl()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      (reader.requestFullscreen || reader.webkitRequestFullscreen).call(reader);
    }
  }
  function onFullscreenChange() {
    var on = !!fullscreenEl();
    reader.classList.toggle('is-fullscreen', on);
    fullscreenBtn.setAttribute('aria-label', on ? 'Exit fullscreen' : 'Enter fullscreen');
    fullscreenBtn.title = on ? 'Exit fullscreen (F)' : 'Fullscreen (F)';
    resetZoom();
    updateChrome();
  }
  if (reader.requestFullscreen || reader.webkitRequestFullscreen) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  } else {
    // e.g. iPhone Safari, which has no element fullscreen
    fullscreenBtn.hidden = true;
  }

  viewport.addEventListener('wheel', function (e) {
    e.preventDefault();
    setZoom(scale + (e.deltaY < 0 ? 0.2 : -0.2));
  }, { passive: false });

  // --- Hand tool / panning ---
  handBtn.addEventListener('click', function () {
    handActive = !handActive;
    handBtn.classList.toggle('active', handActive);
    updateChrome();
  });

  viewport.addEventListener('pointerdown', function (e) {
    if (animating) return;
    if (!(handActive || scale > 1)) return;
    dragging = true;
    frame.classList.add('grabbing');
    sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
    try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
  });
  viewport.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    tx = stx + (e.clientX - sx);
    ty = sty + (e.clientY - sy);
    clampPan();
    applyTransform();
  });
  function endDrag() {
    if (dragging) {
      dragging = false;
      frame.classList.remove('grabbing');
    }
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // --- Keyboard ---
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { flip(1); }
    else if (e.key === 'ArrowLeft') { flip(-1); }
    else if (e.key === '+' || e.key === '=') { setZoom(scale + 0.25); }
    else if (e.key === '-' || e.key === '_') { setZoom(scale - 0.25); }
    else if ((e.key === 'f' || e.key === 'F') && !fullscreenBtn.hidden) { toggleFullscreen(); }
  });

  // --- Init ---
  img.src = src(1);
  updateChrome();
  preload(2);
})();
