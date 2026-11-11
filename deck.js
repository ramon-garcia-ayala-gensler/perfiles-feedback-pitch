/* Deck pitch · motor genérico (identidad Halo).
   Escenario 1920 × 1080, cromo (cabeza y pie), navegación con pasos internos, notas del orador (N),
   «de dónde sale» (P), pantalla completa (F) y los componentes que se activan solos por su marcado:
   [data-dib], [data-ruta-portada], .carrera, .orbita, .demo, .etapas, .esc, [data-desde], [data-contar].
   Lo propio de un deck va en deck.local.js, que registra D.hooks[idDeLaDiapositiva] = { entrar, salir, paso }. */
(() => {
  'use strict';
  const H = window.Halo;
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, r = document) => Array.from(r.querySelectorAll(sel));
  const dos = (n) => String(n).padStart(2, '0');
  const movimiento = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hooks = {};
  window.D = { $, $$, hooks, movimiento, Halo: H };

  /* ---- dibujos blancos extra (200 × 160), además de los de halo.js ---- */
  const FINO = 'fill="none" stroke="currentColor" stroke-width=".8" stroke-opacity=".7"';
  const ACC = 'fill="none" stroke="currentColor" stroke-width="1.6"';
  const LN = 'fill="none" stroke="currentColor" stroke-width="1.1"';
  const NODO = 'fill="#fff" stroke="currentColor" stroke-width="1.4"';
  const abrir = (w, h) => `<svg class="h-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`;
  const caja = (x, y, w, d, h, acc) => { const a = acc ? ACC : FINO, dx = d * .87, dy = d * .5;
    return `<path ${a} d="M${x} ${y} l${w * .87} ${w * .5} l${dx} ${-dy} l${-w * .87} ${-w * .5} Z"/>` +
      `<path ${a} d="M${x} ${y} v${h} l${w * .87} ${w * .5} v${-h} M${x + w * .87} ${y + w * .5 + h} l${dx} ${-dy} v${-h}"/>`; };
  Object.assign(H.DIBUJOS, {
    masas() { return abrir(200, 160) + caja(36, 92, 34, 30, 30) + caja(84, 52, 30, 28, 84, true) + caja(128, 82, 30, 26, 46) + `<path ${FINO} d="M14 138 L100 150 L188 132"/></svg>`; },
    podio() { return abrir(200, 160) + caja(30, 88, 62, 60, 22, true) + caja(70, 58, 26, 24, 36) + `<path ${FINO} d="M14 134 L100 152 L188 130"/></svg>`; },
    ciudad() { return abrir(200, 160) + caja(24, 86, 22, 20, 44) + caja(60, 60, 24, 22, 76) + caja(102, 40, 24, 22, 96, true) + caja(146, 76, 22, 20, 54) + '</svg>'; },
    barras() { let s = abrir(200, 160) + `<path ${LN} d="M20 136H184"/>`; const v = [38, 62, 50, 84, 104];
      v.forEach((h, i) => { s += `<rect ${FINO} x="${30 + i * 31}" y="${136 - h}" width="20" height="${h}" rx="2"/>`; });
      s += `<path ${ACC} d="M40 ${136 - 52} L71 ${136 - 76} L102 ${136 - 64} L133 ${136 - 98} L164 ${136 - 118}"/>`;
      v.forEach((h, i) => { s += `<circle ${NODO} cx="${40 + i * 31}" cy="${136 - h - 14}" r="3.2"/>`; });
      return s + '</svg>'; },
    ventana() { let s = abrir(200, 160) + `<rect ${LN} x="18" y="20" width="164" height="120" rx="7"/><path ${FINO} d="M18 36H182"/>`;
      [28, 36, 44].forEach((x) => { s += `<circle cx="${x}" cy="28" r="2" fill="currentColor"/>`; });
      [[56, .62], [76, .35], [96, .8]].forEach(([y, v]) => { s += `<path ${FINO} d="M32 ${y}H92"/><circle ${NODO} cx="${32 + v * 60}" cy="${y}" r="3.6"/>`; });
      return s + `<path ${ACC} d="M112 120 L112 70 L140 54 L168 70 L168 120 Z M112 70 L140 86 L168 70 M140 86 V120"/></svg>`; },
    /* personas conectadas: equipos, talento, red */
    personas() { const P = [[100, 50, 1], [44, 92, 0], [156, 92, 0], [70, 132, 0], [130, 132, 0]]; let s = abrir(200, 160);
      [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [0, 3], [0, 4]].forEach(([a, b], i) => { s += `<path ${i < 2 ? ACC : FINO} d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}"/>`; });
      P.forEach(([x, y, g]) => { const r = g ? 14 : 10; s += `<circle ${NODO} cx="${x}" cy="${y}" r="${r}"/><circle ${LN} cx="${x}" cy="${y - r * .25}" r="${r * .32}"/><path ${LN} d="M${x - r * .55} ${y + r * .6} a${r * .55} ${r * .45} 0 0 1 ${r * 1.1} 0"/>`; });
      return s + '</svg>'; },
    /* reloj: tiempo, días, espera */
    reloj() { const cx = 100, cy = 82, R = 56; let s = abrir(200, 160) + `<circle ${LN} cx="${cx}" cy="${cy}" r="${R}"/><circle ${FINO} cx="${cx}" cy="${cy}" r="${R - 12}"/>`;
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r1 = R - (i % 3 ? 6 : 10); s += `<path ${i % 3 ? FINO : LN} d="M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)} L${(cx + Math.cos(a) * R).toFixed(1)} ${(cy + Math.sin(a) * R).toFixed(1)}"/>`; }
      return s + `<path ${ACC} d="M${cx} ${cy} L${cx} ${cy - 36} M${cx} ${cy} L${cx + 26} ${cy + 12}"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="currentColor"/></svg>`; },
    /* documento con firma: propuesta, aprobación, entrega */
    documento() { let s = abrir(200, 160) + `<path ${LN} d="M58 16 H126 L150 40 V144 H58 Z M126 16 V40 H150"/>`;
      [56, 70, 84, 98].forEach((y, i) => { s += `<path ${FINO} d="M72 ${y} H${i === 3 ? 112 : 136}"/>`; });
      return s + `<path ${ACC} d="M72 126 C82 112 88 134 98 120 S114 116 124 124"/><circle ${NODO} cx="150" cy="128" r="12"/><path ${ACC} d="M144 128 l4 4 l8 -8"/></svg>`; },
    /* tablero de datos: dashboards, perfiles, reportes */
    tablero() { let s = abrir(200, 160) + `<rect ${LN} x="16" y="20" width="168" height="120" rx="8"/>`;
      s += `<rect ${FINO} x="28" y="32" width="60" height="44" rx="4"/><circle ${ACC} cx="58" cy="54" r="14"/><path ${ACC} d="M58 40 A14 14 0 0 1 71 59"/>`;
      [[100, 36, .8], [100, 52, .55], [100, 68, .7]].forEach(([x, y, v]) => { s += `<path ${FINO} d="M${x} ${y} H172"/><path ${ACC} d="M${x} ${y} H${(x + v * 72).toFixed(0)}"/>`; });
      return s + `<path ${FINO} d="M28 128 L28 90 M28 128 H172"/><path ${ACC} d="M28 120 L60 108 L92 114 L124 96 L156 100 L172 92"/></svg>`; },
  });
  D.caja = caja;

  /* ---- arranque: los scripts de abajo (deck.local.js) ya registraron sus hooks ---- */
  function arrancar() {
    $$('[data-dib]').forEach((el) => { const f = H.DIBUJOS[el.dataset.dib]; if (f) el.innerHTML = f(); else console.warn('Dibujo desconocido:', el.dataset.dib); });
    H.montar();

    /* portada: ruta blanca con los pasos (data-nodos="Uno|Dos|Tres") */
    const MONO = "font-family:'JetBrains Mono','Cascadia Mono',Consolas,monospace;font-weight:500;letter-spacing:.08em";
    $$('[data-ruta-portada]').forEach((el) => {
      const N = (el.dataset.nodos || 'Uno|Dos|Tres').split('|'), et = el.dataset.etiqueta || 'PASO';
      const P = N.map((_, i) => [1290 + i * (380 / Math.max(1, N.length - 1)), 250 + i * (540 / Math.max(1, N.length - 1))]);
      const mid = P[Math.floor((N.length - 1) / 2)];
      let s = `<svg class="h-svg" viewBox="0 0 1920 1080" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray=".5 9" stroke-linecap="round" d="M1100 ${mid[1]} L${mid[0]} ${mid[1]}"/><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray=".5 9" stroke-linecap="round" d="M${P.map((p) => p.join(' ')).join(' L')}"/>`;
      P.forEach((p, i) => { s += `<circle fill="#fff" stroke="currentColor" stroke-width="1.6" cx="${p[0]}" cy="${p[1]}" r="${p === mid ? 13 : 8}"/><text x="${p[0] + 24}" y="${p[1] + 9}" fill="currentColor" style="font-family:'Inter Display','Segoe UI Variable Display','Segoe UI',sans-serif;font-size:32px;letter-spacing:-.01em">${N[i]}</text><text x="${p[0] + 24}" y="${p[1] + 40}" fill="currentColor" style="${MONO};font-size:16px">${et} 0${i + 1}</text>`; });
      el.innerHTML = s + '</svg>';
    });

    /* carrera: cada .carril trae data-dias; la pista mide lo que tarda el más lento */
    $$('.carrera').forEach((c) => {
      const carriles = $$('.carril', c), ns = carriles.map((k) => +k.dataset.dias || 1);
      const dias = Math.max(...ns), gana = Math.min(...ns), dia = Math.round(1360 / dias);
      c.style.setProperty('--dias', dias); c.style.setProperty('--gana', gana); c.style.setProperty('--dia', dia + 'px');
      carriles.forEach((k, i) => { k.classList.add('c' + (i + 1)); k.style.setProperty('--n', ns[i]); if (ns[i] === dias) $$('.llega', k).forEach((l) => l.classList.add('llega--izq')); });
      const eje = $$('.eje', c)[0], et = c.dataset.unidad || 'DÍA';
      if (eje) eje.innerHTML = Array.from({ length: dias + 1 }, (_, i) => `<i style="left:${i * dia}px"></i>${i ? `<b style="left:${i * dia}px">${et} ${i}</b>` : ''}`).join('');
    });

    /* escalera: cada .pel trae data-h (número), data-u (unidad), data-marca (texto de la marca) y opcional data-recurrente */
    $$('.esc').forEach((esc) => {
      const pels = $$('.pel', esc), n = pels.length, sl = esc.closest('.s');
      esc.style.setProperty('--n', n); $$('.pels', esc).forEach((p) => p.style.setProperty('--n', n));
      const altos = pels.map((_, i) => Math.round(370 + (n > 1 ? i * 270 / (n - 1) : 270)));
      pels.forEach((p, i) => p.style.setProperty('--alto', altos[i] + 'px'));
      if (!sl.dataset.pasos) sl.dataset.pasos = n;
      const unidad = esc.dataset.unidad || 'h';
      const prev = hooks[sl.id] || {};
      hooks[sl.id] = Object.assign({}, prev, {
        paso(k) {
          pels.forEach((p, i) => p.classList.toggle('act', i <= k));
          const m = $$('.marca', esc)[0];
          if (m) {
            m.style.setProperty('--col', k); m.style.setProperty('--alto', altos[k] + 'px'); m.style.setProperty('--n', n);
            if (k === n - 1 && n > 2) { m.style.left = 'auto'; m.style.right = '0'; } else { m.style.left = ''; m.style.right = ''; }
            const t = $$('.h-pastilla', m)[0]; if (t) t.innerHTML = pels[k].dataset.marca || '';
          }
          let suma = 0, rec = '';
          pels.slice(0, k + 1).forEach((p) => { suma += +p.dataset.h || 0; if (p.dataset.recurrente) rec = ' + ' + p.dataset.recurrente; });
          const s = $$('[data-suma]', esc)[0]; if (s) s.textContent = suma.toLocaleString('es-MX') + ' ' + unidad + rec;
          prev.paso && prev.paso(k);
        },
      });
    });

    /* etapas: con data-pasos, cada paso enciende una etapa y cambia el título ([data-titulo-paso]) */
    $$('.etapas').forEach((et) => {
      const sl = et.closest('.s'), items = $$('.etapa', et), tit = $$('[data-titulo-paso]', sl)[0], prev = hooks[sl.id] || {};
      hooks[sl.id] = Object.assign({}, prev, {
        paso(k) { items.forEach((x, i) => x.classList.toggle('on', i === k)); if (tit && items[k] && items[k].dataset.titulo) tit.innerHTML = items[k].dataset.titulo; prev.paso && prev.paso(k); },
      });
    });

    /* demo: el video arranca al entrar y la lista de momentos (li[data-t] en segundos) lo sigue */
    $$('.demo').forEach((dm) => {
      const sl = dm.closest('.s'), v = $$('video', dm)[0], li = $$('.momentos li', dm), T = li.map((l) => +l.dataset.t || 0), prev = hooks[sl.id] || {};
      const imgs = $$('.pantalla img', dm);
      if (!v && imgs.length > 1) {
        /* galería: sin video, cada captura acompaña a un momento y rotan solas (data-intervalo en ms) */
        const pan = $$('.pantalla', dm)[0], dur = +(pan.dataset.intervalo || 4000); pan.classList.add('pantalla--galeria');
        let k = 0, t = 0, t0 = 0, raf = 0;
        const mostrar = (n) => { k = n % imgs.length; t0 = performance.now(); imgs.forEach((im, i) => im.classList.toggle('on', i === k)); li.forEach((l, i) => { l.classList.toggle('act', i === k); l.style.setProperty('--av', i < k ? 1 : 0); }); };
        const barra = () => { if (li[k]) li[k].style.setProperty('--av', Math.min(1, (performance.now() - t0) / dur).toFixed(3)); raf = requestAnimationFrame(barra); };
        const ciclo = () => { t = setTimeout(() => { mostrar(k + 1); ciclo(); }, dur); };
        hooks[sl.id] = Object.assign({}, prev, {
          entrar(s) { clearTimeout(t); cancelAnimationFrame(raf); mostrar(0); if (movimiento) { ciclo(); barra(); } prev.entrar && prev.entrar(s); },
          salir(s) { clearTimeout(t); cancelAnimationFrame(raf); prev.salir && prev.salir(s); },
        });
        return;
      }
      if (!v) return;
      let raf = 0;
      const marca = () => {
        const t = v.currentTime, fin = v.duration || (T[T.length - 1] || 0) + 8;
        li.forEach((l, i) => { const a = T[i], b = i + 1 < T.length ? T[i + 1] : fin, on = t >= a && t < b;
          l.classList.toggle('act', on); l.style.setProperty('--av', on ? Math.min(1, (t - a) / (b - a)).toFixed(3) : t >= b ? 1 : 0); });
        raf = requestAnimationFrame(marca);
      };
      hooks[sl.id] = Object.assign({}, prev, {
        entrar(s) { v.currentTime = 0; v.play().catch(() => {}); cancelAnimationFrame(raf); marca(); prev.entrar && prev.entrar(s); },
        salir(s) { v.pause(); cancelAnimationFrame(raf); prev.salir && prev.salir(s); },
      });
    });

    /* motor: el núcleo se enciende, salen los satélites (.sat con data-n) y un pulso los recorre */
    $$('.orbita').forEach((o) => {
      const sl = o.closest('.s'), p = $$('.pulso', o)[0], nucleo = $$('.nucleo-p', o)[0], base = nucleo ? nucleo.innerHTML : '', prev = hooks[sl.id] || {};
      const sats = $$('.sat', o); let t = 0, an = null, i = 0;
      const parar = () => { clearTimeout(t); if (an) an.cancel(); an = null; };
      const ciclo = () => {
        if (!p || !sats.length) return;
        const sat = sats[i % sats.length], cx = o.clientWidth / 2, cy = o.clientHeight / 2;
        const tx = sat.offsetLeft + sat.offsetWidth / 2, ty = sat.offsetTop + sat.offsetHeight / 2;
        an = p.animate([{ transform: `translate(${cx}px,${cy}px)`, opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .85 }, { transform: `translate(${tx}px,${ty}px)`, opacity: 0 }], { duration: 800, easing: 'ease-in' });
        an.onfinish = () => { sats.forEach((x) => x.classList.toggle('vivo', x === sat)); if (nucleo && sat.dataset.n) nucleo.innerHTML = `${o.dataset.nucleo || ''} + <em>${sat.dataset.n}</em>`; i++; t = setTimeout(ciclo, 900); };
      };
      hooks[sl.id] = Object.assign({}, prev, {
        entrar(s) { parar(); i = 0; s.classList.remove('anim'); sats.forEach((x) => x.classList.remove('vivo')); if (nucleo) nucleo.innerHTML = base;
          void s.offsetWidth; requestAnimationFrame(() => s.classList.add('anim')); if (movimiento) t = setTimeout(ciclo, 1700); prev.entrar && prev.entrar(s); },
        salir(s) { parar(); s.classList.remove('anim'); prev.salir && prev.salir(s); },
      });
    });

    /* red: grafo vivo de personas, proyectos y grupos. Datos en <script type="application/json" id="…"> (ver componentes.md).
       Aparece con su [data-desde]/[data-solo]; con data-foco="k", desde el paso k se enciende el nodo foco y sus notas. */
    $$('.red').forEach((el) => {
      const fuente = document.getElementById(el.dataset.red);
      if (!fuente) { console.warn('Red sin datos:', el.dataset.red); return; }
      const datos = JSON.parse(fuente.textContent), sl = el.closest('.s'), prev = hooks[sl.id] || {};
      const cv = document.createElement('canvas'); el.prepend(cv);
      const W = el.offsetWidth, AL = el.offsetHeight, ctx = cv.getContext('2d');
      cv.width = W * 2; cv.height = AL * 2; ctx.scale(2, 2);
      let semilla = (datos.generar && datos.generar.semilla) || 7;
      const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
      const col = (c) => H.HEX[c] || c || H.HEX.lila;
      /* grupos en elipse alrededor del centro */
      const G = (datos.grupos || []).map((g, i, a) => { const t = i / a.length * Math.PI * 2 - Math.PI / 2;
        return Object.assign({}, g, { x: W / 2 + Math.cos(t) * W * .33, y: AL / 2 + Math.sin(t) * AL * .3 }); });
      const gPor = Object.fromEntries(G.map((g) => [g.id, g]));
      const N = [], porId = {}, L = [];
      const nodo = (o) => { const g = gPor[o.g] || { x: W / 2, y: AL / 2 }; const n = Object.assign({ x: g.x + (azar() - .5) * 120, y: g.y + (azar() - .5) * 120 }, o); N.push(n); porId[n.id] = n; return n; };
      const liga = (a, b, tipo) => { if (porId[a] && porId[b] && a !== b) L.push({ a: porId[a], b: porId[b], tipo: tipo || '' }); };
      /* relleno generado: personas y proyectos por grupo, ligados sobre todo dentro de su grupo */
      if (datos.generar && G.length) {
        const { personas = 50, proyectos = 20 } = datos.generar, P = [];
        for (let i = 0; i < proyectos; i++) P.push(nodo({ id: '_p' + i, t: 'proyecto', g: G[i % G.length].id }));
        for (let i = 0; i < personas; i++) {
          const n = nodo({ id: '_h' + i, t: 'persona', g: G[Math.floor(azar() * G.length)].id }), k = 1 + Math.floor(azar() * 3);
          for (let j = 0; j < k; j++) { const mismos = P.filter((p) => p.g === n.g), lista = azar() < .8 && mismos.length ? mismos : P; liga(n.id, lista[Math.floor(azar() * lista.length)].id); }
        }
      }
      (datos.nodos || []).forEach(nodo);
      (datos.ligas || []).forEach(([a, b, tipo]) => liga(a, b, tipo));
      /* acomodo: repulsión, resortes y gravedad a su grupo (determinista) */
      for (let it = 0; it < 360; it++) {
        const enf = 1 - it / 360;
        for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
          const a = N[i], b = N[j]; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy || .01;
          if (d2 > 160 * 160) continue; const f = 900 / d2 * enf, d = Math.sqrt(d2); dx /= d; dy /= d;
          a.x += dx * f; a.y += dy * f; b.x -= dx * f; b.y -= dy * f;
        }
        L.forEach(({ a, b }) => { const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, f = (d - 46) * .04 * enf; a.x += dx / d * f; a.y += dy / d * f; b.x -= dx / d * f; b.y -= dy / d * f; });
        N.forEach((n) => { const g = gPor[n.g]; if (g) { n.x += (g.x - n.x) * .012; n.y += (g.y - n.y) * .012; }
          n.x = Math.max(30, Math.min(W - 30, n.x)); n.y = Math.max(30, Math.min(AL - 30, n.y)); });
      }
      const foco = datos.foco && porId[datos.foco.nodo];
      if (foco) { const dx = W * .5 - foco.x, dy = AL * .52 - foco.y; N.forEach((n) => { if (n === foco) { n.x += dx; n.y += dy; } }); }
      /* estrella del foco: cada nodo con nota se acomoda en un anillo alrededor del foco, con su línea directa y su nota hacia afuera */
      const notas = foco ? (datos.foco.notas || []).filter((nt) => porId[nt.a] && porId[nt.a] !== foco) : [];
      const anotados = notas.map((nt) => porId[nt.a]), estrella = new Set(anotados);
      const tipoCon = (n) => { const l = L.find((x) => (x.a === foco && x.b === n) || (x.b === foco && x.a === n)); return l ? l.tipo : ''; };
      if (foco && anotados.length) {
        const k = anotados.length, ini = -Math.PI / 2 + Math.PI / k, rx = Math.min(W * .3, 340), ry = Math.min(AL * .34, 240);
        const norm = (a) => ((a - ini) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2), ang = (n) => norm(Math.atan2(n.y - foco.y, n.x - foco.x));
        [...anotados].sort((a, b) => ang(a) - ang(b)).forEach((n, i) => { const a = ini + i * Math.PI * 2 / k; n.tx = foco.x + Math.cos(a) * rx; n.ty = foco.y + Math.sin(a) * ry; n.ta = a; });
      }
      const centro = { x: W / 2, y: AL / 2 }, maxD = Math.hypot(W, AL) / 2;
      N.forEach((n, i) => { n.retraso = Math.hypot(n.x - centro.x, n.y - centro.y) / maxD * 1.3 + azar() * .25; n.fase = i * 1.7; });
      /* etiquetas HTML: nombres de grupo y notas del foco */
      const capa = document.createElement('div'); capa.className = 'red-capa'; el.append(capa);
      G.forEach((g) => capa.insertAdjacentHTML('beforeend', `<span class="red-grupo" style="left:${g.x}px;top:${g.y - 128}px">${g.n}</span>`));
      if (foco) {
        /* el foco es el centro de la estrella: una tarjeta con su avatar, encima de donde salen las líneas */
        capa.insertAdjacentHTML('beforeend', `<span class="red-nota red-nota--foco" style="left:${foco.x}px;top:${foco.y}px">${foco.ini ? `<span class="red-av">${foco.ini}</span>` : ''}<span>${datos.foco.titulo || foco.n}</span></span>`);
        notas.forEach((nt, i) => { const n = porId[nt.a], der = Math.cos(n.ta) > -.01;
          capa.insertAdjacentHTML('beforeend', `<span class="red-nota${der ? '' : ' red-nota--izq'}" style="left:${n.tx + (der ? 22 : -22)}px;top:${n.ty}px;--t:${(.3 + i * .14).toFixed(2)}s">${nt.t}</span>`);
          /* si no cabe de su lado, cambia de lado */
          const sp = capa.lastElementChild, ancho = sp.offsetWidth;
          if (der && n.tx + 22 + ancho > W - 8) { sp.classList.add('red-nota--izq'); sp.style.left = (n.tx - 22) + 'px'; }
          else if (!der && n.tx - 22 - ancho < 8) { sp.classList.remove('red-nota--izq'); sp.style.left = (n.tx + 22) + 'px'; } });
      }
      let raf = 0, t0 = 0, vis = 0, f = 0, ultimo = 0;
      const dibuja = (now) => {
        const t = (now - t0) / 1000, enFoco = el.classList.contains('red--foco'), visible = !el.hasAttribute('data-desde') && !el.hasAttribute('data-solo') || el.classList.contains('visto');
        if (visible && !vis) vis = now; if (!visible) vis = 0;
        const tv = vis ? (now - vis) / 1000 : 0, dt = Math.min(.05, (now - (ultimo || now)) / 1000); ultimo = now;
        f += ((enFoco ? 1 : 0) - f) * Math.min(1, dt * 4);
        ctx.clearRect(0, 0, W, AL);
        G.forEach((g) => { const a = Math.min(1, tv / .8) * (1 - f * .8), gr = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, 170);
          gr.addColorStop(0, col(g.c) + Math.round(a * 110).toString(16).padStart(2, '0')); gr.addColorStop(1, col(g.c) + '00');
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(g.x, g.y, 170, 0, Math.PI * 2); ctx.fill(); });
        const e = f * f * (3 - 2 * f), quieto = 1 - e * .8;
        const pos = (n) => { let x = n.x, y = n.y; if (n.tx != null) { x += (n.tx - x) * e; y += (n.ty - y) * e; }
          return [x + Math.sin(t * .5 + n.fase) * 2.2 * quieto, y + Math.cos(t * .42 + n.fase) * 2.2 * quieto]; };
        const ap = (n) => movimiento ? Math.max(0, Math.min(1, (tv - n.retraso) / .5)) : (tv ? 1 : 0);
        L.forEach((l) => { const a = Math.min(ap(l.a), ap(l.b)); if (!a) return;
          const [x1, y1] = pos(l.a), [x2, y2] = pos(l.b);
          ctx.strokeStyle = `rgba(29,30,33,${.13 * a * (1 - f * .88)})`; ctx.lineWidth = 1; ctx.setLineDash(l.tipo === 'recomienda' ? [2, 5] : []);
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
        if (foco && f > .01) {
          const [fx, fy] = pos(foco);
          anotados.forEach((n, i) => { const [x, y] = pos(n);
            ctx.strokeStyle = `rgba(29,30,33,${.5 * f})`; ctx.lineWidth = 1.6; ctx.setLineDash(tipoCon(n) === 'recomienda' ? [2, 6] : []);
            ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(x, y); ctx.stroke();
            if (f > .5 && movimiento) { const k = (t * .4 + i * .17) % 1; ctx.globalAlpha = f; ctx.fillStyle = col('coral'); ctx.beginPath(); ctx.arc(fx + (x - fx) * k, fy + (y - fy) * k, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; } });
        }
        ctx.setLineDash([]);
        N.forEach((n) => { const a = ap(n); if (!a) return; const [x, y] = pos(n), g = gPor[n.g], cerca = n === foco || estrella.has(n);
          const atenua = cerca ? 1 : 1 - f * .84; ctx.globalAlpha = a * atenua;
          if (n === foco) {
            const r = 12 + 16 * f, gl = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2); gl.addColorStop(0, col('coral') + '66'); gl.addColorStop(1, col('lila') + '00');
            ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
            const gg = ctx.createLinearGradient(x - r, y - r, x + r, y + r); gg.addColorStop(0, col('durazno')); gg.addColorStop(.5, col('coral')); gg.addColorStop(1, col('lila'));
            ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            if (f > .3 && n.ini) { ctx.fillStyle = '#fff'; ctx.font = `300 ${Math.round(r * .8)}px 'Segoe UI Variable Display','Segoe UI',sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.ini, x, y + 1); }
          } else if (n.t === 'proyecto') {
            const s = (n.n ? 9 : 6.5) * (cerca && f > .5 ? 1.25 : 1);
            ctx.fillStyle = '#fff'; ctx.strokeStyle = H.HEX.grafito; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.roundRect(x - s, y - s, s * 2, s * 2, 3); ctx.fill(); ctx.stroke();
          } else {
            const r = (n.n ? 7 : 4.6) * (cerca && f > .5 ? 1.35 : 1);
            ctx.fillStyle = col(g ? g.c : 'lila'); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          }
          ctx.globalAlpha = 1; });
        capa.style.setProperty('--f', f.toFixed(3)); capa.style.setProperty('--v', Math.min(1, tv / 1.2).toFixed(3));
        el.classList.toggle('foco-listo', f > .6);
        raf = requestAnimationFrame(dibuja);
      };
      hooks[sl.id] = Object.assign({}, prev, {
        entrar(s) { cancelAnimationFrame(raf); t0 = performance.now(); vis = 0; f = 0; ultimo = 0; raf = requestAnimationFrame(dibuja); prev.entrar && prev.entrar(s); },
        salir(s) { cancelAnimationFrame(raf); prev.salir && prev.salir(s); },
      });
    });

    /* cromo: cabeza y pie en las diapositivas con data-ruta */
    const S = $$('.s'), producto = document.body.dataset.producto || '', equipo = document.body.dataset.equipo || '';
    S.forEach((sl, i) => {
      if (sl.dataset.ruta) sl.insertAdjacentHTML('afterbegin', `<div class="cabeza"><p class="et">${sl.dataset.ruta}</p><p class="et">${producto}</p></div><div class="pie"><p class="et">${equipo}</p><p class="et">${dos(i + 1)} / ${dos(S.length)}</p></div>`);
      /* pasos: explícitos, o los que pidan los [data-desde] */
      const desde = [...$$('[data-desde]', sl).map((e) => +e.dataset.desde || 0), ...$$('[data-solo]', sl).flatMap((e) => e.dataset.solo.split(',').map(Number)), ...$$('.red[data-foco]', sl).map((e) => +e.dataset.foco)];
      if (!sl.dataset.pasos && desde.length) sl.dataset.pasos = Math.max(...desde) + 1;
    });

    /* ---- navegación con pasos ---- */
    let actual = -1, paso = 0;
    const escenario = $('escenario');
    const ajustar = () => escenario.style.setProperty('--k', Math.min(innerWidth / 1920, innerHeight / 1080));
    addEventListener('resize', ajustar); ajustar();
    const hook = (sl) => hooks[sl.id] || {};
    const pasosDe = (sl) => +sl.dataset.pasos || 1;
    const url = () => history.replaceState(null, '', '#' + (actual + 1) + (paso ? '.' + paso : ''));
    const contar = (sl) => $$('[data-contar]', sl).forEach((el) => {
      const fin = +el.dataset.contar, dec = (el.dataset.contar.split('.')[1] || '').length;
      const fmt = (v) => v.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (!movimiento) { el.textContent = fmt(fin); return; }
      const t0 = performance.now(), dur = 1100;
      const f = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(fin * e); if (k < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    });
    function fijarPaso(n) {
      paso = n; const sl = S[actual]; sl.dataset.paso = n;
      $$('[data-desde]', sl).forEach((e) => e.classList.toggle('visto', (+e.dataset.desde || 0) <= n));
      $$('[data-solo]', sl).forEach((e) => e.classList.toggle('visto', e.dataset.solo.split(',').map(Number).includes(n)));
      $$('[data-por-paso]', sl).forEach((e) => { const a = JSON.parse(e.dataset.porPaso); e.innerHTML = a[Math.min(n, a.length - 1)]; });
      $$('.red[data-foco]', sl).forEach((e) => e.classList.toggle('red--foco', n >= +e.dataset.foco));
      hook(sl).paso && hook(sl).paso(n); url();
    }
    const ir = (n, p = 0) => {
      n = Math.max(0, Math.min(S.length - 1, n));
      if (n !== actual) {
        if (actual >= 0) { S[actual].classList.remove('on', 'corre'); hook(S[actual]).salir && hook(S[actual]).salir(S[actual]); }
        actual = n; const sl = S[n]; sl.classList.add('on');
        $('cuenta').textContent = `${dos(n + 1)} / ${dos(S.length)}`;
        $('notas-txt').textContent = sl.dataset.notas || ''; $('fuente-txt').textContent = sl.dataset.fuente || '';
        fijarPaso(Math.min(p, pasosDe(sl) - 1));
        if ($$('.carrera', sl).length) { void sl.offsetWidth; requestAnimationFrame(() => sl.classList.add('corre')); }
        contar(sl);
        hook(sl).entrar && hook(sl).entrar(sl);
      } else if (p !== paso) fijarPaso(Math.min(p, pasosDe(S[actual]) - 1));
      url();
    };
    const sig = () => { if (paso < pasosDe(S[actual]) - 1) fijarPaso(paso + 1); else ir(actual + 1); };
    const ant = () => { if (paso > 0) fijarPaso(paso - 1); else if (actual > 0) ir(actual - 1, pasosDe(S[actual - 1]) - 1); };

    const pantalla = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});
    const alterna = (id) => { const o = $(id), on = !o.classList.contains('on'); $('notas').classList.remove('on'); $('fuente').classList.remove('on'); if (on) o.classList.add('on'); };
    addEventListener('keydown', (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); sig(); }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); ant(); }
      else if (e.key === 'Home') ir(0); else if (e.key === 'End') ir(S.length - 1);
      else if (e.key === 'f' || e.key === 'F') pantalla();
      else if (e.key === 'n' || e.key === 'N') alterna('notas');
      else if (e.key === 'p' || e.key === 'P') alterna('fuente');
    });
    $('ant').onclick = ant; $('sig').onclick = sig;
    $('bnotas').onclick = () => alterna('notas'); $('bfuente').onclick = () => alterna('fuente'); $('bpant').onclick = pantalla;
    let t0m; addEventListener('mousemove', () => { document.body.classList.add('mueve'); clearTimeout(t0m); t0m = setTimeout(() => document.body.classList.remove('mueve'), 2200); });
    let x0t = null; addEventListener('touchstart', (e) => { x0t = e.touches[0].clientX; }, { passive: true });
    addEventListener('touchend', (e) => { if (x0t == null || e.target.closest('input,canvas,iframe')) { x0t = null; return; } const dx = e.changedTouches[0].clientX - x0t; if (Math.abs(dx) > 50) (dx < 0 ? sig() : ant()); x0t = null; });
    const desdeHash = () => { const [a, c] = location.hash.slice(1).split('.'); ir((parseInt(a, 10) || 1) - 1, parseInt(c, 10) || 0); };
    addEventListener('hashchange', desdeHash);
    desdeHash();
    window.Deck = { ir, sig, ant, fijarPaso, total: S.length, pasos: () => S.map(pasosDe) };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
