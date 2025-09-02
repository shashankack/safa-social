import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedLogo
 * Random per-section *fill* animation (no strokes) + optional radial mode.
 *
 * Modes:
 *  - "radial": fill expands from the center outward using a circular mask
 *  - "random": each path is *filled* via a directional wipe (mask) in a random
 *               direction and stagger (not just fading opacity)
 *
 * Props
 *  - color: fill color of the logo (default: "#fff")
 *  - size: width of the SVG in px (height auto via viewBox) (default: 220)
 *  - speed: base duration in seconds (default: 1.4)
 *  - mode: "radial" | "random" (default: "radial")
 *  - seed: number to stabilize random ordering/timings when mode="random"
 */
const AnimatedLogo = ({
  color = "#fff",
  size = 220,
  speed = 1.4,
  mode = "radial",
  seed,
}) => {
  const vw = 165.52;
  const vh = 159.21;
  const cx = vw / 2;
  const cy = vh / 2;
  const maxR = Math.hypot(cx, cy);

  // Source paths from your SVG
  const pathD = [
    "M42.12,48.73c-3.04,5.56-6.03,11.02-9.02,16.47.28.18.55.35.83.53,1.87-1.1,3.72-2.26,5.63-3.3,17.56-9.56,32.65-7.88,47.57,5.48,5.23,4.68,10.13,9.73,15.31,14.47,2.28,2.08,4.71,4.14,7.4,5.61,8.37,4.56,16.98-.03,18.19-9.49,1.92-15-8.12-27.44-23.33-28.35-8.3-.5-16.64-.15-24.96-.32-13.5-.28-26.86-1.64-39.43-6.99-3.25-1.38-6.35-3.5-8.96-5.89-4.1-3.78-5.04-9.05-2.02-13.69,2.62-4.03,5.89-7.99,9.72-10.81C51.47,3.3,65.49-1.36,81.08.35c13.03,1.43,21.26,9.3,23.25,22.23.78,5.07.49,10.3.71,16.13-17.77-9.36-34.49-8.93-51.66.85,8.96,3.5,17.57,5.26,26.44,4.91,8.91-.35,17.79-1.33,26.68-1.99,12.79-.95,25.3.28,37.06,5.69,12.31,5.65,20.41,14.78,21.78,28.73,1.91,19.31-12.04,38.1-30.15,40.74-10.23,1.49-19.18-1.89-27.37-7.72-9.81-6.99-16.99-16.36-23.47-26.35-4.13-6.37-9.04-12.02-15.59-16.06-10.19-6.29-22.1-5.36-32.23,2.6-4.41,3.46-8.51,7.37-13.15,10.47-3,2-6.62,3.39-10.16,4.17-5.78,1.28-10.49-1.53-12.16-7.19-3.07-10.41.83-19.2,7.56-26.8,6.12-6.91,13.94-9.97,23.28-7.84,4.06.93,7.92,3.24,10.22,5.83Z",
    "M73.21,128.89c-4.62,10.24-16.77,17.44-28.66,16.35-16.15-1.48-28.14-9.8-35.05-24.41-7.23-15.28,1.21-33.55,17.46-38.02,11.26-3.09,22.52-2.63,32.69,4.09,5.11,3.38,8.63,8.29,11.81,13.46,2.83,4.61,5.55,9.32,8.78,13.63,2,2.67,4.66,5,7.41,6.91,6.68,4.64,13.35,3.7,19.87-.69,4.93-3.32,4.97-3.23,8.92,1.39,3.64,4.26,6.39,8.98,7.55,14.52,1.82,8.62-1.32,16.96-7.82,20.86-6.47,3.88-14.72,2.61-21.66-3.32-7.46-6.37-11.71-14.81-15.66-23.57-4.36-9.66-8.85-19.31-14.12-28.47-2.51-4.36-6.51-8.23-10.65-11.18-6.74-4.79-14.3-1.17-15.87,6.96-1.15,5.96,1.27,10.77,5.02,15.12,7.21,8.37,16.38,13.35,27.08,15.71.94.21,1.89.43,2.87.65Z",
  ];

  // Random utilities for per-path masks
  const randomSpec = useMemo(() => {
    if (mode !== "random") return [];
    let s = typeof seed === "number" ? seed : Math.floor(Math.random() * 1e9);
    const rng = () => {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      return (s >>> 0) / 0xffffffff;
    };
    // Create randomized direction + timing per path
    return pathD
      .map((_, i) => ({
        angle: rng() * 360 - 180, // -180..180 degrees
        delay: (i + rng()) * (speed * 0.25),
        dur: speed * (0.6 + rng() * 0.6), // 0.6x..1.2x of base speed
        orderKey: rng(),
      }))
      .sort((a, b) => a.orderKey - b.orderKey); // shuffle reveal order
  }, [mode, seed, speed]);

  return (
    <motion.svg
      width={size}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Safa logo with fill animation"
      style={{ display: "block" }}
    >
      <defs>
        {mode === "radial" && (
          <mask id="radial-fill-mask">
            <rect x="0" y="0" width={vw} height={vh} fill="black" />
            <motion.circle
              cx={cx}
              cy={cy}
              r={0}
              fill="white"
              animate={{ r: maxR }}
              transition={{ duration: speed, ease: "easeInOut" }}
            />
          </mask>
        )}

        {mode === "random" &&
          randomSpec.map((spec, i) => (
            <mask id={`rand-mask-${i}`} key={`mask-${i}`}>
              {/* hidden background */}
              <rect x="0" y="0" width={vw} height={vh} fill="black" />
              {/* directional wipe: a full-viewport rect that scales from center */}
              <motion.rect
                x={0}
                y={0}
                width={vw}
                height={vh}
                fill="white"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "50% 50%",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1, rotate: spec.angle }}
                transition={{
                  duration: spec.dur,
                  delay: spec.delay,
                  ease: "easeInOut",
                }}
              />
            </mask>
          ))}
      </defs>

      {/* Fills */}
      <g
        id="Layer_1-2"
        data-name="Layer_1"
        mask={mode === "radial" ? "url(#radial-fill-mask)" : undefined}
        style={{ color }}
      >
        {mode === "random" ? (
          // Each path is revealed by its own mask (wipe) instead of opacity fade
          randomSpec.map((_, i) => (
            <g key={`p-${i}`} mask={`url(#rand-mask-${i})`}>
              <path fill="currentColor" d={pathD[i]} />
            </g>
          ))
        ) : (
          <g>
            <path fill="currentColor" d={pathD[0]} />
            <path fill="currentColor" d={pathD[1]} />
          </g>
        )}
      </g>

      {/* Optional ultra-subtle breathing after reveal */}
      <motion.g
        style={{ color, pointerEvents: "none" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.08, 0] }}
        transition={{
          duration: speed * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <g>
          <path fill="currentColor" d={pathD[0]} />
          <path fill="currentColor" d={pathD[1]} />
        </g>
      </motion.g>
    </motion.svg>
  );
};

export default AnimatedLogo;
