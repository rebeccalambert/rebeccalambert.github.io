import { profileLinks } from '../data/content';

/** Resume / Email / GitHub / LinkedIn — shared by the classic hero and the Play mode profile card. */
export default function ProfileLinks({ className, linkClassName }: { className: string; linkClassName?: string }) {
  return (
    <ul className={className}>
      {profileLinks.map(({ label, href, download, external }) => (
        <li key={label}>
          <a
            href={href}
            className={linkClassName}
            download={download}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
