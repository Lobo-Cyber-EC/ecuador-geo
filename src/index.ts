export * from "./types";
import { provinciasData } from "./data";
import type {
  Provincia,
  Canton,
  Parroquia,
  BuscarResultado,
  BuscarOpciones,
  UbicacionDetalle,
  Coordenada,
  CantonCercano,
} from "./types";

type ProvinciaResumen = Pick<Provincia, "codigo" | "nombre" | "lat" | "lng">;
type CantonResumen = Pick<Canton, "codigo" | "nombre" | "lat" | "lng">;

/** Código INEC de las Zonas No Delimitadas (no es una provincia). */
const CODIGO_ZONAS_NO_DELIMITADAS = "90";

/**
 * Normaliza un código INEC: solo dígitos, como máximo `longitud` caracteres,
 * rellenado con ceros a la izquierda. Retorna `undefined` si el código no es válido.
 */
const normalizarCodigo = (
  codigo: unknown,
  longitud: number,
): string | undefined => {
  const texto = typeof codigo === "number" ? String(codigo) : codigo;
  if (typeof texto !== "string" || !/^\d+$/.test(texto)) return undefined;
  if (texto.length > longitud) return undefined;
  return texto.padStart(longitud, "0");
};

/**
 * Normaliza un string para búsquedas difusas: quita acentos y pasa a minúsculas.
 */
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
};

const esCoordenada = (valor: unknown): valor is Coordenada =>
  typeof valor === "object" &&
  valor !== null &&
  Number.isFinite((valor as Coordenada).lat) &&
  Number.isFinite((valor as Coordenada).lng);

const tieneCoordenadas = (punto: {
  lat?: number;
  lng?: number;
}): punto is Coordenada => punto.lat != null && punto.lng != null;

/**
 * Provincias ya homogeneizadas. Es de uso interno: las funciones públicas
 * siempre retornan copias para que el consumidor no pueda alterar el cache.
 */
const provinciaCache = new Map<string, Provincia | null>();

const getProvinciaInterna = (codigo: unknown): Provincia | undefined => {
  const paddedProv = normalizarCodigo(codigo, 2);
  if (!paddedProv) return undefined;

  if (!provinciaCache.has(paddedProv)) {
    provinciaCache.set(paddedProv, construirProvincia(paddedProv));
  }
  return provinciaCache.get(paddedProv) ?? undefined;
};

const construirProvincia = (paddedProv: string): Provincia | null => {
  const data = provinciasData[parseInt(paddedProv, 10).toString()];
  if (!data || !data.cantones) return null;

  const cantonesFormat: Record<string, Canton> = {};

  for (const cCode of Object.keys(data.cantones)) {
    const cData = data.cantones[cCode];
    const paddedCant = cCode.padStart(4, "0");

    const parroquiasFormat: Record<string, Parroquia> = {};
    if (cData.parroquias) {
      for (const pCode of Object.keys(cData.parroquias)) {
        const paddedParr = pCode.padStart(6, "0");
        parroquiasFormat[paddedParr] = {
          codigo: paddedParr,
          nombre: cData.parroquias[pCode],
        };
      }
    }

    cantonesFormat[paddedCant] = {
      codigo: paddedCant,
      nombre: cData.canton,
      lat: cData.lat,
      lng: cData.lng,
      parroquias: parroquiasFormat,
    };
  }

  return {
    codigo: paddedProv,
    nombre: data.provincia || "ZONAS NO DELIMITADAS",
    lat: data.lat,
    lng: data.lng,
    cantones: cantonesFormat,
  };
};

const resumenProvincia = (p: Provincia): ProvinciaResumen => ({
  codigo: p.codigo,
  nombre: p.nombre,
  lat: p.lat,
  lng: p.lng,
});

const resumenCanton = (c: Canton): CantonResumen => ({
  codigo: c.codigo,
  nombre: c.nombre,
  lat: c.lat,
  lng: c.lng,
});

/** Códigos de las 24 provincias (excluye las Zonas No Delimitadas). */
const codigosProvincias = (): string[] =>
  Object.keys(provinciasData)
    .filter((codigo) => codigo !== CODIGO_ZONAS_NO_DELIMITADAS)
    .map((codigo) => codigo.padStart(2, "0"));

interface EntradaIndice {
  resultado: BuscarResultado;
  normalizado: string;
  codigoProvincia: string;
}

let indiceBusqueda: EntradaIndice[] | undefined;

/**
 * Índice con los nombres ya normalizados, construido una sola vez.
 * Conserva el orden de búsqueda: provincia, sus cantones y luego sus parroquias.
 */
