import type { EvalRow } from '../data/content';

export default function EvalTable({ rows, caption }: { rows: EvalRow[]; caption: string }) {
  return (
    <table className="eval-table">
      <caption className="eval-table__caption">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Check</th>
          <th scope="col">Result</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.check}>
            <th scope="row">{row.check}</th>
            <td>{row.result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
