export type VaultKeyName = 'gemini' | 'googleClientId' | 'elevenLabs' | 'auphonic';

/** Emitted after the effective Gemini key changes; never includes key material. */
export const GEMINI_KEY_UPDATED_EVENT = 'vt:gemini-key-updated';

const notifyGeminiKeyUpdated = (): void => {
  try {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(GEMINI_KEY_UPDATED_EVENT));
  } catch {
    // Key storage must remain usable in SSR, tests, and restricted browser contexts.
  }
};

const KEY_MAP: Record<VaultKeyName, string> = {
  gemini: 'yt_api_key',
  googleClientId: 'yt_google_client_id',
  elevenLabs: 'vt_elevenlabs_key',
  auphonic: 'vt_auphonic_key',
};

const GEMINI_ALIASES = ['yt_api_key', 'vt_gemini_api_key', 'gemini_api_key', 'google_api_key'];

const DEFAULTS: Partial<Record<VaultKeyName, string>> = {
  googleClientId: '365513395077-1cpc5mgn763t62ggcujkgbiv11rdbhsv.apps.googleusercontent.com',
};

export interface VaultSnapshot {
  gemini: string;
  googleClientId: string;
  elevenLabs: string;
  auphonic: string;
}

/**
 * Storage is optional at module/runtime boundaries (SSR, tests, privacy-restricted
 * browsers). Never let an unavailable or throwing Storage implementation crash Brain
 * orchestration; reads fall back to defaults and writes become safe no-ops.
 */
const getBrowserStorage = (): Storage | null => {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    return null;
  }
};

const readStorage = (key: string): string | null => {
  try {
    return getBrowserStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string): void => {
  try {
    getBrowserStorage()?.setItem(key, value);
  } catch {
    // Browser storage may be blocked or full. Callers should still be able to run.
  }
};

const removeStorage = (key: string): void => {
  try {
    getBrowserStorage()?.removeItem(key);
  } catch {
    // Best-effort cleanup; absence of storage must not break the runtime.
  }
};

export const getVaultKey = (name: VaultKeyName): string => {
  if (name === 'gemini') {
    const found = GEMINI_ALIASES.map((key) => readStorage(key) || '').find((value) => value.trim().length > 0);
    return found || '';
  }
  const storageKey = KEY_MAP[name];
  return readStorage(storageKey) || DEFAULTS[name] || '';
};

export const setVaultKey = (name: VaultKeyName, value: string): void => {
  if (name === 'gemini') {
    const trimmed = value.trim();
    if (!trimmed) {
      GEMINI_ALIASES.forEach(removeStorage);
      notifyGeminiKeyUpdated();
      return;
    }
    GEMINI_ALIASES.forEach((key) => writeStorage(key, trimmed));
    notifyGeminiKeyUpdated();
    return;
  }

  const storageKey = KEY_MAP[name];
  if (!value) {
    removeStorage(storageKey);
    return;
  }
  writeStorage(storageKey, value);
};

export const getVaultSnapshot = (): VaultSnapshot => ({
  gemini: getVaultKey('gemini'),
  googleClientId: getVaultKey('googleClientId'),
  elevenLabs: getVaultKey('elevenLabs'),
  auphonic: getVaultKey('auphonic'),
});

export const setVaultSnapshot = (snapshot: Partial<VaultSnapshot>): void => {
  if (snapshot.gemini !== undefined) setVaultKey('gemini', snapshot.gemini);
  if (snapshot.googleClientId !== undefined) setVaultKey('googleClientId', snapshot.googleClientId);
  if (snapshot.elevenLabs !== undefined) setVaultKey('elevenLabs', snapshot.elevenLabs);
  if (snapshot.auphonic !== undefined) setVaultKey('auphonic', snapshot.auphonic);
};

export const hasVaultKey = (name: VaultKeyName): boolean => {
  return getVaultKey(name).trim().length > 0;
};
