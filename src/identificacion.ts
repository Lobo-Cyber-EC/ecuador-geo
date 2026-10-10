import type { RUCDetalle } from "./types";

/** Código de provincia que el Registro Civil asigna a ecuatorianos registrados en el exterior. */
const CODIGO_EXTERIOR = 30;

const esCodigoProvinciaIdentificacion = (codigo: number): boolean =>
  (codigo >= 1 && codigo <= 24) || codigo === CODIGO_EXTERIOR;

/** Dígito verificador módulo 10 (cédula y RUC de persona natural). */
const digitoModulo10 = (digitos: string): number => {
  let suma = 0;
  for (let i = 0; i < digitos.length; i++) {
    let producto = Number(digitos[i]) * (i % 2 === 0 ? 2 : 1);
    if (producto > 9) producto -= 9;
    suma += producto;
  }
  return (10 - (suma % 10)) % 10;
};

/** Dígito verificador módulo 11 (RUC de sociedades y entidades públicas). */
const digitoModulo11 = (digitos: string, coeficientes: number[]): number => {
  let suma = 0;
  for (let i = 0; i < coeficientes.length; i++) {
    suma += Number(digitos[i]) * coeficientes[i];
  }
  const resultado = 11 - (suma % 11);
  // Un resultado de 10 no corresponde a ningún dígito, así que nunca coincidirá
  return resultado === 11 ? 0 : resultado;
};

/**
 * Valida una cédula de identidad ecuatoriana (10 dígitos): código de provincia,
 * tercer dígito y dígito verificador (módulo 10).
 * No consulta al Registro Civil si la cédula existe.
 * @param cedula Número de cédula como string
 */
export const validarCedula = (cedula: string): boolean => {
  if (typeof cedula !== "string" || !/^\d{10}$/.test(cedula)) return false;

  const provincia = Number(cedula.slice(0, 2));
  if (!esCodigoProvinciaIdentificacion(provincia)) return false;
  // Para los registrados en el exterior no se valida el tercer dígito
  if (provincia !== CODIGO_EXTERIOR && Number(cedula[2]) >= 6) return false;

  return digitoModulo10(cedula.slice(0, 9)) === Number(cedula[9]);
};

/**
 * Analiza un RUC ecuatoriano (13 dígitos) y retorna su tipo, provincia y
 * establecimiento. Valida formato y dígito verificador; no consulta al SRI si el
 * RUC existe o está activo.
 * @param ruc Número de RUC como string
 */
export const analizarRUC = (ruc: string): RUCDetalle => {
  if (typeof ruc !== "string" || !/^\d{13}$/.test(ruc)) return { valido: false };

  const provincia = Number(ruc.slice(0, 2));
  if (!esCodigoProvinciaIdentificacion(provincia)) return { valido: false };

  const codigoProvincia = ruc.slice(0, 2);
  const tercerDigito = Number(ruc[2]);

  // Entidad pública: 9 dígitos de base y 4 de establecimiento
  if (tercerDigito === 6) {
    const establecimiento = ruc.slice(9);
    const valido =
      digitoModulo11(ruc, [3, 2, 7, 6, 5, 4, 3, 2]) === Number(ruc[8]) &&
      establecimiento !== "0000";
    return { valido, tipo: "entidad pública", codigoProvincia, establecimiento };
  }

  const establecimiento = ruc.slice(10);

  // Sociedad privada o extranjero sin cédula
  if (tercerDigito === 9) {
    const valido =
      digitoModulo11(ruc, [4, 3, 2, 7, 6, 5, 4, 3, 2]) === Number(ruc[9]) &&
      establecimiento !== "000";
    return { valido, tipo: "sociedad privada", codigoProvincia, establecimiento };
  }

  // Persona natural: cédula + establecimiento
  if (tercerDigito < 6 || provincia === CODIGO_EXTERIOR) {
    const valido =
      validarCedula(ruc.slice(0, 10)) && establecimiento !== "000";
    return { valido, tipo: "persona natural", codigoProvincia, establecimiento };
  }

  return { valido: false, codigoProvincia };
};

/**
 * Valida un RUC ecuatoriano (13 dígitos) de persona natural, sociedad privada o
 * entidad pública. Valida formato y dígito verificador; no consulta al SRI.
 * @param ruc Número de RUC como string
 */
export const validarRUC = (ruc: string): boolean => analizarRUC(ruc).valido;
