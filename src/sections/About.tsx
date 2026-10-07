export default function About() {
  return (
    <section className="about" aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      <div className="about__inner">
        <img className="about__photo" src="/images/me.jpg" alt="Portrait of Rebecca Lai" />
        <p>
          Frontend engineer, formerly at LinkedIn (Notifications) and Pilotly. I build React and TypeScript
          interfaces with accessibility and testing built in, and I like working close to the people who use
          them. Based in the Chicago area.
        </p>
      </div>
    </section>
  );
}
