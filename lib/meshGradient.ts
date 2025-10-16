import type { CSSProperties } from "react";

// Seeded mesh gradient utilities
export function mulberry32(seed: number) {
    let t = seed >>> 0;
    return function () {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

export function hashSeed(str: string) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0;
}

export function hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
        Math.round(255 * f(0)),
        Math.round(255 * f(8)),
        Math.round(255 * f(4)),
    ] as const;
}

export function rgbaFromHsl(h: number, s: number, l: number, a: number) {
    const [r, g, b] = hslToRgb(h, s, l);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(min, Math.min(max, num));
}

export function generateMeshStyleFromSeed(
    seedStr: string,
): CSSProperties & Record<`--${string}`, string | number> {
    const seed = hashSeed(seedStr.replace(/\D/g, ""));
    const rand = mulberry32(seed || 1);

    // Choose a color family near a base hue and keep tones dark so white text pops
    const families = [
        "red",
        "orange",
        "amber",
        "magenta",
        "purple",
        "indigo",
        "blue",
        "cyan",
        "teal",
        "green",
    ] as const;
    type Family = typeof families[number];
    const family: Family = families[Math.floor(rand() * families.length)];
    const baseHueMap: Record<Family, number> = {
        red: 0,
        orange: 20,
        amber: 35,
        magenta: 315,
        purple: 280,
        indigo: 245,
        blue: 220,
        cyan: 195,
        teal: 170,
        green: 140,
    };

    // Keep the family tight with a small wobble
    const baseHue = baseHueMap[family] + (rand() - 0.5) * 8; // ±4° wobble
    const hueSpread = 16; // compact spread to remain in-family
    const hues = Array.from({ length: 4 }, (_, i) => {
        const shift = (i + 1) * (hueSpread / 4) * (rand() * 1.4 - 0.7);
        return (baseHue + shift + 360) % 360;
    });

    // Base saturation per family (kept in a controlled range)
    const baseSatMap: Record<Family, number> = {
        red: 76,
        orange: 72,
        amber: 70,
        magenta: 74,
        purple: 70,
        indigo: 66,
        blue: 68,
        cyan: 64,
        teal: 66,
        green: 72,
    };
    const baseSat = baseSatMap[family];
    const sats = [
        clamp(baseSat + rand() * 8, 58, 88),
        clamp(baseSat - 2 + rand() * 10, 56, 88),
        clamp(baseSat - 4 + rand() * 10, 54, 86),
        clamp(baseSat - 6 + rand() * 10, 54, 84),
    ];

    // Dark lightness ranges tailored per family to keep white text readable
    const darkRangeMap: Record<Family, [number, number]> = {
        red: [32, 50],
        orange: [32, 50],
        amber: [32, 48],
        magenta: [34, 52],
        purple: [36, 54],
        indigo: [36, 54],
        blue: [36, 54],
        cyan: [34, 52],
        teal: [34, 52],
        green: [34, 52],
    };
    const [darkMin, darkMax] = darkRangeMap[family];
    const lights = [
        clamp(darkMin + rand() * (darkMax - darkMin), darkMin, darkMax),
        clamp(darkMin + rand() * (darkMax - darkMin), darkMin, darkMax),
        clamp(darkMin - 2 + rand() * (darkMax - darkMin), darkMin - 2, darkMax),
        clamp(darkMin + 2 + rand() * (darkMax - darkMin), darkMin + 2, darkMax),
    ];

    const alphas = [0.52, 0.5, 0.45, 0.38].map((a) =>
        clamp(a + (rand() - 0.5) * 0.08, 0.28, 0.65)
    );

    const colors = hues.map((h, i) =>
        rgbaFromHsl(h, sats[i], lights[i], alphas[i])
    );

    // Seeded centers near quadrants; avoid center
    const p = (min: number, max: number) =>
        clamp(min + rand() * (max - min), min, max);
    const c1 = { x: p(16, 30), y: p(18, 34) };
    const c2 = { x: p(66, 82), y: p(16, 30) };
    const c3 = { x: p(28, 42), y: p(70, 86) };
    const c4 = { x: p(72, 88), y: p(64, 82) };

    // Animation characteristics seeded from last4
    const duration = 10 + Math.floor(rand() * 7); // 10s..16s
    const direction = rand() < 0.5
        ? ("alternate" as const)
        : ("alternate-reverse" as const);
    const delay = -(Math.round(rand() * 300) / 100); // -0.00s .. -3.00s

    return {
        // Provide seeded CSS variables for positions
        "--r1x": `${c1.x}%`,
        "--r1y": `${c1.y}%`,
        "--r2x": `${c2.x}%`,
        "--r2y": `${c2.y}%`,
        "--r3x": `${c3.x}%`,
        "--r3y": `${c3.y}%`,
        "--r4x": `${c4.x}%`,
        "--r4y": `${c4.y}%`,

        // Provide seeded colors
        "--r1c": colors[0],
        "--r2c": colors[1],
        "--r3c": colors[2],
        "--r4c": colors[3],

        // Seed animation controls (overrides defaults in CSS)
        animationDuration: `${duration}s`,
        animationDirection: direction,
        animationDelay: `${delay}s`,
    } as CSSProperties & Record<`--${string}`, string | number>;
}