const getIndiceBusqueda = (): EntradaIndice[] => {
  if (indiceBusqueda) return indiceBusqueda;

  const indice: EntradaIndice[] = [];
  for (const codigoProv of codigosProvincias()) {
    const prov = getProvinciaInterna(codigoProv);
    if (!prov) continue;
    const agregar = (resultado: BuscarResultado) =>
      indice.push({
        resultado,
        normalizado: normalizeText(resultado.nombre),
        codigoProvincia: prov.codigo,
      });

    agregar({ codigo: prov.codigo, nombre: prov.nombre, tipo: "Provincia" });
    const cantones = Object.values(prov.cantones);
    for (const cant of cantones) {
      agregar({
        codigo: cant.codigo,
        nombre: cant.nombre,
        tipo: "Cantón",
        lat: cant.lat,
        lng: cant.lng,
      });
    }
    for (const cant of cantones) {
      for (const parr of Object.values(cant.parroquias)) {
        agregar({ codigo: parr.codigo, nombre: parr.nombre, tipo: "Parroquia" });
      }
    }
  }

  indiceBusqueda = indice;
  return indice;
};

/**
 * Retorna un arreglo con todas las provincias del Ecuador.
 * No incluye cantones ni parroquias para mantener la respuesta ligera.
 */
export const getProvincias = (): ProvinciaResumen[] => {
  return codigosProvincias()
    .map((codigo) => getProvinciaInterna(codigo))
    .filter((p): p is Provincia => p !== undefined)
    .map(resumenProvincia);
};

/**
 * Retorna la información completa de una provincia, incluyendo todos sus cantones y parroquias homogeneizados.
 * @param codigoProvincia El código INEC de la provincia (01 a 24)
 */
export const getProvincia = (
  codigoProvincia: string,
): Provincia | undefined => {
  const provincia = getProvinciaInterna(codigoProvincia);
  if (!provincia) return undefined;

  const cantones: Record<string, Canton> = {};
  for (const [codigo, canton] of Object.entries(provincia.cantones)) {
    const parroquias: Record<string, Parroquia> = {};
    for (const [pCodigo, parroquia] of Object.entries(canton.parroquias)) {
      parroquias[pCodigo] = { ...parroquia };
    }
    cantones[codigo] = { ...canton, parroquias };
  }
  return { ...provincia, cantones };
};

/**
 * Retorna todos los cantones pertenecientes a una provincia específica.
 * @param codigoProvincia El código INEC de la provincia (01 a 24)
 */
export const getCantones = (codigoProvincia: string): CantonResumen[] => {
  const provincia = getProvinciaInterna(codigoProvincia);
  if (!provincia) return [];

  return Object.values(provincia.cantones).map(resumenCanton);
};

/**
 * Retorna todas las parroquias pertenecientes a un cantón específico.
 * @param codigoProvincia Código INEC de la provincia
 * @param codigoCanton Código INEC del cantón
 */
export const getParroquias = (
  codigoProvincia: string,
  codigoCanton: string,
): Pick<Parroquia, "codigo" | "nombre">[] => {
  const provincia = getProvinciaInterna(codigoProvincia);
  const cantonCode = normalizarCodigo(codigoCanton, 4);
  if (!provincia || !cantonCode) return [];

  const canton = provincia.cantones[cantonCode];
  if (!canton) return [];

  return Object.values(canton.parroquias).map((p) => ({ ...p }));
};

/**
 * Retorna todos los cantones del Ecuador en un arreglo plano.
 */
export const getAllCantones = (): CantonResumen[] => {
  const allCantones: CantonResumen[] = [];
  for (const codigo of codigosProvincias()) {
    allCantones.push(...getCantones(codigo));
  }
  return allCantones;
};

/**
 * Retorna todas las parroquias del Ecuador en un arreglo plano.
 */
export const getAllParroquias = (): Pick<Parroquia, "codigo" | "nombre">[] => {
  const allParroquias: Pick<Parroquia, "codigo" | "nombre">[] = [];
  for (const codigo of codigosProvincias()) {
    const provincia = getProvinciaInterna(codigo);
    if (!provincia) continue;
    for (const canton of Object.values(provincia.cantones)) {
      for (const parroquia of Object.values(canton.parroquias)) {
        allParroquias.push({ ...parroquia });
      }
    }
  }
  return allParroquias;
};

/**
 * Busca coincidencias difusas en provincias, cantones y parroquias.
 * @param query Texto a buscar
 * @param opciones Opciones de filtrado: limite y tipo
 */
