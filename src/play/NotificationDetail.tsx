import { useRef } from 'react';
import EvalTable from '../components/EvalTable';
import { clauseCheckEvalResults } from '../data/content';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import type { NotificationDetail as Detail } from './notifications';

/** The row that tells the "fix" story — highlighted once the rows land. */
const AFTER_FIX_ROW = 2;

export default function NotificationDetail({
  id,
  detail,
  expanded,
}: {
  id: string;
  detail: Detail;
  expanded: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // On open: content fades up; for ClauseCheck the eval rows land one by one
  // and the "after prompt fix" row gets a highlight sweep.
  useGSAP(
    () => {
      if (!expanded) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.from('.note__detail-body > *', { autoAlpha: 0, y: -8, duration: 0.3, stagger: 0.06 });
        if (ref.current?.querySelector('.eval-table')) {
          tl.from('.eval-table tbody tr', { autoAlpha: 0, x: -16, duration: 0.3, stagger: 0.18 }, '<0.1').fromTo(
            `.eval-table tbody tr:nth-child(${AFTER_FIX_ROW})`,
            { backgroundColor: 'rgb(191 240 220 / 0)' },
            { backgroundColor: 'rgb(191 240 220 / 1)', duration: 0.5, ease: 'power2.out' },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [expanded], revertOnUpdate: true },
  );

  return (
    <div id={id} ref={ref} className="note__detail" hidden={!expanded}>
      <div className="note__detail-body">
        {detail.kind === 'story' ? <p>{detail.story.body}</p> : <ProjectBody detail={detail} />}
      </div>
    </div>
  );
}

function ProjectBody({ detail }: { detail: Extract<Detail, { kind: 'project' }> }) {
  const { name, description, stack, repoUrl, demoUrl, demoDisabledReason, screenshot, note } = detail.project;

  return (
    <>
      <p>{description}</p>
      {name === 'ClauseCheck' && <EvalTable rows={clauseCheckEvalResults} caption="ClauseCheck eval results" />}
      {screenshot && (
        <img
          className="note__screenshot"
          src={screenshot.src}
          alt={screenshot.alt}
          width={screenshot.width}
          height={screenshot.height}
          loading="lazy"
          decoding="async"
        />
      )}
      <p className="note__stack">{stack}</p>
      {note && <p className="note__note">{note}</p>}
      <ul className="note__links">
        <li>
          <a className="is-interactive" href={repoUrl} target="_blank" rel="noreferrer">
            Code
          </a>
        </li>
        {demoUrl && (
          <li>
            <a className="is-interactive" href={demoUrl} target="_blank" rel="noreferrer">
              Demo
            </a>
          </li>
        )}
        {!demoUrl && demoDisabledReason && (
          <li>
            <span className="note__demo-off">{demoDisabledReason}</span>
          </li>
        )}
      </ul>
    </>
  );
}
