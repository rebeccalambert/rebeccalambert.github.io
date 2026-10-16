import ProfileLinks from '../components/ProfileLinks';

export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__inner">
        <h1>Rebecca Lai</h1>
        <p className="hero__title">Software Engineer</p>
        <ProfileLinks className="hero__links" />
      </div>
    </section>
  );
}
