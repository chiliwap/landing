"use client";

import Nav from "@/components/layout/nav";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const products = [
  {
    id: "full-coverage",
    name: "Full Coverage System",
    description: "Comprehensive fire protection system.",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fbrickandbatten%2Fimages%2Ff_auto%2Cq_auto%2Fv1657654626%2Fwordpress_assets%2F106771-BEFORE_agreeable-gray_westhighland-white%2F106771-BEFORE_agreeable-gray_westhighland-white.jpg%3F_i%3DAA&f=1&nofb=1&ipt=355ce572b18c69d7f6a8bebfe9892911013b25747fe2c0fb7e551f928a56cbcc",
    hero: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F37%2F0c%2F55%2F370c55f67d922cb79459cc19d7865666.jpg&f=1&nofb=1&ipt=d671cfceb3ab3c76c453e01d4da67bebc049852dfe8049b2fbede88aceb872eb",
  },
  {
    id: "brass-sprinklers",
    name: "Stand-Alone Sprinklers",
    description: "High-quality sprinkler for your home.",
    image: "/products/sprinkler.jpg",
    hero: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fww1.prweb.com%2Fprfiles%2F2015%2F03%2F02%2F12556168%2FGeneva_Q1_Facade.jpg&f=1&nofb=1&ipt=1f63b02053caa786837cf83acad388a9df0eda9141b43d80a1b7f849d180ea1c",
  },
  {
    id: "monitoring",
    name: "Control & Monitoring System",
    description: "Advanced monitoring solutions for fire protection.",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thespruce.com%2Fthmb%2FQG4SUpXK8rwsAcqdx39OB_QhF_w%3D%2F2000x1333%2Ffilters%3Ano_upscale()%2Felectrical-service-size-of-my-home-1152752-hero-0a04c3eec7c94154a5e8f116e7fe329f.jpg&f=1&nofb=1&ipt=20e73ea2598437f120b6d97a54f73aebf7c4cee16a294d27bf8cd120a5531ac4",
    hero: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.staticmb.com%2Fmbcontent%2Fimages%2Fuploads%2F2022%2F12%2FMost-Beautiful-House-in-the-World.jpg&f=1&nofb=1&ipt=abe02fa60dc9445c7f733fc2ef0dcb990de79a23f5e8432b883ebd7ea86e3ec5",
  },
];

// Short per-product key differentiators for display beside the © text
const productDiffs: Record<string, string> = {
  "full-coverage": "Whole-home automatic protection",
  "brass-sprinklers": "Targeted add-on units",
  monitoring: "Smart alerts & control",
};

