import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Sheet from '../components/Sheet';
import RadioRow from '../components/RadioRow';
import SegmentedControl from '../components/SegmentedControl';
import { useData } from '../contexts/DataContext';
import { parLabel, toneFor, coursePar, roundDateValue } from '../lib/scoring';

const DEFAULT_FILTERS = { dateFrom: '', dateTo: '', player: 'all', holes: 'all', kind: 'all' };
const HOLES_OPTIONS = [{ value: 'all', label: 'Tous' }, { value: '9', label: '9 trous' }, { value: '18', label: '18 trous' }];
const KIND_OPTIONS = [{ value: 'all', label: 'Tous' }, { value: 'exterieur', label: 'Extérieur' }, { value: 'interieur', label: 'Simulateur' }];

// Rounds.jsx unmounts while a scorecard is open (Summary's back button goes
// straight to '/parties', dropping any URL state) and remounts on return —
// so search/year/sort/filters are kept here, at module scope, instead of
// component state. The module itself stays loaded for the whole SPA
// session, which is exactly the "remember while browsing" lifetime asked
// for — no router change, no new dependency, nothing outside this page.
let rememberedState = { search: '', year: undefined, sort: 'recent', filters: DEFAULT_FILTERS };

// Built from explicit code points (rather than a literal character range in
// the source, which is easy to mis-encode) — matches U+0300..U+036F, the
// Unicode combining-marks block NFD decomposition splits accents into.
const DIACRITICS = new RegExp('[̀-ͯ]', 'g');
function normalize(s) {
  return (s || '').toString().normalize('NFD').replace(DIACRITICS, '').toLowerCase();
}

