import React, { createContext, useContext, useState, useEffect } from 'react';
import { getVaultKey, setVaultKey } from '../services/keyVault';

// Do NOT static-import @google/genai — it's a ~50 kB gzip module and this
// provider mounts at App boot, which used to force every route (Dashboard,
// Editor, Analytics) to preload the Gemini SDK before first paint. The SDK
// is only reachable via `validateAndSaveKey`, which fires on user action, so
// a dynamic import there defers the cost until the moment it's needed.

interface GeminiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isValidating: boolean;
  validateAndSaveKey: (key: string) => Promise<boolean>;
  validationError: string | null;
}

const GeminiKeyContext = createContext<GeminiKeyContextType | undefined>(undefined);

export const GeminiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load key from localStorage on mount
  useEffect(() => {
    const storedKey = getVaultKey('gemini');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    setVaultKey('gemini', key);
    setApiKeyState(key);
  };

  const clearApiKey = () => {
    setVaultKey('gemini', '');
    setApiKeyState(null);
  };

  const validateAndSaveKey = async (key: string): Promise<boolean> => {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      setValidationError('Enter a Gemini API key.');
      return false;
    }

    setIsValidating(true);
    setValidationError(null);
    try {
      // Credential validation must not depend on a guessed model being
      // generatable. A successful model-list request proves that this key can
      // access the Gemini API; actual feature calls use the configured model.
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: trimmedKey });
      const listedModels = await ai.models.list();
      // Consume the async iterator so request/authentication errors surface here.
      for await (const _model of listedModels) {
        // A valid key may list models that differ by account, region, or API tier.
        // Do not make the key save depend on one model's generation availability.
      }

      setApiKey(trimmedKey);
      setIsValidating(false);
      return true;
    } catch (error: any) {
      // Saving a BYOK credential is separate from verifying Google's current
      // model catalog. Catalog/model availability errors must not prevent users
      // from adding a key, whether signed in or signed out. Keep the credential
      // local and clearly report that verification could not be completed.
      setApiKey(trimmedKey);
      const status = Number(error?.status ?? error?.code);
      const message = String(error?.message ?? '');
      if (status === 400 || status === 401 || /api key|unauthorized|invalid api key|authentication/i.test(message)) {
        setValidationError('Key saved locally, but Google could not verify it. Check that the API key is correct and Gemini API access is enabled.');
      } else if (status === 403 || /permission denied|forbidden/i.test(message)) {
        setValidationError('Key saved locally, but Google denied verification. Check API access and project permissions.');
      } else {
        setValidationError('Key saved locally. Google could not verify the connection right now; you can retry or test it when using an AI feature.');
      }
      setIsValidating(false);
      return true;
    }
  };

  return (
    <GeminiKeyContext.Provider value={{
      apiKey,
      setApiKey,
      clearApiKey,
      isValidating,
      validateAndSaveKey,
      validationError
    }}>
      {children}
    </GeminiKeyContext.Provider>
  );
};

export const useGeminiKey = () => {
  const context = useContext(GeminiKeyContext);
  if (context === undefined) {
    throw new Error('useGeminiKey must be used within a GeminiKeyProvider');
  }
  return context;
};
