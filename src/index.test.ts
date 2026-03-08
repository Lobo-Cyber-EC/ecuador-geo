import { describe, it, expect } from "vitest";
import {
  getProvincias,
  getProvincia,
  getCantones,
  getParroquias,
  getAllCantones,
  getAllParroquias,
  buscar,
  getUbicacionPorCodigo,
  getDistanciaEntreUbicaciones,
  getCantonesCercanos,
  getUbicacionPorCoordenadas,
} from "./index";

describe("Core Data Functions", () => {
  it("getProvincias() should return an array of 24 provinces", () => {
    const provincias = getProvincias();
    expect(provincias).toBeInstanceOf(Array);
    expect(provincias.length).toBe(24);

    // Check if Guayas is present
    const guayas = provincias.find((p) => p.codigo === "09");
    expect(guayas).toBeDefined();
    expect(guayas?.nombre).toBe("GUAYAS");
    // Ensure lat/lng was parsed
    expect(guayas?.lat).toBeDefined();
    expect(guayas?.lng).toBeDefined();
  });

  it("getProvincia() should return complete data mapping for a single province", () => {
    const pichincha = getProvincia("17");
    expect(pichincha).toBeDefined();
    expect(pichincha?.nombre).toBe("PICHINCHA");
    expect(Object.keys(pichincha!.cantones).length).toBeGreaterThan(0);
  });

  it("getCantones() should return cantones for a given province code", () => {
    const cantonesAzuay = getCantones("01");
    expect(cantonesAzuay.length).toBeGreaterThan(0);
    const cuenca = cantonesAzuay.find((c) => c.codigo === "0101");
    expect(cuenca).toBeDefined();
    expect(cuenca?.nombre).toBe("CUENCA");
    expect(cuenca?.lat).toBeDefined();
  });

  it("getParroquias() should return parroquias for a given cantón", () => {
    const parroquiasCuenca = getParroquias("01", "0101");
    expect(parroquiasCuenca.length).toBeGreaterThan(0);
    const sanBlas = parroquiasCuenca.find((p) => p.codigo === "010110");
    expect(sanBlas).toBeDefined();
    expect(sanBlas?.nombre).toBe("SAN BLAS");
  });

  it("getAllCantones() should return all cantones in Ecuador", () => {
    const allC = getAllCantones();
    expect(allC.length).toBeGreaterThan(200); // 221
    expect(allC.some((c) => c.codigo === "1701")).toBeTruthy();
  });

  it("getAllParroquias() should return all parroquias in Ecuador", () => {
    const allP = getAllParroquias();
    expect(allP.length).toBeGreaterThan(800);
    expect(allP.some((p) => p.codigo === "170150")).toBeTruthy();
  });
});

describe("Search and Hierarchy Functions", () => {
  it("buscar() should fuzzily find locations", () => {
    const res = buscar("guaya");
    expect(res.length).toBeGreaterThan(0);
    expect(
      res.some((r) => r.nombre === "GUAYAQUIL" && r.tipo === "Cantón"),
    ).toBeTruthy();
  });

  it("getUbicacionPorCodigo() should resolve hierarchy for Canton", () => {
    const quito = getUbicacionPorCodigo("1701");
    expect(quito).toBeDefined();
    expect(quito?.tipo).toBe("Cantón");
    expect(quito?.nombre).toBe("QUITO");
    expect(quito?.provincia?.nombre).toBe("PICHINCHA");
  });

  it("getUbicacionPorCodigo() should resolve hierarchy for Parroquia", () => {
    const parroquia = getUbicacionPorCodigo("170150");
    expect(parroquia).toBeDefined();
    expect(parroquia?.tipo).toBe("Parroquia");
    expect(parroquia?.canton?.nombre).toBe("QUITO");
    expect(parroquia?.provincia?.nombre).toBe("PICHINCHA");
  });
});

describe("Geo-Spatial Features", () => {
  it("getDistanciaEntreUbicaciones() calculates distance between two known cantons", () => {
    // Quito (1701) to Guayaquil (0901)
    const dist = getDistanciaEntreUbicaciones("1701", "0901");
    expect(dist).toBeGreaterThan(0);
    // Guayaquil - Quito is roughly 260-280 km in straight line
    expect(dist).toBeGreaterThan(200);
    expect(dist).toBeLessThan(400);
  });

  it("getCantonesCercanos() returns ordered nearby cantones", () => {
    // Rumiñahui (1904) and Mejia (1903) are near Quito (1701)
    const cercanos = getCantonesCercanos("1701", 50); // 50km radius
    expect(cercanos.length).toBeGreaterThan(0);
    // Should be ordered
    if (cercanos.length > 1) {
      expect(cercanos[0].distanciaKm).toBeLessThanOrEqual(
        cercanos[1].distanciaKm,
      );
    }
  });

  it("getUbicacionPorCoordenadas() resolves the closest Canton to a GPS point", () => {
    // Exact Cuenca coord from csv: lat: -2.90055, lng: -79.00453
    const coordGPS = { lat: -2.90055, lng: -79.00453 };
    const resolved = getUbicacionPorCoordenadas(coordGPS);

    expect(resolved).toBeDefined();
    expect(resolved?.codigo).toBe("0101");
    expect(resolved?.nombre).toBe("CUENCA");
    expect(resolved?.distanciaKm).toBeLessThan(1); // Very close or 0
  });
});