// One compact, full-width row per round — replaces the old one-card-per-
// round layout so many rounds can be scanned/compared without excessive
// scrolling.
function RoundRow({ round, course, players, isLast, onClick }) {
  const par = course ? coursePar(course, round.holes) : round.par || 72;
  const envLabel = course?.kind ? (course.kind === 'interieur' ? 'Simulateur' : 'Extérieur') : null;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer', padding: '14px 4px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
      }}
    >
      <div style={{ font: 'var(--text-body)', fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
        {course?.name}
      </div>
      <div style={{ font: 'var(--text-small)', fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2, marginBottom: 8 }}>
        {round.date} · {round.holes} trous{envLabel ? ` · ${envLabel}` : ''}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16, rowGap: 6 }}>
        {round.playerIds.map((pid) => {
          const p = players.find((pp) => pp.id === pid);
          const diff = round.totals[pid] - par;
          return (
            <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ font: 'var(--text-small)', fontSize: 13.5, fontWeight: 600 }}>{p?.name}</span>
              <Badge tone={toneFor(diff)}>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{parLabel(diff)}</span>
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const selectStyle = {
  flex: 1, minWidth: 0, height: 40, border: '1px solid var(--border-default)', borderRadius: 10,
  padding: '0 8px', font: 'var(--text-small)', fontSize: 13, color: 'var(--text-body)', background: '#fff',
};

export default function Rounds() {
  const navigate = useNavigate();
  const { allRounds, players, courses } = useData();

  const [search, setSearch] = useState(rememberedState.search);
  const [year, setYear] = useState(rememberedState.year); // undefined = "not chosen yet" -> defaults to most recent
  const [sort, setSort] = useState(rememberedState.sort);
  const [filters, setFilters] = useState(rememberedState.filters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    rememberedState = { search, year, sort, filters };
  }, [search, year, sort, filters]);

  const allCompleted = useMemo(() => allRounds.filter((r) => r.status === 'completed'), [allRounds]);

  const years = useMemo(() => {
    const set = new Set();
    allCompleted.forEach((r) => {
      const ts = roundDateValue(r.date);
      if (ts) set.add(new Date(ts).getFullYear());
    });
    return [...set].sort((a, b) => b - a);
  }, [allCompleted]);

  const effectiveYear = year !== undefined ? year : (years[0] ?? 'all');

  const playersInRounds = useMemo(() => {
    const ids = new Set();
    allCompleted.forEach((r) => r.playerIds.forEach((pid) => ids.add(pid)));
    return players.filter((p) => ids.has(p.id));
  }, [allCompleted, players]);

  const filteredRounds = useMemo(() => {
    const q = normalize(search.trim());
    const fromTs = filters.dateFrom ? new Date(filters.dateFrom + 'T00:00:00').getTime() : null;
    const toTs = filters.dateTo ? new Date(filters.dateTo + 'T00:00:00').getTime() : null;

    const list = allCompleted.filter((r) => {
      const course = courses.find((c) => c.id === r.courseId);
      const ts = roundDateValue(r.date);

      if (effectiveYear !== 'all' && (!ts || new Date(ts).getFullYear() !== effectiveYear)) return false;
      if (fromTs != null && ts < fromTs) return false;
      if (toTs != null && ts > toTs) return false;
      if (filters.player !== 'all' && !r.playerIds.includes(filters.player)) return false;
      if (filters.holes !== 'all' && r.holes !== Number(filters.holes)) return false;
      if (filters.kind !== 'all' && course?.kind !== filters.kind) return false;

      if (q) {
        const courseMatch = normalize(course?.name).includes(q);
        const playerMatch = r.playerIds.some((pid) => normalize(players.find((p) => p.id === pid)?.name).includes(q));
        if (!courseMatch && !playerMatch) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      const diff = roundDateValue(b.date) - roundDateValue(a.date);
      return sort === 'recent' ? diff : -diff;
    });
    return list;
  }, [allCompleted, courses, players, effectiveYear, filters, search, sort]);

  const activeFilterCount = ['dateFrom', 'dateTo', 'player', 'holes', 'kind'].filter(
    (k) => filters[k] && filters[k] !== 'all'
  ).length;

  const resetAll = () => {
    setSearch('');
    setYear('all');
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: 'var(--text-h2)' }}>Parties</div>
        <Button variant="primary" onClick={() => navigate('/nouvelle-partie')} style={{ alignSelf: 'flex-start', borderRadius: 999, height: 46, padding: '0 22px', fontSize: 16 }}>
          + Nouvelle partie
        </Button>

        {!allCompleted.length && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 12 }}>Aucune partie enregistrée.</div>
            <Button variant="primary" onClick={() => navigate('/nouvelle-partie')} style={{ borderRadius: 999 }}>Jouer une première ronde</Button>
          </div>
        )}

        {allCompleted.length > 0 && (
          <>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un terrain ou un joueur"
                style={{
                  width: '100%', height: 46, border: '1px solid var(--border-default)', borderRadius: 10,
                  padding: search ? '0 38px 0 14px' : '0 14px', font: 'var(--text-body)', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Effacer la recherche"
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 18, lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={effectiveYear === 'all' ? 'all' : String(effectiveYear)}
                onChange={(e) => setYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                style={{ ...selectStyle, flex: 0.8 }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
                <option value="all">Toutes les années</option>
              </select>

              <button
                type="button"
                onClick={() => { setDraft(filters); setSheetOpen(true); }}
                style={{ ...selectStyle, flex: 0.9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600 }}
              >
                Filtres
                {activeFilterCount > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px',
                    background: 'var(--brand-action)', color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...selectStyle, flex: 1.3, fontSize: 12.5 }}>
                <option value="recent">Plus récentes</option>
                <option value="oldest">Plus anciennes</option>
              </select>
            </div>

            <div style={{ font: 'var(--text-small)', fontSize: 13, color: 'var(--text-muted)' }}>
              {filteredRounds.length <= 1 ? `${filteredRounds.length} partie` : `${filteredRounds.length} parties`}
            </div>

            {filteredRounds.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Aucune partie ne correspond à ces critères.
                </div>
                <Button variant="secondary" onClick={resetAll} style={{ borderRadius: 999 }}>Réinitialiser les filtres</Button>
              </div>
            ) : (
              <Card style={{ padding: '0 14px' }}>
                {filteredRounds.map((r, i) => (
                  <RoundRow
                    key={r.id}
                    round={r}
                    course={courses.find((c) => c.id === r.courseId)}
                    players={players}
                    isLast={i === filteredRounds.length - 1}
                    onClick={() => navigate(`/resume/${r.id}`)}
                  />
                ))}
              </Card>
            )}
          </>
        )}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Filtres</div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ font: 'var(--text-label)', color: 'var(--color-text-primary)' }}>Date de début</label>
            <input
              type="date"
              value={draft.dateFrom}
              onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value }))}
              style={{ height: 46, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0 10px', font: 'var(--text-body)', fontSize: 14 }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ font: 'var(--text-label)', color: 'var(--color-text-primary)' }}>Date de fin</label>
            <input
              type="date"
              value={draft.dateTo}
              onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value }))}
              style={{ height: 46, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0 10px', font: 'var(--text-body)', fontSize: 14 }}
            />
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--text-label)', color: 'var(--color-text-primary)', marginBottom: 8 }}>Nombre de trous</div>
          <SegmentedControl options={HOLES_OPTIONS} value={draft.holes} onChange={(v) => setDraft((d) => ({ ...d, holes: v }))} />
        </div>

        <div>
          <div style={{ font: 'var(--text-label)', color: 'var(--color-text-primary)', marginBottom: 8 }}>Environnement</div>
          <SegmentedControl options={KIND_OPTIONS} value={draft.kind} onChange={(v) => setDraft((d) => ({ ...d, kind: v }))} />
        </div>

        <div>
          <div style={{ font: 'var(--text-label)', color: 'var(--color-text-primary)', marginBottom: 8 }}>Joueur</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RadioRow selected={draft.player === 'all'} label="Tous les joueurs" onClick={() => setDraft((d) => ({ ...d, player: 'all' }))} />
            {playersInRounds.map((p) => (
              <RadioRow key={p.id} selected={draft.player === p.id} label={p.name} onClick={() => setDraft((d) => ({ ...d, player: p.id }))} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <Button
            variant="secondary"
            style={{ flex: 1 }}
            onClick={() => { setFilters(DEFAULT_FILTERS); setDraft(DEFAULT_FILTERS); setSheetOpen(false); }}
          >
            Réinitialiser
          </Button>
          <Button
            variant="primary"
            style={{ flex: 1 }}
            onClick={() => { setFilters(draft); setSheetOpen(false); }}
          >
            Appliquer
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
