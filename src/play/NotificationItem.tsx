import { CATEGORY_ICONS, type PlayNotification } from './notifications';

export default function NotificationItem({
  notification,
  hidden,
}: {
  notification: PlayNotification;
  hidden: boolean;
}) {
  const { category, title, body, meta, unread } = notification;

  return (
    <li className={unread ? 'note note--unread' : 'note'} data-category={category} hidden={hidden}>
      <span className="note__icon" aria-hidden="true">
        {CATEGORY_ICONS[category]}
      </span>
      <div className="note__text">
        <p>
          <strong>{title}</strong>
          {body && ` — ${body}`}
        </p>
        <p className="note__meta">{meta}</p>
      </div>
      {unread && (
        <span className="note__dot">
          <span className="visually-hidden">Unread</span>
        </span>
      )}
    </li>
  );
}
