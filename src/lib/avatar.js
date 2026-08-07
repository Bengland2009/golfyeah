const DEFAULT_AVATAR_SRC = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<circle cx="50" cy="50" r="50" fill="#E4ECE7"/>' +
  '<circle cx="50" cy="40" r="18" fill="#005239"/>' +
  '<path d="M50 62c-20 0-32 12-32 26v12h64V88c0-14-12-26-32-26z" fill="#005239"/>' +
  '</svg>'
);

export function avatarSrc(player) {
  if (!player) return DEFAULT_AVATAR_SRC;
  return player.customPhotoUrl || player.photoUrl || DEFAULT_AVATAR_SRC;
}
