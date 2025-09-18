export function getCrypto() {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }
  return globalThis.crypto ?? undefined;
}

export async function hashPassword(password: string) {
  const cryptoInstance = getCrypto();
  if (!cryptoInstance?.subtle) {
    return password;
  }
  const data = new TextEncoder().encode(password);
  const digest = await cryptoInstance.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
