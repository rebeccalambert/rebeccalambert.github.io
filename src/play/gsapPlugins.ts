// GSAP plugins used only by Play mode. Registered here, inside the lazy Play
// chunk, so the classic page never downloads them.
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { gsap } from '../lib/gsap';

gsap.registerPlugin(Flip, Draggable, InertiaPlugin);

export { Draggable, Flip };
