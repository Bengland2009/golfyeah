const TONES = {
  neutral: { background: 'var(--surface-tint)', color: 'var(--text-muted)' },
  under: { background: '#FCE9EC', color: '#C8102E' },
  over: { background: '#ECEFED', color: '#17211D' },
  progress: { background: '#FDF1DC', color: '#B4690E' },
  success: { background: '#E3F1EA', color: 'var(--brand-action)' },
};

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      style={{
        ...(TONES[tone] || TONES.neutral),
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}
