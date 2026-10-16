import '@fontsource/fredoka/latin-600.css';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-700.css';
import './play.css';
import { useRef } from 'react';
import ProfileLinks from '../components/ProfileLinks';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import Feed from './Feed';

export default function PlayMode() {
  const layoutRef = useRef<HTMLDivElement>(null);

  // Entrance: profile card slides in from the left, then the feed rises up.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'back.out(1.6)', duration: 0.6 } })
          .from('.play-profile', { autoAlpha: 0, x: -40, rotation: -3 })
          .from('.play-feed', { autoAlpha: 0, y: 40 }, '<0.12');
      });
      return () => mm.revert();
    },
    { scope: layoutRef },
  );

  return (
    <div className="play-layout" ref={layoutRef}>
      <aside className="play-profile" aria-label="About Rebecca">
        <img className="play-profile__photo" src="/images/me.webp" alt="Portrait of Rebecca Lai" width={381} height={420} />
        <h1>Rebecca Lai</h1>
        <p className="play-profile__title">Software Engineer</p>
        <ProfileLinks className="play-profile__links" linkClassName="is-interactive" />
      </aside>

      <Feed />
    </div>
  );
}
