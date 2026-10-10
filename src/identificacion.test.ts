import { describe, it, expect } from "vitest";
import {
  validarCedula,
  validarRUC,
  analizarRUC,
  getProvinciaPorCedula,
} from "./index";

// Números sintéticos con dígito verificador calculado a mano (no son datos reales)
const CEDULA = "1710034065"; // 1·2 7·1 1·2 0·1 0·2 3·1 4·2 0·1 6·2(=12→3) = 25 → 10-5 = 5
const RUC_NATURAL = "1710034065001";
const RUC_PRIVADA = "1790011674001"; // Σ coef. 4,3,2,7,6,5,4,3,2 = 84 → 11-(84%11) = 4
const RUC_PUBLICA = "1760001550001"; // Σ coef. 3,2,7,6,5,4,3,2 = 72 → 11-(72%11) = 5

describe("validarCedula()", () => {
  it("accepts a cédula with a correct check digit", () => {
    expect(validarCedula(CEDULA)).toBe(true);
  });

  it("rejects a wrong check digit", () => {
    expect(validarCedula("1710034066")).toBe(false);
  });

  it("rejects invalid province codes", () => {
    expect(validarCedula("0010034065")).toBe(false); // provincia 00
    expect(validarCedula("2510034065")).toBe(false); // provincia 25
  });

  it("rejects a third digit of 6 or more", () => {
    expect(validarCedula("1760001550")).toBe(false);
  });

  it("accepts code 30 (registered abroad) without checking the third digit", () => {
    // 3·2 0·1 9·2(=18→9) 0 0 0 0 0 0 = 15 → 10-5 = 5
    expect(validarCedula("3090000005")).toBe(true);
  });

  it("rejects malformed input", () => {
    for (const valor of ["", "171003406", "17100340655", "17100340a5", " 1710034065"]) {
      expect(validarCedula(valor), valor).toBe(false);
    }
    expect(validarCedula(1710034065 as unknown as string)).toBe(false);
  });
});

describe("validarRUC() / analizarRUC()", () => {
  it("detects a natural person RUC", () => {
    expect(analizarRUC(RUC_NATURAL)).toEqual({
      valido: true,
      tipo: "persona natural",
      codigoProvincia: "17",
      establecimiento: "001",
    });
  });

  it("detects a private company RUC", () => {
    expect(analizarRUC(RUC_PRIVADA)).toEqual({
      valido: true,
      tipo: "sociedad privada",
      codigoProvincia: "17",
      establecimiento: "001",
    });
  });

  it("detects a public entity RUC", () => {
    expect(analizarRUC(RUC_PUBLICA)).toEqual({
      valido: true,
      tipo: "entidad pública",
      codigoProvincia: "17",
      establecimiento: "0001",
    });
  });

  it("rejects wrong check digits but still reports the type", () => {
    expect(analizarRUC("1790011675001")).toMatchObject({
      valido: false,
      tipo: "sociedad privada",
    });
    expect(validarRUC("1760001560001")).toBe(false);
    expect(validarRUC("1710034066001")).toBe(false);
  });

  it("rejects establishment code 000 / 0000", () => {
    expect(validarRUC("1710034065000")).toBe(false);
    expect(validarRUC("1790011674000")).toBe(false);
    expect(validarRUC("1760001550000")).toBe(false);
  });

  it("rejects third digits 7 and 8", () => {
    expect(analizarRUC("1770011674001").valido).toBe(false);
    expect(analizarRUC("1780011674001").valido).toBe(false);
  });

  it("rejects malformed input", () => {
    for (const valor of ["", CEDULA, "17900116740011", "179001167400a"]) {
      expect(validarRUC(valor), valor).toBe(false);
    }
  });
});

describe("getProvinciaPorCedula()", () => {
  it("resolves the province from a cédula or RUC", () => {
    expect(getProvinciaPorCedula(CEDULA)?.nombre).toBe("PICHINCHA");
    expect(getProvinciaPorCedula("0912345678")?.codigo).toBe("09");
    expect(getProvinciaPorCedula(RUC_PRIVADA)?.codigo).toBe("17");
  });

  it("returns undefined for code 30, invalid codes or malformed input", () => {
    expect(getProvinciaPorCedula("3090000005")).toBeUndefined();
    expect(getProvinciaPorCedula("9012345678")).toBeUndefined();
    expect(getProvinciaPorCedula("17")).toBeUndefined();
  });
});
