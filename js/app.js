/* =========================================================
   Книга привітань з Днем учителя
   5-В клас · Коломийський науковий ліцей №9
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Налаштування ---------- */
  const CONFIG = {
    pauseAfterVideo1: 4,     // секунд від кінця 1-го відео до галереї
    pauseAfterGallery: 1.5,  // секунд від кінця галереї до 2-го відео
    pauseAfterVideo2: 4,     // секунд від кінця 2-го відео до сторінки подяки
    galleryFallback: 181,    // тривалість галереї (с), якщо музика недоступна
    musicVolume: 0.9,
    flip: 1.1,               // тривалість перегортання сторінки (с)
    flipStagger: 0.22,       // інтервал між аркушами, коли гортаємо кілька сторінок
  };

  /* ---------- Вчителі ----------
     Порядок відповідає номеру фото в папці photo.
     icons — 1–2 іконки з SVG-спрайта в index.html.
     Щоб підписати вчителя, додайте name: 'Ім’я По батькові'. */
  const TEACHERS = [
    { photo: 'photo/1.jpg',   role: 'Директор ліцею',       icons: ['i-helm', 'i-school'] },
    { photo: 'photo/2.jpg',   role: 'Класний керівник 5-В', note: 'Історія', icons: ['i-class', 'i-history'] },
    { photo: 'photo/3.jpg',   role: 'Асистент вчителя',     note: 'Інклюзивне навчання', icons: ['i-care', 'i-together'] },
    { photo: 'photo/4.png',   role: 'Природознавство',      icons: ['i-sprout', 'i-magnifier'] },
    { photo: 'photo/5.jpg',   role: 'Математика',           icons: ['i-math', 'i-compass'] },
    { photo: 'photo/6.png',   role: 'Польська мова',        icons: ['i-say-pl', 'i-flag-pl'] },
    { photo: 'photo/7.jpg',   role: 'Польська мова',        icons: ['i-say-pl', 'i-flag-pl'] },
    { photo: 'photo/8.jpg',   role: 'Фізична культура',     icons: ['i-ball', 'i-stopwatch'] },
    { photo: 'photo/9.jpeg',  role: 'Українська мова',      icons: ['i-say-ua', 'i-flag-ua'] },
    { photo: 'photo/10.jpg',  role: 'Українська мова',      icons: ['i-say-ua', 'i-flag-ua'] },
    { photo: 'photo/11.jpeg', role: 'Англійська мова',      icons: ['i-say-en', 'i-flag-gb'] },
    { photo: 'photo/12.png',  role: 'Англійська мова',      icons: ['i-say-en', 'i-flag-gb'] },
    { photo: 'photo/13.jpg',  role: 'Мистецтво',            icons: ['i-palette', 'i-brush'] },
    { photo: 'photo/14.webp', role: 'Література',           icons: ['i-book', 'i-quill'] },
    { photo: 'photo/15.jpg',  role: 'Музика',               icons: ['i-note', 'i-piano'] },
    { photo: 'photo/16.jpg',  role: 'Інформатика',          icons: ['i-laptop', 'i-code'] },
    { photo: 'photo/17.jpg',  role: 'Інформатика',          icons: ['i-laptop', 'i-code'] },
    { photo: 'photo/18.jpg',  role: 'Християнська етика',   icons: ['i-candle', 'i-bible'] },
    { photo: 'photo/19.jpg',  role: 'СЕЕН',                 note: 'соціально-емоційне та етичне навчання', icons: ['i-smile', 'i-heart'] },
    { photo: 'photo/20.png',  role: 'Трудове навчання',     note: 'технології', icons: ['i-hammer', 'i-gear'] },
    { photo: 'photo/21.png',  role: 'Трудове навчання',     note: 'технології', icons: ['i-hammer', 'i-gear'] },
  ];

  const PAGE_LABELS = [
    'Обкладинка',
    'Сторінка 1 з 3 · Вітання',
    'Сторінка 2 з 3 · Галерея',
    'Сторінка 3 з 3 · Від класу',
    'Подяка',
  ];

  /* ---------- Елементи ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const book = $('#book');
  const block = $('#block');
  const leaves = $$('.leaf', block).sort((a, b) => a.dataset.leaf - b.dataset.leaf);
  const faces = $$('[data-face]', block);
  const N = leaves.length;   // аркуші: обкладинка + 3 сторінки
  const LAST = N;            // форзац із подякою
  const video1 = $('#video1');
  const video2 = $('#video2');
  const music = $('#music');
  const note1 = $('#note1');
  const note3 = $('#note3');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const fsBtn = $('#fsBtn');
  const pageLabel = $('#pageLabel');
  const tabs = $$('.tab');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = { page: 0 };
  let flipTimer = 0;
  let autoTimer = 0;

  document.documentElement.style.setProperty('--flip', CONFIG.flip + 's');
  const flipDuration = () => (reduceMotion.matches ? 0.45 : CONFIG.flip);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rand = (a, b) => a + Math.random() * (b - a);

  function setIcon(button, id, label) {
    button.querySelector('use').setAttribute('href', '#' + id);
    button.setAttribute('aria-label', label);
  }

  /* ---------- Плавна гучність ---------- */
  function fadeTo(media, target, ms, done) {
    clearInterval(media._fade);
    const from = media.volume;
    const start = performance.now();
    media._fade = setInterval(() => {
      const k = Math.min(1, (performance.now() - start) / ms);
      try { media.volume = from + (target - from) * k; } catch (e) { /* iOS: гучність лише для читання */ }
      if (k >= 1) {
        clearInterval(media._fade);
        if (done) done();
      }
    }, 30);
  }

  /* Перший дотик/клік «розблоковує» звук для всіх медіа (вимога браузерів). */
  let unlocked = false;
  function unlockMedia() {
    if (unlocked) return;
    unlocked = true;
    [video1, video2, music].forEach((m) => {
      if (!m.paused) return;
      const wasMuted = m.muted;
      try {
        m.muted = true;
        const p = m.play();
        m.pause();
        m.muted = wasMuted;
        if (p && p.catch) p.catch(() => {});
      } catch (e) {
        m.muted = wasMuted;
      }
    });
  }
  ['click', 'keydown', 'touchend'].forEach((ev) => document.addEventListener(ev, unlockMedia, true));

  /* ---------- Перегортання ---------- */
  function restack() {
    leaves.forEach((leaf, i) => {
      leaf.style.zIndex = i < state.page ? String(i + 1) : String(2 * N - i + 10);
    });
  }

  function setInert() {
    faces.forEach((face) => {
      const active = Number(face.dataset.face) === state.page;
      face.inert = !active;
      face.setAttribute('aria-hidden', String(!active));
    });
  }

  function updateUI() {
    const p = state.page;
    book.dataset.page = String(p);
    book.classList.toggle('is-closed', p === 0);
    pageLabel.textContent = PAGE_LABELS[p];
    prevBtn.disabled = p === 0;
    nextBtn.disabled = p === LAST;
    tabs.forEach((t) => t.classList.toggle('is-active', Number(t.dataset.go) === p));
    $$('.dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === p);
      if (i === p) d.setAttribute('aria-current', 'page');
      else d.removeAttribute('aria-current');
    });
    setInert();
  }

  function goTo(target) {
    target = clamp(Math.round(target), 0, LAST);
    if (target === state.page) return;
    const from = state.page;
    leavePage(from);

    const forward = target > from;
    const order = [];
    if (forward) for (let i = from; i < target; i++) order.push(i);
    else for (let i = from - 1; i >= target; i--) order.push(i);

    const dur = flipDuration();
    const stagger = order.length > 1 ? Math.min(CONFIG.flipStagger, 0.9 / order.length) : 0;
    order.forEach((i, k) => {
      const leaf = leaves[i];
      leaf.style.setProperty('--delay', (k * stagger).toFixed(2) + 's');
      leaf.style.zIndex = String(100 + N - i);
      leaf.classList.add('is-flipping');
      leaf.classList.toggle('is-turned', forward);
    });

    state.page = target;
    updateUI();

    clearTimeout(flipTimer);
    flipTimer = setTimeout(() => {
      leaves.forEach((leaf) => {
        leaf.classList.remove('is-flipping');
        leaf.style.removeProperty('--delay');
      });
      restack();
      enterPage(state.page);
    }, (dur + (order.length - 1) * stagger) * 1000 + 60);
  }

  const next = () => goTo(state.page + 1);
  const prev = () => goTo(state.page - 1);

  function enterPage(p) {
    if (p === 1) playVideo(video1);
    else if (p === 2) gallery.enter();
    else if (p === 3) playVideo(video2);
    else if (p === LAST) celebrate();
    keepAwake(p > 0 && p < LAST);
  }

  function leavePage(p) {
    hideNotes();
    clearTimeout(autoTimer);
    if (p === 1) video1.pause();
    else if (p === 2) gallery.leave();
    else if (p === 3) video2.pause();
  }

  /* ---------- Відео ---------- */
  function playVideo(v) {
    if (v.ended) v.currentTime = 0;
    const p = v.play();
    if (p && p.catch) p.catch(() => syncOverlay(v));
  }

  function syncOverlay(v) {
    v.parentElement.querySelector('.vplay').classList.toggle('is-on', v.paused && !v.ended);
  }

  [video1, video2].forEach((v) => {
    ['play', 'playing', 'pause', 'ended', 'emptied'].forEach((ev) => v.addEventListener(ev, () => syncOverlay(v)));
    v.addEventListener('loadedmetadata', () => {
      if (v.videoWidth && v.videoHeight) v.parentElement.style.setProperty('--ar', v.videoWidth + ' / ' + v.videoHeight);
    });
    v.parentElement.querySelector('.vplay').addEventListener('click', () => {
      hideNotes();
      playVideo(v);
    });
  });

  video1.addEventListener('ended', () => {
    if (state.page === 1) showNote(note1, CONFIG.pauseAfterVideo1, () => goTo(2));
  });
  video2.addEventListener('ended', () => {
    if (state.page === 3) showNote(note3, CONFIG.pauseAfterVideo2, () => goTo(LAST));
  });

  /* ---------- Стікер із відліком ---------- */
  let noteTimer = 0;
  let noteTick = 0;

  function showNote(note, seconds, done) {
    hideNotes();
    const count = $('.note__count', note);
    const bar = $('.ring__bar', note);
    let left = Math.max(1, Math.round(seconds));
    count.textContent = String(left);
    note.style.setProperty('--sec', seconds + 's');
    bar.style.animation = 'none';
    void bar.getBoundingClientRect();
    bar.style.animation = '';
    note.classList.add('is-on');
    noteTick = setInterval(() => {
      left -= 1;
      if (left > 0) count.textContent = String(left);
    }, 1000);
    noteTimer = setTimeout(() => {
      hideNotes();
      done();
    }, seconds * 1000);
  }

  function hideNotes() {
    clearTimeout(noteTimer);
    clearInterval(noteTick);
    note1.classList.remove('is-on');
    note3.classList.remove('is-on');
  }

  $$('.note [data-again]').forEach((btn) => btn.addEventListener('click', () => {
    hideNotes();
    const v = document.getElementById(btn.dataset.again);
    v.currentTime = 0;
    playVideo(v);
  }));

  /* ---------- Галерея ---------- */
  const gallery = (function () {
    const wall = $('#wall');
    const track = $('#track');
    const intro = $('#plaqueIntro');
    const outro = $('#plaqueOutro');
    const prog = $('#gprogress');
    const fill = $('#gfill');
    const pencil = $('#gpencil');
    const btnPause = $('#gPause');
    const btnMute = $('#gMute');
    const hint = $('#gMusicHint');

    let t = 0;               // час галереї, с
    let last = 0;
    let raf = 0;
    let active = false;      // сторінка галереї відкрита
    let paused = false;      // пауза користувача
    let done = false;
    let musicClock = false;  // рух синхронізовано з музикою
    let waitMusic = false;   // чекаємо старту музики
    let waitTimer = 0;
    let resynced = false;    // одна спроба підтягнути музику до галереї
    let musicBroken = false;
    let x0 = 0;
    let x1 = 0;
    let progW = 0;

    function build() {
      const frag = document.createDocumentFragment();
      TEACHERS.forEach((teacher) => {
        const fig = document.createElement('figure');
        fig.className = 'art';

        const lamp = document.createElement('div');
        lamp.className = 'art__lamp';
        lamp.setAttribute('aria-hidden', 'true');

        const frame = document.createElement('div');
        frame.className = 'art__frame';
        const mat = document.createElement('div');
        mat.className = 'art__mat';
        const img = document.createElement('img');
        img.className = 'art__img';
        img.decoding = 'async';
        img.alt = [teacher.name, teacher.role, teacher.note].filter(Boolean).join(', ');
        img.addEventListener('load', () => {
          if (img.naturalWidth && img.naturalHeight) {
            img.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
            measure();
          }
        });
        img.addEventListener('error', () => fig.classList.add('is-missing'));
        img.src = teacher.photo;
        mat.appendChild(img);
        frame.appendChild(mat);

        const label = document.createElement('figcaption');
        label.className = 'art__label';
        const icons = document.createElement('span');
        icons.className = 'art__icons';
        icons.innerHTML = teacher.icons.map((id) =>
          '<span class="art__icon"><svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg></span>').join('');
        label.appendChild(icons);
        [['art__role', teacher.role], ['art__note', teacher.note], ['art__name', teacher.name]].forEach(([cls, text]) => {
          if (!text) return;
          const span = document.createElement('span');
          span.className = cls;
          span.textContent = text;
          label.appendChild(span);
        });

        fig.append(lamp, frame, label);
        frag.appendChild(fig);
      });
      track.insertBefore(frag, outro);
    }

    function duration() {
      const d = music.duration;
      return Number.isFinite(d) && d > 20 ? d : CONFIG.galleryFallback;
    }

    /* рівномірний рух із м’яким розгоном і гальмуванням */
    function travel(p) {
      const a = 0.025;
      const v = 1 / (1 - a);
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      if (p < a) return (v * p * p) / (2 * a);
      if (p > 1 - a) return 1 - (v * (1 - p) * (1 - p)) / (2 * a);
      return v * (a / 2 + (p - a));
    }

    function measure() {
      const w = wall.clientWidth;
      const center = (el) => el.offsetLeft + el.offsetWidth / 2;
      x0 = w / 2 - center(intro);
      x1 = w / 2 - center(outro);
      progW = prog.clientWidth;
      render();
    }

    function render() {
      const p = clamp(t / duration(), 0, 1);
      const x = x0 + (x1 - x0) * travel(p);
      track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      pencil.style.transform = 'translate3d(' + (p * progW).toFixed(1) + 'px,-50%,0)';
    }

    function frame(now) {
      const dt = clamp((now - last) / 1000, 0, 0.25);
      last = now;
      if (active && !paused && !done && !waitMusic) {
        const playing = musicClock && !music.paused && !music.ended;
        const buffering = playing && (music.seeking || music.readyState < 3);
        if (!buffering) t += dt; // поки музика довантажується — галерея чекає
        if (playing && !buffering) {
          const drift = music.currentTime - t;
          if (Math.abs(drift) < 1.5) {
            t += drift * 0.08; // м'яко тримаємо рух у такт пісні
          } else if (drift > 0) {
            t = music.currentTime; // вкладка була у фоні — галерея наздоганяє пісню
          } else if (!resynced) {
            resynced = true; // пісня відстала — один раз перемотуємо її, галерея назад не їде
            try { music.currentTime = t; } catch (e) { /* без перемотування — просто граємо далі */ }
          }
        }
        if (t >= duration()) finish();
      }
      render();
      if (active) raf = requestAnimationFrame(frame);
    }

    function startMusic() {
      hint.classList.remove('is-on');
      if (musicBroken) {
        musicClock = false;
        return;
      }
      waitMusic = true;
      resynced = false;
      clearTimeout(waitTimer);
      waitTimer = setTimeout(() => { waitMusic = false; }, 4000);
      try {
        if (Math.abs(music.currentTime - t) > 0.3) music.currentTime = t;
      } catch (e) { /* ще немає метаданих */ }
      music.volume = 0;
      const ok = () => {
        clearTimeout(waitTimer);
        waitMusic = false;
        if (!active || paused) {
          music.pause();
          return;
        }
        if (Math.abs(music.currentTime - t) > 0.6) music.currentTime = t;
        musicClock = true;
        fadeTo(music, CONFIG.musicVolume, 1400);
      };
      const fail = (err) => {
        clearTimeout(waitTimer);
        waitMusic = false;
        if (err && err.name === 'AbortError') return; // play() перервано нашою ж паузою
        musicClock = false;
        if (active && !musicBroken && (!err || err.name === 'NotAllowedError')) hint.classList.add('is-on');
      };
      const p = music.play();
      if (p && p.then) p.then(ok, fail);
      else ok();
    }

    function updateButtons() {
      setIcon(btnPause, paused ? 'u-play' : 'u-pause', paused ? 'Продовжити' : 'Пауза');
      setIcon(btnMute, music.muted ? 'u-music-off' : 'u-music', music.muted ? 'Увімкнути музику' : 'Вимкнути музику');
    }

    function enter() {
      active = true;
      if (done) {
        t = 0;
        done = false;
      }
      paused = false;
      updateButtons();
      measure();
      startMusic();
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
      video2.preload = 'auto';
    }

    function leave() {
      active = false;
      musicClock = false;
      waitMusic = false;
      cancelAnimationFrame(raf);
      hint.classList.remove('is-on');
      fadeTo(music, 0, 450, () => music.pause());
    }

    function finish() {
      if (done) return;
      done = true;
      t = duration();
      render();
      if (state.page === 2) autoTimer = setTimeout(() => goTo(3), CONFIG.pauseAfterGallery * 1000);
    }

    function togglePause() {
      if (!active || done) return;
      paused = !paused;
      if (paused) {
        clearInterval(music._fade);
        music.pause();
      } else {
        startMusic();
      }
      updateButtons();
    }

    function toggleMute() {
      music.muted = !music.muted;
      updateButtons();
    }

    function reset() {
      t = 0;
      done = false;
      render();
    }

    music.addEventListener('ended', () => { if (active) finish(); });
    music.addEventListener('error', () => {
      musicBroken = true;
      musicClock = false;
      waitMusic = false;
      hint.classList.remove('is-on');
    });
    music.addEventListener('loadedmetadata', render);
    /* пауза ззовні (клавіші медіа, дзвінок тощо) — зупиняємо й галерею */
    music.addEventListener('pause', () => {
      if (active && musicClock && !done && !music.ended && !paused) {
        paused = true;
        updateButtons();
      }
    });
    music.addEventListener('play', () => {
      if (active && paused) {
        paused = false;
        updateButtons();
      }
    });

    btnPause.addEventListener('click', togglePause);
    btnMute.addEventListener('click', toggleMute);
    hint.addEventListener('click', () => {
      if (paused) togglePause();
      else startMusic();
    });

    build();
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(wall);
    else window.addEventListener('resize', measure);

    return { enter, leave, measure, togglePause, toggleMute, reset };
  })();

  /* ---------- Сторінка подяки ---------- */
  function celebrate() {
    if (reduceMotion.matches) return;
    spawnLeaves(26, true);
  }

  $('#replayBtn').addEventListener('click', () => {
    [video1, video2].forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
    gallery.reset();
    goTo(1);
  });

  /* ---------- Осіннє листя ---------- */
  const LEAF_COLORS = ['#E0A526', '#F2C14E', '#D9772B', '#B4532A', '#C4472D', '#E8B04A', '#A8742A'];

  function spawnLeaves(count, burst) {
    const box = $('#leaves');
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const d = rand(13, 24);
      el.className = 'fall' + (burst ? ' fall--burst' : '');
      el.style.cssText = [
        '--x:' + rand(-2, 98).toFixed(1) + 'vw',
        '--s:' + rand(18, 44).toFixed(0) + 'px',
        '--d:' + d.toFixed(1) + 's',
        '--delay:' + (burst ? rand(0, 2.5) : -rand(0, d)).toFixed(1) + 's',
        '--c:' + LEAF_COLORS[i % LEAF_COLORS.length],
        '--o:' + rand(0.45, 0.85).toFixed(2),
        '--drift:' + rand(-14, 14).toFixed(1) + 'vw',
        '--r1:' + rand(-70, 0).toFixed(0) + 'deg',
        '--r2:' + rand(30, 140).toFixed(0) + 'deg',
      ].join(';');
      el.innerHTML = '<svg viewBox="0 0 100 100"><use href="#' + (Math.random() < 0.7 ? 'leaf-maple' : 'leaf-oval') + '"/></svg>';
      if (burst) el.addEventListener('animationend', (e) => { if (e.target === el) el.remove(); });
      box.appendChild(el);
    }
  }

  /* ---------- Не гасити екран під час показу ---------- */
  let wakeLock = null;
  async function keepAwake(on) {
    try {
      if (on && !wakeLock && 'wakeLock' in navigator && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      } else if (!on && wakeLock) {
        await wakeLock.release();
        wakeLock = null;
      }
    } catch (e) { /* не підтримується — не страшно */ }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') keepAwake(state.page > 0 && state.page < LAST);
  });

  /* ---------- Повний екран ---------- */
  const root = document.documentElement;
  const isFullscreen = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  if (!(root.requestFullscreen || root.webkitRequestFullscreen)) fsBtn.hidden = true;

  function toggleFullscreen() {
    if (fsBtn.hidden) return;
    if (isFullscreen()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      const r = (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
      if (r && r.catch) r.catch(() => {});
    }
  }

  ['fullscreenchange', 'webkitfullscreenchange'].forEach((ev) => document.addEventListener(ev, () => {
    setIcon(fsBtn, isFullscreen() ? 'u-full-exit' : 'u-full', isFullscreen() ? 'Вийти з повноекранного режиму' : 'На весь екран');
  }));

  /* ---------- Керування ---------- */
  function toggleCurrent() {
    const p = state.page;
    if (p === 0) goTo(1);
    else if (p === 1 || p === 3) {
      const v = p === 1 ? video1 : video2;
      if (v.paused) {
        hideNotes();
        playVideo(v);
      } else {
        v.pause();
      }
    } else if (p === 2) gallery.togglePause();
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  fsBtn.addEventListener('click', toggleFullscreen);
  $('#openBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(1);
  });
  $('.cover').addEventListener('click', () => goTo(1));
  $$('[data-go]').forEach((btn) => btn.addEventListener('click', () => goTo(Number(btn.dataset.go))));
  $$('[data-next]').forEach((btn) => btn.addEventListener('click', next));

  const dotsBox = $('#dots');
  PAGE_LABELS.forEach((label, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', label);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'VIDEO' && /^(ArrowLeft|ArrowRight| )$/.test(e.key)) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        next();
        return;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prev();
        return;
      case 'Home':
        e.preventDefault();
        goTo(0);
        return;
      case 'End':
        e.preventDefault();
        goTo(LAST);
        return;
      case ' ':
        if (tag === 'BUTTON') return;
        e.preventDefault();
        toggleCurrent();
        return;
      default:
    }
    if (e.code === 'KeyF') toggleFullscreen();
    else if (e.code === 'KeyM') gallery.toggleMute();
  });

  /* свайпи на телефоні */
  let touch = null;
  book.addEventListener('touchstart', (e) => {
    const target = e.target;
    if (e.touches.length !== 1 || (target.closest && target.closest('video, .gbtns, .note'))) {
      touch = null;
      return;
    }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
  }, { passive: true });
  book.addEventListener('touchend', (e) => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x;
    const dy = e.changedTouches[0].clientY - touch.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - touch.time < 900) {
      if (dx < 0) next();
      else prev();
    }
    touch = null;
  }, { passive: true });

  /* перспектива залежить від розміру книги */
  function fitPerspective() {
    block.style.perspective = Math.round(Math.max(block.clientWidth, block.clientHeight) * 3) + 'px';
  }
  window.addEventListener('resize', fitPerspective);

  /* ---------- Старт ---------- */
  fitPerspective();
  restack();
  updateUI();
  gallery.measure();
  if (!reduceMotion.matches) spawnLeaves(window.innerWidth < 700 ? 9 : 16, false);

  /* для перевірки та налагодження */
  window.teachersBook = { goTo, state };
})();
