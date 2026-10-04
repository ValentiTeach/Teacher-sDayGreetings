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
    musicRate: 1.1,          // швидкість пісні (1 — звичайна, 1.1 — на 10 % швидше)
    musicEnd: 167.5,         // секунда, де в пісні закінчується звук (далі — тиша)
    galleryFallback: 167.5,  // тривалість галереї (с пісні), якщо музика недоступна
    musicVolume: 0.9,
    flip: 1.1,               // тривалість перегортання сторінки (с)
    flipStagger: 0.22,       // інтервал між аркушами, коли гортаємо кілька сторінок
  };

  /* ---------- Вчителі ----------
     Кожен запис — «експозиція» одного предмета: 1 або 2 фото (номери файлів у папці photo).
     icons — 1–2 іконки з SVG-спрайта в index.html (підписи до них — у ICON_TIPS нижче).
     Щоб підписати вчителів, додайте names: ['Ім’я По батькові', ...] у тому ж порядку, що й photos. */
  const EXHIBITS = [
    { subject: 'Директор ліцею',          icons: ['i-helm', 'i-school'],     photos: ['photo/1.jpg'] },
    { subject: 'Класний керівник 5-В',    note: 'Історія', icons: ['i-class', 'i-history'], photos: ['photo/2.jpg'] },
    { subject: 'Асистент вчителя',        note: 'Інклюзивне навчання', icons: ['i-care', 'i-together'], photos: ['photo/3.jpg'] },
    { subject: 'Пізнаємо природу та ЗБД', icons: ['i-sprout', 'i-magnifier'], photos: ['photo/4.png'] },
    { subject: 'Математика',              icons: ['i-math', 'i-compass'],    photos: ['photo/5.jpg'] },
    { subject: 'Польська мова',           icons: ['i-say-pl', 'i-flag-pl'],  photos: ['photo/6.png', 'photo/7.jpg'] },
    { subject: 'Фізична культура',        icons: ['i-ball', 'i-stopwatch'],  photos: ['photo/8.jpg'] },
    { subject: 'Українська мова',         icons: ['i-say-ua', 'i-flag-ua'],  photos: ['photo/9.jpeg', 'photo/10.jpg'] },
    { subject: 'Англійська мова',         icons: ['i-say-en', 'i-flag-gb'],  photos: ['photo/11.jpeg', 'photo/12.png'] },
    { subject: 'Мистецтво',               icons: ['i-palette', 'i-brush'],   photos: ['photo/13.jpg'] },
    { subject: 'Література',              icons: ['i-book', 'i-quill'],      photos: ['photo/14.webp'] },
    { subject: 'Музика',                  icons: ['i-note', 'i-piano'],      photos: ['photo/15.jpg'] },
    { subject: 'Інформатика',             icons: ['i-laptop', 'i-code'],     photos: ['photo/16.jpg', 'photo/17.jpg'] },
    { subject: 'Християнська етика',      icons: ['i-candle', 'i-bible'],    photos: ['photo/18.jpg'] },
    { subject: 'СЕЕН',                    note: 'соціально-емоційне та етичне навчання', icons: ['i-smile', 'i-heart'], photos: ['photo/19.jpg'] },
    { subject: 'Трудове навчання',        note: 'технології', icons: ['i-hammer', 'i-gear'], photos: ['photo/20.png', 'photo/21.png'] },
  ];

  /* Підписи, що з’являються над іконками, та їхні анімації. */
  const ICON_TIPS = {
    'i-helm': ['Директор веде наш ліцей уперед', 'spin'],
    'i-school': ['Наш ліцей — наш другий дім', 'bounce'],
    'i-class': ['5-В — дружна команда!', 'bounce'],
    'i-history': ['Історія вчить пам’ятати', 'wiggle'],
    'i-care': ['Підтримка й турбота щодня', 'beat'],
    'i-together': ['Разом — кожен важливий', 'bounce'],
    'i-sprout': ['Усе живе росте — і ми теж', 'grow'],
    'i-magnifier': ['Досліджуємо світ навколо', 'wiggle'],
    'i-math': ['Плюс знання, мінус помилки!', 'spin'],
    'i-compass': ['Точність — понад усе', 'spin'],
    'i-say-pl': ['Dzień dobry!', 'bounce'],
    'i-flag-pl': ['Мова наших сусідів', 'wave'],
    'i-ball': ['Рух — це здоров’я!', 'bounce'],
    'i-stopwatch': ['На старт, увага, руш!', 'wiggle'],
    'i-say-ua': ['Рідна мова — наша сила', 'bounce'],
    'i-flag-ua': ['Синє небо, золоте поле', 'wave'],
    'i-say-en': ['Hello, teacher!', 'bounce'],
    'i-flag-gb': ['Англійська відкриває світ', 'wave'],
    'i-palette': ['Світ у всіх кольорах', 'spin'],
    'i-brush': ['Кожен мазок — маленьке диво', 'wiggle'],
    'i-book': ['Книжки — двері в інші світи', 'bounce'],
    'i-quill': ['Слово має силу', 'wiggle'],
    'i-note': ['Музика живе в серці', 'bounce'],
    'i-piano': ['До-ре-мі-фа-соль!', 'wiggle'],
    'i-laptop': ['Цифровий світ — під контролем', 'bounce'],
    'i-code': ['print("Дякуємо!")', 'wiggle'],
    'i-candle': ['Світло добра', 'flicker'],
    'i-bible': ['Мудрість на кожен день', 'bounce'],
    'i-smile': ['Розуміємо свої емоції', 'spin'],
    'i-heart': ['Доброта починається з нас', 'beat'],
    'i-hammer': ['Робимо своїми руками', 'wiggle'],
    'i-gear': ['Технології рухають світ', 'spin'],
  };

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
  /* якщо файл відео пошкоджений — не зависаємо, а гортаємо далі */
  function skipBroken(v) {
    if (v === video1 && state.page === 1) showNote(note1, CONFIG.pauseAfterVideo1, () => goTo(2));
    else if (v === video2 && state.page === 3) showNote(note3, CONFIG.pauseAfterVideo2, () => goTo(LAST));
  }

  function playVideo(v) {
    if (v.error) {
      skipBroken(v);
      return;
    }
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

  [video1, video2].forEach((v) => v.addEventListener('error', () => skipBroken(v)));

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

  const LEAF_COLORS = ['#E0A526', '#F2C14E', '#D9772B', '#B4532A', '#C4472D', '#E8B04A', '#A8742A'];

  /* ---------- Листочки-«конфеті» з точки натискання ---------- */
  function leafPop(x, y, count, color) {
    if (reduceMotion.matches) return;
    for (let i = 0; i < (count || 8); i++) {
      const el = document.createElement('div');
      const angle = rand(0, Math.PI * 2);
      const dist = rand(40, 110);
      el.className = 'pop-leaf';
      el.style.cssText = [
        'left:' + x + 'px',
        'top:' + y + 'px',
        '--dx:' + (Math.cos(angle) * dist).toFixed(0) + 'px',
        '--dy:' + (Math.sin(angle) * dist + 40).toFixed(0) + 'px',
        '--r:' + rand(-260, 260).toFixed(0) + 'deg',
        '--s:' + rand(12, 22).toFixed(0) + 'px',
        'color:' + (color && i % 3 ? color : LEAF_COLORS[i % LEAF_COLORS.length]),
      ].join(';');
      el.innerHTML = color && i % 3
        ? '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="18" ry="42" fill="currentColor"/></svg>'
        : '<svg viewBox="0 0 100 100"><use href="#' + (i % 3 ? 'leaf-maple' : 'leaf-oval') + '"/></svg>';
      el.addEventListener('animationend', () => el.remove());
      document.body.appendChild(el);
    }
  }

  /* «Оживити» іконку: анімація + підпис-бульбашка */
  function playIcon(btn, withTip) {
    btn.classList.remove('is-play');
    void btn.offsetWidth;
    btn.classList.add('is-play');
    if (!withTip) return;
    const label = btn.closest('.art__label');
    const bubble = label && $('.art__bubble', label);
    if (!bubble) return;
    bubble.textContent = (ICON_TIPS[btn.dataset.icon] || [''])[0];
    bubble.classList.add('is-on');
    clearTimeout(bubble._t);
    bubble._t = setTimeout(() => bubble.classList.remove('is-on'), 2800);
  }

  function iconButton(id, cls) {
    const tip = ICON_TIPS[id] || ['', 'wiggle'];
    return '<button type="button" class="' + cls + '" data-icon="' + id + '" data-anim="' + tip[1] + '" aria-label="' + tip[0] + '">' +
      '<svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg></button>';
  }

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
    const timetable = $('#timetable');
    const caption = $('#ttCaption');
    const captionDefault = caption.textContent;
    const zoom = $('#zoom');
    const RAMP = 0.015;

    let t = 0;               // позиція в пісні, с
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
    let zoomPaused = false;
    let x0 = 0;
    let x1 = 0;
    let wallW = 0;
    let progW = 0;
    let current = -1;
    let exhibits = [];
    let centers = [];
    let chips = [];

    music.defaultPlaybackRate = CONFIG.musicRate;
    music.preservesPitch = true;

    function build() {
      const frag = document.createDocumentFragment();
      EXHIBITS.forEach((ex, index) => {
        const fig = document.createElement('figure');
        fig.className = 'art' + (ex.photos.length > 1 ? ' art--group' : '');

        const lamp = document.createElement('div');
        lamp.className = 'art__lamp';
        lamp.setAttribute('aria-hidden', 'true');

        const frames = document.createElement('div');
        frames.className = 'art__frames';
        ex.photos.forEach((src, k) => {
          const name = ex.names && ex.names[k];
          const frame = document.createElement('div');
          frame.className = 'art__frame';
          const mat = document.createElement('button');
          mat.type = 'button';
          mat.className = 'art__mat';
          mat.setAttribute('aria-label', 'Збільшити фото: ' + (name ? name + ', ' : '') + ex.subject);
          const img = document.createElement('img');
          img.className = 'art__img';
          img.decoding = 'async';
          img.alt = [name, ex.subject, ex.note].filter(Boolean).join(', ');
          img.addEventListener('load', () => {
            if (img.naturalWidth && img.naturalHeight) {
              img.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
              measure();
            }
          });
          img.addEventListener('error', () => fig.classList.add('is-missing'));
          img.src = src;
          mat.addEventListener('click', () => openZoom(img, ex, name));
          mat.appendChild(img);
          frame.appendChild(mat);
          frames.appendChild(frame);
        });

        const label = document.createElement('figcaption');
        label.className = 'art__label';
        label.innerHTML = '<span class="art__bubble" aria-live="polite"></span><span class="art__icons">' +
          ex.icons.map((id) => iconButton(id, 'art__icon')).join('') + '</span>';
        [['art__role', ex.subject], ['art__note', ex.note], ['art__name', ex.names && ex.names.filter(Boolean).join(' · ')]]
          .forEach(([cls, text]) => {
            if (!text) return;
            const span = document.createElement('span');
            span.className = cls;
            span.textContent = text;
            label.appendChild(span);
          });

        fig.append(lamp, frames, label);
        frag.appendChild(fig);
        exhibits.push(fig);

        /* кнопка в «розкладі» над галереєю */
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'tt';
        chip.setAttribute('aria-label', ex.subject);
        chip.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#' + ex.icons[0] + '"/></svg>' +
          (ex.photos.length > 1 ? '<span class="tt__n">' + ex.photos.length + '</span>' : '');
        chip.addEventListener('click', () => seekTo(index));
        chip.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') caption.textContent = ex.subject; });
        chip.addEventListener('pointerleave', () => { caption.textContent = captionDefault; });
        chip.addEventListener('focus', () => { caption.textContent = ex.subject; });
        chip.addEventListener('blur', () => { caption.textContent = captionDefault; });
        timetable.appendChild(chip);
        chips.push(chip);
      });
      track.insertBefore(frag, outro);

      track.addEventListener('click', (e) => {
        const btn = e.target.closest('.art__icon');
        if (!btn) return;
        playIcon(btn, true);
        const r = btn.getBoundingClientRect();
        leafPop(r.left + r.width / 2, r.top + r.height / 2, 7);
      });
    }

    function duration() {
      const d = music.duration;
      return Number.isFinite(d) && d > 20 ? Math.min(d, CONFIG.musicEnd || d) : CONFIG.galleryFallback;
    }

    /* рівномірний рух із м’яким розгоном і гальмуванням */
    function travel(p) {
      const v = 1 / (1 - RAMP);
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      if (p < RAMP) return (v * p * p) / (2 * RAMP);
      if (p > 1 - RAMP) return 1 - (v * (1 - p) * (1 - p)) / (2 * RAMP);
      return v * (RAMP / 2 + (p - RAMP));
    }

    function untravel(e) {
      const v = 1 / (1 - RAMP);
      const edge = (v * RAMP) / 2;
      if (e <= 0) return 0;
      if (e >= 1) return 1;
      if (e < edge) return Math.sqrt((2 * RAMP * e) / v);
      if (e > 1 - edge) return 1 - Math.sqrt((2 * RAMP * (1 - e)) / v);
      return e / v + RAMP / 2;
    }

    function measure() {
      wallW = wall.clientWidth;
      const center = (el) => el.offsetLeft + el.offsetWidth / 2;
      x0 = wallW / 2 - center(intro);
      x1 = wallW / 2 - center(outro);
      centers = exhibits.map(center);
      progW = prog.clientWidth;
      render();
    }

    function setCurrent(i) {
      if (i === current) return;
      if (current >= 0) {
        exhibits[current].classList.remove('is-current');
        chips[current].classList.remove('is-active');
      }
      current = i;
      if (i < 0) return;
      exhibits[i].classList.add('is-current');
      chips[i].classList.add('is-active');
      if (timetable.scrollWidth > timetable.clientWidth) {
        timetable.scrollTo({ left: chips[i].offsetLeft - timetable.clientWidth / 2 + chips[i].offsetWidth / 2, behavior: 'smooth' });
      }
      /* коли вчитель у центрі — іконки самі «оживають» */
      if (active && !paused && !done) {
        $$('.art__icon', exhibits[i]).forEach((btn, k) => setTimeout(() => playIcon(btn, k === 0), 350 + k * 450));
      }
    }

    function render() {
      const p = clamp(t / duration(), 0, 1);
      const x = x0 + (x1 - x0) * travel(p);
      track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      pencil.style.transform = 'translate3d(' + (p * progW).toFixed(1) + 'px,-50%,0)';
      let best = -1;
      let bestD = wallW * 0.28;
      centers.forEach((c, i) => {
        const d = Math.abs(c + x - wallW / 2);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setCurrent(best);
    }

    function frame(now) {
      const dt = clamp((now - last) / 1000, 0, 0.25) * CONFIG.musicRate;
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
      music.playbackRate = CONFIG.musicRate;
      music.volume = 0;
      const ok = () => {
        clearTimeout(waitTimer);
        waitMusic = false;
        if (!active || paused || done) {
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
      closeZoom(true);
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
      if (!music.paused) fadeTo(music, 0, CONFIG.pauseAfterGallery * 1000, () => music.pause());
      if (state.page === 2) autoTimer = setTimeout(() => goTo(3), CONFIG.pauseAfterGallery * 1000);
    }

    /* перейти до вчителя з «розкладу» */
    function seekTo(i) {
      if (!active) return;
      const e = (wallW / 2 - centers[i] - x0) / (x1 - x0);
      t = untravel(clamp(e, 0, 1)) * duration();
      try { if (!musicBroken) music.currentTime = t; } catch (err) { /* без перемотування */ }
      if (done) {
        clearTimeout(autoTimer);
        done = false;
        if (!paused) startMusic();
      }
      current = -1;
      render();
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
      current = -1;
      render();
    }

    /* збільшене фото */
    function openZoom(img, ex, name) {
      $('#zoomImg').src = img.currentSrc || img.src;
      $('#zoomImg').alt = img.alt;
      $('#zoomRole').textContent = ex.subject;
      $('#zoomNote').textContent = [name, ex.note].filter(Boolean).join(' · ');
      $('#zoomIcons').innerHTML = ex.icons.map((id) => iconButton(id, 'zoom__icon')).join('');
      zoom.classList.add('is-on');
      zoomPaused = active && !paused && !done;
      if (zoomPaused) togglePause();
      $('.zoom__close', zoom).focus({ preventScroll: true });
    }

    function closeZoom(silent) {
      if (!zoom.classList.contains('is-on')) return;
      zoom.classList.remove('is-on');
      if (!silent && zoomPaused && paused) togglePause();
      zoomPaused = false;
    }

    zoom.addEventListener('click', (e) => {
      const icon = e.target.closest('.zoom__icon');
      if (icon) {
        playIcon(icon, false);
        $('#zoomTip').textContent = (ICON_TIPS[icon.dataset.icon] || [''])[0];
        const r = icon.getBoundingClientRect();
        leafPop(r.left + r.width / 2, r.top + r.height / 2, 8);
        return;
      }
      $('#zoomTip').textContent = '';
      closeZoom(false);
    });

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

    return { enter, leave, measure, togglePause, toggleMute, reset, closeZoom };
  })();

  /* ---------- Сторінка подяки ---------- */
  const thanksIcons = $('#thanksIcons');
  const thanksTip = $('#thanksTip');
  EXHIBITS.forEach((ex) => {
    thanksIcons.insertAdjacentHTML('beforeend', iconButton(ex.icons[0], 'thanks__icon'));
    thanksIcons.lastElementChild.dataset.subject = ex.subject;
    thanksIcons.lastElementChild.setAttribute('aria-label', ex.subject + ' — дякуємо!');
  });
  thanksIcons.addEventListener('click', (e) => {
    const btn = e.target.closest('.thanks__icon');
    if (!btn) return;
    playIcon(btn, false);
    btn.classList.add('is-thanked');
    thanksTip.textContent = btn.dataset.subject + ' — дякуємо!';
    const r = btn.getBoundingClientRect();
    leafPop(r.left + r.width / 2, r.top + r.height / 2, 9);
  });
  $('.grade').addEventListener('click', (e) => {
    const g = e.currentTarget;
    g.classList.remove('is-stamp');
    void g.offsetWidth;
    g.classList.add('is-stamp');
    const r = g.getBoundingClientRect();
    leafPop(r.left + r.width / 2, r.top + r.height / 2, 12);
  });

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

  /* ---------- Обкладинка й стіл: квіти, нахил, «садок» ---------- */
  $$('.bouquet .fl').forEach((fl) => {
    fl.addEventListener('click', (e) => {
      e.stopPropagation(); // квіти не відкривають книгу
      fl.classList.remove('is-bloom');
      void fl.getBoundingClientRect();
      fl.classList.add('is-bloom');
      const r = fl.getBoundingClientRect();
      leafPop(r.left + r.width / 2, r.top + r.height / 2, 10, fl.dataset.petal || '#f2c14e');
    });
    fl.addEventListener('animationend', () => fl.classList.remove('is-bloom'));
  });

  const desk = $('.desk');
  const garden = $('#garden');
  let tiltFrame = 0;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || reduceMotion.matches) return;
    cancelAnimationFrame(tiltFrame);
    tiltFrame = requestAnimationFrame(() => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      desk.style.setProperty('--px', (-nx).toFixed(3));
      desk.style.setProperty('--py', (-ny).toFixed(3));
      if (state.page !== 0) return;
      const r = book.getBoundingClientRect();
      const bx = clamp((e.clientX - r.left) / r.width, 0, 1);
      const by = clamp((e.clientY - r.top) / r.height, 0, 1);
      book.style.setProperty('--ry', ((bx - 0.5) * 7).toFixed(2) + 'deg');
      book.style.setProperty('--rx', ((0.5 - by) * 5).toFixed(2) + 'deg');
      book.style.setProperty('--gx', (bx * 100).toFixed(1) + '%');
      book.style.setProperty('--gy', (by * 100).toFixed(1) + '%');
    });
  });
  document.addEventListener('pointerleave', () => {
    book.style.setProperty('--rx', '0deg');
    book.style.setProperty('--ry', '0deg');
  });

  /* клік по порожньому столу «садить» квітку */
  const PLANTS = [['fl-chrys', '#f2c14e'], ['fl-chrys', '#fff4dc'], ['fl-chrys', '#e07f30'], ['fl-aster', '#9b6bc4'],
    ['fl-aster', '#d66a9a'], ['fl-sun', ''], ['fl-rowan', ''], ['leaf-maple', '#c4472d']];
  $('.stage').addEventListener('click', (e) => {
    if (e.target.closest('.book') || reduceMotion.matches) return;
    const [id, color] = PLANTS[Math.floor(Math.random() * PLANTS.length)];
    const el = document.createElement('div');
    el.className = 'planted';
    el.style.cssText = 'left:' + e.clientX + 'px;top:' + e.clientY + 'px;--s:' + rand(46, 84).toFixed(0) + 'px;--r:' +
      rand(-25, 25).toFixed(0) + 'deg;color:' + (color || 'inherit');
    el.innerHTML = '<svg viewBox="0 0 100 100"><use href="#' + id + '"/></svg>';
    el.addEventListener('animationend', (ev) => { if (ev.animationName === 'plant-out') el.remove(); });
    garden.appendChild(el);
    while (garden.children.length > 24) garden.firstElementChild.remove();
    leafPop(e.clientX, e.clientY, 6, color || '#f2c14e');
  });

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
    if (e.key === 'Escape') {
      gallery.closeZoom(false);
      return;
    }
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
    if (e.touches.length !== 1 || (target.closest && target.closest('video, .gbtns, .note, .timetable, .zoom'))) {
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
