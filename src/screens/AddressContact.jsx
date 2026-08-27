import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { LockIcon } from '../components/icons';
import { CLUBS, TABS, DEFAULT_CLUB, DEFAULT_TAB, BH_SUBCLUBS, DEFAULT_BH_SUBCLUB, contentFor, QUICK_COMPARE } from '../lib/addressContact';
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
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        height: 40, borderRadius: 11, padding: '0 4px', cursor: disabled ? 'not-allowed' : 'pointer',
        border: active ? '1px solid var(--brand-action)' : disabled ? '1px solid transparent' : '1px solid var(--border-default)',
        background: active ? '#EAF5EF' : disabled ? 'var(--surface-tint)' : '#fff',
        color: disabled ? 'var(--text-disabled)' : active ? 'var(--brand-action)' : 'var(--text-body)',
        font: 'var(--text-label)', fontSize: 13,
      }}
      title={disabled ? 'Bientôt disponible' : undefined}
    >
      {club.label}
      {disabled && <LockIcon width={10} height={10} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.6 }} />}
    </button>
  );
}

// A local, more compact tab toggle — the shared SegmentedControl is
// tuned for other screens; this one intentionally trims height/padding/
// shadow per the "onglets plus compacts" request, without touching the
// shared component other screens rely on.
function CompactTabs({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--surface-tint)', borderRadius: 10, padding: 3, gap: 3 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(23,33,29,0.1)' : 'none',
              font: 'var(--text-small)', fontWeight: 600, fontSize: 13,
              color: active ? 'var(--text-body)' : 'var(--text-muted)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// B/H's secondary Bois/Hybride choice — deliberately lighter than
// CompactTabs (underline instead of a filled pill) so it reads as
// subordinate to the four main club buttons above it.
function SubClubToggle({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 16, paddingLeft: 2 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              background: 'none', border: 'none', borderBottom: active ? '2px solid var(--brand-action)' : '2px solid transparent',
              padding: '2px 0 4px', cursor: 'pointer',
              font: 'var(--text-small)', fontSize: 13.5, fontWeight: active ? 700 : 500,
              color: active ? 'var(--text-body)' : 'var(--text-muted)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function AddressContact() {
  const navigate = useNavigate();
  const [club, setClub] = useState(DEFAULT_CLUB);
  const [subClub, setSubClub] = useState(DEFAULT_BH_SUBCLUB);
  const [tab, setTab] = useState(DEFAULT_TAB);

  const isBH = club === 'bois-hybride';
  const effectiveClub = isBH ? subClub : club;
  const isArcPendingForBH = isBH && tab === 'arc';

  const content = contentFor(effectiveClub, tab);
  const Diagram = diagramFor(effectiveClub, tab);

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

        {isBH && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SubClubToggle
              options={BH_SUBCLUBS.map((s) => ({ value: s.id, label: s.label }))}
              value={subClub}
              onChange={setSubClub}
            />
            <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)', paddingLeft: 2 }}>
              Depuis le gazon
            </div>
          </div>
        )}

        <CompactTabs
          options={TABS.map((t) => ({ value: t.id, label: t.label }))}
          value={tab}
          onChange={setTab}
        />

        {content && Diagram ? (
          <>
            <Card tint style={{ padding: '10px 14px' }}>
              <div style={{ font: 'var(--text-eyebrow)', fontSize: 10, color: 'var(--brand-action)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-eyebrow)', marginBottom: 6 }}>
                À retenir
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {content.keyPoints.map((point) => (
                  <div key={point} style={{ font: 'var(--text-small)', fontSize: 13.5, color: 'var(--text-body)', lineHeight: 1.35, fontWeight: 500 }}>
                    {point}
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ padding: 12 }}>
              <div style={{ maxWidth: 280, margin: '0 auto' }}>
                <Diagram />
              </div>
              <div style={{ font: 'var(--text-small)', fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 6, lineHeight: 1.35 }}>
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
                      <div style={{ font: 'var(--text-body)', fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginTop: 1 }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {content.footnote && (
                <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, paddingTop: 10 }}>
                  <Badge>{content.footnote.badge}</Badge> — {content.footnote.text}
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
              {isArcPendingForBH ? 'À venir pour Arc et contact.' : 'Bientôt disponible pour ce bâton.'}
            </div>
          </Card>
        )}

        <Card tint>
          <div style={{ font: 'var(--text-eyebrow)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-eyebrow)', marginBottom: 10 }}>
            Driver vs Fer 7
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_COMPARE.map((c) => (
              <div key={c.club} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ font: 'var(--text-label)', fontSize: 14, flexShrink: 0, minWidth: 58 }}>{c.club}</span>
                <span style={{ font: 'var(--text-small)', fontSize: 13, color: 'var(--text-muted)' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
