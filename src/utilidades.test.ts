import { describe, it, expect } from "vitest";
import {
  autocompletar,
  buscar,
  formatearNombre,
  formatearUbicacion,
  getOpcionesProvincias,
  getOpcionesCantones,
  getOpcionesParroquias,
  getProvincias,
  getCantones,
  getParroquias,
  getRegion,
  getZonaHoraria,
  getProvinciasPorRegion,
} from "./index";

describe("autocompletar()", () => {
  it("tolerates typos", () => {
    expect(autocompletar("guayakil")[0].codigo).toBe("0901");
    expect(autocompletar("cuenka")[0].codigo).toBe("0101");
    expect(autocompletar("riobanba")[0].codigo).toBe("0601");
    expect(autocompletar("guayaquli")[0].codigo).toBe("0901"); // letras invertidas
  });

  it("ranks exact and prefix matches before substring matches", () => {
    const resultados = autocompletar("loja");
    expect(resultados[0]).toMatchObject({ codigo: "11", tipo: "Provincia" });
    expect(resultados[1]).toMatchObject({ codigo: "1101", tipo: "Cantón" });
    // "Nueva Loja" contiene "loja" pero no empieza con ese texto
    const nuevaLoja = resultados.findIndex((r) => r.nombre === "NUEVA LOJA");
    expect(nuevaLoja).toBeGreaterThan(1);
  });

  it("matches alternative names in parentheses", () => {
    expect(autocompletar("el coca")[0].codigo).toBe("220150");
    expect(autocompletar("yanzatza")[0].codigo).toBe("1905");
  });

  it("does not return mid-word matches for 1-2 letter queries", () => {
    for (const r of autocompletar("x")) {
      expect(r.nombre.toLowerCase().split(/[^a-zñ]+/).some((p) => p.startsWith("x"))).toBe(true);
    }
  });

  it("does not apply typo tolerance to short words", () => {
    expect(autocompletar("lojz")).toEqual([]);
  });

  it("supports limite, tipo and codigoProvincia", () => {
    expect(autocompletar("san", { limite: 3 })).toHaveLength(3);
    const cantones = autocompletar("san", { tipo: "Cantón", codigoProvincia: "09" });
    expect(cantones.length).toBeGreaterThan(0);
    for (const c of cantones) {
      expect(c.tipo).toBe("Cantón");
      expect(c.codigo.startsWith("09")).toBe(true);
    }
    expect(autocompletar("san", { codigoProvincia: "xx" })).toEqual([]);
  });

  it("handles empty and invalid queries", () => {
    expect(autocompletar("")).toEqual([]);
    expect(autocompletar("   ")).toEqual([]);
    expect(autocompletar(null as unknown as string)).toEqual([]);
  });

  it("does not change buscar()", () => {
    // buscar() sigue siendo búsqueda por subcadena en orden de código de provincia
    expect(buscar("guayakil")).toEqual([]);
    const provincias = buscar("loja").map((r) => r.codigo.slice(0, 2));
    expect(provincias).toEqual([...provincias].sort());
    expect(autocompletar("loja")[0].codigo).toBe("11");
  });
});

describe("Dropdown options", () => {
  it("getOpcionesProvincias() returns the 24 provinces with official names, sorted", () => {
    const opciones = getOpcionesProvincias();
    expect(opciones).toHaveLength(24);
    expect(opciones[0]).toEqual({ value: "01", label: "Azuay" });
    expect(opciones.find((o) => o.value === "13")?.label).toBe("Manabí");
    expect(opciones.find((o) => o.value === "23")?.label).toBe(
      "Santo Domingo de los Tsáchilas",
    );
    const labels = opciones.map((o) => o.label);
    expect(labels).toEqual(
      [...labels].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })),
    );
  });

  it("getOpcionesProvincias() can filter by region and keep code order", () => {
    expect(getOpcionesProvincias({ region: "Insular" })).toEqual([
      { value: "20", label: "Galápagos" },
    ]);
    const porCodigo = getOpcionesProvincias({ ordenarPor: "codigo" });
    expect(porCodigo.map((o) => o.value)).toEqual(getProvincias().map((p) => p.codigo));
  });

  it("getOpcionesCantones() and getOpcionesParroquias() match the base data", () => {
    const cantones = getOpcionesCantones("09");
    expect(cantones).toHaveLength(getCantones("09").length);
    expect(cantones.find((c) => c.value === "0920")?.label).toBe(
      "San Jacinto de Yaguachi",
    );
    const parroquias = getOpcionesParroquias("09", "0901");
    expect(parroquias).toHaveLength(getParroquias("09", "0901").length);
    expect(getOpcionesCantones("xx")).toEqual([]);
  });
});

describe("Formatting", () => {
  it("formatearNombre() converts INEC names to title case", () => {
    expect(formatearNombre("SAN JACINTO DE YAGUACHI")).toBe("San Jacinto de Yaguachi");
    expect(formatearNombre("SALITRE (URBINA JADO)")).toBe("Salitre (Urbina Jado)");
    expect(formatearNombre("24 DE MAYO")).toBe("24 de Mayo");
    expect(formatearNombre("LA LIBERTAD")).toBe("La Libertad");
    expect(formatearNombre("ATAHUALPA (CAB. EN CAMARONES)")).toBe(
      "Atahualpa (Cab. en Camarones)",
    );
  });

  it("formatearUbicacion() builds a readable hierarchy", () => {
    expect(formatearUbicacion("090112")).toBe("Tarqui, Guayaquil, Guayas");
    expect(formatearUbicacion("0901")).toBe("Guayaquil, Guayas");
    expect(formatearUbicacion("13")).toBe("Manabí");
    expect(formatearUbicacion("0901", " - ")).toBe("Guayaquil - Guayas");
    expect(formatearUbicacion("999999")).toBeUndefined();
  });
});

describe("Regions and time zones", () => {
  it("getRegion() works with province, canton and parroquia codes", () => {
    expect(getRegion("09")).toBe("Costa");
    expect(getRegion("1701")).toBe("Sierra");
    expect(getRegion("220150")).toBe("Amazonía");
    expect(getRegion("2001")).toBe("Insular");
    expect(getRegion("9001")).toBeUndefined(); // Zonas No Delimitadas
    expect(getRegion("xx")).toBeUndefined();
  });

  it("getZonaHoraria() returns Pacific/Galapagos only for Galápagos", () => {
    expect(getZonaHoraria("200150")).toBe("Pacific/Galapagos");
    for (const p of getProvincias().filter((p) => p.codigo !== "20")) {
      expect(getZonaHoraria(p.codigo), p.codigo).toBe("America/Guayaquil");
    }
  });

  it("every province belongs to exactly one region", () => {
    const total = (["Costa", "Sierra", "Amazonía", "Insular"] as const).reduce(
      (suma, region) => suma + getProvinciasPorRegion(region).length,
      0,
    );
    expect(total).toBe(24);
    expect(getProvinciasPorRegion("Amazonía")).toHaveLength(6);
  });
});
