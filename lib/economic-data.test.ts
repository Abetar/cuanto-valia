import { describe, expect, it } from "vitest";

import {
  calculateAccumulatedInflation,
  calculatePurchasableQuantity,
  calculatePurchasingPower,
  comparePurchasingPower,
  convertMoneyBetweenIndexes,
} from "./economics";

describe("convertMoneyBetweenIndexes", () => {
  it("convierte correctamente dinero hacia un año con menor INPC", () => {
    const result = convertMoneyBetweenIndexes(
      34_000,
      140,
      70
    );

    expect(result).toBeCloseTo(17_000, 2);
  });

  it("mantiene el valor si ambos índices son iguales", () => {
    const result = convertMoneyBetweenIndexes(
      34_000,
      100,
      100
    );

    expect(result).toBe(34_000);
  });

  it("funciona también hacia un año con mayor INPC", () => {
    const result = convertMoneyBetweenIndexes(
      10_000,
      100,
      150
    );

    expect(result).toBeCloseTo(15_000, 2);
  });
});

describe("calculateAccumulatedInflation", () => {
  it("calcula una inflación acumulada de 100%", () => {
    const result = calculateAccumulatedInflation(
      50,
      100
    );

    expect(result).toBeCloseTo(100, 2);
  });

  it("devuelve cero cuando los índices son iguales", () => {
    const result = calculateAccumulatedInflation(
      100,
      100
    );

    expect(result).toBe(0);
  });
});

describe("calculatePurchasingPower", () => {
  it("calcula cuántas unidades pueden comprarse", () => {
    const result = calculatePurchasingPower(
      1000,
      20
    );

    expect(result).toBe(50);
  });

  it("permite resultados con decimales", () => {
    const result = calculatePurchasingPower(
      100,
      30
    );

    expect(result).toBeCloseTo(3.3333, 4);
  });
});

describe("comparePurchasingPower", () => {
  it("detecta una pérdida de poder de compra", () => {
    const result = comparePurchasingPower(
      100,
      80
    );

    expect(result).toBeCloseTo(-20, 2);
  });

  it("detecta una ganancia de poder de compra", () => {
    const result = comparePurchasingPower(
      100,
      125
    );

    expect(result).toBeCloseTo(25, 2);
  });

  it("devuelve cero cuando no cambia", () => {
    const result = comparePurchasingPower(
      100,
      100
    );

    expect(result).toBe(0);
  });
});

describe("calculatePurchasableQuantity", () => {
  it("calcula cuántos kilogramos pueden comprarse", () => {
    const result = calculatePurchasableQuantity(
      1000,
      20
    );

    expect(result).toBe(50);
  });

  it("permite cantidades fraccionarias", () => {
    const result = calculatePurchasableQuantity(
      100,
      30
    );

    expect(result).toBeCloseTo(3.3333, 4);
  });

  it("rechaza precios inválidos", () => {
    expect(() =>
      calculatePurchasableQuantity(1000, 0)
    ).toThrow();
  });
});

describe("validaciones", () => {
  it("rechaza índices inválidos", () => {
    expect(() =>
      convertMoneyBetweenIndexes(1000, 0, 100)
    ).toThrow();
  });

  it("rechaza precios iguales o menores a cero", () => {
    expect(() =>
      calculatePurchasingPower(1000, 0)
    ).toThrow();
  });
});