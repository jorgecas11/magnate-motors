// ============================================================
// MAGNATE MOTORS — Datos estáticos del juego
// ============================================================
(function (root) {
  "use strict";

  var COMPANIES = {
    dragontech: {
      id: "dragontech", name: "DragonTech", sede: "China",
      accionInicial: 15, capital: 81, accionesPropias: 4,
      poderNombre: "El taller del mundo",
      poderDesc: "Puedes tener 4 fábricas en lugar de 3, y arrancas en China (mercado más barato).",
      maxFactoriesBonus: 1, startMarket: "china"
    },
    hanseong: {
      id: "hanseong", name: "Hanseong", sede: "Corea",
      accionInicial: 16, capital: 95, accionesPropias: 5,
      poderNombre: "Valor coreano",
      poderDesc: "+$1 por unidad vendida en mercados de precio base $7 o menos.",
      startMarket: "corea"
    },
    lusso: {
      id: "lusso", name: "Lusso", sede: "Italia",
      accionInicial: 17, capital: 85, accionesPropias: 3,
      poderNombre: "Diseño italiano",
      poderDesc: "+$1 por unidad vendida en mercados de precio base $8 o más.",
      startMarket: "italia"
    },
    imperial: {
      id: "imperial", name: "Imperial", sede: "Alemania",
      accionInicial: 18, capital: 82, accionesPropias: 3,
      poderNombre: "Ingeniería alemana",
      poderDesc: "Vendes 1 unidad adicional en cada mercado donde tengas presencia.",
      startMarket: "alemania"
    },
    kogane: {
      id: "kogane", name: "Kogane", sede: "Japón",
      accionInicial: 19, capital: 98, accionesPropias: 3,
      poderNombre: "Kaizen",
      poderDesc: "Tu primera compra de patente de cada ronda es gratis.",
      startMarket: "japon"
    },
    liberty: {
      id: "liberty", name: "Liberty", sede: "Estados Unidos",
      accionInicial: 20, capital: 85, accionesPropias: 3,
      poderNombre: "Producción en serie",
      poderDesc: "Tus fábricas producen hasta 13 unidades por ronda, y en mercados con fábrica puedes vender 1 unidad por encima del tope.",
      startMarket: "eeuu"
    }
  };

  var MARKETS = {
    eeuu:     { id: "eeuu", name: "Estados Unidos", continente: "America", costo: 7, barrera: 12, demanda: 13, tope: 10, precioMax: 11 },
    japon:    { id: "japon", name: "Japón", continente: "Asia", costo: 6, barrera: 12, demanda: 13, tope: 10, precioMax: 10 },
    alemania: { id: "alemania", name: "Alemania", continente: "Europa", costo: 6, barrera: 9, demanda: 9, tope: 7, precioMax: 10 },
    rusia:    { id: "rusia", name: "Rusia", continente: "Europa", costo: 5, barrera: 9, demanda: 10, tope: 8, precioMax: 8 },
    italia:   { id: "italia", name: "Italia", continente: "Europa", costo: 5, barrera: 7, demanda: 7, tope: 6, precioMax: 8 },
    espana:   { id: "espana", name: "España", continente: "Europa", costo: 5, barrera: 7, demanda: 7, tope: 6, precioMax: 8 },
    francia:  { id: "francia", name: "Francia", continente: "Europa", costo: 5, barrera: 7, demanda: 7, tope: 6, precioMax: 8 },
    corea:    { id: "corea", name: "Corea", continente: "Asia", costo: 5, barrera: 4, demanda: 12, tope: 10, precioMax: 7 },
    mexico:   { id: "mexico", name: "México", continente: "America", costo: 4, barrera: 4, demanda: 7, tope: 6, precioMax: 5 },
    brasil:   { id: "brasil", name: "Brasil", continente: "America", costo: 4, barrera: 4, demanda: 8, tope: 6, precioMax: 5 },
    sudafrica:{ id: "sudafrica", name: "Sudáfrica", continente: "Africa", costo: 4, barrera: 4, demanda: 7, tope: 6, precioMax: 5 },
    australia:{ id: "australia", name: "Australia", continente: "Oceania", costo: 4, barrera: 4, demanda: 7, tope: 6, precioMax: 5 },
    china:    { id: "china", name: "China", continente: "Asia", costo: 3, barrera: 6, demanda: 10, tope: 8, precioMax: 4 },
    india:    { id: "india", name: "India", continente: "Asia", costo: 3, barrera: 6, demanda: 9, tope: 7, precioMax: 4 }
  };

  var TRASLADO = { mismoPais: 0, mismoContinente: 3, otroContinente: 6 };

  // Patentes: 4 ramas, niveles 1-5 (5 no comprable, solo desarrollable... en realidad nivel5 "no se puede comprar" pero sí desarrollar)
  var PATENTES = {
    motor: {
      nombre: "Motor",
      niveles: [
        null,
        { nivel: 1, desarrollo: 15, compra: 5, bonoPrecio: 1 },
        { nivel: 2, desarrollo: 24, compra: 8, bonoPrecio: 2 },
        { nivel: 3, desarrollo: 33, compra: 11, bonoPrecio: 3 },
        { nivel: 4, desarrollo: 42, compra: 14, bonoPrecio: 4 },
        { nivel: 5, desarrollo: 51, compra: null, bonoPrecio: 5 }
      ]
    },
    produccion: {
      nombre: "Producción",
      niveles: [
        null,
        { nivel: 1, desarrollo: 18, compra: 6, extraCapacidad: 1 },
        { nivel: 2, desarrollo: 27, compra: 9, extraCapacidad: 2 },
        { nivel: 3, desarrollo: 36, compra: 12, extraCapacidad: 3 },
        { nivel: 4, desarrollo: 45, compra: 15, extraCapacidad: 4 },
        { nivel: 5, desarrollo: 54, compra: null, extraCapacidad: 5 }
      ]
    },
    accesorios: {
      nombre: "Accesorios",
      niveles: [
        null,
        { nivel: 1, desarrollo: 15, compra: 6, bonoPrecio: 1, extraUnidades: 0 },
        { nivel: 2, desarrollo: 23, compra: 9, bonoPrecio: 1, extraUnidades: 2 },
        { nivel: 3, desarrollo: 30, compra: 12, bonoPrecio: 2, extraUnidades: 2 },
        { nivel: 4, desarrollo: 38, compra: 15, bonoPrecio: 2, extraUnidades: 4 },
        { nivel: 5, desarrollo: 45, compra: null, bonoPrecio: 3, extraUnidades: 6 }
      ]
    },
    seguridad: {
      nombre: "Seguridad",
      niveles: [
        null,
        { nivel: 1, desarrollo: 14, compra: 6, extraUnidades: 1, regulatorio: 1 },
        { nivel: 2, desarrollo: 21, compra: 8, extraUnidades: 2, regulatorio: 2 },
        { nivel: 3, desarrollo: 28, compra: 11, extraUnidades: 3, regulatorio: 3 },
        { nivel: 4, desarrollo: 35, compra: 14, extraUnidades: 4, regulatorio: 4 },
        { nivel: 5, desarrollo: 42, compra: null, extraUnidades: 5, regulatorio: 99 }
      ]
    }
  };

  var KNOWHOW = [
    // Ronda 1
    { id: "red_comercio", ronda: 1, nombre: "Red de Comercio", precio: 9, desc: "−$3 a las barreras de entrada." },
    { id: "relaciones_laborales", ronda: 1, nombre: "Relaciones Laborales", precio: 18, desc: "Inmune a eventos que suban el costo de producción." },
    { id: "financiamiento_consumidor", ronda: 1, nombre: "Financiamiento al Consumidor", precio: 30, desc: "Vendes 1 unidad por encima de la demanda en cada mercado (2 si eres Imperial y la tienes)." },
    { id: "integracion_vertical", ronda: 1, nombre: "Integración Vertical", precio: 45, desc: "Fábrica adicional (4ª, o 5ª si eres DragonTech)." },
    // Ronda 2
    { id: "alianzas_estrategicas", ronda: 2, nombre: "Alianzas Estratégicas", precio: 12, desc: "−$5 al costo de construcción." },
    { id: "homologacion_global", ronda: 2, nombre: "Homologación Global", precio: 16, desc: "Todos tus traslados cuestan $2 y todas tus barreras $4." },
    { id: "manufactura_esbelta", ronda: 2, nombre: "Manufactura Esbelta", precio: 20, desc: "−$1 al costo de producción." },
    { id: "marca_premium", ronda: 2, nombre: "Marca Premium", precio: 35, desc: "Ganas todos los desempates de venta." },
    // Ronda 3
    { id: "colaboracion_tecnologica", ronda: 3, nombre: "Colaboración Tecnológica", precio: 10, desc: "−$4 al costo de desarrollo." },
    { id: "transporte_ecoeficiente", ronda: 3, nombre: "Transporte Ecoeficiente", precio: 14, desc: "−$1 al costo de traslado." },
    { id: "red_distribucion", ronda: 3, nombre: "Red de Distribución", precio: 22, desc: "Tu inventario no vendido se conserva a la ronda siguiente." },
    { id: "automatizacion_procesos", ronda: 3, nombre: "Automatización de Procesos", precio: 40, desc: "−$2 al costo de producción." },
    // Ronda 4
    { id: "ingenieria_financiera", ronda: 4, nombre: "Ingeniería Financiera", precio: 25, desc: "Sin comisión al vender acciones, y 1 acción adicional de tu empresa." },
    { id: "inteligencia_artificial", ronda: 4, nombre: "Inteligencia Artificial", precio: 35, desc: "−$1 en producción, traslado, desarrollo y construcción." },
    { id: "vehiculo_electrico", ronda: 4, nombre: "Vehículo Eléctrico", precio: 35, desc: "Costo de producción fijo de $4 en cualquier mercado (excluye otras reducciones de costo de producción, para siempre)." },
    { id: "plataforma_modular", ronda: 4, nombre: "Plataforma Modular", precio: 40, desc: "Desarrollas 2 tecnologías por ronda." }
  ];

  // Eventos: 5 por ronda (ronda 5 no aplica)
  var EVENTOS = {
    1: [
      { id: "linea_montaje", nombre: "Línea de montaje móvil (Ford, 1913)", efecto: "−$1 al costo de producción", duracion: "permanente", tipo: "costoProduccion", valor: -1 },
      { id: "credito_automotriz", nombre: "Nace el crédito automotriz (GMAC, 1919)", efecto: "+2 de demanda en todos los mercados", duracion: "permanente", tipo: "demandaGlobal", valor: 2 },
      { id: "gran_depresion", nombre: "Gran Depresión (1929)", efecto: "−2 de demanda en todos los mercados", duracion: "1 ronda", tipo: "demandaGlobal", valor: -2 },
      { id: "segunda_guerra", nombre: "Segunda Guerra Mundial (1939-45)", efecto: "+$1 al costo de producción; −2 de demanda en Europa", duracion: "1 ronda", tipo: "guerraMundial" },
      { id: "autopistas_modernas", nombre: "Autopistas modernas (Autobahn, 1932)", efecto: "−$1 al traslado dentro del mismo continente", duracion: "permanente", tipo: "trasladoContinente", valor: -1 }
    ],
    2: [
      { id: "plan_marshall", nombre: "Plan Marshall (1948)", efecto: "+2 de demanda en Europa", duracion: "permanente", tipo: "demandaContinente", continente: "Europa", valor: 2 },
      { id: "toyota", nombre: "Sistema de Producción Toyota", efecto: "−$1 al costo de producción en Asia", duracion: "permanente", tipo: "costoProduccionContinente", continente: "Asia", valor: -1 },
      { id: "auto_pueblo", nombre: "El auto del pueblo (VW/Fiat)", efecto: "+3 de demanda en mercados de precio máximo ≤ $5", duracion: "permanente", tipo: "demandaPrecioMax", maxPrecio: 5, valor: 3 },
      { id: "crisis_petroleo", nombre: "Crisis del petróleo (OPEP, 1973)", efecto: "−2 de demanda global (1 ronda); exige nivel regulatorio 1 (permanente)", duracion: "mixta", tipo: "crisisPetroleo" },
      { id: "ley_seguridad", nombre: "Ley de Seguridad Vial (NHTSA, 1968)", efecto: "Exige nivel regulatorio 1", duracion: "permanente", tipo: "regulatorio", valor: 1 }
    ],
    3: [
      { id: "trasplantes_japoneses", nombre: "Trasplantes japoneses (Honda en Ohio, 1982)", efecto: "−$2 a la barrera de fábricas fuera de tu continente", duracion: "permanente", tipo: "barreraFabricaExtranjera", valor: -2 },
      { id: "tlcan", nombre: "TLCAN (1994)", efecto: "Traslado $0 entre México, Estados Unidos y Brasil", duracion: "permanente", tipo: "traslado0", paises: ["mexico", "eeuu", "brasil"] },
      { id: "china_omc", nombre: "China entra a la OMC (2001)", efecto: "+3 de demanda en China", duracion: "permanente", tipo: "demandaMercado", mercado: "china", valor: 3 },
      { id: "crisis_asiatica", nombre: "Crisis asiática (1997)", efecto: "−2 de demanda en Asia", duracion: "1 ronda", tipo: "demandaContinente", continente: "Asia", valor: -2 },
      { id: "airbags", nombre: "Airbags obligatorios (FMVSS 208, 1998)", efecto: "Exige nivel regulatorio 2", duracion: "permanente", tipo: "regulatorio", valor: 2 }
    ],
    4: [
      { id: "auge_ve", nombre: "Auge del vehículo eléctrico (Tesla Model S, 2012)", efecto: "+$2 por unidad vendida si tienes Motor Nv3+", duracion: "permanente", tipo: "bonoMotorAlto", valor: 2, nivelMinimo: 3 },
      { id: "subsidios_verdes", nombre: "Subsidios verdes (IRA, 2022)", efecto: "+$3 de valor de acción si tienes Motor Nv4+ (pago único, ronda 5)", duracion: "unica_r5", tipo: "subsidiosVerdes", nivelMinimo: 4, valor: 3 },
      { id: "dieselgate", nombre: "Dieselgate (Volkswagen, 2015)", efecto: "Exige nivel regulatorio 3", duracion: "permanente", tipo: "regulatorio", valor: 3 },
      { id: "pandemia", nombre: "Pandemia de COVID-19 (2020)", efecto: "−2 de demanda en todos los mercados", duracion: "1 ronda", tipo: "demandaGlobal", valor: -2 },
      { id: "semiconductores", nombre: "Crisis de semiconductores (2021)", efecto: "Tope de producción de 6 por fábrica", duracion: "1 ronda", tipo: "topeProduccion", valor: 6 }
    ]
  };

  var CONTINENTES = ["America", "Europa", "Asia", "Africa", "Oceania"];

  var DATA = {
    COMPANIES: COMPANIES,
    MARKETS: MARKETS,
    TRASLADO: TRASLADO,
    PATENTES: PATENTES,
    KNOWHOW: KNOWHOW,
    EVENTOS: EVENTOS,
    CONTINENTES: CONTINENTES
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = DATA;
  } else {
    root.MM_DATA = DATA;
  }
})(typeof window !== "undefined" ? window : this);
