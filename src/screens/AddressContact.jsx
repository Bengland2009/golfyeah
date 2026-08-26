import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SegmentedControl from '../components/SegmentedControl';
import { LockIcon } from '../components/icons';
import { CLUBS, TABS, DEFAULT_CLUB, DEFAULT_TAB, contentFor } from '../lib/addressContact';
import { diagramFor } from '../components/AddressDiagrams';

// Small glyphs for the info-card icon slots — one per label this screen
// actually uses, kept local since nothing else in the app needs them.
const INFO_ICONS = {
  'Balle': (
    <svg viewBox="0 0 40 40" width={19} height={19}>
      <line x1="7" y1="24" x2="33" y2="24" stroke="currentColor" strokeWidth="1.6" />
      <line x1="7" y1="21" x2="7" y2="27" stroke="currentColor" strokeWidth="1.6" />
      <line x1="33" y1="21" x2="33" y2="27" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="24" r="4" fill="#B9812A" stroke="#8C6420" strokeWidth="1" />
    </svg>
  ),
  'Épaules': (
    <svg viewBox="0 0 40 40" width={19} height={19}>
      <line x1="11" y1="16" x2="29" y2="22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="11" cy="16" r="1.8" fill="currentColor" />
      <circle cx="29" cy="22" r="1.8" fill="currentColor" />
    </svg>
  ),
  'Pression': (
    <svg viewBox="0 0 40 40" width={19} height={19}>
      <line x1="8" y1="26" x2="32" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <circle cx="21" cy="26" r="3.6" fill="currentColor" />
    </svg>
  ),
  'Point bas': (
    <svg viewBox="0 0 40 40" width={19} height={19}>
      <path d="M 8 16 Q 20 26 32 16" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.8" />
      <circle cx="20" cy="23.3" r="1.6" fill="currentColor" />
      <circle cx="16" cy="19" r="3.6" fill="#B9812A" stroke="#8C6420" strokeWidth="1" />
    </svg>
  ),
  'Contact': (
    <svg viewBox="0 0 40 40" width={19} height={19}>
      <line x1="12" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.8" fill="currentColor" />
      <circle cx="27" cy="20" r="2.4" fill="currentColor" />
    </svg>
  ),
};

function ClubButton({ club, active, onClick }) {
  const disabled = club.locked;
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        height: 40, borderRadius: 11, padding: '0 4px', cursor: disabled ? 'not-allowed' : 'pointer',
        border: active ? '1px solid var(--brand-action)' : '1px solid var(--border-default)',
        background: active ? '#EAF5EF' : '#fff',
        color: disabled ? 'var(--text-disabled)' : active ? 'var(--brand-action)' : 'var(--text-body)',
        font: 'var(--text-label)', fontSize: 13, opacity: disabled ? 0.7 : 1,
      }}
      title={disabled ? 'Bientôt disponible' : undefined}
    >
      {club.label}
      {disabled && <LockIcon width={11} height={11} strokeWidth={2} style={{ flexShrink: 0 }} />}
    </button>
  );
}

export default function AddressContact() {
  const navigate = useNavigate();
  const [club, setClub] = useState(DEFAULT_CLUB);
  const [tab, setTab] = useState(DEFAULT_TAB);

  const content = contentFor(club, tab);
  const Diagram = diagramFor(club, tab);

  return (
    <div>
      <Header title="Adresse & contact" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Comment te placer, et comment le bâton doit frapper la balle — bâton par bâton.
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {CLUBS.map((c) => (
            <ClubButton key={c.id} club={c} active={club === c.id} onClick={() => setClub(c.id)} />
          ))}
        </div>

        <SegmentedControl
          options={TABS.map((t) => ({ value: t.id, label: t.label }))}
          value={tab}
          onChange={setTab}
        />

        {content && Diagram ? (
          <>
            <Card>
              <Diagram />
              <div style={{ font: 'var(--text-small)', fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8, lineHeight: 1.4 }}>
                {content.caption}
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-default)' }}>
                {content.info.map((row) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 2px', borderBottom: '1px solid var(--border-default)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--surface-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-body)' }}>
                      {INFO_ICONS[row.label] || null}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ font: 'var(--text-eyebrow)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-eyebrow)' }}>{row.label}</div>
                      <div style={{ font: 'var(--text-body)', fontSize: 13.5, lineHeight: 1.3, marginTop: 1 }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {content.footnote && (
                <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, paddingTop: 10 }}>
                  <Badge>Wedges</Badge> — {content.footnote.replace(/^Wedges\s*—\s*/, '')}
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
              Bientôt disponible pour ce bâton.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
