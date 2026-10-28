import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const storedKey = localStorage.getItem('vt_gemini_api_key');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    localStorage.setItem('vt_gemini_api_key', key);
    setApiKeyState(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem('vt_gemini_api_key');
    setApiKeyState(null);
  };

  const validateAndSaveKey = async (key: string): Promise<boolean> => {
    setIsValidating(true);
    setValidationError(null);
    try {
      // Validate by making a tiny request
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash',
        contents: 'reply with exactly "OK"',
      });

      if (response.text) {
        setApiKey(key);
        setIsValidating(false);
        return true;
      }
      throw new Error("Invalid response from Gemini");
    } catch (error: any) {
      // Keep provider diagnostics out of the settings UI; SDK errors can contain
      // raw request details and model identifiers that are not useful to creators.
      const status = Number(error?.status ?? error?.code);
      const message = String(error?.message ?? '');
      if (status === 404 || /model.+(not found|not supported)|models\/[^ ]+ is not found/i.test(message)) {
        setValidationError('Gemini could not use the validation model. Check that the selected model is available to your API key and try again.');
      } else if (status === 400 || status === 401 || status === 403 || /api key|unauthorized|permission denied|invalid argument/i.test(message)) {
        setValidationError('Gemini could not validate this API key. Check the key and its API access, then try again.');
      } else {
        setValidationError('Gemini connection failed. Check your network and API access, then try again.');
      }
      setIsValidating(false);
      return false;
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
