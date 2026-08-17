/* Spark English Center — blog detail interactions
   (works alongside spark.js: header, mobile nav, reveal all reused) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reading progress bar ---- */
  var bar = document.getElementById('readProgress');
  var article = document.getElementById('article');
  function progress() {
    if (!bar || !article) return;
    var rect = article.getBoundingClientRect();
    var total = article.offsetHeight - window.innerHeight;
    var passed = -rect.top;
    var pct = total > 0 ? Math.min(Math.max(passed / total, 0), 1) : 0;
    bar.style.width = (pct * 100).toFixed(2) + '%';
  }

  /* ---- TOC scrollspy ---- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  var sections = tocLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  function spy() {
    if (!sections.length) return;
    var mark = window.scrollY + 120;
    var current = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= mark) current = sections[i].id;
    }
    tocLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      progress();
      spy();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---- close mobile TOC after picking a section ---- */
  var mtoc = document.getElementById('tocMobile');
  if (mtoc) {
    mtoc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () { mtoc.removeAttribute('open'); });
    });
  }

  /* ---- single-open FAQ (accordion feel, still native + schema friendly) ---- */
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        faqs.forEach(function (o) { if (o !== d) o.removeAttribute('open'); });
      }
    });
  });
})();
