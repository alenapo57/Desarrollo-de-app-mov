/**
 * Calcula el rango de fechas [start, end] para un período dado.
 * Devuelve null para 'todos' (sin filtro de fecha).
 *
 * @param {'todos'|'semana'|'mes'|'personalizado'} period
 * @param {string|null} customDesde - fecha 'YYYY-MM-DD'
 * @param {string|null} customHasta - fecha 'YYYY-MM-DD'
 */
export function getPeriodRange(period, customDesde, customHasta) {
  const now = new Date();

  if (period === 'semana') {
    const start = new Date(now);
    const day = start.getDay(); // 0 = domingo, 1 = lunes, ...
    const diffToMonday = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (period === 'mes') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (period === 'personalizado' && customDesde && customHasta) {
    const start = new Date(`${customDesde}T00:00:00`);
    const end = new Date(`${customHasta}T23:59:59`);
    return { start, end };
  }

  return null;
}

/**
 * Filtra una lista de movimientos según el período seleccionado.
 * Si el período es 'todos' (o inválido), devuelve la lista sin cambios.
 */
export function filterMovimientosByPeriod(movimientos, period, customDesde, customHasta) {
  const range = getPeriodRange(period, customDesde, customHasta);
  if (!range) return movimientos;

  return movimientos.filter((m) => {
    const fecha = new Date(`${m.fecha}T00:00:00`);
    return fecha >= range.start && fecha <= range.end;
  });
}
