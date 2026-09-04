// ============================================================
// MAGNATE MOTORS — Motor de reglas (funciones puras, testeable)
// ============================================================
(function (root) {
  "use strict";
  var DATA = (typeof module !== "undefined" && module.exports) ? require("./data.js") : root.MM_DATA;

  function ceil(x) { return Math.ceil(x); }
  function clampMin(x, min) { return x < min ? min : x; }

  // ---------- Jugador: helpers de tecnología ----------
  function patentLevel(player, branch) {
    return (player.patentes && player.patentes[branch]) || 0;
  }
  function hasKnow(player, id) {
    return !!(player.knowhow && player.knowhow.indexOf(id) !== -1);
  }
  function company(player) { return DATA.COMPANIES[player.companyId]; }

  // ---------- Costo de producción ----------
  // events: objeto con banderas activas ESTA ronda (ver applyEventsForRound)
  function productionCost(player, marketId, events) {
    events = events || {};
    var market = DATA.MARKETS[marketId];
    if (hasKnow(player, "vehiculo_electrico")) {
      // Fijo $4, excluye cualquier otra reducción de costo de producción propia.
      var vcost = 4;
      if (events.costoProduccionExtra) vcost += events.costoProduccionExtra; // guerra mundial +1, si no es inmune
      return clampMin(vcost, 2);
    }
    var cost = market.costo;
    if (hasKnow(player, "manufactura_esbelta")) cost -= 1;
    if (hasKnow(player, "automatizacion_procesos")) cost -= 2;
    if (hasKnow(player, "inteligencia_artificial")) cost -= 1;
    if (market.continente === "Asia" && events.toyotaAsia) cost -= 1;
    if (events.lineaMontaje) cost -= 1; // permanente desde que se reveló
    var inmune = hasKnow(player, "relaciones_laborales");
    if (events.costoProduccionExtra && !inmune) cost += events.costoProduccionExtra; // ej. Segunda Guerra Mundial +1
    return clampMin(cost, 2);
  }

  // ---------- Capacidad de producción por fábrica ----------
  function productionCapPerFactory(player, events) {
    events = events || {};
    var base = hasKnow(player, "___never") ? 0 : (company(player).id === "liberty" ? 13 : 10);
    base += patentLevel(player, "produccion");
    if (events.topeProduccionEvento) base = Math.min(base, events.topeProduccionEvento);
    return base;
  }

  // ---------- Costo de traslado ----------
  function transportCost(player, fromMarketId, toMarketId, events) {
    events = events || {};
    var from = DATA.MARKETS[fromMarketId];
    var to = DATA.MARKETS[toMarketId];
    if (fromMarketId === toMarketId) return 0;
    var tlcanPaises = { mexico: 1, eeuu: 1, brasil: 1 };
    if (events.tlcan && tlcanPaises[fromMarketId] && tlcanPaises[toMarketId]) return 0;
    if (hasKnow(player, "homologacion_global")) {
      // Traslados a $2 flat (salvo TLCAN, que ya devolvió 0 arriba)
      var flat = 2;
      if (hasKnow(player, "inteligencia_artificial")) flat -= 1;
      return clampMin(flat, 1);
    }
    var base = (from.continente === to.continente) ? DATA.TRASLADO.mismoContinente : DATA.TRASLADO.otroContinente;
    if (from.continente === to.continente && events.autopistasModernas) base -= 1;
    if (hasKnow(player, "transporte_ecoeficiente")) base -= 1;
    if (hasKnow(player, "inteligencia_artificial")) base -= 1;
    return clampMin(base, 1);
  }

  // ---------- Costo de expansión (barrera + construcción) ----------
  function expansionBarrier(player, marketId, isForeignContinentFactory, events) {
    events = events || {};
    var market = DATA.MARKETS[marketId];
    var barrera = market.barrera;
    if (hasKnow(player, "red_comercio")) barrera -= 3;
    if (hasKnow(player, "homologacion_global")) barrera = Math.min(barrera, 4);
    if (isForeignContinentFactory && events.trasplantesJaponeses) barrera -= 2;
    return clampMin(barrera, 1);
  }
  function expansionBuildCost(player, tipo /* 'oficina'|'fabrica' */) {
    var base = tipo === "oficina" ? 5 : 10;
    if (hasKnow(player, "alianzas_estrategicas")) base -= 5;
    if (hasKnow(player, "inteligencia_artificial")) base -= 1;
    return clampMin(base, 1);
  }

  // ---------- Costo de desarrollo ----------
  function developmentCost(player, baseCost) {
    var cost = baseCost;
    if (hasKnow(player, "colaboracion_tecnologica")) cost -= 4;
    if (hasKnow(player, "inteligencia_artificial")) cost -= 1;
    return clampMin(cost, 1);
  }

  // ---------- Máximo de fábricas ----------
  function maxFactories(player) {
    var max = 3;
    if (company(player).id === "dragontech") max += 1;
    if (hasKnow(player, "integracion_vertical")) max += 1;
    return max;
  }

  // ---------- Bono de precio por unidad vendida (se cobra tras ganar la comparación) ----------
  function priceBonusPerUnit(player, marketId, events) {
    events = events || {};
    var market = DATA.MARKETS[marketId];
    var bonus = 0;
    var mLevel = patentLevel(player, "motor");
    if (mLevel > 0) bonus += DATA.PATENTES.motor.niveles[mLevel].bonoPrecio;
    var aLevel = patentLevel(player, "accesorios");
    if (aLevel > 0) bonus += DATA.PATENTES.accesorios.niveles[aLevel].bonoPrecio;
    var comp = company(player);
    if (comp.id === "hanseong" && market.precioMax <= 7) bonus += 1;
    if (comp.id === "lusso" && market.precioMax >= 8) bonus += 1;
    if (events.augeVE && mLevel >= 3) bonus += 2;
    return bonus;
  }

  // ---------- Unidades extra (por encima de la demanda / tope) ----------
  function extraUnits(player, events) {
    events = events || {};
    var extra = 0;
    var aLevel = patentLevel(player, "accesorios");
    if (aLevel > 0) extra += DATA.PATENTES.accesorios.niveles[aLevel].extraUnidades;
    var sLevel = patentLevel(player, "seguridad");
    if (sLevel > 0) extra += DATA.PATENTES.seguridad.niveles[sLevel].extraUnidades;
    if (hasKnow(player, "financiamiento_consumidor")) {
      extra += (company(player).id === "imperial") ? 2 : 1;
    }
    return extra;
  }

  // ---------- Cap de venta por mercado (tope) ----------
  function marketCap(player, marketId, tieneFabricaAqui) {
    var market = DATA.MARKETS[marketId];
    var cap = market.tope;
    if (company(player).id === "liberty" && tieneFabricaAqui) cap += 1;
    return cap;
  }

  // ---------- Nivel regulatorio del jugador (cubre exigencias) ----------
  function regulatoryLevel(player) {
    return patentLevel(player, "seguridad") >= 5 ? 99 : patentLevel(player, "seguridad");
  }

  // ---------- Resolución de venta en UN mercado ----------
  // offers: [{playerId, unidades, precio, tieneFabrica, accesoriosNivel, valorAccion, unidadesExtra, bonoPrecio}]
  // demanda y tope vienen del mercado (ya ajustados por eventos si aplica)
  // Devuelve: { ventas: {playerId: unidadesVendidas}, ingresos: {playerId: monto}, remate: {playerId: unidadesRemate}, dominante: playerId|null }
  function resolveMarketSale(offers, demanda, incumplioRegulatorio) {
    incumplioRegulatorio = incumplioRegulatorio || {};
    var ventas = {}, ingresos = {}, remate = {};
    offers.forEach(function (o) { ventas[o.playerId] = 0; ingresos[o.playerId] = 0; remate[o.playerId] = 0; });

    // Orden de venta: precio publicado ascendente; empate por: 1) fábrica aquí, 2) accesorios nivel, 3) valor de acción
    var sorted = offers.slice().sort(function (a, b) {
      if (a.precio !== b.precio) return a.precio - b.precio;
      if (a.marcaPremium && !b.marcaPremium) return -1;
      if (b.marcaPremium && !a.marcaPremium) return 1;
      if ((b.tieneFabrica ? 1 : 0) !== (a.tieneFabrica ? 1 : 0)) return (b.tieneFabrica ? 1 : 0) - (a.tieneFabrica ? 1 : 0);
      if (b.accesoriosNivel !== a.accesoriosNivel) return b.accesoriosNivel - a.accesoriosNivel;
      return b.valorAccion - a.valorAccion;
    });

    var demandaRestante = demanda;
    sorted.forEach(function (o) {
      var cap = o.cap;
      var vendibleBase = Math.min(o.unidades, cap, demandaRestante);
      vendibleBase = Math.max(vendibleBase, 0);
      demandaRestante -= vendibleBase;
      ventas[o.playerId] += vendibleBase;

      // Unidades extra: por encima de demanda/tope, solo en el mercado elegido
      var restanteInventario = o.unidades - vendibleBase;
      var extra = Math.min(o.unidadesExtra || 0, restanteInventario);
      ventas[o.playerId] += extra;

      var precioCobrado = o.precio + (o.bonoPrecio || 0);
      ingresos[o.playerId] += (vendibleBase + extra) * precioCobrado;

      var noVendido = o.unidades - vendibleBase - extra;
      remate[o.playerId] += Math.max(noVendido, 0);
    });

    // Aplicar penalización por incumplimiento regulatorio: -$3/unidad vendida
    Object.keys(ventas).forEach(function (pid) {
      if (incumplioRegulatorio[pid]) {
        ingresos[pid] -= 3 * ventas[pid];
      }
    });

    // Dominante: quien vendió más unidades (base+extra) en el mercado (empate -> quien llegó primero, no modelado aquí; se resuelve fuera)
    var dominante = null, max = -1;
    Object.keys(ventas).forEach(function (pid) {
      if (ventas[pid] > max) { max = ventas[pid]; dominante = pid; }
    });
    if (max <= 0) dominante = null;

    return { ventas: ventas, ingresos: ingresos, remate: remate, dominante: dominante };
  }

  function remateValue(marketId, unidades) {
    var market = DATA.MARKETS[marketId];
    var precio = ceil(market.precioMax * 0.5); // "50% del precio base" -> se usa precio base=precioMax de mercado como referencia
    return precio * unidades;
  }

  // ---------- Dividendos ----------
  function dividendPerShare(ventasTotales, accionesEnManosDeJugadores) {
    if (accionesEnManosDeJugadores <= 0) return 0;
    var total = ceil(ventasTotales * 0.2);
    return ceil(total / accionesEnManosDeJugadores);
  }

  // ---------- Banda de oferta en subasta de acciones ----------
  function bidBand(stockValue) {
    if (stockValue < 20) return 3;
    if (stockValue <= 30) return 4;
    return 5;
  }

  // ---------- Comisión al vender al mercado ----------
  function sellCommission(player, stockValue) {
    if (hasKnow(player, "ingenieria_financiera")) return 0;
    if (stockValue < 20) return 1;
    if (stockValue <= 30) return 2;
    return 3;
  }

  // ---------- Patrimonio final ----------
  function finalWealth(player, stockValues /* {companyId: valor} */) {
    var cash = ceil(player.cash * 0.5);
    var ownShares = (player.acciones && player.acciones[player.companyId] || 0) * stockValues[player.companyId];
    var otherShares = 0;
    Object.keys(player.acciones || {}).forEach(function (cid) {
      if (cid !== player.companyId) otherShares += player.acciones[cid] * stockValues[cid];
    });
    return cash + ownShares + otherShares;
  }

  var LOGIC = {
    ceil: ceil, clampMin: clampMin,
    patentLevel: patentLevel, hasKnow: hasKnow, company: company,
    productionCost: productionCost, productionCapPerFactory: productionCapPerFactory,
    transportCost: transportCost, expansionBarrier: expansionBarrier, expansionBuildCost: expansionBuildCost,
    developmentCost: developmentCost, maxFactories: maxFactories,
    priceBonusPerUnit: priceBonusPerUnit, extraUnits: extraUnits, marketCap: marketCap,
    regulatoryLevel: regulatoryLevel, resolveMarketSale: resolveMarketSale, remateValue: remateValue,
    dividendPerShare: dividendPerShare, bidBand: bidBand, sellCommission: sellCommission,
    finalWealth: finalWealth
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = LOGIC;
  } else {
    root.MM_LOGIC = LOGIC;
  }
})(typeof window !== "undefined" ? window : this);