export const buscar = (
  query: string,
  opciones?: BuscarOpciones,
): BuscarResultado[] => {
  if (typeof query !== "string") return [];
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const results: BuscarResultado[] = [];
  const filtroTipo = opciones?.tipo;
  const limite = opciones?.limite;

  for (const entrada of getIndiceBusqueda()) {
    if (limite && results.length >= limite) break;
    if (filtroTipo && entrada.resultado.tipo !== filtroTipo) continue;
    if (entrada.normalizado.includes(normalizedQuery)) {
      results.push({ ...entrada.resultado });
    }
  }

  return results;
};

/**
 * Obtiene el detalle jerárquico dado un código INEC. Induce el tipo por la longitud del código.
 * @param codigo Código INEC (2 = provincia, 4 = cantón, 6 = parroquia)
 */
export const getUbicacionPorCodigo = (
  codigo: string,
): UbicacionDetalle | undefined => {
  if (typeof codigo !== "string" || !/^(\d{2}|\d{4}|\d{6})$/.test(codigo))
    return undefined;

  const provincia = getProvinciaInterna(codigo.substring(0, 2));
  if (!provincia) return undefined;

  // Es una provincia
  if (codigo.length === 2) {
    return { ...resumenProvincia(provincia), tipo: "Provincia" };
  }

  // Es un cantón
  const canton = provincia.cantones[codigo.substring(0, 4)];
  if (!canton) return undefined;

  if (codigo.length === 4) {
    return {
      ...resumenCanton(canton),
      tipo: "Cantón",
      provincia: resumenProvincia(provincia),
    };
  }

  // Es una parroquia
  const parroquia = canton.parroquias[codigo];
  if (!parroquia) return undefined;

  return {
    codigo,
    nombre: parroquia.nombre,
    tipo: "Parroquia",
    provincia: resumenProvincia(provincia),
    canton: resumenCanton(canton),
  };
};

/**
 * Fórmula matemática del Haversino para obtener distancia en KM de curva esférica.
 */
const calcularHaversine = (coord1: Coordenada, coord2: Coordenada): number => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calcula la distancia en línea curva (Haversine) en kilómetros entre dos coordenadas
 * o entre dos códigos INEC dados (resolviendo sus coordenadas automáticamente).
 */
export const getDistanciaEntreUbicaciones = (
  origen: string | Coordenada,
  destino: string | Coordenada,
): number | null => {
  const getCoords = (punto: string | Coordenada): Coordenada | null => {
    if (esCoordenada(punto)) return punto;
    if (typeof punto !== "string") return null;

    // Si es un string (código), tratamos de buscarlo
    const ubicacion = getUbicacionPorCodigo(punto);
    if (!ubicacion) return null;

    if (tieneCoordenadas(ubicacion))
      return { lat: ubicacion.lat, lng: ubicacion.lng };
    if (ubicacion.canton && tieneCoordenadas(ubicacion.canton))
      return { lat: ubicacion.canton.lat, lng: ubicacion.canton.lng };
    if (ubicacion.provincia && tieneCoordenadas(ubicacion.provincia))
      return { lat: ubicacion.provincia.lat, lng: ubicacion.provincia.lng };

    return null;
  };

  const coordOrigen = getCoords(origen);
  const coordDestino = getCoords(destino);

  if (!coordOrigen || !coordDestino) return null;

  return Number(calcularHaversine(coordOrigen, coordDestino).toFixed(2));
};

/**
 * Retorna todos los cantones que están dentro del radio (en kilómetros) establecido
 * a partir de un cantón central por su código INEC. Si se pasa el código de una
 * parroquia, se usa su cantón como centro.
 */
export const getCantonesCercanos = (
  codigoCantonCentral: string,
  radioEnKm: number,
): CantonCercano[] => {
  if (!Number.isFinite(radioEnKm) || radioEnKm < 0) return [];
  const centro = getUbicacionPorCodigo(codigoCantonCentral);

  let cantonCentral: CantonResumen | undefined;
  if (centro?.tipo === "Cantón") cantonCentral = centro;
  else if (centro?.tipo === "Parroquia") cantonCentral = centro.canton;

  if (!cantonCentral || !tieneCoordenadas(cantonCentral)) return [];
  const coordCentro: Coordenada = {
    lat: cantonCentral.lat,
    lng: cantonCentral.lng,
  };

  const resultados: CantonCercano[] = [];

  for (const c of getAllCantones()) {
    if (c.codigo === cantonCentral.codigo) continue;
    if (tieneCoordenadas(c)) {
      const dist = calcularHaversine(coordCentro, c);
      if (dist <= radioEnKm) {
        resultados.push({
          ...c,
          distanciaKm: Number(dist.toFixed(2)),
        });
      }
    }
  }

  return resultados.sort((a, b) => a.distanciaKm - b.distanciaKm);
};

