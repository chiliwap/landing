"use client";

import { motion, useMotionValueEvent, useSpring } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/modal";
const ContactForm = dynamic(() => import("@/components/forms/contact-form"), {
  ssr: false,
});
import { submitContact } from "@/components/forms/actions/contact";

type Point = { x: number; y: number; v: number };

export default function Features() {
  const [modalOpen, setModalOpen] = useState(false);

  // Chart constants
  const WIDTH = 900;
  const HEIGHT = 280;
  const M = 28; // margin
  const N = 64; // number of samples across the chart

  // Generate stable demo data (deterministic PRNG to avoid hydration mismatch)
  const values = useMemo(() => {
    // Linear congruential generator with fixed seed
    let seed = 1337 >>> 0;
    const rand = () =>
      (seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296;
    const arr: number[] = [];
    let base = 50;
    for (let i = 0; i < N; i++) {
      // smooth synthetic trend with slight upward drift
      const t = i / (N - 1);
      const wave =
        Math.sin(t * Math.PI * 2) * 8 + Math.cos(t * Math.PI * 4) * 4;
      base += 0.5 + (rand() - 0.5) * 0.8; // minor noise + drift (deterministic)
      arr.push(Math.max(10, base + wave));
    }
    return arr;
  }, []);

  const minV = useMemo(() => Math.min(...values), [values]);
  const maxV = useMemo(() => Math.max(...values), [values]);
  const denom = Math.max(1e-6, maxV - minV);
  const scaleX = (i: number) => M + (i / (N - 1)) * (WIDTH - 2 * M);
  const scaleY = (v: number) =>
    HEIGHT - M - ((v - minV) / denom) * (HEIGHT - 2 * M);

  const points: Point[] = useMemo(
    () => values.map((v, i) => ({ x: scaleX(i), y: scaleY(v), v })),
    [values, minV, maxV]
  );

  // Format numbers to fixed precision to avoid SSR/CSR float repr differences
  const fmt = (n: number) => Math.round(n * 1000) / 1000; // 3dp

  const pathD = useMemo(() => {
    // simple polyline path
    return points.reduce(
      (acc, p, i) =>
        i === 0
          ? `M ${fmt(p.x)} ${fmt(p.y)}`
          : `${acc} L ${fmt(p.x)} ${fmt(p.y)}`,
      ""
    );
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    const top = points.reduce(
      (acc, p, i) =>
        i === 0
          ? `M ${fmt(p.x)} ${fmt(p.y)}`
          : `${acc} L ${fmt(p.x)} ${fmt(p.y)}`,
      ""
    );
    const last = points[points.length - 1];
    const first = points[0];
    return `${top} L ${fmt(last.x)} ${fmt(HEIGHT - M)} L ${fmt(first.x)} ${fmt(
      HEIGHT - M
    )} Z`;
  }, [points]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0); // in viewBox coords (kept for potential future use)
  // Animate along the curve using a spring on the cumulative path length
  const cumLen = useMemo(() => {
    const arr: number[] = new Array(points.length).fill(0);
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      total += Math.hypot(dx, dy);
      arr[i] = total;
    }
    return arr;
  }, [points]);
  const totalLen = cumLen[cumLen.length - 1] || 0;
  const lenSpring = useSpring(0, { stiffness: 260, damping: 30 });
  const [animLen, setAnimLen] = useState<number | null>(null);
  useMotionValueEvent(lenSpring, "change", (v) => {
    setAnimLen(typeof v === "number" ? v : Number(v));
  });

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = svgRef.current;
    if (!el) return;
    // Map client coordinates to SVG viewBox space using inverse screen CTM
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const screenCTM = el.getScreenCTM?.();
    if (!screenCTM) return;
    const inv = screenCTM.inverse();
    const svgP = pt.matrixTransform(inv);
    const xVB = svgP.x; // viewBox X
    setMouseX(xVB);
    // Clamp to chart area and compute nearest index
    const clampedX = Math.max(M, Math.min(WIDTH - M, xVB));
    const step = (WIDTH - 2 * M) / (N - 1);
    const idx = Math.round((clampedX - M) / step);
    setHoverIdx(Math.max(0, Math.min(N - 1, idx)));
  };
  // Keep the last hover position instead of clearing on leave
  const onLeave = () => {};

  // When hover target changes, animate along the curve to that index&apos;s path length
  useEffect(() => {
    if (hoverIdx == null) return;
    const targetLen = cumLen[hoverIdx] ?? 0;
    if (animLen == null) {
      // first time: jump to the target without sweeping the whole path
      lenSpring.set(targetLen);
      setAnimLen(targetLen);
    } else {
      lenSpring.set(targetLen);
    }
  }, [hoverIdx, cumLen]);

  // Interpolate a point on the polyline at a given length
  const animPoint = useMemo(() => {
    if (animLen == null || points.length === 0) return null;
    const L = Math.max(0, Math.min(totalLen, animLen));
    // find segment
    let i = 1;
    while (i < cumLen.length && cumLen[i] < L) i++;
    if (i >= points.length) return points[points.length - 1];
    const L0 = cumLen[i - 1] || 0;
    const segLen = (cumLen[i] || 0) - L0 || 1;
    const t = Math.max(0, Math.min(1, (L - L0) / segLen));
    const p0 = points[i - 1];
    const p1 = points[i];
    return {
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t,
      v: p0.v + (p1.v - p0.v) * t,
    } as Point;
  }, [animLen, points, cumLen, totalLen]);

  const hoverPoint = animPoint; // render at animated point along the curve
  const hoverValue = animPoint?.v ?? null; // animate tooltip value with the guide
  // Fixed ticks: every 10°C starting at 55°C within visible range
  const ticks = useMemo(() => {
    const BASE = 55;
    const STEP = 10;
    const start = Math.max(BASE, Math.ceil(minV / STEP) * STEP);
    const end = Math.ceil(maxV / STEP) * STEP;
    const out: number[] = [];
    for (let t = start; t <= end; t += STEP) out.push(t);
    return out;
  }, [minV, maxV]);
  // Tooltip positioning near the point with simple edge clamping
  const tooltip = useMemo(() => {
    if (!hoverPoint || hoverValue == null) return null;
    const approxW = 72; // px in viewBox units (viewBox is px-like here)
    const approxH = 24;
    // Keep tooltip centered on the guide horizontally so it "sticks" to it.
    const x = hoverPoint.x - approxW / 2;
    // Prefer above the point; if too close to top margin, place below.
    let y = hoverPoint.y - approxH - 8;
    if (y < M) y = hoverPoint.y + 12;
    // Show continuous value with one decimal place between 10°C ticks
    const celsius = hoverValue;
    return { x, y, text: `${celsius.toFixed(1)}°C` };
  }, [hoverPoint, hoverValue]);

  return (
    <section className="text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.48, 0.15, 0.25, 0.96] }}
          className="text-center mb-12"
        >
          <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium text-white/70 ring-1 ring-white/15 bg-white/5">
            Features
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
            Get In-The-Know
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            Real-time wildfire intelligence—see risk trends and system readiness
            as you move across the timeline.
          </p>
        </motion.div>

        {/* interactive chart card (full-bleed on mobile) */}
        <div className="md:h-auto h-72 relative border border-white/10 bg-neutral-950/50 backdrop-blur-md px-2 md:p-6 -mx-4 md:mx-0 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden rounded-2xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          {/* background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 hidden md:block"
            style={{
              background:
                "radial-gradient(700px 380px at 50% 50%, rgba(251,146,60,0.08), transparent 60%), radial-gradient(1100px 600px at 50% 50%, rgba(239,68,68,0.05), transparent 70%)",
            }}
          />
          {/* top-left context blurb */}
          <div className="absolute top-2 left-4 z-10 flex items-center gap-2 text-[11px] text-white/80 sm:text-xs pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              Controllers: tracking temp & humidity
            </span>
            <span className="hidden md:inline text-white/60">
              Auto-responds when conditions turn hot and dry.
            </span>
          </div>

          <div className="relative">
            <svg
              ref={svgRef}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="w-full h-[420px] sm:h-[300px] md:h-[320px] touch-none select-none -mt-12 md:mt-0"
              role="img"
              aria-label="Interactive trend chart"
            >
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>
                <clipPath id="reveal" clipPathUnits="userSpaceOnUse">
                  <rect
                    x={M}
                    y={M}
                    width={WIDTH - 2 * M}
                    height={HEIGHT - 2 * M}
                    rx={6}
                  />
                </clipPath>
              </defs>

              {/* grid: fixed horizontal lines every 10°C from 55°C, with labels */}
              <g opacity="0.35">
                {ticks.map((val) => {
                  const y = scaleY(val);
                  return (
                    <line
                      key={`gy-${val}`}
                      x1={M}
                      y1={y}
                      x2={WIDTH - M}
                      y2={y}
                      stroke="#ffffff"
                      strokeOpacity={0.08}
                    />
                  );
                })}
                {ticks.map((val) => {
                  const y = scaleY(val);
                  return (
                    <text
                      key={`gt-${val}`}
                      x={M - 10}
                      y={y}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      fill="#ffffff"
                      fillOpacity={0.5}
                      fontSize={11}
                    >
                      {`${val}°C`}
                    </text>
                  );
                })}
              </g>

              {/* area under curve (no clipPath for Safari robustness) */}
              <path d={areaD} fill="url(#area)" />

              {/* trend line (static for Safari compatibility) */}
              <path d={pathD} stroke="url(#line)" strokeWidth={3} fill="none" />

              {/* hover guide (persists; follows curve exactly) */}
              {hoverPoint && (
                <g>
                  <line
                    x1={hoverPoint.x}
                    y1={M}
                    x2={hoverPoint.x}
                    y2={HEIGHT - M}
                    stroke="#ffffff"
                    strokeOpacity={0.25}
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={hoverPoint.x}
                    cy={hoverPoint.y}
                    r={6}
                    fill="#fff"
                  />
                  <circle
                    cx={hoverPoint.x}
                    cy={hoverPoint.y}
                    r={14}
                    fill="#ffffff"
                    fillOpacity={0.12}
                  />
                  {/* tooltip near point (animated with guide) */}
                  {tooltip && (
                    <motion.g
                      initial={false}
                      animate={{ x: tooltip.x, y: tooltip.y }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 30,
                      }}
                    >
                      <rect
                        width={72}
                        height={24}
                        rx={6}
                        fill="#000000"
                        fillOpacity={0.95}
                        stroke="#ffffff"
                        strokeOpacity={0.15}
                      />
                      <text
                        x={36}
                        y={16}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                        fontWeight={600}
                      >
                        {tooltip.text}
                      </text>
                    </motion.g>
                  )}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* small feature bullets (wildfire-focused) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Ember Storm Shield",
              desc: "Automated soaking routines to defend eaves, vents, and perimeters when embers arrive.",
            },
            {
              title: "Proactive Risk Alerts",
              desc: "Get notified as conditions escalate so you can activate earlier and protect sooner.",
            },
            {
              title: "Whole-Home Coverage",
              desc: "From impact sprinklers to under-soffit soaking, scale protection for your property.",
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-neutral-950/50 p-5 backdrop-blur-md [box-shadow:inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <h3 className="text-base font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-white/70">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* KPI stats row (wildfire outcomes) */}
        <motion.div
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: {} }}
        >
          {[
            { label: "Faster Activation", value: "3.2x" },
            { label: "Water Saved", value: "-35%" },
            { label: "During Outages Uptime", value: "99.9%" },
            { label: "Home Risk Reduced", value: "-42%" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-neutral-950/40 p-4"
            >
              <div className="text-2xl font-semibold">{kpi.value}</div>
              <div className="text-xs text-white/60 mt-1">{kpi.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* progress bars to hint outcomes (wildfire protection) */}
        <motion.div
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: {} }}
        >
          {[
            { label: "Perimeter Soak Readiness", pct: 94 },
            { label: "Wildfire Risk Detection", pct: 98 },
          ].map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-neutral-950/40 p-4"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">{p.label}</span>
                <span className="text-white/60">{p.pct}%</span>
              </div>
              <div className="mt-2 h-2 rounded bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-white/40"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${p.pct}%` }}
                  transition={{ duration: 0.7, delay: 0.1 * i }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* testimonial + CTA (home protection) */}
        <motion.div
          className="mt-6 rounded-2xl border border-white/10 bg-neutral-950/50 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex-1">
            <p className="text-white/80 text-sm md:text-base">
              “During ember storms we can pre-soak our eaves and perimeter in
              seconds. It’s the first time we’ve felt truly prepared to protect
              our home.”
            </p>
            <div className="mt-2 text-xs text-white/50">
              — Homeowner, West Kelowna
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-white/15 text-white px-4 py-2 text-sm hover:border-white/25 hover:bg-white/5 transition-colors"
          >
            Talk to an expert
          </button>
        </motion.div>
      </div>
      {/* Contact Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4 text-center">Contact</h2>
        <ContactForm action={submitContact} selectedTier={""} />
      </Modal>
    </section>
  );
}
