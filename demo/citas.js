/* Demo "Web + citas" (negocio ficticio). Todo se guarda solo en este navegador; no se envía nada. */
(function (w) {
  'use strict';
  var KEY = 'rt_demo_citas_v1';
  var SERVICIOS = [
    { id: 'mant', n: 'Mantenimiento (aceite y filtros)', min: 60 },
    { id: 'fren', n: 'Frenos', min: 90 },
    { id: 'neum', n: 'Neumáticos', min: 30 },
    { id: 'itv', n: 'Pre-ITV', min: 30 },
    { id: 'diag', n: 'Diagnosis', min: 30 }
  ];
  var TRAMOS = [['09:00', '13:30'], ['15:30', '19:00']];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function toMin(h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; }
  function toH(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function abierto(d) { return d.getDay() !== 0 && d.getDay() !== 6 ? true : d.getDay() === 6 ? 'manana' : false; }
  function seed() {
    var hoy = new Date(), c = [], nombres = ['Marta G.', 'Luis P.', 'Ana R.', 'Jordi S.', 'Carmen L.', 'Pablo M.'];
    var k = 0;
    for (var i = 0; i < 6; i++) {
      var d = addDays(hoy, i); if (!abierto(d)) continue;
      [['09:30', 'mant'], ['11:00', 'fren'], ['16:00', 'itv']].forEach(function (s, j) {
        if ((i + j) % 2) return;
        c.push({ id: 'c' + (k++), dia: ymd(d), hora: s[0], serv: s[1], nombre: nombres[k % nombres.length], tel: '600 000 0' + pad(k), estado: 'pendiente' });
      });
    }
    return { citas: c, bloqueos: [{ dia: ymd(addDays(hoy, 2)), desde: '15:30', hasta: '19:00', motivo: 'Formación' }] };
  }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.citas) return s; } catch (e) {}
    var s2 = seed(); save(s2); return s2;
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function serv(id) { for (var i = 0; i < SERVICIOS.length; i++) if (SERVICIOS[i].id === id) return SERVICIOS[i]; return SERVICIOS[0]; }
  function ocupado(s, dia, ini, dur, ignora) {
    var fin = ini + dur;
    for (var i = 0; i < s.citas.length; i++) {
      var c = s.citas[i]; if (c.dia !== dia || c.estado === 'anulada' || c.id === ignora) continue;
      var a = toMin(c.hora), b = a + serv(c.serv).min;
      if (ini < b && a < fin) return true;
    }
    for (var j = 0; j < s.bloqueos.length; j++) {
      var bl = s.bloqueos[j]; if (bl.dia !== dia) continue;
      if (ini < toMin(bl.hasta) && toMin(bl.desde) < fin) return true;
    }
    return false;
  }
  function huecos(s, dia, dur) {
    var d = new Date(dia + 'T12:00:00'), ab = abierto(d), out = [];
    if (!ab) return out;
    var tr = ab === 'manana' ? [TRAMOS[0]] : TRAMOS, ahora = new Date(), esHoy = dia === ymd(ahora);
    tr.forEach(function (t) {
      for (var m = toMin(t[0]); m + dur <= toMin(t[1]); m += 30) {
        if (esHoy && m <= ahora.getHours() * 60 + ahora.getMinutes()) continue;
        out.push({ h: toH(m), libre: !ocupado(s, dia, m, dur) });
      }
    });
    return out;
  }
  function fechaLarga(dia) {
    var d = new Date(dia + 'T12:00:00');
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  w.RTCitas = { SERVICIOS: SERVICIOS, load: load, save: save, serv: serv, huecos: huecos, ymd: ymd, addDays: addDays, abierto: abierto, fechaLarga: fechaLarga, toMin: toMin, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})(window);
