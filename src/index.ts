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

/**
 * Retorna un arreglo con todas las provincias del Ecuador.
 * No incluye cantones ni parroquias para mantener la respuesta ligera.
 */
export const getProvincias = (): Pick<
  Provincia,
  "codigo" | "nombre" | "lat" | "lng"
>[] => {
  return Object.keys(provinciasData)
    .filter((codigo) => codigo !== "90")
    .map((codigo) => {
      const rawData: any = provinciasData[codigo];
      return {
        codigo: codigo.padStart(2, "0"),
        nombre: rawData.provincia || "ZONAS NO DELIMITADAS",
        lat: rawData.lat,
        lng: rawData.lng,
      };
    });
};

/**
 * Retorna la información completa de una provincia, incluyendo todos sus cantones y parroquias homogeneizados.
 * @param codigoProvincia El código INEC de la provincia (01 a 24)
 */
export const getProvincia = (
  codigoProvincia: string,
): Provincia | undefined => {
  const code = parseInt(codigoProvincia, 10).toString();
  const data: any = provinciasData[code];
  if (!data || !data.cantones) return undefined;

  const paddedProv = code.padStart(2, "0");
  const cantonesFormat: Record<string, Canton> = {};

  for (const cCode of Object.keys(data.cantones)) {
    const cData = data.cantones[cCode];
    const paddedCant = cCode.padStart(4, "0");

    const parroquiasFormat: Record<string, Parroquia> = {};
    if (cData.parroquias) {
      for (const pCode of Object.keys(cData.parroquias)) {
        const pData = cData.parroquias[pCode];
        const paddedParr = pCode.padStart(6, "0");
        parroquiasFormat[paddedParr] = {
          codigo: paddedParr,
          nombre: pData,
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

/**
 * Retorna todos los cantones pertenecientes a una provincia específica.
 * @param codigoProvincia El código INEC de la provincia (01 a 24)
 */
export const getCantones = (
  codigoProvincia: string,
): Pick<Canton, "codigo" | "nombre" | "lat" | "lng">[] => {
  const provincia = getProvincia(codigoProvincia);
  if (!provincia || !provincia.cantones) return [];

  return Object.values(provincia.cantones).map((c) => ({
    codigo: c.codigo,
    nombre: c.nombre,
    lat: c.lat,
    lng: c.lng,
  }));
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
  const provincia = getProvincia(codigoProvincia);
  if (!provincia || !provincia.cantones) return [];

  const cantonCode = codigoCanton.padStart(4, "0");
  const canton = provincia.cantones[cantonCode];

  if (!canton || !canton.parroquias) return [];

  return Object.values(canton.parroquias);
};

/**
 * Retorna todos los cantones del Ecuador en un arreglo plano.
 */
export const getAllCantones = (): Pick<
  Canton,
  "codigo" | "nombre" | "lat" | "lng"
>[] => {
  const allCantones: Pick<Canton, "codigo" | "nombre" | "lat" | "lng">[] = [];
  const provincias = getProvincias();

  for (const prov of provincias) {
    allCantones.push(...getCantones(prov.codigo));
  }
  return allCantones;
};

/**
 * Retorna todas las parroquias del Ecuador en un arreglo plano.
 */
export const getAllParroquias = (): Pick<Parroquia, "codigo" | "nombre">[] => {
  const allParroquias: Pick<Parroquia, "codigo" | "nombre">[] = [];
  const provincias = getProvincias();

  for (const prov of provincias) {
    const cantones = getCantones(prov.codigo);
    for (const cant of cantones) {
      allParroquias.push(...getParroquias(prov.codigo, cant.codigo));
    }
  }
  return allParroquias;
};

/**
 * Normaliza un string para búsquedas difusas: quita acentos y pasa a minúsculas.
 */
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const results: BuscarResultado[] = [];
  const filtroTipo = opciones?.tipo;
  const limite = opciones?.limite;

  const provincias = getProvincias();
  for (const prov of provincias) {
    if (limite && results.length >= limite) break;

    if (!filtroTipo || filtroTipo === "Provincia") {
      if (normalizeText(prov.nombre).includes(normalizedQuery)) {
        results.push({
          codigo: prov.codigo,
          nombre: prov.nombre,
          tipo: "Provincia",
        });
        if (limite && results.length >= limite) break;
      }
    }

    if (!filtroTipo || filtroTipo === "Cantón") {
      const cantones = getCantones(prov.codigo);
      for (const cant of cantones) {
        if (limite && results.length >= limite) break;
        if (normalizeText(cant.nombre).includes(normalizedQuery)) {
          results.push({
            codigo: cant.codigo,
            nombre: cant.nombre,
            tipo: "Cantón",
            lat: cant.lat,
            lng: cant.lng,
          });
        }
      }
    }

    if (!filtroTipo || filtroTipo === "Parroquia") {
      const cantones = getCantones(prov.codigo);
      for (const cant of cantones) {
        if (limite && results.length >= limite) break;
        const parroquias = getParroquias(prov.codigo, cant.codigo);
        for (const parr of parroquias) {
          if (limite && results.length >= limite) break;
          if (normalizeText(parr.nombre).includes(normalizedQuery)) {
            results.push({
              codigo: parr.codigo,
              nombre: parr.nombre,
              tipo: "Parroquia",
            });
          }
        }
      }
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
  const codeLength = codigo.length;
  if (codeLength !== 2 && codeLength !== 4 && codeLength !== 6)
    return undefined;

  const provCode = codigo.substring(0, 2);
  const provincia = getProvincia(provCode);

  if (!provincia) return undefined;

  // Es una provincia
  if (codeLength === 2) {
    return {
      codigo: provincia.codigo,
      nombre: provincia.nombre,
      tipo: "Provincia",
      lat: provincia.lat,
      lng: provincia.lng,
    };
  }

  // Es un cantón
  const cantCode = codigo.substring(0, 4);
  const canton = provincia.cantones[cantCode];

  if (!canton) return undefined;

  if (codeLength === 4) {
    return {
      codigo: canton.codigo,
      nombre: canton.nombre,
      tipo: "Cantón",
      lat: canton.lat,
      lng: canton.lng,
      provincia: {
        codigo: provincia.codigo,
        nombre: provincia.nombre,
        lat: provincia.lat,
        lng: provincia.lng,
      },
    };
  }

  // Es una parroquia
  if (!canton.parroquias) return undefined;
  const parroquia = canton.parroquias[codigo];
  if (!parroquia) return undefined;

  return {
    codigo,
    nombre: parroquia.nombre,
    tipo: "Parroquia",
    provincia: {
      codigo: provincia.codigo,
      nombre: provincia.nombre,
      lat: provincia.lat,
      lng: provincia.lng,
    },
    canton: {
      codigo: canton.codigo,
      nombre: canton.nombre,
      lat: canton.lat,
      lng: canton.lng,
    },
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
    if (typeof punto === "object" && "lat" in punto && "lng" in punto)
      return punto;

    // Si es un string (código), tratamos de buscarlo
    const ubicacion = getUbicacionPorCodigo(punto as string);
    if (!ubicacion) return null;

    if (ubicacion.lat && ubicacion.lng)
      return { lat: ubicacion.lat, lng: ubicacion.lng };
    if (ubicacion.canton?.lat && ubicacion.canton?.lng)
      return { lat: ubicacion.canton.lat, lng: ubicacion.canton.lng };
    if (ubicacion.provincia?.lat && ubicacion.provincia?.lng)
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
 * a partir de un cantón central por su código INEC.
 */
export const getCantonesCercanos = (
  codigoCantonCentral: string,
  radioEnKm: number,
): CantonCercano[] => {
  const centro = getUbicacionPorCodigo(codigoCantonCentral);

  let coordCentro: Coordenada | undefined;
  if (centro?.tipo === "Cantón" && centro.lat && centro.lng) {
    coordCentro = { lat: centro.lat, lng: centro.lng };
  } else if (centro?.canton?.lat && centro.canton?.lng) {
    coordCentro = { lat: centro.canton.lat, lng: centro.canton.lng };
  }

  if (!coordCentro) return [];

  const todos = getAllCantones();
  const resultados: CantonCercano[] = [];

  for (const c of todos) {
    if (c.codigo === codigoCantonCentral) continue;
    if (c.lat && c.lng) {
      const dist = calcularHaversine(coordCentro, { lat: c.lat, lng: c.lng });
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
  const todos = getAllCantones();
  if (!todos.length) return null;

  let cantCercano: CantonCercano | null = null;
  let minDistancia = Infinity;

  for (const c of todos) {
    if (c.lat && c.lng) {
      const dist = calcularHaversine(coordenadas, { lat: c.lat, lng: c.lng });
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

// ─── Funciones de Búsqueda por Nombre ───────────────────────────────────────

/**
 * Busca una provincia por nombre exacto o parcial (insensible a mayúsculas y acentos).
 * @param nombre Nombre de la provincia a buscar
 */
export const getProvinciaPorNombre = (
  nombre: string,
): Pick<Provincia, "codigo" | "nombre" | "lat" | "lng"> | undefined => {
  const normalizado = normalizeText(nombre);
  if (!normalizado) return undefined;

  const provincias = getProvincias();
  return (
    provincias.find((p) => normalizeText(p.nombre) === normalizado) ||
    provincias.find((p) => normalizeText(p.nombre).includes(normalizado))
  );
};

/**
 * Busca un cantón por nombre exacto o parcial (insensible a mayúsculas y acentos).
 * Retorna el primer resultado encontrado.
 * @param nombre Nombre del cantón a buscar
 */
export const getCantonPorNombre = (
  nombre: string,
): Pick<Canton, "codigo" | "nombre" | "lat" | "lng"> | undefined => {
  const normalizado = normalizeText(nombre);
  if (!normalizado) return undefined;

  const cantones = getAllCantones();
  return (
    cantones.find((c) => normalizeText(c.nombre) === normalizado) ||
    cantones.find((c) => normalizeText(c.nombre).includes(normalizado))
  );
};

// ─── Zonas No Delimitadas ───────────────────────────────────────────────────

/**
 * Retorna los cantones de las Zonas No Delimitadas del Ecuador (código INEC 90).
 * Estas zonas son territorios en disputa que no pertenecen oficialmente a ninguna provincia.
 */
export const getZonasNoDelimitadas = (): Pick<
  Canton,
  "codigo" | "nombre" | "lat" | "lng"
>[] => {
  const data: any = provinciasData["90"];
  if (!data || !data.cantones) return [];

  return Object.keys(data.cantones).map((code) => {
    const c = data.cantones[code];
    return {
      codigo: code.padStart(4, "0"),
      nombre: c.canton,
      lat: c.lat,
      lng: c.lng,
    };
  });
};

// ─── Validadores de Códigos INEC ────────────────────────────────────────────

/**
 * Valida si un código INEC de provincia (2 dígitos) corresponde a una provincia real.
 * @param codigo Código de 2 dígitos
 */
export const esCodigoProvinciaValido = (codigo: string): boolean => {
  return getProvincia(codigo) !== undefined;
};

/**
 * Valida si un código INEC de cantón (4 dígitos) corresponde a un cantón real.
 * @param codigo Código de 4 dígitos
 */
export const esCodigoCantonValido = (codigo: string): boolean => {
  if (codigo.length !== 4) return false;
  const ubicacion = getUbicacionPorCodigo(codigo);
  return ubicacion !== undefined && ubicacion.tipo === "Cantón";
};

/**
 * Valida si un código INEC de parroquia (6 dígitos) corresponde a una parroquia real.
 * @param codigo Código de 6 dígitos
 */
export const esCodigoParroquiaValido = (codigo: string): boolean => {
  if (codigo.length !== 6) return false;
  const ubicacion = getUbicacionPorCodigo(codigo);
  return ubicacion !== undefined && ubicacion.tipo === "Parroquia";
};
