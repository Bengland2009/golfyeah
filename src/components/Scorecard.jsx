import { Fragment } from 'react';
import { scoreColor } from '../lib/scoring';

// A real scorecard, not a spreadsheet: the hole-by-hole grid is a supporting
// detail, so it stays small and muted while the player's name/total/+/- (the
// numbers people actually scan for) get weight, size and a tinted column to
// anchor the eye. The Total/+/- band uses the same subtle brand-tinted wash
// on every row (header included) so it reads as one continuous column even
// while the hole cells scroll underneath it.
const HIGHLIGHT_BG = 'rgba(0, 103, 71, 0.06)';

function labelCell(bg, extra) {
  return {
    position: 'sticky', left: 0, zIndex: 1, background: bg,
    padding: '7px 10px 7px 2px', textAlign: 'left', whiteSpace: 'nowrap',
    ...extra,
  };
}
function numCell(bg, extra) {
  return { padding: '7px 6px', textAlign: 'center', background: bg, ...extra };
}

export default function Scorecard({
  holes, pars, players, scores, putts,
  editable = false, onScoreChange, onPuttClick, onParClick,
}) {
  const range = Array.from({ length: holes }, (_, i) => i);
  const parKnown = pars.every((p) => p != null);
  const parTotal = pars.reduce((a, p) => a + (p || 0), 0);

  const totalFor = (pid) => scores[pid].reduce((a, v) => a + (Number(v) || 0), 0);
  const isComplete = (pid) => parKnown && scores[pid].every((v) => v !== '' && v != null && Number(v) > 0);

  const border = '1px solid var(--border-default)';

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border, background: '#fff' }}>
      <table style={{ borderCollapse: 'collapse', font: 'var(--text-small)', width: '100%' }}>
        <tbody>
          {/* Header: hole numbers, muted eyebrow style */}
          <tr>
            <td style={{ ...labelCell('#fff'), borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)', font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase' }}>
              Trou
            </td>
            {range.map((h) => (
              <td key={h} style={{ ...numCell('#fff'), borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, minWidth: 28 }}>
                {h + 1}
              </td>
            ))}
            <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)', font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', minWidth: 44 }}>
              Total
            </td>
            <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)', font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', minWidth: 40 }}>
              +/−
            </td>
          </tr>

          {/* Par: the reference row, visually distinct with a light wash */}
          <tr>
            <td style={{ ...labelCell('var(--surface-tint)'), borderBottom: '1px solid var(--border-default)', fontWeight: 700, color: 'var(--text-body)' }}>
              Par
            </td>
            {range.map((h) => (
              <td key={h} style={{ ...numCell('var(--surface-tint)'), borderBottom: '1px solid var(--border-default)', fontWeight: 700 }}>
                {editable ? (
                  pars[h] != null ? (
                    <span onClick={() => onParClick?.(h)} style={{ cursor: 'pointer' }}>{pars[h]}</span>
                  ) : (
                    <span
                      onClick={() => onParClick?.(h)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 20,
                        borderRadius: 6, border: '1px dashed var(--brand-action)', color: 'var(--brand-action)',
                        fontWeight: 700, cursor: 'pointer', fontSize: 12,
                      }}
                    >
                      ?
                    </span>
                  )
                ) : (pars[h] ?? '–')}
              </td>
            ))}
            <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: '1px solid var(--border-default)', fontWeight: 700 }}>
              {parKnown ? parTotal : '–'}
            </td>
            <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: '1px solid var(--border-default)' }} />
          </tr>

          {players.map((player, idx) => {
            const complete = isComplete(player.id);
            const total = totalFor(player.id);
            const diff = complete ? total - parTotal : null;
            const hasPutts = putts && putts[player.id];
            const isLast = idx === players.length - 1;
            const sectionBorder = isLast ? 'none' : '1px solid var(--border-default)';

            return (
              <Fragment key={player.id}>
                <tr>
                  <td style={{ ...labelCell('#fff'), borderBottom: hasPutts ? 'none' : sectionBorder, paddingTop: 10, fontWeight: 700, fontSize: 15, color: 'var(--text-body)' }}>
                    {player.name}
                  </td>
                  {range.map((h) => (
                    <td key={h} style={{ ...numCell('#fff'), borderBottom: hasPutts ? 'none' : sectionBorder, paddingTop: 10 }}>
                      {editable ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={scores[player.id][h]}
                          onChange={(e) => onScoreChange?.(player.id, h, e.target.value)}
                          style={{ width: 28, height: 28, textAlign: 'center', border: '1px solid var(--border-default)', borderRadius: 6, font: 'var(--text-small)', padding: 0, outline: 'none' }}
                        />
                      ) : (
                        <span style={{ fontWeight: 500 }}>{scores[player.id][h] ?? '–'}</span>
                      )}
                    </td>
                  ))}
                  <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: hasPutts ? 'none' : sectionBorder, paddingTop: 10, fontWeight: 700, fontSize: 15 }}>
                    {complete ? total : '—'}
                  </td>
                  <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: hasPutts ? 'none' : sectionBorder, paddingTop: 10, fontWeight: 700, fontSize: 15, color: diff == null ? 'var(--text-disabled)' : scoreColor(diff) }}>
                    {diff == null ? '—' : (diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff)}
                  </td>
                </tr>

                {hasPutts && (
                  <tr>
                    <td style={{ ...labelCell('#fff'), borderBottom: sectionBorder, paddingBottom: 10, color: 'var(--text-muted)', fontWeight: 400, fontSize: 12 }}>
                      Putts
                    </td>
                    {range.map((h) => {
                      const v = putts[player.id][h];
                      const isSet = v !== '' && v != null;
                      return (
                        <td key={h} style={{ ...numCell('#fff'), borderBottom: sectionBorder, paddingBottom: 10 }}>
                          {editable ? (
                            <span
                              onClick={() => onPuttClick?.(player.id, h)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 20, height: 18, borderRadius: 6, cursor: 'pointer',
                                background: isSet ? '#EAF5EF' : 'transparent',
                                border: isSet ? '1px solid rgba(0,103,71,0.2)' : '1px dashed var(--border-default)',
                                color: isSet ? 'var(--brand-action)' : 'var(--text-disabled)',
                                fontSize: 11, fontWeight: isSet ? 700 : 400,
                              }}
                            >
                              {isSet ? (Number(v) >= 4 ? '4+' : v) : '·'}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{isSet ? v : '–'}</span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: sectionBorder }} />
                    <td style={{ ...numCell(HIGHLIGHT_BG), borderBottom: sectionBorder }} />
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
