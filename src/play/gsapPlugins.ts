// GSAP plugins used only by Play mode. Registered here, inside the lazy Play
// chunk, so the classic page never downloads them.
import { Draggable } from 'gsap/Draggable';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { gsap } from '../lib/gsap';

gsap.registerPlugin(Flip, Draggable, InertiaPlugin, MotionPathPlugin, DrawSVGPlugin);

export { Draggable, Flip };
