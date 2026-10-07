export default function Contact() {
  return (
    <section className="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact</h2>
      <ul className="contact__list">
        <li>
          <a href="mailto:rlambert.w@gmail.com">rlambert.w@gmail.com</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/rebeccajlambert/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://github.com/rebeccalambert" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href="/images/RebeccaLai_Resume_2026.pdf" download="RebeccaLai_Resume">
            Resume (PDF)
          </a>
        </li>
      </ul>
    </section>
  );
}
