/**
 * Normaliza un string para búsquedas difusas: quita acentos y pasa a minúsculas.
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
};

/** Palabras que van en minúscula dentro de un nombre (salvo al inicio). */
const PALABRAS_MENORES = new Set(["de", "del", "la", "las", "los", "y", "e", "en"]);

/**
 * Convierte un nombre en mayúsculas (formato INEC) a formato título en español.
 * @example formatearNombre("SAN JACINTO DE YAGUACHI") // "San Jacinto de Yaguachi"
 * @param nombre Nombre a formatear
 */
export const formatearNombre = (nombre: string): string => {
  let inicio = true;
  return nombre
    .toLowerCase()
    // "CAB.EN" / "CAB. EN" = "cabecera en"
    .replace(/\bcab\.\s*en\b/g, "cab. en")
    .replace(/[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu, (parte) => {
      if (!/[\p{L}\p{N}]/u.test(parte)) {
        // Lo que va entre paréntesis es otro nombre y empieza con mayúscula
        if (parte.includes("(")) inicio = true;
        return parte;
      }
      const resultado =
        !inicio && PALABRAS_MENORES.has(parte)
          ? parte
          : parte.charAt(0).toUpperCase() + parte.slice(1);
      inicio = false;
      return resultado;
    });
};

/**
 * Distancia de edición (Damerau-Levenshtein restringida) entre dos strings.
 * Deja de calcular en cuanto supera `maximo` y retorna `maximo + 1`.
 */
export const distanciaEdicion = (
  a: string,
  b: string,
  maximo: number,
): number => {
  if (Math.abs(a.length - b.length) > maximo) return maximo + 1;

  let filaAnterior2: number[] = [];
  let filaAnterior = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i++) {
    const fila = [i];
    let minimoFila = i;
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      let valor = Math.min(
        filaAnterior[j] + 1,
        fila[j - 1] + 1,
        filaAnterior[j - 1] + costo,
      );
      // Transposición de dos letras contiguas ("guayaquli" → "guayaquil")
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        valor = Math.min(valor, filaAnterior2[j - 2] + 1);
      }
      fila[j] = valor;
      if (valor < minimoFila) minimoFila = valor;
    }
    if (minimoFila > maximo) return maximo + 1;
    filaAnterior2 = filaAnterior;
    filaAnterior = fila;
  }

  return filaAnterior[b.length];
};
