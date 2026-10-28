import React, { createContext, useContext, useState, useEffect } from 'react';
import { getVaultKey, setVaultKey } from '../services/keyVault';

// Keep the SDK out of the initial bundle; load it only when the user validates a key.
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

  // The local key vault is shared by settings and Gemini runtime consumers.
  // It is deliberately independent of ViewTube's login/account state.
  useEffect(() => {
    const storedKey = getVaultKey('gemini');
    if (storedKey) setApiKeyState(storedKey);
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
      // Do not validate against a guessed model ID. Model availability varies by
      // key and API release; a successful authenticated model-catalog request
      // verifies API-key access without rejecting the key due to one model 404.
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: trimmedKey });
      const listedModels = await ai.models.list();
      // Consume the async iterator so authentication/network errors are observed.
      for await (const _model of listedModels) {
        // The catalog may be different for each key; no particular model is required.
      }

      setApiKey(trimmedKey);
      return true;
    } catch (error: unknown) {
      const providerError = error as { status?: number; code?: number | string; message?: string } | null;
      const status = Number(providerError?.status ?? providerError?.code);
      const message = String(providerError?.message ?? '');

      if (status === 400 || status === 401 || status === 403 || /api key|unauthorized|permission denied|invalid argument/i.test(message)) {
        setValidationError('Gemini could not validate this API key. Check the key and its Google AI Studio API access, then try again.');
      } else if (status === 404 || /not found|not supported/i.test(message)) {
        setValidationError('Google could not load the Gemini model catalog for this key. Check that the Gemini API is enabled for the key, then try again.');
      } else {
        setValidationError('Gemini connection failed. Check your network and Google AI Studio API access, then try again.');
      }
      return false;
    } finally {
      setIsValidating(false);
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
