import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Wrap every animation in `gsap.matchMedia().add(MOTION_OK, ...)` so users who
 * ask for reduced motion get the final state instantly instead of a tween.
 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export function prefersMotion(): boolean {
  return window.matchMedia(MOTION_OK).matches;
}

export { gsap, ScrollTrigger, useGSAP };
