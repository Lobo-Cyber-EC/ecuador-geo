export interface Parroquia {
  codigo: string;
  nombre: string;
}

export interface Canton {
  codigo: string;
  nombre: string;
  lat?: number;
  lng?: number;
  parroquias: Record<string, Parroquia>;
}

export interface Provincia {
  codigo: string;
  nombre: string;
  lat?: number;
  lng?: number;
  cantones: Record<string, Canton>;
}

export interface UbicacionDetalle {
  codigo: string;
  nombre: string;
  tipo: "Provincia" | "Cantón" | "Parroquia";
  lat?: number;
  lng?: number;
  provincia?: Pick<Provincia, "codigo" | "nombre" | "lat" | "lng">;
  canton?: Pick<Canton, "codigo" | "nombre" | "lat" | "lng">;
}

export interface BuscarResultado {
  codigo: string;
  nombre: string;
  tipo: "Provincia" | "Cantón" | "Parroquia";
  lat?: number;
  lng?: number;
}

export interface Coordenada {
  lat: number;
  lng: number;
}

export interface CantonCercano extends Pick<
  Canton,
  "codigo" | "nombre" | "lat" | "lng"
> {
  distanciaKm: number;
}

export interface BuscarOpciones {
  /** Cantidad maxima de resultados a retornar */
  limite?: number;
  /** Filtrar por tipo de entidad */
  tipo?: "Provincia" | "Cantón" | "Parroquia";
}

export interface AutocompletarOpciones extends BuscarOpciones {
  /** Limitar los resultados a una provincia (código INEC de 2 dígitos) */
  codigoProvincia?: string;
}

/** Región natural del Ecuador */
export type Region = "Costa" | "Sierra" | "Amazonía" | "Insular";

/** Zona horaria IANA. Galápagos está una hora por detrás del continente. */
export type ZonaHoraria = "America/Guayaquil" | "Pacific/Galapagos";

/** Opción lista para usar en un `<select>` o componente de dropdown */
export interface OpcionSelect {
  value: string;
  label: string;
}

export interface OpcionesSelectConfig {
  /** Orden de las opciones (default: "nombre", alfabético en español) */
  ordenarPor?: "nombre" | "codigo";
}

export interface OpcionesProvinciasConfig extends OpcionesSelectConfig {
  /** Incluir solo las provincias de una región */
  region?: Region;
}

export type TipoRUC = "persona natural" | "sociedad privada" | "entidad pública";

export interface RUCDetalle {
  /** Formato y dígito verificador correctos (no consulta al SRI) */
  valido: boolean;
  tipo?: TipoRUC;
  /** Código de provincia de los 2 primeros dígitos (30 = registrado en el exterior) */
  codigoProvincia?: string;
  /** Código de establecimiento (últimos 3 o 4 dígitos) */
  establecimiento?: string;
}
