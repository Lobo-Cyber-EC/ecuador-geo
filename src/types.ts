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