/**
 * Geocodificación inversa simple: Dado un GPS de un usuario (Lat/Lng),
 * busca iterativamente cuál es el Cantón más cercano a esta posición.
 */
export const getUbicacionPorCoordenadas = (
  coordenadas: Coordenada,
): CantonCercano | null => {
  if (!esCoordenada(coordenadas)) return null;

  let cantCercano: CantonCercano | null = null;
  let minDistancia = Infinity;

  for (const c of getAllCantones()) {
    if (tieneCoordenadas(c)) {
      const dist = calcularHaversine(coordenadas, c);
      if (dist < minDistancia) {
        minDistancia = dist;
        cantCercano = {
          ...c,
          distanciaKm: Number(dist.toFixed(2)),
        };
      }
    }
  }

  return cantCercano;
};

/**
 * Busca la primera entrada del índice cuyo nombre coincide exacta o parcialmente.
 */
const buscarPorNombre = (
  nombre: string,
  tipo: BuscarResultado["tipo"],
  codigoProvincia?: string,
): EntradaIndice | undefined => {
  if (typeof nombre !== "string") return undefined;
  const normalizado = normalizeText(nombre);
  if (!normalizado) return undefined;

  let candidatos = getIndiceBusqueda().filter((e) => e.resultado.tipo === tipo);
  if (codigoProvincia !== undefined) {
    const prov = normalizarCodigo(codigoProvincia, 2);
    candidatos = candidatos.filter((e) => e.codigoProvincia === prov);
  }

  return (
    candidatos.find((e) => e.normalizado === normalizado) ||
    candidatos.find((e) => e.normalizado.includes(normalizado))
  );
};

/**
 * Busca una provincia por nombre exacto o parcial (insensible a mayúsculas y acentos).
 * @param nombre Nombre de la provincia a buscar
 */
export const getProvinciaPorNombre = (
  nombre: string,
): ProvinciaResumen | undefined => {
  const entrada = buscarPorNombre(nombre, "Provincia");
  const provincia = entrada && getProvinciaInterna(entrada.resultado.codigo);
  return provincia ? resumenProvincia(provincia) : undefined;
};

/**
 * Busca un cantón por nombre exacto o parcial (insensible a mayúsculas y acentos).
 * Retorna el primer resultado encontrado. Hay nombres repetidos en distintas
 * provincias (ej: BOLÍVAR, OLMEDO); usa `codigoProvincia` para desambiguar.
 * @param nombre Nombre del cantón a buscar
 * @param codigoProvincia Código INEC de la provincia para limitar la búsqueda (opcional)
 */
export const getCantonPorNombre = (
  nombre: string,
  codigoProvincia?: string,
): CantonResumen | undefined => {
  const entrada = buscarPorNombre(nombre, "Cantón", codigoProvincia);
  if (!entrada) return undefined;
  const { codigo, nombre: nombreCanton, lat, lng } = entrada.resultado;
  return { codigo, nombre: nombreCanton, lat, lng };
};

/**
 * Retorna los cantones de las Zonas No Delimitadas del Ecuador (código INEC 90).
 * Estas zonas son territorios en disputa que no pertenecen oficialmente a ninguna provincia.
 */
export const getZonasNoDelimitadas = (): CantonResumen[] => {
  return getCantones(CODIGO_ZONAS_NO_DELIMITADAS);
};

/**
 * Valida si un código INEC de provincia (2 dígitos) corresponde a una provincia real.
 * Las Zonas No Delimitadas (90) no son una provincia.
 * @param codigo Código de 2 dígitos
 */
export const esCodigoProvinciaValido = (codigo: string): boolean => {
  if (typeof codigo !== "string" || !/^\d{2}$/.test(codigo)) return false;
  if (codigo === CODIGO_ZONAS_NO_DELIMITADAS) return false;
  return getProvinciaInterna(codigo) !== undefined;
};

/**
 * Valida si un código INEC de cantón (4 dígitos) corresponde a un cantón real.
 * @param codigo Código de 4 dígitos
 */
export const esCodigoCantonValido = (codigo: string): boolean => {
  if (typeof codigo !== "string" || codigo.length !== 4) return false;
  return getUbicacionPorCodigo(codigo)?.tipo === "Cantón";
};

/**
 * Valida si un código INEC de parroquia (6 dígitos) corresponde a una parroquia real.
 * @param codigo Código de 6 dígitos
 */
export const esCodigoParroquiaValido = (codigo: string): boolean => {
  if (typeof codigo !== "string" || codigo.length !== 6) return false;
  return getUbicacionPorCodigo(codigo)?.tipo === "Parroquia";
};