export default function Products(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(() => {
    const idx = products.findIndex((p) => p.id == slug);
    return idx >= 0 ? idx : 0;
  });
  const [step, setStep] = useState<1 | 2>(1);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Quote form state
  const [levels, setLevels] = useState<number>(1);
  const [sqft, setSqft] = useState<number>(2000);
  const [stateCode, setStateCode] = useState<string>("BC");
  const [postal, setPostal] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [waterSource, setWaterSource] = useState<
    "municipal" | "well" | "cistern" | "other"
  >("municipal");
  const [outbuildings, setOutbuildings] = useState<boolean>(false);
  const [homeType, setHomeType] = useState<
    "detached" | "semi" | "townhouse" | "condo"
  >("detached");
  const [buildType, setBuildType] = useState<"new" | "retrofit">("retrofit");
  const [timeline, setTimeline] = useState<"asap" | "1-3" | "3-6" | "6+">(
    "1-3"
  );

  // Note: initial selection is set via useState initializer above; no effect needed

  // Move focus to the selected option (roving tabindex pattern)
  useEffect(() => {
    if (selectedProduct != null && selectedProduct !== -1) {
      const el = optionRefs.current[selectedProduct];
      el?.focus();
    }
  }, [selectedProduct]);

  const currentProduct =
    selectedProduct !== null && selectedProduct !== -1
      ? products[selectedProduct]
      : slug
        ? products.find((p) => p.id == slug) || products[0]
        : products[0];

  // Preview equals current selection (no hover-based preview)
  const previewProduct = currentProduct;

  // Compute a rough quote based on selections
  const quote = useMemo(() => {
    const sp =
      selectedProduct !== null && selectedProduct !== -1
        ? products[selectedProduct]
        : currentProduct;
    if (!sp) return null;

    // base price per sqft by product
    let basePerSqft = 2.5;
    let baseFlat = 0;
    switch (sp.id) {
      case "full-coverage":
        basePerSqft = 3.5;
        break;
      case "brass-sprinklers":
        basePerSqft = 2.2;
        break;
      case "monitoring":
        basePerSqft = 0.8;
        baseFlat = 1500;
        break;
    }

    // Levels multiplier
    const levelMult = [0, 1, 1.12, 1.18, 1.25][
      Math.max(0, Math.min(levels, 4))
    ];

    // Location multiplier by province/territory (Canada only)
    const highCost = new Set(["BC", "ON"]);
    const midCost = new Set(["QC", "AB"]);
    let locMult = 1.0;
    if (highCost.has(stateCode.toUpperCase())) locMult = 1.12;
    else if (midCost.has(stateCode.toUpperCase())) locMult = 1.06;
    else locMult = 1.0;

    // Water source multiplier (affects installation complexity)
    const waterMultMap = {
      municipal: 1.0,
      well: 1.06,
      cistern: 1.1,
      other: 1.08,
    };
    const waterMult = waterMultMap[waterSource] ?? 1.0;

    // Home type & build type multipliers
    const homeTypeMultMap = {
      detached: 1.0,
      semi: 1.03,
      townhouse: 1.02,
      condo: 0.95,
    } as const;
    const homeMult = homeTypeMultMap[homeType] ?? 1.0;
    const buildMult = buildType === "retrofit" ? 1.08 : 1.0;

    // Extras
    const extrasFlat = outbuildings ? 1500 : 0;

    const baseMaterial = sqft * basePerSqft;
    const afterLevels = baseMaterial * levelMult;
    const afterLocation = afterLevels * locMult;
    const afterWater = afterLocation * waterMult;
    const afterHomeType = afterWater * homeMult;
    const afterBuild = afterHomeType * buildMult;

    const addLevels = Math.max(0, afterLevels - baseMaterial);
    const addLocation = Math.max(0, afterLocation - afterLevels);
    const addWater = Math.max(0, afterWater - afterLocation);
    const addHomeType = Math.max(0, afterHomeType - afterWater);
    const addBuild = Math.max(0, afterBuild - afterHomeType);

    const raw = baseFlat + extrasFlat + afterBuild;
    const low = Math.max(0, raw * 0.9);
    const high = raw * 1.1;
    return {
      raw,
      low,
      high,
      details: {
        basePerSqft,
        baseFlat,
        levelMult,
        locMult,
        waterMult,
        homeMult,
        buildMult,
        extrasFlat,
        sqft,
        baseMaterial,
        afterLevels,
        afterLocation,
        afterWater,
        afterHomeType,
        afterBuild,
        addLevels,
        addLocation,
        addWater,
        addHomeType,
        addBuild,
      },
    };
  }, [
    selectedProduct,
    currentProduct,
    levels,
    sqft,
    stateCode,
    waterSource,
    outbuildings,
    homeType,
    buildType,
  ]);

  // Build a receipt-style breakdown using a map to avoid repeated JSX
  const breakdownItems = useMemo(() => {
    if (!quote)
      return [] as Array<{
        key: string;
        label: string;
        amount: number;
        isBase?: boolean;
      }>;
    const d = quote.details;
    const items: Array<{
      key: string;
      label: string;
      amount: number;
      isBase?: boolean;
    }> = [
      {
        key: "baseMaterial",
        label: `Base materials (${sqft.toLocaleString()} sq ft × $${d.basePerSqft.toFixed(2)})`,
        amount: d.baseMaterial,
        isBase: true,
      },
      { key: "addLevels", label: "Levels", amount: d.addLevels },
      { key: "addLocation", label: "Location", amount: d.addLocation },
      { key: "addWater", label: "Water source", amount: d.addWater },
      { key: "addHomeType", label: "Home type", amount: d.addHomeType },
      { key: "addBuild", label: "Build type", amount: d.addBuild },
      { key: "extrasFlat", label: "Outbuildings", amount: d.extrasFlat },
      { key: "baseFlat", label: "Base system", amount: d.baseFlat },
    ];
    // Always include base materials; include others only if > 0
    return items.filter((it) => it.isBase || it.amount > 0);
  }, [quote, sqft]);

  // Compact custom select component to replace native <select>
  function CompactSelect(props: {
    id?: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    className?: string;
    placeholder?: string;
    ariaLabel?: string;
  }) {
    const { id, value, onChange, options, className, placeholder, ariaLabel } =
      props;
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(() =>
      Math.max(
        0,
        options.findIndex((o) => o.value === value)
      )
    );
    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const onDoc = (e: MouseEvent) => {
        if (!wrapRef.current) return;
        if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    useEffect(() => {
      setActiveIndex(
        Math.max(
          0,
          options.findIndex((o) => o.value === value)
        )
      );
    }, [value, options]);

    const selected = options.find((o) => o.value === value);
    const label = selected?.label ?? placeholder ?? "Select";

    return (
      <div ref={wrapRef} className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((i) => Math.min(options.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (open) {
                const opt = options[activeIndex];
                if (opt) onChange(opt.value);
              }
              setOpen((o) => !o);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={`${className ?? ""} inline-flex w-full items-center justify-between text-left bg-neutral-900 border border-white/15 text-white/90 hover:bg-neutral-850/100`}
        >
          <span className="truncate">{label}</span>
          <svg
            className="ml-2 h-3.5 w-3.5 opacity-80"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {open && (
          <ul
            role="listbox"
            aria-labelledby={id}
            className="absolute z-50 left-0 right-0 top-full mt-1 rounded-lg border border-white/15 bg-neutral-900 shadow-xl max-h-64 overflow-auto"
          >
            {options.map((opt, i) => {
              const isActive = i === activeIndex;
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    isActive ? "bg-neutral-800" : "bg-transparent"
                  } ${isSelected ? "text-white" : "text-white/80"}`}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen text-white bg-[radial-gradient(70%_60%_at_50%_10%,rgba(255,140,66,0.20)_0%,rgba(255,140,66,0.06)_35%,transparent_70%)]">
      <Nav />

      {/* Full-width layout with 5:1 ratio (left:right) */}
      <section className="pt-16 md:pt-20">
        <div className="mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-24 pb-24 md:pb-0">
          {/* Two layouts that crossfade/slide between steps */}
          <div className="relative min-h-[70vh]">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: -16, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.995 }}
                  className="absolute inset-0"
                >
                  <div className="my-6 md:my-8 w-full flex flex-col md:flex-row items-stretch gap-6 md:gap-8">
                    {/* Left: big image area */}
                    <div className="md:w-8/10 w-full">
                      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_1px_0_rgba(255,255,255,0.3),0_20px_80px_-20px_rgba(0,0,0,0.6)]">
                        <img
                          className="w-full h-[44vh] md:h-[80vh] object-cover object-center scale-105"
                          src={previewProduct.hero}
                          alt="Product preview"
                        />
                        {/* Glass gradient overlays */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),transparent_30%),radial-gradient(80%_40%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
                        {/* Darken for readability */}
                        <div className="pointer-events-none absolute inset-0 bg-black/35 md:bg-black/30" />
                        <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between gap-3 text-xs md:text-sm text-white/80">
                          <span className="sm:flex hidden px-3 py-2 rounded-xl bg-black/30 backdrop-blur border border-white/10 shadow-sm">
                            {currentProduct.description}
                          </span>
                          <span
                            key={currentProduct.id}
                            className="px-3 py-2 rounded-xl bg-black/30 backdrop-blur border border-white/10 shadow-sm"
                          >
                            {`© ${new Date().getFullYear()} Chiliwap`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: options with min width, full height */}
                    <aside className="w-full md:flex-[1_1_0%] md:min-w-[280px]">
                      <div className="relative h-auto md:h-[80vh] rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-[0_0_1px_0_rgba(255,255,255,0.3),0_20px_80px_-20px_rgba(0,0,0,0.6)] md:overflow-hidden overflow-visible flex flex-col">
                        <header className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-tight">
                              Virtual Consultation
                            </h2>
                            <span className="text-xs text-white/60">
                              Step {step} of 2
                            </span>
                          </div>
                          <p className="text-sm text-white/60">
                            {step === 1
                              ? "Explore our range of high-quality products."
                              : "Tell us about your home to estimate a rough quote."}
                          </p>
                        </header>

                        {/* Product options - compact, no scroll */}
                        <div
                          className="mt-4 flex-1 min-h-0 flex flex-col gap-3 md:overflow-visible overflow-y-auto pr-1"
                          role="radiogroup"
                          aria-label="Select a product"
                        >
                          {products.map((product, i) => {
                            const selected = selectedProduct === i;
                            const anySelected =
                              selectedProduct !== null &&
                              selectedProduct !== -1;
                            const tabIndex = selected
                              ? 0
                              : !anySelected && i === 0
                                ? 0
                                : -1;
                            return (
                              <div
                                key={product.id}
                                className="relative rounded-2xl flex-1 flex"
                              >
                                <button
                                  type="button"
                                  role="radio"
                                  aria-checked={selected}
                                  aria-label={product.name}
                                  onClick={() => {
                                    setSelectedProduct(i);
                                  }}
                                  onKeyDown={(e) => {
                                    let nextIndex: number | null = null;
                                    if (
                                      e.key === "ArrowDown" ||
                                      e.key === "ArrowRight"
                                    ) {
                                      e.preventDefault();
                                      nextIndex = (i + 1) % products.length;
                                    }
                                    if (
                                      e.key === "ArrowUp" ||
                                      e.key === "ArrowLeft"
                                    ) {
                                      e.preventDefault();
                                      nextIndex =
                                        (i - 1 + products.length) %
                                        products.length;
                                    }
                                    if (e.key === "Home") {
                                      e.preventDefault();
                                      nextIndex = 0;
                                    }
                                    if (e.key === "End") {
                                      e.preventDefault();
                                      nextIndex = products.length - 1;
                                    }
                                    if (nextIndex != null) {
                                      setSelectedProduct(nextIndex);
                                      return;
                                    }
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setSelectedProduct(i);
                                      setStep(2);
                                    }
                                  }}
                                  tabIndex={tabIndex}
                                  ref={(el) => {
                                    optionRefs.current[i] = el;
                                  }}
                                  className={`group relative isolate w-full h-full min-h-[96px] md:min-h-[124px] rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden text-left px-4 py-3 flex items-start gap-4 transition-[background,border-color,box-shadow] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 transform-gpu flex-1 ${
                                    selected
                                      ? "ring-1 ring-orange-500/40 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_-20px_rgba(234,88,12,0.45)]"
                                      : "hover:bg-white/[0.07]"
                                  }`}
                                >
                                  {/* New selected badge indicator */}
                                  {selected && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="absolute right-0 bottom-0 mr-3 mb-2 z-40 inline-flex items-center gap-1 rounded-full border border-orange-400/50 bg-orange-500/20 px-2 py-1 text-[10px] md:text-[11px] text-orange-100 backdrop-blur"
                                    >
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M20 7L9 18L4 13"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      Selected
                                    </motion.div>
                                  )}
                                  {/* Background image (clipped to rounded corners) */}
                                  <div
                                    aria-hidden
                                    className="absolute inset-0 z-0 rounded-2xl overflow-hidden"
                                  >
                                    <img
                                      src={product.image || product.hero}
                                      alt=""
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                      onError={(e) => {
                                        const t =
                                          e.currentTarget as HTMLImageElement & {
                                            dataset: {
                                              fallbackApplied?: string;
                                            };
                                          };
                                        if (t.dataset.fallbackApplied) return;
                                        t.dataset.fallbackApplied = "1";
                                        t.src = product.hero || "/poster.webp";
                                      }}
                                    />
                                  </div>
                                  {/* Overlays above image, below content */}
                                  <div
                                    aria-hidden
                                    className="absolute inset-0 z-10 rounded-2xl pointer-events-none bg-black/55 md:bg-black/45"
                                  />

                                  {/* Text over background */}
                                  <div className="relative z-40 min-w-0 flex-1">
                                    <h4 className="text-sm md:text-[15px] font-medium tracking-tight truncate">
                                      {product.name}
                                    </h4>
                                    <p className="mt-0.5 text-[11px] md:text-[12px] text-white/80 truncate">
                                      {product.description}
                                    </p>
                                    {/* Inline selected text removed in favor of badge */}
                                  </div>

                                  {/* Right image chip removed: background now fills the pill */}
                                </button>

                                {/* bottom accent removed for a cleaner look */}
                              </div>
                            );
                          })}
                        </div>

                        {/* Preview removed for a tighter, sleeker sidebar */}

                        {/* Sidebar filler/info panel */}
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-3 text-xs text-white/80">
                          <div className="flex items-start gap-2">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-orange-300 mt-0.5"
                            >
                              <path
                                d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="space-y-1">
                              <p className="font-medium text-white/90">
                                Why this option
                              </p>
                              <p className="text-white/70">
                                {productDiffs[currentProduct.id] ||
                                  "Smart protection for your home"}
                              </p>
                              <p className="text-white/50">
                                Tip: Use ↑ ↓ or ← → to navigate between options.
                                Press Enter to select.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Next button inside sidebar, below options */}
                        <div className="mt-auto pt-4">
                          <button
                            onClick={() => setStep(2)}
                            disabled={
                              selectedProduct == null || selectedProduct == -1
                            }
                            className={`inline-flex w-full items-center justify-center h-11 rounded-xl font-semibold tracking-wide shadow transition-all duration-300 ${
                              selectedProduct !== null && selectedProduct !== -1
                                ? "cursor-pointer bg-orange-700 text-white hover:bg-orange-600"
                                : "cursor-not-allowed bg-orange-600/30 text-white"
                            }`}
                          >
                            {"Next \u2192"}
                          </button>
                        </div>
                      </div>
                    </aside>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 16, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.995 }}
                  className="absolute inset-0"
                >
                  <div className="my-6 md:my-8 w-full flex flex-col md:flex-row items-stretch gap-6 md:gap-8">
                    {/* Left: banner + compact form (no scrolling) */}
                    <div className="md:w-8/10 w-full">
                      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_1px_0_rgba(255,255,255,0.3),0_20px_80px_-20px_rgba(0,0,0,0.6)] md:h-[80vh] flex flex-col">
                        {/* Compact banner */}
                        <div className="relative h-32 sm:h-36 md:h-40">
                          <img
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            src={previewProduct.hero}
                            alt="House details"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(17,17,19,0.2),rgba(17,17,19,0.6))]" />
                          <div className="absolute left-0 right-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3">
                            <div>
                              <h2 className="text-base sm:text-lg font-semibold tracking-tight">
                                House details
                              </h2>
                              <p className="text-[11px] sm:text-xs text-white/80 mt-1">
                                Refine your estimate below.
                              </p>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 backdrop-blur px-2.5 py-1.5 text-[10px] text-white/80 capitalize">
                              {currentProduct.name}
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] text-white hover:bg-white/15 transition-colors"
                              >
                                Change
                              </button>
                            </span>
                          </div>
                        </div>

                        {/* Compact form area (no scrolling) */}
                        <div className="flex-1 p-4 sm:p-5 md:p-6 overflow-hidden">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4 md:p-5 h-full flex flex-col">
                            {/* Inline header to use space and keep context */}
                            <div className="flex items-center justify-between gap-3 text-[11px]">
                              <span className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-white/80">
                                Step 2 of 2
                              </span>
                              <span className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-white/80 capitalize">
                                {productDiffs[currentProduct.id] ||
                                  "Smart protection"}
                              </span>
                            </div>

                            <p className="mt-2 text-[10px] text-white/60">
                              Non-binding rough estimate in CAD; site visit
                              required for final quote.
                            </p>

                            {/* Next steps timeline */}
                            <ol className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                              {[
                                { t: "Share details", d: "Complete this form" },
                                {
                                  t: "Confirm",
                                  d: "We'll refine your estimate",
                                },
                                { t: "Schedule", d: "Book a site visit" },
                              ].map((s, i) => (
                                <li
                                  key={`step-${i}`}
                                  className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-orange-500/80 text-[10px] font-semibold text-white">
                                      {i + 1}
                                    </span>
                                    <span className="font-medium">{s.t}</span>
                                  </div>
                                  <p className="mt-1 text-white/70">{s.d}</p>
                                </li>
                              ))}
                            </ol>
                            <form className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 text-[13px] flex-1 content-start">
                              {/* Row 1 */}
                              <div className="md:col-span-3">
                                <label
                                  htmlFor="levels"
                                  className="text-xs text-white/70"
                                >
                                  Levels
                                </label>
                                <div className="mt-1 grid grid-cols-4 gap-1.5">
                                  {[1, 2, 3, 4].map((n) => (
                                    <button
                                      key={n}
                                      id={n === 1 ? "levels" : undefined}
                                      type="button"
                                      onClick={() => setLevels(n)}
                                      className={`h-9 rounded-lg border text-xs transition-all ${
                                        levels === n
                                          ? "border-orange-500/60 bg-orange-500/20 text-white"
                                          : "border-white/10 bg-white/[0.03] hover:border-white/20 text-white/80"
                                      }`}
                                    >
                                      {n}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="md:col-span-3">
                                <label
                                  htmlFor="sqft2"
                                  className="text-xs text-white/70"
                                >
                                  Square footage
                                </label>
                                <div className="mt-1 relative">
                                  <input
                                    id="sqft2"
                                    type="number"
                                    min={300}
                                    step={50}
                                    value={sqft}
                                    onChange={(e) =>
                                      setSqft(
                                        Math.max(
                                          300,
                                          Number(e.target.value) || 0
                                        )
                                      )
                                    }
                                    className="w-full h-10 rounded-lg border border-white/10 bg-black/20 backdrop-blur px-3 pr-12 text-sm outline-none focus:border-white/20"
                                  />
                                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-white/60">
                                    sq ft
                                  </span>
                                </div>
                              </div>

                              <div className="md:col-span-3">
                                <label
                                  htmlFor="water"
                                  className="text-[12px] text-white/70"
                                >
                                  Water source
                                </label>
                                <CompactSelect
                                  id="water"
                                  ariaLabel="Water source"
                                  value={waterSource}
                                  onChange={(v) =>
                                    setWaterSource(
                                      v as
                                        | "municipal"
                                        | "well"
                                        | "cistern"
                                        | "other"
                                    )
                                  }
                                  options={[
                                    { value: "municipal", label: "Municipal" },
                                    { value: "well", label: "Well" },
                                    { value: "cistern", label: "Cistern" },
                                    { value: "other", label: "Other" },
                                  ]}
                                  className="mt-1 w-full h-10 rounded-lg px-3 text-sm outline-none"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label
                                  htmlFor="hometype"
                                  className="text-[12px] text-white/70"
                                >
                                  Home type
                                </label>
                                <CompactSelect
                                  id="hometype"
                                  ariaLabel="Home type"
                                  value={homeType}
                                  onChange={(v) =>
                                    setHomeType(
                                      v as
                                        | "detached"
                                        | "semi"
                                        | "townhouse"
                                        | "condo"
                                    )
                                  }
                                  options={[
                                    { value: "detached", label: "Detached" },
                                    { value: "semi", label: "Semi-detached" },
                                    { value: "townhouse", label: "Townhouse" },
                                    { value: "condo", label: "Condo" },
                                  ]}
                                  className="mt-1 w-full h-10 rounded-lg px-3 text-sm outline-none"
                                />
                              </div>

                              {/* Row 2 */}
                              <div className="md:col-span-3">
                                <label
                                  htmlFor="buildtype"
                                  className="text-[12px] text-white/70"
                                >
                                  Build type
                                </label>
                                <CompactSelect
                                  id="buildtype"
                                  ariaLabel="Build type"
                                  value={buildType}
                                  onChange={(v) =>
                                    setBuildType(v as "retrofit" | "new")
                                  }
                                  options={[
                                    { value: "retrofit", label: "Retrofit" },
                                    { value: "new", label: "New build" },
                                  ]}
                                  className="mt-1 w-full h-10 rounded-lg px-3 text-sm outline-none"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label
                                  htmlFor="state2"
                                  className="text-[12px] text-white/70"
                                >
                                  Province / Territory
                                </label>
                                <CompactSelect
                                  id="state2"
                                  ariaLabel="Province / Territory"
                                  value={stateCode}
                                  onChange={(v) => setStateCode(v)}
                                  options={[
                                    "AB",
                                    "BC",
                                    "MB",
                                    "NB",
                                    "NL",
                                    "NS",
                                    "NT",
                                    "NU",
                                    "ON",
                                    "PE",
                                    "QC",
                                    "SK",
                                    "YT",
                                  ].map((s) => ({ value: s, label: s }))}
                                  className="mt-1 w-full h-10 rounded-lg px-3 text-sm outline-none"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label
                                  htmlFor="city"
                                  className="text-[12px] text-white/70"
                                >
                                  City / Area
                                </label>
                                <input
                                  id="city"
                                  type="text"
                                  placeholder="e.g., Kelowna"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  className="mt-1 w-full h-10 rounded-lg border border-white/10 bg-black/20 backdrop-blur px-3 text-sm outline-none focus:border-white/20"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label
                                  htmlFor="postal2"
                                  className="text-[12px] text-white/70"
                                >
                                  Postal code (optional)
                                </label>
                                <input
                                  id="postal2"
                                  type="text"
                                  inputMode="text"
                                  placeholder="A1A 1A1"
                                  maxLength={7}
                                  value={postal}
                                  onChange={(e) =>
                                    setPostal(e.target.value.toUpperCase())
                                  }
                                  className="mt-1 w-full h-10 rounded-lg border border-white/10 bg-black/20 backdrop-blur px-3 text-sm outline-none focus:border-white/20"
                                />
                              </div>

                              {/* Row 3 (left): Extras */}
                              <div className="md:col-span-6">
                                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                                  <input
                                    id="outbuildings"
                                    type="checkbox"
                                    checked={outbuildings}
                                    onChange={(e) =>
                                      setOutbuildings(e.target.checked)
                                    }
                                    className="peer sr-only"
                                  />
                                  <span
                                    aria-hidden
                                    className="h-4 w-4 rounded-sm border border-white/20 bg-white/10 flex items-center justify-center transition-colors peer-checked:bg-black peer-checked:border-white/40 peer-checked:[&_svg]:opacity-100"
                                  >
                                    <svg
                                      className="h-3 w-3 text-white opacity-0 transition-opacity"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 12.086l6.793-6.793a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                  <span className="text-[12px] text-white/80">
                                    Include outbuildings (garage/barn)
                                  </span>
                                </label>
                              </div>

                              {/* Row 3 (right): Timeline */}
                              <div className="md:col-span-6">
                                <label
                                  htmlFor="timeline"
                                  className="text-[12px] text-white/70"
                                >
                                  Project timeline
                                </label>
                                <CompactSelect
                                  id="timeline"
                                  ariaLabel="Project timeline"
                                  value={timeline}
                                  onChange={(v) =>
                                    setTimeline(
                                      v as "asap" | "1-3" | "3-6" | "6+"
                                    )
                                  }
                                  options={[
                                    { value: "asap", label: "ASAP" },
                                    { value: "1-3", label: "1–3 months" },
                                    { value: "3-6", label: "3–6 months" },
                                    { value: "6+", label: "6+ months" },
                                  ]}
                                  className="mt-1 w-full h-10 rounded-lg border border-white/10 bg-black/20 backdrop-blur px-3 text-sm outline-none focus:border-white/20"
                                />
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: options-sized sidebar container hosting white receipt */}
                    <aside className="w-full md:flex-[1_1_0%] md:min-w-[280px]">
                      <div className="relative h-auto md:h-[80vh] rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-[0_0_1px_0_rgba(255,255,255,0.3),0_20px_80px_-20px_rgba(0,0,0,0.6)] md:overflow-hidden overflow-visible flex flex-col">
                        <div className="relative rounded-2xl border border-black/10 bg-white text-black p-5 md:p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] flex-1 flex flex-col overflow-hidden">
                          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <header className="flex flex-row justify-between w-full items-end mb-1">
                                  <p className="text-xs uppercase tracking-wider text-black/60">
                                    Rough estimate
                                  </p>
                                  <p className="rounded-xl border border-black/10 bg-black/5 px-2 py-1 text-[9px] text-black/80 capitalize">
                                    {currentProduct.name}
                                  </p>
                                </header>

                                <p className="mt-1 text-2xl font-semibold">
                                  {quote
                                    ? `$${Math.round(quote.low).toLocaleString()} - $${Math.round(quote.high).toLocaleString()}`
                                    : "—"}
                                </p>
                                <p className="mt-2 text-[12px] text-black/60 max-w-sm">
                                  Non-binding, for planning only. Prices in CAD.
                                  Final quote requires a site assessment.
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                              <div className="rounded-xl border border-black/10 bg-black/5 p-3">
                                <p className="text-black/60 text-xs">Levels</p>
                                <p className="mt-1 font-medium text-black">
                                  {levels}
                                </p>
                              </div>
                              <div className="rounded-xl border border-black/10 bg-black/5 p-3">
                                <p className="text-black/60 text-xs">
                                  Square footage
                                </p>
                                <p className="mt-1 font-medium text-black">
                                  {sqft.toLocaleString()} sq ft
                                </p>
                              </div>
                              <div className="rounded-xl border border-black/10 bg-black/5 p-3">
                                <p className="text-black/60 text-xs">
                                  Water source
                                </p>
                                <p className="mt-1 font-medium capitalize text-black">
                                  {waterSource}
                                </p>
                              </div>
                              <div className="rounded-xl border border-black/10 bg-black/5 p-3">
                                <p className="text-black/60 text-xs">
                                  Province / Territory
                                </p>
                                <p className="mt-1 font-medium text-black">
                                  {stateCode.toUpperCase()}
                                </p>
                              </div>
                              <div className="rounded-xl border border-black/10 bg-black/5 p-3">
                                <p className="text-black/60 text-xs">
                                  City / Area
                                </p>
                                <p className="mt-1 font-medium text-black">
                                  {city || "—"}
                                </p>
                              </div>
                              <div className="rounded-xl border border-black/10 bg-black/5 p-3">
                                <p className="text-black/60 text-xs">
                                  Postal code
                                </p>
                                <p className="mt-1 font-medium text-black">
                                  {postal || "—"}
                                </p>
                              </div>
                            </div>

                            <hr className="my-6 border-black/10" />
                            {/* Receipt-like breakdown */}
                            <div className="text-sm text-black h-48 md:h-56 overflow-y-auto pr-1">
                              {breakdownItems.map(
                                ({ key, label, amount, isBase }) => (
                                  <div
                                    key={key}
                                    className="flex items-center justify-between py-1"
                                  >
                                    <span className="text-black/70">
                                      {label}
                                    </span>
                                    <span className="text-black font-mono tabular-nums">
                                      {isBase ? "" : "+ "}$
                                      {Math.round(amount).toLocaleString()}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="flex items-center justify-between py-2 mt-2 border-t border-black/10">
                              <span className="font-medium text-black">
                                Estimated total
                              </span>
                              <span className="font-semibold font-mono tabular-nums text-black">
                                {quote
                                  ? `~ $${Math.round(quote.raw).toLocaleString()}`
                                  : "—"}
                              </span>
                            </div>

                            {/* <ul className="mb-4 mt-4 space-y-2 text-xs text-black/70">
                          <li className="flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />
                            Water source impacts pump/pressure equipment needs.
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />
                            Outbuildings add material and trenching costs.
                          </li>
                        </ul> */}
                            <p className="text-xs text-black/60">
                              Prices vary by site access, water supply, local
                              code requirements, and installation complexity.
                              Our team will follow up to refine this estimate.
                            </p>
                          </div>

                          {/* Actions at bottom of receipt */}
                          <div className="mt-6 pt-4 border-t border-black/10 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="cursor-pointer inline-flex w-44 items-center justify-center h-10 px-4 rounded-xl border border-black/10 bg-black/5 hover:bg-black/10 text-sm text-black transition-colors duration-300"
                            >
                              Back
                            </button>
                            <Link
                              href="/contact"
                              className="inline-flex w-full items-center justify-center h-10 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold text-white transition-colors duration-300"
                            >
                              Continue
                            </Link>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
