export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__inner">
        <h1>Rebecca Lai</h1>
        <p className="hero__title">Software Engineer</p>
        <ul className="hero__links">
          <li>
            <a href="/images/RebeccaLai_Resume_2026.pdf" download="RebeccaLai_Resume">
              Resume
            </a>
          </li>
          <li>
            <a href="mailto:rlambert.w@gmail.com">Email</a>
          </li>
          <li>
            <a href="https://github.com/rebeccalambert" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/rebeccajlambert/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
