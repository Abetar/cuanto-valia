"use client";

import { useMemo, useState } from "react";
import type { IconType } from "react-icons";

import {
  FiBarChart2,
  FiCalendar,
  FiCoffee,
  FiDisc,
  FiDollarSign,
  FiDroplet,
  FiExternalLink,
  FiFileText,
  FiHeart,
  FiInfo,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";

import {
  getAvailableInpcYears,
  getInpcForYear,
  getProductPriceForYear,
  isInpcYearComplete,
} from "@/lib/economic-data";

import {
  calculateAccumulatedInflation,
  calculatePurchasableQuantity,
  convertMoneyBetweenIndexes,
} from "@/lib/economics";

/* -------------------------------------------------------------------------- */
/*                                   LINKS                                    */
/* -------------------------------------------------------------------------- */

const links = {
  kofi: "https://ko-fi.com/abrahamgomez96",
  cuentaClara: "https://cuenta-clara-psi.vercel.app/",
  mexicoEnNumeros: "https://mexico-en-numeros.vercel.app/",
};

/* -------------------------------------------------------------------------- */
/*                                   FORMAT                                   */
/* -------------------------------------------------------------------------- */

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

/* -------------------------------------------------------------------------- */
/*                                  PRODUCTS                                  */
/* -------------------------------------------------------------------------- */

type ProductDefinition = {
  id: string;
  name: string;
  unit: string;
  Icon: IconType;
  accent: string;
  delay: number;
};

const products: ProductDefinition[] = [
  {
    id: "tortilla",
    name: "Tortilla",
    unit: "kg",
    Icon: FiDisc,
    accent: "#73b800",
    delay: 0,
  },
  {
    id: "egg",
    name: "Huevo",
    unit: "kg",
    Icon: FiPackage,
    accent: "#f3a000",
    delay: 0.35,
  },
  {
    id: "milk",
    name: "Leche",
    unit: "L",
    Icon: FiDroplet,
    accent: "#1688d4",
    delay: 0.7,
  },
  {
    id: "gasoline",
    name: "Gasolina",
    unit: "L",
    Icon: FiTruck,
    accent: "#e44f3f",
    delay: 1.05,
  },
  {
    id: "gansito",
    name: "Gansito",
    unit: "pzas",
    Icon: FiCoffee,
    accent: "#c42b74",
    delay: 1.4,
  },
  {
    id: "sabritas",
    name: "Sabritas",
    unit: "bolsas",
    Icon: FiShoppingBag,
    accent: "#e5a500",
    delay: 1.75,
  },
];

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const years = getAvailableInpcYears();

  const minYear = years[0];
  const maxYear = years[years.length - 1];

  const [amount, setAmount] = useState(34_000);
  const [baseYear, setBaseYear] = useState(maxYear);
  const [selectedYear, setSelectedYear] = useState(2000);

  const baseIndex = getInpcForYear(baseYear);
  const selectedIndex = getInpcForYear(selectedYear);

  const equivalentValue = useMemo(() => {
    return convertMoneyBetweenIndexes(amount, baseIndex, selectedIndex);
  }, [amount, baseIndex, selectedIndex]);

  const inflationDifference = useMemo(() => {
    if (selectedYear === baseYear) {
      return 0;
    }

    if (selectedYear < baseYear) {
      return calculateAccumulatedInflation(selectedIndex, baseIndex);
    }

    return calculateAccumulatedInflation(baseIndex, selectedIndex);
  }, [selectedYear, baseYear, selectedIndex, baseIndex]);

  const onePesoEquivalent = useMemo(() => {
    return convertMoneyBetweenIndexes(1, selectedIndex, baseIndex);
  }, [selectedIndex, baseIndex]);

  const productResults = useMemo(() => {
    return products.map((product) => {
      const selectedPrice = getProductPriceForYear(product.id, selectedYear);

      const basePrice = getProductPriceForYear(product.id, baseYear);

      const selectedQuantity =
        selectedPrice !== null && selectedPrice > 0
          ? calculatePurchasableQuantity(equivalentValue, selectedPrice)
          : null;

      const baseQuantity =
        basePrice !== null && basePrice > 0
          ? calculatePurchasableQuantity(amount, basePrice)
          : null;

      const quantityDifference =
        selectedQuantity !== null && baseQuantity !== null && baseQuantity > 0
          ? ((selectedQuantity - baseQuantity) / baseQuantity) * 100
          : null;

      return {
        ...product,
        selectedPrice,
        basePrice,
        selectedQuantity,
        baseQuantity,
        quantityDifference,
      };
    });
  }, [selectedYear, baseYear, equivalentValue, amount]);

  const baseYearIsPartial = !isInpcYearComplete(baseYear);

  const selectedYearIsPartial = !isInpcYearComplete(selectedYear);

  const sliderProgress = ((selectedYear - minYear) / (maxYear - minYear)) * 100;

  return (
    <>
      <style jsx global>{`
        @keyframes aresFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes softBlink {
          0%,
          100% {
            opacity: 0.65;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes progressSweep {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(340%);
          }
        }

        @keyframes dockEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes supportPulse {
          0%,
          100% {
            box-shadow:
              0 3px 8px rgba(72, 90, 99, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
          }

          50% {
            box-shadow:
              0 4px 13px rgba(195, 53, 107, 0.22),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
          }
        }

        .ares-float {
          animation: aresFloat 3.8s ease-in-out infinite;
        }

        .ares-status {
          animation: softBlink 2.2s ease-in-out infinite;
        }

        .quick-launch {
          animation: dockEnter 0.45s ease-out both;
        }

        .support-button {
          animation: supportPulse 3s ease-in-out infinite;
        }

        .ares-range {
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 3px;
          outline: none;
        }

        .ares-range::-webkit-slider-thumb {
          appearance: none;
          width: 17px;
          height: 23px;
          border-radius: 4px;
          cursor: grab;
          border: 1px solid #4d7300;
          background: linear-gradient(
            180deg,
            #d5fa78 0%,
            #96ce21 45%,
            #6da900 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 1px 3px rgba(47, 76, 0, 0.3);
        }

        .ares-range::-webkit-slider-thumb:active {
          cursor: grabbing;
        }

        .ares-range::-moz-range-thumb {
          width: 17px;
          height: 23px;
          border-radius: 4px;
          cursor: grab;
          border: 1px solid #4d7300;
          background: linear-gradient(
            180deg,
            #d5fa78 0%,
            #96ce21 45%,
            #6da900 100%
          );
        }

        @media (min-width: 640px) {
          .ares-range {
            height: 10px;
          }

          .ares-range::-webkit-slider-thumb {
            width: 22px;
            height: 28px;
          }

          .ares-range::-moz-range-thumb {
            width: 22px;
            height: 28px;
          }
        }
      `}</style>

      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#eef1f4] pb-24 text-[#25303a] sm:pb-12">
        {/* TOP APPLICATION BAR */}

        <div className="w-full max-w-full border-b border-[#a7b1ba] bg-gradient-to-b from-white via-[#edf2f5] to-[#d8dee3] shadow-[0_1px_4px_rgba(0,0,0,0.16)]">
          <div className="mx-auto flex min-h-14 w-full max-w-7xl min-w-0 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#527e00] bg-gradient-to-b from-[#bbed4e] to-[#6ca600] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.15)]">
                <FiTrendingUp className="text-xl text-white" />
              </div>

              <div>
                <p className="text-[17px] font-bold leading-none text-[#34414b]">
                  Cuánto valía
                </p>

                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.13em] text-[#81909a]">
                  México en Números
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-xs text-[#65727b] sm:flex">
              <span className="ares-status h-2 w-2 rounded-full bg-[#79b800]" />
              datos cargados
            </div>
          </div>
        </div>

        {/* SOFTWARE NAV */}

        <div className="w-full max-w-full border-b border-[#c0c7cc] bg-[#f8f9fa]">
          <div className="mx-auto flex w-full max-w-7xl min-w-0 overflow-x-auto px-4 sm:px-6">
            <button className="border-x border-[#c0c7cc] bg-white px-5 py-2.5 text-xs font-bold text-[#507c00] shadow-[inset_0_3px_0_#83bd13]">
              Comparar
            </button>

            <div className="px-5 py-2.5 text-xs font-medium text-[#85919a]">
              1993 — {maxYear}
            </div>

            <div className="px-5 py-2.5 text-xs font-medium text-[#85919a]">
              INPC
            </div>

            <a
              href={links.mexicoEnNumeros}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hidden items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-[#68757d] transition hover:bg-white hover:text-[#507c00] md:flex"
            >
              Más herramientas
              <FiExternalLink />
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 py-7 sm:px-6 sm:py-10">
          {/* INTRO */}

          <header className="mb-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-[-0.045em] text-[#26333c] sm:text-5xl">
                  ¿Cuánto valía tu dinero?
                </h1>
              </div>

              <div className="hidden items-center gap-2 rounded border border-[#bfc8ce] bg-white px-3 py-2 text-xs text-[#71808a] shadow-sm md:flex">
                <FiInfo />
                INPC México · 1993–{maxYear}
              </div>
            </div>
          </header>

          {/* MAIN WINDOW */}

          <section className="w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-[#aeb8bf] bg-[#f7f8f9] shadow-[0_7px_25px_rgba(51,65,75,0.13)]">
            <div className="flex items-center justify-between border-b border-[#769800] bg-gradient-to-b from-[#a9dc31] via-[#87bc12] to-[#669900] px-4 py-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <div className="flex items-center gap-2 text-sm font-bold">
                <FiDollarSign />
                Comparador de poder adquisitivo
              </div>

              <div className="flex gap-1">
                <span className="h-3 w-3 rounded-[2px] border border-white/40 bg-white/30" />
                <span className="h-3 w-3 rounded-[2px] border border-white/40 bg-white/30" />
                <span className="h-3 w-3 rounded-[2px] border border-white/40 bg-white/30" />
              </div>
            </div>

            <div className="grid w-full max-w-full min-w-0 lg:grid-cols-[390px_minmax(0,1fr)]">
              {/* LEFT SETTINGS */}

              <div className="min-w-0 max-w-full overflow-hidden border-b border-[#c9d0d5] bg-[#edf1f3] p-4 sm:p-5 lg:border-b-0 lg:border-r">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[#65727b]">
                  Tu dinero
                </div>

                <div className="rounded-md border border-[#b7c1c7] bg-white p-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#59666f]">
                    <FiDollarSign className="text-[#79ad0d]" />
                    Monto
                  </label>

                  <div className="flex items-center border-b-2 border-[#86b724] pb-1">
                    <span className="mr-1 text-2xl font-bold text-[#839097]">
                      $
                    </span>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={amount.toLocaleString("en-US")}
                      onChange={(event) => {
                        const rawValue = event.target.value.replace(/,/g, "");

                        if (rawValue === "") {
                          setAmount(0);
                          return;
                        }

                        if (/^\d+$/.test(rawValue)) {
                          setAmount(Number(rawValue));
                        }
                      }}
                      className="min-w-0 flex-1 bg-transparent text-3xl font-black tracking-[-0.04em] text-[#27333c] outline-none"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#59666f]">
                      <FiCalendar className="text-[#79ad0d]" />
                      Tu dinero es de
                    </label>

                    <div className="relative">
                      <select
                        value={baseYear}
                        onChange={(event) =>
                          setBaseYear(Number(event.target.value))
                        }
                        className="w-full appearance-none rounded border border-[#aab5bd] bg-gradient-to-b from-white to-[#edf0f2] px-3 py-2.5 text-sm font-bold text-[#34414b] outline-none shadow-sm focus:border-[#76a900]"
                      >
                        {years
                          .slice()
                          .reverse()
                          .map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                      </select>

                      <FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#79868e]" />
                    </div>
                  </div>
                </div>

                {baseYearIsPartial && (
                  <div className="mt-3 flex gap-2 rounded border border-[#e1c15b] bg-[#fff8d9] px-3 py-2 text-[11px] text-[#76611f]">
                    <FiInfo className="mt-0.5 shrink-0" />
                    {baseYear} usa datos parciales.
                  </div>
                )}

                <div className="mt-5 overflow-hidden rounded-md border border-[#b7c1c7]">
                  <div className="border-b border-[#b7c1c7] bg-gradient-to-b from-white to-[#e0e5e8] px-3 py-2 text-xs font-bold text-[#57636b]">
                    Resumen
                  </div>

                  <div className="divide-y divide-[#dce1e4] bg-white">
                    <SidebarStat
                      label="Año comparado"
                      value={String(selectedYear)}
                    />

                    <SidebarStat
                      label="Inflación"
                      value={`${percentFormatter.format(inflationDifference)}%`}
                    />

                    <SidebarStat
                      label={`$1 de ${selectedYear}`}
                      value={currencyFormatter.format(onePesoEquivalent)}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT RESULT */}

              <div className="min-w-0 max-w-full overflow-hidden bg-white">
                <div className="w-full max-w-full min-w-0 overflow-hidden p-4 sm:p-7">
                  <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a969d]">
                        En {selectedYear} serían
                      </p>

                      <p className="mt-1 max-w-full break-words text-4xl font-black tracking-[-0.055em] text-[#26333c] sm:text-6xl">
                        {currencyFormatter.format(equivalentValue)}
                      </p>

                      <p className="mt-3 max-w-xl text-xs leading-5 text-[#71808a] sm:text-sm">
                        En {selectedYear} necesitabas aproximadamente{" "}
                        <strong className="font-bold text-[#4b5962]">
                          {currencyFormatter.format(equivalentValue)}
                        </strong>{" "}
                        para tener el mismo poder adquisitivo general que{" "}
                        <strong className="font-bold text-[#4b5962]">
                          {currencyFormatter.format(amount)}
                        </strong>{" "}
                        en {baseYear}.
                      </p>
                    </div>

                    <div className="w-full min-w-0 max-w-full rounded border border-[#9dbb5a] bg-[#f2f9df] px-4 py-2 text-right sm:w-auto sm:min-w-[150px]">
                      <p className="text-[10px] font-bold uppercase text-[#6b881f]">
                        original
                      </p>

                      <p className="font-bold text-[#4b6412]">
                        {currencyFormatter.format(amount)}
                      </p>

                      <p className="text-[11px] text-[#819650]">{baseYear}</p>
                    </div>
                  </div>

                  {selectedYearIsPartial && (
                    <p className="mt-3 text-xs text-[#9a791d]">
                      Información parcial del año.
                    </p>
                  )}

                  {/* SLIDER */}

                  <div className="mt-7 w-full min-w-0 overflow-hidden rounded-md border border-[#c8d0d5] bg-[#eef2f4] p-4 sm:mt-9">
                    {/* MOBILE */}
                    <div className="sm:hidden">
                      <div className="mb-5 flex justify-center">
                        <div className="rounded border border-[#668f0a] bg-gradient-to-b from-[#b8e54c] to-[#7db20b] px-5 py-1.5 text-base font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(70,100,0,0.2)]">
                          {selectedYear}
                        </div>
                      </div>

                      <div className="w-full px-3">
                        <input
                          type="range"
                          min={minYear}
                          max={maxYear}
                          step={1}
                          value={selectedYear}
                          onChange={(event) =>
                            setSelectedYear(Number(event.target.value))
                          }
                          aria-label={`Comparar con el año ${selectedYear}`}
                          className="ares-range block w-full max-w-full cursor-pointer"
                          style={{
                            background: `linear-gradient(
            to right,
            #77ad0b 0%,
            #95ca21 ${sliderProgress}%,
            #c8d0d5 ${sliderProgress}%,
            #c8d0d5 100%
          )`,
                          }}
                        />
                      </div>

                      <div className="mt-4 flex w-full items-center justify-between px-3">
                        <span className="font-mono text-[10px] text-[#7b878e]">
                          {minYear}
                        </span>

                        <span className="font-mono text-[10px] text-[#7b878e]">
                          {maxYear}
                        </span>
                      </div>

                      <p className="mt-2 text-center text-[10px] text-[#929ca1]">
                        Desliza para cambiar de año
                      </p>
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden sm:block">
                      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                        <span className="font-mono text-[11px] text-[#75828a]">
                          {minYear}
                        </span>

                        <div className="min-w-[82px] rounded border border-[#668f0a] bg-gradient-to-b from-[#b8e54c] to-[#7db20b] px-5 py-1.5 text-center text-lg font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                          {selectedYear}
                        </div>

                        <span className="text-right font-mono text-[11px] text-[#75828a]">
                          {maxYear}
                        </span>
                      </div>

                      <div className="px-2">
                        <input
                          type="range"
                          min={minYear}
                          max={maxYear}
                          step={1}
                          value={selectedYear}
                          onChange={(event) =>
                            setSelectedYear(Number(event.target.value))
                          }
                          aria-label={`Comparar con el año ${selectedYear}`}
                          className="ares-range block w-full cursor-pointer"
                          style={{
                            background: `linear-gradient(
            to right,
            #77ad0b 0%,
            #95ca21 ${sliderProgress}%,
            #c8d0d5 ${sliderProgress}%,
            #c8d0d5 100%
          )`,
                          }}
                        />
                      </div>

                      <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-[#d5dade]">
                        <div
                          className="absolute inset-y-0 w-1/4 bg-[#91c421]/40"
                          style={{
                            animation: "progressSweep 4s linear infinite",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* METRICS BAR */}

                <div className="grid w-full max-w-full min-w-0 border-y border-[#ccd3d7] bg-[#f2f4f5] sm:grid-cols-3">
                  <Metric
                    label="Equivalencia"
                    value={currencyFormatter.format(equivalentValue)}
                  />

                  <Metric
                    label="Inflación entre años"
                    value={`${percentFormatter.format(inflationDifference)}%`}
                  />

                  <Metric
                    label={`$1 de ${selectedYear}`}
                    value={currencyFormatter.format(onePesoEquivalent)}
                    last
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PRODUCTS */}

          <section className="mt-8 w-full max-w-full min-w-0">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] text-[#2d3942]">
                  ¿Qué alcanzaba?
                </h2>
              </div>

              <span className="hidden rounded border border-[#c9d0d4] bg-white px-3 py-1.5 text-[11px] text-[#77848c] sm:block">
                {selectedYear}
              </span>
            </div>

            <div className="grid w-full max-w-full min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {productResults.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  selectedYear={selectedYear}
                  baseYear={baseYear}
                />
              ))}
            </div>
          </section>

          {/* SUPPORT PANEL */}

          <section className="mt-8 overflow-hidden rounded-md border border-[#b8c1c7] bg-white shadow-[0_2px_7px_rgba(55,69,79,0.08)]">
            <div className="flex items-center justify-between border-b border-[#c7ced3] bg-gradient-to-b from-[#fafbfb] to-[#e5e9eb] px-4 py-2">
              <span className="text-xs font-bold text-[#56636b]">
                Más de AG Solutions
              </span>

              <span className="h-2 w-2 rounded-full bg-[#82ba14]" />
            </div>

            <div className="grid md:grid-cols-3">
              <ProjectLink
                href={links.cuentaClara}
                Icon={FiFileText}
                title="Cuenta Clara"
                description="Calcula finiquito y liquidación."
              />

              <ProjectLink
                href={links.mexicoEnNumeros}
                Icon={FiBarChart2}
                title="México en Números"
                description="Compara tu ingreso en México."
              />

              <ProjectLink
                href={links.kofi}
                Icon={FiHeart}
                title="Apoya el proyecto"
                description="Invítame un café en Ko-fi."
                support
                last
              />
            </div>
          </section>

          {/* FOOTER */}

          <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-[#cbd2d6] py-5 text-[11px] text-[#869198] sm:flex-row">
            <span>Cuánto valía · México en Números</span>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a
                href={links.cuentaClara}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#628f08]"
              >
                Cuenta Clara
              </a>

              <a
                href={links.mexicoEnNumeros}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#628f08]"
              >
                México en Números
              </a>

              <a
                href={links.kofi}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#c44b71] transition hover:text-[#9e3154]"
              >
                Ko-fi
              </a>
            </div>
          </footer>
        </div>

        {/* QUICK LAUNCH FLOATING DOCK */}

        <QuickLaunch />
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              QUICK LAUNCH                                  */
/* -------------------------------------------------------------------------- */

function QuickLaunch() {
  return (
    <aside className="quick-launch fixed bottom-3 left-1/2 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1.5 rounded-lg border border-[#9faab1] bg-gradient-to-b from-white to-[#dfe5e8] p-1.5 shadow-[0_5px_18px_rgba(47,60,69,0.25),inset_0_1px_0_white] sm:bottom-5 sm:left-auto sm:right-5 sm:max-w-none sm:translate-x-0 sm:flex-col sm:items-stretch">
      <div className="hidden border-b border-[#c5ccd0] px-2 pb-1.5 pt-0.5 sm:block">
        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#909a9f]">
          quick launch
        </p>
      </div>

      <QuickLaunchItem
        href={links.cuentaClara}
        Icon={FiFileText}
        label="Cuenta Clara"
        accent="#1688d4"
      />

      <QuickLaunchItem
        href={links.mexicoEnNumeros}
        Icon={FiBarChart2}
        label="México en Números"
        accent="#72a90c"
      />

      <QuickLaunchItem
        href={links.kofi}
        Icon={FiHeart}
        label="Apóyame"
        accent="#c74370"
        support
      />
    </aside>
  );
}

function QuickLaunchItem({
  href,
  Icon,
  label,
  accent,
  support = false,
}: {
  href: string;
  Icon: IconType;
  label: string;
  accent: string;
  support?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`group flex min-h-10 items-center gap-2 rounded-md border border-[#b7c0c5] bg-gradient-to-b from-white to-[#edf0f2] px-2.5 py-2 shadow-[inset_0_1px_0_white] transition hover:-translate-y-0.5 hover:border-[#8c989f] hover:shadow-md sm:min-w-[150px] ${
        support ? "support-button" : ""
      }`}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded border bg-white shadow-sm"
        style={{
          color: accent,
          borderColor: `${accent}55`,
        }}
      >
        <Icon />
      </div>

      <span className="hidden flex-1 text-[11px] font-bold text-[#4c5961] sm:block">
        {label}
      </span>

      <FiExternalLink className="hidden text-[10px] text-[#9aa3a8] transition group-hover:text-[#65727a] sm:block" />
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PROJECT LINK                                 */
/* -------------------------------------------------------------------------- */

function ProjectLink({
  href,
  Icon,
  title,
  description,
  support = false,
  last = false,
}: {
  href: string;
  Icon: IconType;
  title: string;
  description: string;
  support?: boolean;
  last?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 p-4 transition hover:bg-[#f5f8f1] ${
        !last ? "border-b border-[#d6dcdf] md:border-b-0 md:border-r" : ""
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border shadow-sm ${
          support
            ? "border-[#df9daf] bg-[#fff1f5] text-[#bf3d66]"
            : "border-[#a9c86a] bg-[#f4fae8] text-[#669408]"
        }`}
      >
        <Icon className="text-lg" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-bold text-[#46535b]">{title}</p>

          <FiExternalLink className="text-[10px] text-[#a3abad] transition group-hover:text-[#6c777d]" />
        </div>

        <p className="mt-0.5 text-[10px] text-[#8a9499]">{description}</p>
      </div>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*                                PRODUCT CARD                                */
/* -------------------------------------------------------------------------- */

type ProductCardProps = ProductDefinition & {
  selectedPrice: number | null;
  basePrice: number | null;
  selectedQuantity: number | null;
  baseQuantity: number | null;
  quantityDifference: number | null;
  selectedYear: number;
  baseYear: number;
};

function ProductCard({
  name,
  unit,
  Icon,
  accent,
  delay,
  selectedPrice,
  selectedQuantity,
  baseQuantity,
  quantityDifference,
  selectedYear,
  baseYear,
}: ProductCardProps) {
  const hasData = selectedPrice !== null && selectedQuantity !== null;

  return (
    <article className="group relative min-w-0 max-w-full overflow-hidden rounded-md border border-[#b9c3c9] bg-white shadow-[0_2px_6px_rgba(55,69,79,0.09)] transition duration-200 hover:-translate-y-0.5 hover:border-[#8caf3b] hover:shadow-[0_7px_16px_rgba(55,69,79,0.14)]">
      <div className="flex items-center justify-between border-b border-[#ccd3d7] bg-gradient-to-b from-[#fafbfb] to-[#e5e9eb] px-3 py-2">
        <span className="text-xs font-bold text-[#56636b]">{name}</span>

        <span className="font-mono text-[10px] text-[#98a2a8]">
          {selectedYear}
        </span>
      </div>

      <div className="flex min-h-[170px] gap-4 p-4">
        <div className="flex w-[70px] shrink-0 items-start justify-center pt-2">
          <div
            className="ares-float relative flex h-14 w-14 items-center justify-center rounded-xl border bg-gradient-to-b from-white to-[#eef1f2] shadow-[0_5px_9px_rgba(0,0,0,0.12),inset_0_1px_0_white]"
            style={{
              animationDelay: `${delay}s`,
              borderColor: `${accent}55`,
            }}
          >
            <div
              className="absolute inset-1 rounded-lg opacity-10"
              style={{
                backgroundColor: accent,
              }}
            />

            <Icon
              className="relative text-3xl"
              style={{
                color: accent,
              }}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {hasData ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a969d]">
                Podías comprar
              </p>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black tracking-[-0.05em] text-[#29363e]">
                  {quantityFormatter.format(selectedQuantity)}
                </span>

                <span className="text-xs font-bold text-[#78858d]">{unit}</span>
              </div>

              <p className="mt-2 text-xs text-[#77838a]">
                {priceFormatter.format(selectedPrice)} / {unit}
              </p>

              {baseQuantity !== null && quantityDifference !== null && (
                <div className="mt-3 border-t border-[#e2e6e8] pt-2">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="text-[#89949a]">vs. {baseYear}</span>

                    <span
                      className="font-bold"
                      style={{
                        color: quantityDifference >= 0 ? "#6c9d09" : "#c44b3b",
                      }}
                    >
                      {quantityDifference >= 0 ? "+" : ""}
                      {percentFormatter.format(quantityDifference)}%
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full min-h-[100px] flex-col justify-center">
              <span className="text-2xl font-black text-[#a8b0b5]">—</span>

              <p className="mt-1 text-xs text-[#8f999f]">
                Sin dato para {selectedYear}
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className="h-[3px] w-full opacity-80"
        style={{
          backgroundColor: accent,
        }}
      />
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                SMALL METRIC                                */
/* -------------------------------------------------------------------------- */

function Metric({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`min-w-0 max-w-full px-5 py-4 ${
        last ? "" : "border-b border-[#ccd3d7] sm:border-b-0 sm:border-r"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a969d]">
        {label}
      </p>

      <p className="mt-1 max-w-full break-words text-lg font-black tracking-[-0.03em] text-[#35424b]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SIDEBAR STAT                                 */
/* -------------------------------------------------------------------------- */

function SidebarStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5">
      <span className="text-[11px] text-[#7d8990]">{label}</span>

      <span className="min-w-0 max-w-[55%] truncate text-right text-xs font-bold text-[#43515a]">
        {value}
      </span>
    </div>
  );
}
