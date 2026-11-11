/* Perfiles y Feedback · diapositiva 7, paso 0: el perfil «empieza a relacionar».
   Cada colaborador (li[data-proy]) se enciende por turnos y unas líneas lo unen con los proyectos que compartieron. */
(() => {
  'use strict';
  const { $$, hooks, movimiento } = window.D;
  const sl = document.getElementById('distingue');
  if (!sl) return;
  const cuerpo = sl.querySelector('.pa-cuerpo'), svg = sl.querySelector('.pa-lineas');
  const gente = $$('.pa-gente li[data-proy]', sl), proy = Object.fromEntries($$('.pa-proy[data-id]', sl).map((p) => [p.dataset.id, p]));
  let t = 0, i = 0;

  const caja = (el) => {   // caja en px del lienzo 1920 × 1080, relativa a .pa-cuerpo
    const k = document.getElementById('escenario').getBoundingClientRect().width / 1920, c = cuerpo.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: (b.left - c.left) / k, y: (b.top - c.top) / k, w: b.width / k, h: b.height / k };
  };
  const limpiar = () => { svg.innerHTML = ''; gente.forEach((g) => g.classList.remove('liga')); Object.values(proy).forEach((p) => p.classList.remove('liga')); };
  const relaciona = () => {
    limpiar();
    const li = gente[i % gente.length], a = caja(li.querySelector('.pa-mini')); li.classList.add('liga');
    const x1 = a.x, y1 = a.y + a.h / 2;
    li.dataset.proy.split(',').forEach((id, k) => {
      const p = proy[id]; if (!p) return; p.classList.add('liga');
      const b = caja(p.querySelector('.h-miniatura')), x2 = b.x + b.w, y2 = b.y + b.h * .5;
      const xm = (x1 + x2) / 2, d = `M${x1} ${y1} C${xm} ${y1}, ${xm} ${y2}, ${x2} ${y2}`;
      svg.insertAdjacentHTML('beforeend', `<path d="${d}"/><circle cx="${x2}" cy="${y2}" r="5"/><circle cx="${x1}" cy="${y1}" r="5"/>`);
      const el = svg.lastElementChild.previousElementSibling.previousElementSibling;
      requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('on'); $$('circle', svg).forEach((c) => c.classList.add('on')); }));
      void k;
    });
    i++;
  };
  const parar = () => { clearTimeout(t); limpiar(); };
  const ciclo = (espera) => { t = setTimeout(() => { relaciona(); if (movimiento) ciclo(2800); }, espera); };

  const prev = hooks.distingue || {};
  hooks.distingue = Object.assign({}, prev, {
    entrar(s) { i = 0; parar(); if (+(s.dataset.paso || 0) === 0) ciclo(1500); prev.entrar && prev.entrar(s); },
    salir(s) { parar(); prev.salir && prev.salir(s); },
    paso(n) { parar(); if (n === 0 && sl.classList.contains('on')) ciclo(700); prev.paso && prev.paso(n); },
  });
})();
