import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { CheckIcon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildInviteMailto(name, email, fromName) {
  const subject = encodeURIComponent('Invitation à rejoindre Golfyeah!');
  const body = encodeURIComponent(
    `Salut ${name},\n\n${fromName || 'Un ami'} t'invite à rejoindre Golfyeah!, l'appli qu'on utilise pour suivre nos parties de golf.\n\n` +
    `Pour t'inscrire, connecte-toi avec ce compte Google : ${email}\n\nÀ bientôt sur le parcours!`
  );
  return `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
}

// A plain <a> click opens the mail app as an external protocol handoff.
// Reassigning window.location.href instead would make the browser treat it
// as a same-document navigation and hang waiting for a "load" that a
// mailto: URL never fires.
function openMailto(mailtoUrl) {
  const a = document.createElement('a');
  a.href = mailtoUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function AddPlayer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { players, addPlayer } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedConfirm = confirmEmail.trim();

  const nameValid = trimmedName.length > 0;
  const formatValid = EMAIL_RE.test(trimmedEmail);
  const isDuplicate = formatValid && players.some((p) => p.authEmail && p.authEmail.toLowerCase() === trimmedEmail.toLowerCase());
  const emailsMatch = trimmedEmail.length > 0 && trimmedEmail.toLowerCase() === trimmedConfirm.toLowerCase();

  let emailError = '';
  if (emailTouched && trimmedEmail && !formatValid) emailError = 'Adresse courriel invalide.';
  else if (emailTouched && isDuplicate) emailError = 'Un joueur avec cette adresse existe déjà.';

  let confirmError = '';
  if (confirmTouched && trimmedConfirm && !emailsMatch) confirmError = 'Les adresses ne correspondent pas.';

  const canSubmit = nameValid && formatValid && !isDuplicate && emailsMatch && !saving;

  const save = async () => {
    if (!canSubmit) return;
    setSaving(true);
    await addPlayer(trimmedName, trimmedEmail);
    openMailto(buildInviteMailto(trimmedName, trimmedEmail, user?.name));
    setSaving(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <Header title="Joueur ajouté" onBack={() => navigate('/joueurs')} />
        <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', paddingTop: 56 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon width={28} height={28} strokeWidth={2} style={{ color: 'var(--brand-action)' }} />
          </div>
          <div style={{ font: 'var(--text-h3)' }}>{trimmedName} a été ajouté</div>
          <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Une invitation a été envoyée à <strong style={{ color: 'var(--text-body)' }}>{trimmedEmail}</strong>. Dès que {trimmedName} se connectera avec ce compte Google, son profil sera automatiquement relié.
          </div>
          <Button variant="primary" onClick={() => navigate('/joueurs')} style={{ height: 52, width: '100%' }}>Retour aux joueurs</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Ajouter un joueur" onBack={() => navigate('/joueurs')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Nom du joueur" placeholder="Prénom" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Adresse courriel"
          type="email"
          inputMode="email"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          error={emailError}
        />
        <Input
          label="Confirmer l'adresse courriel"
          type="email"
          inputMode="email"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          onBlur={() => setConfirmTouched(true)}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          error={confirmError}
          helper={!confirmError ? "Retape l'adresse manuellement — le copier-coller est désactivé sur ce champ." : undefined}
        />
        <Button variant="primary" onClick={save} disabled={!canSubmit} style={{ height: 52, width: '100%' }}>
          Ajouter le joueur
        </Button>
      </div>
    </div>
  );
}
