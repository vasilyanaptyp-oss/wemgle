(function () {
  'use strict';
  var d = document;
  d.documentElement.classList.add('js');

  /* header: solid after scroll */
  var top = d.getElementById('top');
  function onScroll() { top.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile nav */
  var burger = d.getElementById('burger');
  var nav = d.getElementById('nav');
  function closeNav() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Otwórz menu');
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* reveal on scroll */
  var items = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* reservation form -> mailto */
  var form = d.getElementById('rform');
  var err = d.getElementById('f-err');
  var dateEl = d.getElementById('f-data');
  if (dateEl) {
    var t = new Date();
    var m = String(t.getMonth() + 1).padStart(2, '0');
    var day = String(t.getDate()).padStart(2, '0');
    dateEl.min = t.getFullYear() + '-' + m + '-' + day;
  }
  function fmtDate(v) {
    var p = v.split('-');
    return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : v;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ids = ['f-data', 'f-godzina', 'f-osoby', 'f-imie', 'f-tel'];
    var missing = [];
    ids.forEach(function (id) {
      var el = d.getElementById(id);
      var bad = !el.value.trim();
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) missing.push(el);
    });
    if (missing.length) {
      err.hidden = false;
      err.textContent = 'Uzupełnij wymagane pola: data, godzina, liczba osób, imię i telefon.';
      missing[0].focus();
      return;
    }
    err.hidden = true;
    var data = fmtDate(d.getElementById('f-data').value);
    var godz = d.getElementById('f-godzina').value;
    var osoby = d.getElementById('f-osoby').value;
    var imie = d.getElementById('f-imie').value.trim();
    var tel = d.getElementById('f-tel').value.trim();
    var uwagi = d.getElementById('f-uwagi').value.trim();
    var subject = 'Rezerwacja stolika: ' + data + ', ' + godz + ', ' + osoby + ' os.';
    var body = [
      'Dzień dobry,',
      '',
      'chciał(a)bym zarezerwować stolik.',
      '',
      'Data: ' + data,
      'Godzina: ' + godz,
      'Liczba osób: ' + osoby,
      'Imię i nazwisko: ' + imie,
      'Telefon: ' + tel,
      'Uwagi: ' + (uwagi || 'brak'),
      '',
      'Proszę o potwierdzenie.',
      'Pozdrawiam'
    ].join('\r\n');
    window.location.href = 'mailto:wemgleiwszkle@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
  form.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false');
  });

  /* gallery lightbox */
  var lb = d.getElementById('lb');
  var lbImg = d.getElementById('lb-img');
  d.querySelectorAll('.gbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      lbImg.src = b.getAttribute('data-full');
      lbImg.alt = b.getAttribute('data-alt') || '';
      if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    });
  });
  function closeLb() { if (lb.close) lb.close(); else lb.removeAttribute('open'); }
  d.getElementById('lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) closeLb(); });
})();
