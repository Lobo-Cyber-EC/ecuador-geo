import type { Region, ZonaHoraria } from "./types";

/**
 * Datos complementarios por provincia (código INEC de 2 dígitos):
 * nombre oficial con tildes, región natural y zona horaria IANA.
 */
export const provinciasInfo: Record<
  string,
  { nombreOficial: string; region: Region; zonaHoraria: ZonaHoraria }
> = {
  "01": { nombreOficial: "Azuay", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "02": { nombreOficial: "Bolívar", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "03": { nombreOficial: "Cañar", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "04": { nombreOficial: "Carchi", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "05": { nombreOficial: "Cotopaxi", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "06": { nombreOficial: "Chimborazo", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "07": { nombreOficial: "El Oro", region: "Costa", zonaHoraria: "America/Guayaquil" },
  "08": { nombreOficial: "Esmeraldas", region: "Costa", zonaHoraria: "America/Guayaquil" },
  "09": { nombreOficial: "Guayas", region: "Costa", zonaHoraria: "America/Guayaquil" },
  "10": { nombreOficial: "Imbabura", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "11": { nombreOficial: "Loja", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "12": { nombreOficial: "Los Ríos", region: "Costa", zonaHoraria: "America/Guayaquil" },
  "13": { nombreOficial: "Manabí", region: "Costa", zonaHoraria: "America/Guayaquil" },
  "14": { nombreOficial: "Morona Santiago", region: "Amazonía", zonaHoraria: "America/Guayaquil" },
  "15": { nombreOficial: "Napo", region: "Amazonía", zonaHoraria: "America/Guayaquil" },
  "16": { nombreOficial: "Pastaza", region: "Amazonía", zonaHoraria: "America/Guayaquil" },
  "17": { nombreOficial: "Pichincha", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "18": { nombreOficial: "Tungurahua", region: "Sierra", zonaHoraria: "America/Guayaquil" },
  "19": { nombreOficial: "Zamora Chinchipe", region: "Amazonía", zonaHoraria: "America/Guayaquil" },
  "20": { nombreOficial: "Galápagos", region: "Insular", zonaHoraria: "Pacific/Galapagos" },
  "21": { nombreOficial: "Sucumbíos", region: "Amazonía", zonaHoraria: "America/Guayaquil" },
  "22": { nombreOficial: "Orellana", region: "Amazonía", zonaHoraria: "America/Guayaquil" },
  "23": { nombreOficial: "Santo Domingo de los Tsáchilas", region: "Costa", zonaHoraria: "America/Guayaquil" },
  "24": { nombreOficial: "Santa Elena", region: "Costa", zonaHoraria: "America/Guayaquil" },
};
