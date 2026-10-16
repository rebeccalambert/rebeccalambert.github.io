// GSAP plugins used only by Play mode. Registered here, inside the lazy Play
// chunk, so the classic page never downloads them.
import { Flip } from 'gsap/Flip';
import { gsap } from '../lib/gsap';

gsap.registerPlugin(Flip);

export { Flip };
