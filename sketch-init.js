/* Rough.js init for sketch theme — only runs when ?style=sketch active.
   Adds genuine hand-drawn rendering on hero elements where CSS-dashed
   borders fall short of authenticity:

   - B4 table outline (replaces CSS dashed wrapper)
   - B5 skeleton avatar circles (replaces CSS dashed circles)
   - B1 H1 underline (replaces pseudo-element marker)
   - B4 Earn-from row red-pen circle (new — emphasis annotation)

   Rough.js loaded from jsDelivr CDN (~9kb gzipped). If network fails,
   page falls back to CSS dashed-border treatments — graceful degradation. */

(function () {
  if (document.documentElement.getAttribute('data-theme') !== 'sketch') return;

  var INK = '#1a1815';
  var RED = '#c83a3a';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function ready(fn) {
    if (document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  // Load rough.js then init
  var rj = document.createElement('script');
  rj.src = 'https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.min.js';
  rj.async = false;
  rj.onload = function () {
    ready(function () {
      document.body.classList.add('rough-loaded');
      drawAll();

      var t;
      window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(drawAll, 200);
      });
    });
  };
  rj.onerror = function () {
    // Fallback: CSS dashed borders remain in place
    console.warn('[sketch] rough.js failed to load — falling back to CSS dashed treatment');
  };
  document.head.appendChild(rj);

  function svgEl(width, height) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('width', width);
    s.setAttribute('height', height);
    s.style.position = 'absolute';
    s.style.top = '0';
    s.style.left = '0';
    s.style.pointerEvents = 'none';
    s.classList.add('rough-svg');
    return s;
  }

  function clearRoughSvgs() {
    Array.prototype.forEach.call(document.querySelectorAll('.rough-svg'), function (n) {
      n.parentNode && n.parentNode.removeChild(n);
    });
  }

  function drawAll() {
    if (!window.rough) return;
    clearRoughSvgs();
    drawTableOutline();
    drawSkeletonAvatars();
    drawHeadlineUnderline();
    drawHighlightRowCircle();
  }

  function drawTableOutline() {
    var wrap = document.querySelector('.diff .table-wrap');
    if (!wrap) return;

    var r = wrap.getBoundingClientRect();
    var svg = svgEl(r.width, r.height);

    var rc = rough.svg(svg);
    svg.appendChild(rc.rectangle(6, 6, r.width - 12, r.height - 12, {
      stroke: INK,
      strokeWidth: 1.8,
      roughness: 2.2,
      bowing: 1.4,
      seed: 42
    }));

    wrap.style.position = 'relative';
    wrap.insertBefore(svg, wrap.firstChild);
  }

  function drawSkeletonAvatars() {
    var nodes = document.querySelectorAll('.skel-avatar');
    Array.prototype.forEach.call(nodes, function (n, i) {
      var r = n.getBoundingClientRect();
      if (r.width < 4) return;
      var svg = svgEl(r.width, r.height);

      var rc = rough.svg(svg);
      svg.appendChild(rc.circle(r.width / 2, r.height / 2, r.width - 4, {
        stroke: INK,
        strokeWidth: 1.4,
        roughness: 2.8,
        seed: i + 11
      }));

      n.style.position = 'relative';
      n.appendChild(svg);
    });
  }

  function drawHeadlineUnderline() {
    var h1 = document.querySelector('.hero h1');
    if (!h1) return;

    var r = h1.getBoundingClientRect();
    var svg = svgEl(r.width, 28);
    svg.style.top = 'auto';
    svg.style.bottom = '-18px';
    svg.style.left = '0';

    var rc = rough.svg(svg);
    svg.appendChild(rc.line(
      r.width * 0.04, 14,
      r.width * 0.96, 12,
      {
        stroke: INK,
        strokeWidth: 3.5,
        roughness: 3,
        bowing: 2.2,
        seed: 7
      }
    ));

    h1.style.position = 'relative';
    h1.appendChild(svg);
  }

  function drawHighlightRowCircle() {
    var row = document.querySelector('.diff .highlight-row');
    if (!row) return;

    var wrap = row.closest('.table-wrap');
    if (!wrap) return;

    var wrapR = wrap.getBoundingClientRect();
    var rowR = row.getBoundingClientRect();

    var x = rowR.left - wrapR.left;
    var y = rowR.top - wrapR.top;

    var pad = 6;
    var svg = svgEl(rowR.width + pad * 2, rowR.height + pad * 2);
    svg.style.top = (y - pad) + 'px';
    svg.style.left = (x - pad) + 'px';

    var rc = rough.svg(svg);
    svg.appendChild(rc.rectangle(2, 2, rowR.width + (pad * 2) - 4, rowR.height + (pad * 2) - 4, {
      stroke: RED,
      strokeWidth: 2.2,
      roughness: 3.5,
      bowing: 2,
      seed: 13
    }));

    wrap.appendChild(svg);
  }
})();
