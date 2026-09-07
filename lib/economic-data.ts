import economicHistory from "../data/economic-history.json";

export type InpcYear = keyof typeof economicHistory.inpc.years;

export function getInpcForYear(year: number): number {
  const yearData =
    economicHistory.inpc.years[
      String(year) as InpcYear
    ];

  if (!yearData) {
    throw new Error(
      `No existe información de INPC para el año ${year}.`
    );
  }

  return yearData.index;
}

export function getAvailableInpcYears(): number[] {
  return Object.keys(economicHistory.inpc.years)
    .map(Number)
    .sort((a, b) => a - b);
}

export function isInpcYearComplete(year: number): boolean {
  const yearData =
    economicHistory.inpc.years[
      String(year) as InpcYear
    ];

  if (!yearData) {
    return false;
  }

  return yearData.complete;
}

export function getProductById(productId: string) {
  return economicHistory.products.find(
    (product) => product.id === productId
  );
}

export function getProductPriceForYear(
  productId: string,
  year: number
): number | null {
  const product = getProductById(productId);

  if (!product) {
    return null;
  }

  const prices = product.prices as Record<
    string,
    {
      price: number;
    }
  >;

  const yearData = prices[String(year)];

  return yearData?.price ?? null;
}

export function getAvailableProductPriceYears(
  productId: string
): number[] {
  const product = getProductById(productId);

  if (!product) {
    return [];
  }

  const prices = product.prices as Record<
    string,
    {
      price: number;
    }
  >;

  return Object.keys(prices)
    .map(Number)
    .sort((a, b) => a - b);
}