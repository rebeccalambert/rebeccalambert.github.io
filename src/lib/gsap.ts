import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

// Core only. Plugins Play mode needs are registered in src/play/gsapPlugins.ts
// so they ship in the lazy Play chunk, not the classic bundle.
gsap.registerPlugin(useGSAP);

/**
 * Wrap every animation in `gsap.matchMedia().add(MOTION_OK, ...)` so users who
 * ask for reduced motion get the final state instantly instead of a tween.
 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export function prefersMotion(): boolean {
  return window.matchMedia(MOTION_OK).matches;
}

export { gsap, useGSAP };
