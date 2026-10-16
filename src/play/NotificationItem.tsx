import NotificationDetail from './NotificationDetail';
import { CATEGORY_ICONS, type PlayNotification } from './notifications';

export default function NotificationItem({
  notification,
  hidden,
  unread,
  expanded,
  onToggle,
  onRead,
}: {
  notification: PlayNotification;
  hidden: boolean;
  /** Live read state from the feed (notification.unread is only the starting value). */
  unread: boolean;
  expanded: boolean;
  onToggle: (id: string) => void;
  onRead: (id: string) => void;
}) {
  const { id, category, title, body, meta, detail } = notification;
  const detailId = `${id}-detail`;

  // Spans (not <p>) because this content sits inside a <button> when the row
  // is expandable, and buttons only allow phrasing content.
  const rowContent = (
    <>
      <span className="note__icon" aria-hidden="true">
        {CATEGORY_ICONS[category]}
      </span>
      <span className="note__text">
        <span className="note__line">
          <strong>{title}</strong>
          {body && ` — ${body}`}
        </span>
        <span className="note__meta">{meta}</span>
      </span>
      <span className="note__end">
        {unread && (
          <span className="note__dot">
            <span className="visually-hidden">Unread</span>
          </span>
        )}
        {detail && (
          <span className="note__chevron" aria-hidden="true">
            ▾
          </span>
        )}
      </span>
    </>
  );

  return (
    <li
      className={unread ? 'note note--unread' : 'note'}
      data-id={id}
      data-category={category}
      data-expanded={expanded || undefined}
      hidden={hidden}
    >
      {detail ? (
        <>
          <button
            type="button"
            className="note__row note__row--button"
            aria-expanded={expanded}
            aria-controls={detailId}
            onClick={() => {
              onToggle(id);
              onRead(id);
            }}
          >
            {rowContent}
          </button>
          <NotificationDetail id={detailId} detail={detail} expanded={expanded} />
        </>
      ) : (
        <div className="note__row">{rowContent}</div>
      )}
    </li>
  );
}
