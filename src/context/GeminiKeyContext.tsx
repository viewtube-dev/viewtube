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

type GeminiModelDescriptor = { name?: string; supportedActions?: string[]; supportedGenerationMethods?: string[] };
type GeminiValidationClient = {
  models: {
    list: () => Promise<AsyncIterable<GeminiModelDescriptor>> | AsyncIterable<GeminiModelDescriptor>;
    generateContent: (input: { model: string; contents: string }) => Promise<{ text?: string | null }>;
  };
};

const getModelScore = (name: string) =>
  (name.includes("flash") ? 100 : 0) +
  (!name.includes("preview") && !name.includes("experimental") ? 20 : 0) +
  (!name.includes("latest") ? 5 : 0);

/** Return every listed Gemini model that advertises generateContent, best candidates first. */
export const chooseGeminiValidationModels = (models: GeminiModelDescriptor[]): string[] => models
  .filter((model) =>
    model.name &&
    [...(model.supportedActions ?? []), ...(model.supportedGenerationMethods ?? [])].includes("generateContent") &&
    model.name.toLowerCase().includes("gemini")
  )
  .map((model) => ({
    name: model.name!.startsWith("models/") ? model.name!.slice(7) : model.name!,
    normalized: model.name!.toLowerCase(),
  }))
  .sort((a, b) => getModelScore(b.normalized) - getModelScore(a.normalized) || a.name.localeCompare(b.name))
  .map((model) => model.name);

/** Kept for callers that need a single preferred model; validation uses the full fallback list. */
export const chooseGeminiValidationModel = (models: GeminiModelDescriptor[]): string | null =>
  chooseGeminiValidationModels(models)[0] ?? null;

const isModelAvailabilityError = (error: unknown): boolean => {
  const value = error as { status?: number; code?: number | string; message?: string } | null;
  const status = Number(value?.status ?? value?.code);
  const message = String(value?.message ?? "");
  return status === 404 ||
    /model[^\n]*(not found|not supported|not available|unavailable|does not exist)|models\/[^ ]+ is not found|not found[^\n]*model/i.test(message);
};

/**
 * Validate with the first listed model that actually accepts generateContent for this key.
 * Model lists can contain stale aliases or models whose availability differs by
 * project/region, so one failed candidate must not reject an otherwise valid key.
 */
export const validateGeminiConnection = async (ai: GeminiValidationClient): Promise<string> => {
  const listedModels = await ai.models.list();
  const availableModels: GeminiModelDescriptor[] = [];
  for await (const model of listedModels) availableModels.push(model);

  const candidates = chooseGeminiValidationModels(availableModels);
  if (!candidates.length) throw new Error("NO_COMPATIBLE_GEMINI_MODEL");

  let lastModelError: unknown;
  for (const model of candidates) {
    try {
      const response = await ai.models.generateContent({ model, contents: 'reply with exactly "OK"' });
      if (response.text) return model;
      lastModelError = new Error("Gemini returned an empty validation response.");
    } catch (error) {
      if (!isModelAvailabilityError(error)) throw error;
      lastModelError = error;
    }
  }

  const error = new Error("NO_COMPATIBLE_GEMINI_MODEL");
  (error as Error & { cause?: unknown }).cause = lastModelError;
  throw error;
};

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
      // A user-provided Gemini key is local-first and does not depend on app login.
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: key });
      await validateGeminiConnection(ai as unknown as GeminiValidationClient);
      setApiKey(key);
      setIsValidating(false);
      return true;
    } catch (error: any) {
      // Keep provider diagnostics out of the settings UI; SDK errors can contain
      // raw request details and model identifiers that are not useful to creators.
      const status = Number(error?.status ?? error?.code);
      const message = String(error?.message ?? '');
      if (message.includes("NO_COMPATIBLE_GEMINI_MODEL")) {
        setValidationError('Gemini listed models for this key, but none accepted the validation request. Check that Gemini API access is enabled for this key and try again.');
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
