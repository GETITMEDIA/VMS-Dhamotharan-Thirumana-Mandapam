/* =====================================================================
   VMS Dhamotharan Thirumana Mandapam — site behaviour
   Vanilla JS, no dependencies. Each concern lives in its own init.
   ===================================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '919894276334';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------------
     Sticky header — solid + compact once scrolled past the threshold
     --------------------------------------------------------------- */
  function initStickyHeader() {
    var header = $('#header');
    if (!header) return;

    var ticking = false;
    function apply() {
      header.classList.toggle('is-stuck', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------------------------------------------------------------
     Mobile navigation drawer
     --------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = $('#navToggle');
    var nav    = $('#nav');
    var scrim  = $('#navScrim');
    if (!toggle || !nav || !scrim) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
      scrim.hidden = !open;
      // let the element paint before transitioning opacity
      window.requestAnimationFrame(function () { scrim.classList.toggle('is-open', open); });
      document.body.classList.toggle('is-locked', open);
      if (open) {
        var first = nav.querySelector('a');
        if (first) first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    scrim.addEventListener('click', function () { setOpen(false); });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state if the viewport grows past the drawer breakpoint
    var wide = window.matchMedia('(min-width: 941px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
    else if (wide.addListener) wide.addListener(onChange);
  }

  /* ---------------------------------------------------------------
     Scroll reveal — staggered via data-delay
     --------------------------------------------------------------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    items.forEach(function (el) {
      var d = el.getAttribute('data-delay');
      if (d) el.style.setProperty('--d', d);
    });

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var remaining = items.slice();

    function reveal(el) {
      el.classList.add('is-in');
      io.unobserve(el);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });

    // Backstop: a fast flick or an anchor jump can move an element past the
    // viewport before the observer reports it, which would leave it stuck at
    // opacity 0. Sweep anything that has already reached the fold.
    var ticking = false;
    function sweep() {
      ticking = false;
      var fold = window.innerHeight * 0.92;
      remaining = remaining.filter(function (el) {
        if (el.classList.contains('is-in')) return false;
        if (el.getBoundingClientRect().top < fold) { reveal(el); return false; }
        return true;
      });
      if (!remaining.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(sweep); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', sweep);
    sweep();
  }

  /* ---------------------------------------------------------------
     Animated stat counters
     --------------------------------------------------------------- */
  function initCounters() {
    var nums = $$('.stat-num[data-count]');
    if (!nums.length) return;

    function render(el, value) {
      el.textContent = value.toLocaleString('en-IN') + (el.getAttribute('data-suffix') || '');
    }

    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reducedMotion.matches) { render(el, target); return; }

      var duration = 1600;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        render(el, Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(function (el) { render(el, parseInt(el.getAttribute('data-count'), 10) || 0); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------
     Feature video player
     --------------------------------------------------------------- */
  function initTourVideo() {
    var video = $('#tourVideo');
    var play  = $('#videoPlay');
    if (!video || !play) return;

    play.addEventListener('click', function () {
      play.classList.add('is-hidden');
      video.play();
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) play.classList.remove('is-hidden');
    });
    video.addEventListener('ended', function () { play.classList.remove('is-hidden'); });
  }

  /* ---------------------------------------------------------------
     Gallery filtering
     --------------------------------------------------------------- */
  function initGalleryFilter() {
    var bar   = $('#filters');
    var grid  = $('#galleryGrid');
    var empty = $('#galEmpty');
    if (!bar || !grid) return;

    var items   = $$('.gal-item', grid);
    var buttons = $$('.filter', bar);

    function applyFilter(value) {
      var shown = 0;

      items.forEach(function (item) {
        var match = value === 'all' || item.getAttribute('data-category') === value;
        if (match) {
          shown++;
          item.classList.remove('is-hidden');
          item.classList.add('is-entering');
          // next frame, let the transition run
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () { item.classList.remove('is-entering'); });
          });
        } else {
          item.classList.add('is-hidden');
        }
      });

      if (empty) empty.hidden = shown !== 0;
    }

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;

      buttons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });

      applyFilter(btn.getAttribute('data-filter'));
      Lightbox.refresh();
    });

    // arrow-key movement across the filter tablist
    bar.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = buttons.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var next = e.key === 'ArrowRight'
        ? (i + 1) % buttons.length
        : (i - 1 + buttons.length) % buttons.length;
      buttons[next].focus();
      buttons[next].click();
    });
  }

  /* ---------------------------------------------------------------
     Lightbox — operates on whichever gallery items are visible
     --------------------------------------------------------------- */
  var Lightbox = (function () {
    var box, img, cap, count, prevBtn, nextBtn, closeBtn;
    var slides = [];
    var index = 0;
    var lastFocus = null;

    function collect() {
      slides = $$('.gal-item:not(.is-hidden) .gal-btn');
    }

    function show(i, animate) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;

      var btn = slides[index];
      var src = btn.getAttribute('data-full');
      var text = btn.getAttribute('data-caption') || '';
      var alt = (btn.querySelector('img') || {}).alt || text;

      var swap = function () {
        img.src = src;
        img.alt = alt;
        cap.textContent = text;
        count.textContent = (index + 1) + ' / ' + slides.length;
        img.classList.remove('is-swapping');
      };

      var multiple = slides.length > 1;
      prevBtn.hidden = !multiple;
      nextBtn.hidden = !multiple;

      if (animate && !reducedMotion.matches) {
        img.classList.add('is-swapping');
        window.setTimeout(swap, 160);
      } else {
        swap();
      }
    }

    function open(btn) {
      collect();
      var i = slides.indexOf(btn);
      if (i === -1) return;

      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.classList.add('is-locked');
      window.requestAnimationFrame(function () { box.classList.add('is-open'); });

      show(i, false);
      closeBtn.focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');

      var finish = function () {
        box.hidden = true;
        img.removeAttribute('src');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      };
      if (reducedMotion.matches) finish();
      else window.setTimeout(finish, 280);
    }

    function isOpen() { return box && !box.hidden; }

    function onKeydown(e) {
      if (!isOpen()) return;
      if (e.key === 'Escape')     { e.preventDefault(); close(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, true); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); show(index - 1, true); }
      if (e.key === 'Tab')        { trapFocus(e); }
    }

    function trapFocus(e) {
      var focusables = [closeBtn, prevBtn, nextBtn].filter(function (el) { return !el.hidden; });
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function initSwipe() {
      var startX = 0, startY = 0, tracking = false;
      box.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        tracking = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      box.addEventListener('touchend', function (e) {
        if (!tracking) return;
        tracking = false;
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          show(index + (dx < 0 ? 1 : -1), true);
        }
      }, { passive: true });
    }

    function init() {
      box      = $('#lightbox');
      img      = $('#lbImg');
      cap      = $('#lbCap');
      count    = $('#lbCount');
      prevBtn  = $('#lbPrev');
      nextBtn  = $('#lbNext');
      closeBtn = $('#lbClose');
      if (!box || !img) return;

      document.addEventListener('click', function (e) {
        var btn = e.target.closest('.gal-btn');
        if (btn) { e.preventDefault(); open(btn); }
      });

      closeBtn.addEventListener('click', close);
      prevBtn.addEventListener('click', function () { show(index - 1, true); });
      nextBtn.addEventListener('click', function () { show(index + 1, true); });

      box.addEventListener('click', function (e) {
        // clicking the backdrop (not a control or the image) closes
        if (e.target === box || e.target.classList.contains('lb-figure')) close();
      });

      document.addEventListener('keydown', onKeydown);
      initSwipe();
    }

    return { init: init, refresh: collect };
  })();

  /* ---------------------------------------------------------------
     Enquiry form → prefilled WhatsApp message
     --------------------------------------------------------------- */
  function initEnquiryForm() {
    var form = $('#enquiryForm');
    if (!form) return;

    var status = $('#formStatus');

    // A date in the past is never a valid event date.
    var dateInput = $('#f-date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    function setError(field, message) {
      var wrap = field.closest('.field');
      var box = wrap ? wrap.querySelector('.err') : null;
      wrap.classList.toggle('has-error', Boolean(message));
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (box) {
        box.textContent = message || '';
        box.hidden = !message;
      }
    }

    function validate() {
      var errors = [];

      var name = $('#f-name');
      var nameVal = name.value.trim();
      if (nameVal.length < 2) { setError(name, 'Please enter your name.'); errors.push(name); }
      else setError(name, '');

      var phone = $('#f-phone');
      var digits = phone.value.replace(/\D/g, '');
      // Accept a 10-digit Indian mobile, optionally prefixed with 0 or 91.
      var normalised = digits.replace(/^(0|91)/, '');
      if (!/^[6-9]\d{9}$/.test(normalised)) {
        setError(phone, 'Enter a valid 10-digit mobile number.');
        errors.push(phone);
      } else setError(phone, '');

      var event = $('#f-event');
      if (!event.value) { setError(event, 'Please choose an event type.'); errors.push(event); }
      else setError(event, '');

      var date = $('#f-date');
      if (date.value) {
        var today = new Date(); today.setHours(0, 0, 0, 0);
        if (new Date(date.value + 'T00:00:00') < today) {
          setError(date, 'Please choose a date that is not in the past.');
          errors.push(date);
        } else setError(date, '');
      } else setError(date, '');

      var guests = $('#f-guests');
      if (guests.value && (Number(guests.value) < 1 || Number(guests.value) > 5000)) {
        setError(guests, 'Enter a guest count between 1 and 5000.');
        errors.push(guests);
      } else setError(guests, '');

      return errors;
    }

    function formatDate(value) {
      if (!value) return 'To be confirmed';
      var d = new Date(value + 'T00:00:00');
      if (isNaN(d)) return value;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function buildMessage() {
      var lines = [
        'Hello VMS Dhamotharan Thirumana Mandapam,',
        '',
        'I would like to enquire about booking the hall.',
        '',
        'Name: ' + $('#f-name').value.trim(),
        'Phone: ' + $('#f-phone').value.trim(),
        'Event: ' + $('#f-event').value,
        'Event Date: ' + formatDate($('#f-date').value),
        'Guests: ' + ($('#f-guests').value.trim() || 'Not decided yet')
      ];

      var note = $('#f-msg').value.trim();
      if (note) lines.push('Message: ' + note);

      lines.push('', 'Please share availability and booking details.');
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var errors = validate();
      if (errors.length) {
        status.textContent = 'Please correct the highlighted fields and try again.';
        status.className = 'form-status is-bad';
        errors[0].focus();
        return;
      }

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildMessage());
      var opened = window.open(url, '_blank', 'noopener');

      if (opened) {
        status.textContent = 'Opening WhatsApp with your enquiry — press send to reach us.';
        status.className = 'form-status is-ok';
      } else {
        // popup blocked: fall back to navigating this tab
        status.textContent = 'Taking you to WhatsApp…';
        status.className = 'form-status is-ok';
        window.location.href = url;
      }
    });

    // Clear a field's error as soon as the visitor starts fixing it
    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field.has-error');
      if (wrap) setError(e.target, '');
    });
  }

  /* ---------------------------------------------------------------
     Back to top
     --------------------------------------------------------------- */
  function initBackToTop() {
    var btn = $('#toTop');
    if (!btn) return;

    var ticking = false;
    function apply() {
      var show = window.scrollY > window.innerHeight * 0.9;
      btn.hidden = !show;
      btn.classList.toggle('is-visible', show);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    });
    apply();
  }

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  function initYear() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* --------------------------------------------------------------- */
  function boot() {
    initStickyHeader();
    initMobileNav();
    initReveal();
    initCounters();

    initTourVideo();
    initGalleryFilter();
    Lightbox.init();
    initEnquiryForm();
    initBackToTop();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
