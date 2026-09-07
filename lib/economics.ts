export function convertMoneyBetweenIndexes(
  amount: number,
  baseIndex: number,
  targetIndex: number
): number {
  if (amount < 0) {
    throw new Error("La cantidad no puede ser negativa.");
  }

  if (baseIndex <= 0 || targetIndex <= 0) {
    throw new Error("Los valores del INPC deben ser mayores a cero.");
  }

  return amount * (targetIndex / baseIndex);
}

export function calculateAccumulatedInflation(
  startIndex: number,
  endIndex: number
): number {
  if (startIndex <= 0 || endIndex <= 0) {
    throw new Error("Los valores del INPC deben ser mayores a cero.");
  }

  return ((endIndex / startIndex) - 1) * 100;
}

export function calculatePurchasingPower(
  money: number,
  productPrice: number
): number {
  if (money < 0) {
    throw new Error("La cantidad no puede ser negativa.");
  }

  if (productPrice <= 0) {
    throw new Error("El precio del producto debe ser mayor a cero.");
  }

  return money / productPrice;
}

export function comparePurchasingPower(
  oldPurchasingPower: number,
  currentPurchasingPower: number
): number {
  if (oldPurchasingPower <= 0) {
    throw new Error(
      "El poder adquisitivo inicial debe ser mayor a cero."
    );
  }

  return (
    ((currentPurchasingPower - oldPurchasingPower) /
      oldPurchasingPower) *
    100
  );
}

export function calculatePurchasableQuantity(
  money: number,
  unitPrice: number
): number {
  if (money < 0) {
    throw new Error("La cantidad de dinero no puede ser negativa.");
  }

  if (unitPrice <= 0) {
    throw new Error("El precio debe ser mayor a cero.");
  }

  return money / unitPrice;
}