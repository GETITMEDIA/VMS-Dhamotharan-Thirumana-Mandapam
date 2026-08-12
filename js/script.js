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
          item.style.transitionDelay = (shown * 40) + 'ms';
          shown++;
          item.classList.remove('is-hidden');
          item.classList.add('is-entering');
          // next frame, let the transition run
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () { item.classList.remove('is-entering'); });
          });
        } else {
          item.style.transitionDelay = '0ms';
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
    var btn = document.querySelector('.floating-wa');
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
    apply();
  }

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  function initYear() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------------
     3D Layered Grid-to-Stack Morph Gallery
     --------------------------------------------------------------- */
  function initGalleryStack() {
    var container = $('#galleryGrid');
    var wrapper = $('#galleryStackContainer');
    if (!container) return;

    var cards = $$('.gal-item', container);
    var isStacked = true;
    
    // Check if gsap is loaded, if not wait a bit
    if (typeof gsap === 'undefined') {
      setTimeout(initGalleryStack, 100);
      return;
    }

    function isMobile() {
      return window.innerWidth <= 768;
    }

    function getLayoutOffsets() {
      // Temporarily clear all transforms to get actual layout positions
      cards.forEach(function (card) {
        gsap.set(card, { x: 0, y: 0, rotate: 0, scale: 1 });
      });

      var containerWidth = container.clientWidth;
      var containerHeight = container.clientHeight;

      return cards.map(function (card) {
        var cardWidth = card.offsetWidth;
        var cardHeight = card.offsetHeight;
        var cardLeft = card.offsetLeft;
        var cardTop = card.offsetTop;

        // Calculate offset to bring the card to the exact center of the container
        var offsetX = (containerWidth / 2) - (cardWidth / 2) - cardLeft;
        var offsetY = (containerHeight / 2) - (cardHeight / 2) - cardTop;

        return {
          x: offsetX,
          y: offsetY
        };
      });
    }

    function stackCards(animate) {
      if (isMobile()) {
        resetCards(false);
        return;
      }
      
      isStacked = true;
      var offsets = getLayoutOffsets();

      cards.forEach(function (card, i) {
        gsap.killTweensOf(card);
        var offset = offsets[i];
        
        // Random slight rotation
        var randomRot = (Math.random() * 12) - 6; // between -6deg and 6deg
        
        // Progressive scale for "small to big" look in stack (top cards are bigger, bottom smaller)
        var stackScale = 0.86 + ((cards.length - 1 - i) / cards.length) * 0.08;

        if (animate) {
          gsap.to(card, {
            x: offset.x,
            y: offset.y,
            rotate: randomRot,
            scale: stackScale,
            zIndex: 100 - i,
            duration: 0.85,
            ease: "expo.out",
            overwrite: "auto"
          });
        } else {
          gsap.set(card, {
            x: offset.x,
            y: offset.y,
            rotate: randomRot,
            scale: stackScale,
            zIndex: 100 - i
          });
        }
      });
    }

    function resetCards(animate) {
      isStacked = false;
      cards.forEach(function (card) {
        gsap.killTweensOf(card);
      });

      if (animate === false || isMobile()) {
        gsap.set(cards, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          zIndex: function (i) { return 100 - i; },
          overwrite: "auto"
        });
      } else {
        gsap.to(cards, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          zIndex: function (i) { return 100 - i; },
          duration: 0.85,
          ease: "expo.out",
          stagger: {
            amount: 0.22,
            from: "start"
          },
          overwrite: "auto"
        });
      }
    }

    // Set initial z-indices
    cards.forEach(function (card, i) {
      gsap.set(card, { zIndex: 100 - i });
    });

    // Run stacking immediately
    setTimeout(function () {
      stackCards(false);
    }, 150);

    // Hover triggers
    container.addEventListener('mouseenter', function() {
      if (!isMobile()) resetCards(true);
    });
    container.addEventListener('mouseleave', function () {
      if (!isMobile()) stackCards(true);
    });

    // Support touch devices (tap to toggle stack/expanded state on tablets)
    container.addEventListener('click', function (e) {
      if (isMobile()) return;
      if (e.target.closest('.gal-btn')) return;
      if (isStacked) {
        resetCards(true);
      } else {
        stackCards(true);
      }
    });

    // Re-stack on resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (isMobile()) {
          resetCards(false);
        } else if (isStacked) {
          stackCards(false);
        } else {
          resetCards(false);
        }
      }, 100);
    });
  }

  /* ---------------------------------------------------------------
     Media fit — a box shaped like its own picture
     object-fit: cover only crops when the box and the file disagree, so
     every media box is told the file's real ratio once it is known.
     --------------------------------------------------------------- */
  function initMediaFit() {
    // selector -> which ancestor carries the aspect ratio
    var TARGETS = [
      ['.frame img',       '.frame'],
      ['.event-media img', '.event-media'],
      ['.gal-btn img',     '.gal-btn'],
      ['.fac-media img',   '.frame']
    ];

    function apply(img, box) {
      var w = img.naturalWidth, h = img.naturalHeight;
      if (!w || !h || !box) return;
      box.style.setProperty('--ar', w + ' / ' + h);
      // keep the attributes honest so the browser reserves the right space
      if (img.getAttribute('width') !== String(w)) {
        img.setAttribute('width', w);
        img.setAttribute('height', h);
      }
    }

    TARGETS.forEach(function (pair) {
      $$(pair[0]).forEach(function (img) {
        var box = img.closest(pair[1]);
        if (!box) return;
        if (img.complete) apply(img, box);
        else img.addEventListener('load', function () { apply(img, box); }, { once: true });
      });
    });
  }

  /* ---------------------------------------------------------------
     Blur-up — photos sharpen into place instead of snapping in
     --------------------------------------------------------------- */
  function initImageFade() {
    if (reducedMotion.matches) return;

    $$('.frame img, .event-media img, .gal-btn img').forEach(function (img) {
      if (img.complete && img.naturalWidth) return;  // already painted, leave it
      img.setAttribute('data-fade', '');
      var done = function () { img.classList.add('is-loaded'); };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      // never let a stalled request keep a photo invisible
      window.setTimeout(done, 3000);
    });
  }

  /* ---------------------------------------------------------------
     Reveal choreography — picks an entrance per element and staggers
     siblings, so no markup needs to carry animation details
     --------------------------------------------------------------- */
  function initRevealChoreography() {
    // photos get uncovered; text and cards move
    $$('.reveal').forEach(function (el) {
      if (el.hasAttribute('data-reveal')) return;
      // .about-visual is deliberately excluded: its badge overhangs the box,
      // and a clip-path would cut it off
      if (el.matches('.frame, .fac-media')) el.setAttribute('data-reveal', 'mask');
      else if (el.matches('.about-visual')) el.setAttribute('data-reveal', 'zoom');
      // a split heading already animates word by word; moving the block too
      // would double the motion
      else if (el.querySelector('.word-rise')) el.setAttribute('data-reveal', 'fade');
      else if (el.matches('.h2, .page-hero-title, .hero-title')) el.setAttribute('data-reveal', 'rise');
      else if (el.matches('.eyebrow, .section-sub, .lede')) el.setAttribute('data-reveal', 'fade');
      else el.setAttribute('data-reveal', 'up');
    });

    // grid children come in one after another, left to right
    var GRIDS = ['.event-grid', '.feature-grid', '.gallery', '.stats-grid', '.chip-row'];
    GRIDS.forEach(function (sel) {
      $$(sel).forEach(function (grid) {
        Array.prototype.forEach.call(grid.children, function (child, i) {
          if (child.getAttribute('data-delay')) return;
          child.style.setProperty('--d', Math.min(i, 7));
        });
      });
    });

    // Gallery tiles carry no .reveal in the markup — give them one so the grid
    // assembles itself tile by tile. Tiles inside the stack container are left
    // alone: GSAP drives their transform and opacity there.
    $$('.gallery .gal-item').forEach(function (item) {
      if (item.classList.contains('reveal')) return;
      if (item.closest('.gallery-stack-container')) return;
      item.classList.add('reveal');
      item.setAttribute('data-reveal', 'zoom');
    });

    // alternating rows slide in from the side they sit on
    $$('.fac-row').forEach(function (row) {
      var media = $('.fac-media', row);
      var body  = $('.fac-body', row);
      var rev   = row.classList.contains('fac-row-rev');
      if (media && !media.hasAttribute('data-reveal')) media.classList.add('reveal');
      if (body && !body.classList.contains('reveal')) {
        body.classList.add('reveal');
        body.setAttribute('data-reveal', rev ? 'left' : 'right');
        body.style.setProperty('--d', 1);
      }
    });
  }

  /* ---------------------------------------------------------------
     Split headings — words lift in sequence out of a clipped line
     --------------------------------------------------------------- */
  function initSplitHeadings() {
    if (reducedMotion.matches) return;

    $$('.section-head .h2, .page-hero-title').forEach(function (h) {
      if (h.querySelector('.word-rise')) return;
      // only plain-text headings; anything with markup is left alone
      if (h.children.length) return;

      var words = h.textContent.trim().split(/\s+/);
      if (!words.length || words.length > 14) return;

      h.textContent = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'word-rise';
        var inner = document.createElement('i');
        inner.textContent = word;
        span.style.setProperty('--w', i);
        span.appendChild(inner);
        h.appendChild(span);
        if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ---------------------------------------------------------------
     Card craft — pointer tilt, cursor sheen, gold edge
     Pointer-driven, so it is skipped on touch and for reduced motion.
     --------------------------------------------------------------- */
  function initCardMotion() {
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    $$('.event-card, .gal-item, .feature, .contact-card, .reach-card').forEach(function (card) {
      // the sheen would sit over the caption on event cards, so those get
      // the gold edge only
      if (card.matches('.event-card')) card.classList.add('edge-glow');
      else card.classList.add('sheen', 'edge-glow');
    });

    if (reducedMotion.matches || !fine.matches) return;

    var MAX = 5;  // degrees — past this it stops reading as a photograph
    $$('.event-card, .gal-item, .contact-card, .reach-card').forEach(function (card) {
      // GSAP owns the transform of stacked gallery cards
      if (card.closest('.gallery-stack-container')) return;

      var frame = 0;
      function track(e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = 0;
          var r = card.getBoundingClientRect();
          var mx = (e.clientX - r.left) / r.width;
          var my = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', mx.toFixed(3));
          card.style.setProperty('--my', my.toFixed(3));
          card.style.setProperty('--ty', ((mx - 0.5) * 2 * MAX).toFixed(2) + 'deg');
          card.style.setProperty('--tx', ((0.5 - my) * 2 * MAX).toFixed(2) + 'deg');
        });
      }

      card.addEventListener('pointerenter', function () {
        // .tilt is added on first hover rather than up front: the scroll
        // reveal owns this element's transform until it has landed, and by
        // the time a pointer reaches the card it always has
        card.classList.add('tilt', 'is-tilting');
        card.style.setProperty('--tscale', '1.012');
      });
      card.addEventListener('pointermove', track);
      card.addEventListener('pointerleave', function () {
        if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
        card.classList.remove('is-tilting');
        card.style.setProperty('--tx', '0deg');
        card.style.setProperty('--ty', '0deg');
        card.style.setProperty('--tscale', '1');
      });
    });
  }

  /* ---------------------------------------------------------------
     Magnetic buttons — the button leans toward the cursor
     --------------------------------------------------------------- */
  function initMagnetic() {
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (reducedMotion.matches || !fine.matches) return;

    var PULL = 0.28;  // fraction of the offset from centre

    $$('.btn-gold, .btn-maroon, .btn-lg, .nav-cta').forEach(function (btn) {
      if (btn.classList.contains('btn-link')) return;
      btn.classList.add('magnetic');

      var frame = 0;
      btn.addEventListener('pointermove', function (e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = 0;
          var r = btn.getBoundingClientRect();
          btn.classList.add('is-pulling');
          btn.style.setProperty('--gx', ((e.clientX - r.left - r.width / 2) * PULL).toFixed(1) + 'px');
          btn.style.setProperty('--gy', ((e.clientY - r.top - r.height / 2) * PULL).toFixed(1) + 'px');
        });
      });
      btn.addEventListener('pointerleave', function () {
        if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
        btn.classList.remove('is-pulling');
        btn.style.setProperty('--gx', '0px');
        btn.style.setProperty('--gy', '0px');
      });
    });
  }

  /* ---------------------------------------------------------------
     Reading progress hairline
     --------------------------------------------------------------- */
  function initScrollProgress() {
    if (reducedMotion.matches) return;

    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    function apply() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      bar.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1).toFixed(4) : 0);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    window.addEventListener('resize', apply);
    apply();
  }

  /* --------------------------------------------------------------- */
  function boot() {
    initStickyHeader();
    initMobileNav();

    // motion setup runs before initReveal: it adds .reveal elements and
    // rewrites headings that the observer then picks up
    initMediaFit();
    initImageFade();
    initSplitHeadings();
    initRevealChoreography();

    initReveal();
    initCounters();

    initCardMotion();
    initMagnetic();
    initScrollProgress();

    initTourVideo();
    initGalleryFilter();
    initGalleryStack();
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
