/* Spark English Center — interactions */
(function () {
  'use strict';

  /* ---- year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky header shadow ---- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  var mnav = document.getElementById('mnav');
  var toggle = document.getElementById('navToggle');
  function openNav() { if (mnav) { mnav.classList.add('open'); toggle && toggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; } }
  function closeNav() { if (mnav) { mnav.classList.remove('open'); toggle && toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; } }
  toggle && toggle.addEventListener('click', openNav);
  mnav && mnav.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---- reveal + count-up (viewport-sweep based; robust in all contexts) ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  function inView(el, margin) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < (vh - (margin || 0)) && r.bottom > 0;
  }

  function countUp(el) {
    if (el.__counted) return;
    el.__counted = true;
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var dur = 1300, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(step);
  }

  var ticking = false;
  function sweep() {
    revealEls.forEach(function (el) {
      if (!el.classList.contains('in') && inView(el, 40)) el.classList.add('in');
    });
    counters.forEach(function (el) {
      if (!el.__counted && inView(el, 60)) countUp(el);
    });
    ticking = false;
  }
  function requestSweep() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sweep);
  }

  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  } else {
    requestSweep();
    window.addEventListener('scroll', requestSweep, { passive: true });
    window.addEventListener('resize', requestSweep, { passive: true });
    // safety net: never leave content hidden if transitions stall (e.g. capture contexts)
    setTimeout(function () {
      document.documentElement.classList.add('reveal-fallback');
      counters.forEach(function (el) { if (!el.__counted) { el.textContent = el.getAttribute('data-count'); } });
    }, 1100);
  }

  /* ---- smooth anchor + close mobile nav ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---- form validation + success ---- */
  var form = document.getElementById('bookForm');
  var card = document.getElementById('formCard');
  if (form && card) {
    function setError(field, on) {
      var f = field.closest('.field');
      if (f) f.classList.toggle('invalid', !!on);
    }
    function validPhone(v) {
      var digits = (v || '').replace(/[^0-9]/g, '');
      return digits.length >= 8 && digits.length <= 15;
    }
    function validateField(field) {
      var v = (field.value || '').trim();
      var ok = true;
      if (field.id === 'phone') ok = validPhone(v);
      else if (field.hasAttribute('required')) ok = v.length > 0;
      setError(field, !ok);
      return ok;
    }
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { if (field.closest('.field').classList.contains('invalid')) validateField(field); });
      field.addEventListener('input', function () { if (field.closest('.field').classList.contains('invalid')) validateField(field); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
      var allOk = true, firstBad = null;
      fields.forEach(function (field) {
        var ok = validateField(field);
        if (!ok && !firstBad) firstBad = field;
        allOk = allOk && ok;
      });
      if (!allOk) { firstBad && firstBad.focus(); return; }
      card.classList.add('done');
      var top = card.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();
