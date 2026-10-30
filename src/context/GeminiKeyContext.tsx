import React, { createContext, useContext, useState, useEffect } from 'react';
import { getVaultKey, setVaultKey } from '../services/keyVault';
import { reportDiagnostic } from '../services/diagnostics';
import { classifyGeminiKeyValidationError } from './geminiKeyValidation';

// Do NOT static-import @google/genai — it's a ~50 kB gzip module and this
// provider mounts at App boot, which used to force every route (Dashboard,
// Editor, Analytics) to preload the Gemini SDK before first paint. The SDK
// is only reachable via `validateAndSaveKey`, which fires on user action, so
// a dynamic import there defers the cost until the moment it's needed.

interface GeminiKeyContextType {
  apiKey: string | null;
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
      reportDiagnostic({
        area: "brain-gemini",
        event: "api_key_missing",
        level: "warn",
        whatHappened: "Gemini API-key validation was blocked because no key was provided.",
        whatItMeans: "The Brain cannot verify provider access until a key is entered.",
        whatToCheck: ["Enter a Gemini API key in Settings."],
        details: {
          source: "gemini-key-settings",
          subsystem: "brain",
          kind: "api_key_validation",
          status: "blocked",
          expected: "A non-empty Gemini API key is provided",
          actual: "No key provided",
          recommendedActions: ["Enter a Gemini API key in Settings."],
          confidence: "confirmed",
          privacy: "sanitized",
        },
      });
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
      reportDiagnostic({
        area: "brain-gemini",
        event: "api_key_validated",
        level: "info",
        whatHappened: "Gemini API-key validation succeeded.",
        whatItMeans: "Google accepted the credential for model discovery.",
        whatToCheck: ["Confirm the selected generation model is available when a Brain feature runs."],
        details: {
          source: "gemini-key-settings",
          subsystem: "brain",
          kind: "api_key_validation",
          status: "passed",
          expected: "Gemini model discovery succeeds",
          actual: "Gemini model discovery completed",
          recommendedActions: ["Confirm the selected generation model is available when a Brain feature runs."],
          confidence: "confirmed",
          privacy: "sanitized",
        },
      });
      return true;
    } catch (error: any) {
      // Saving a BYOK credential is separate from verifying Google's current
      // model catalog. Model-catalog, permission, and transient failures must not
      // prevent adding a key in signed-in or signed-out mode. Explicit invalid-key
      // responses still fail so we don't label a rejected credential as saved.
      const status = Number(error?.status ?? error?.code);
      const failureClass = classifyGeminiKeyValidationError(error);
      if (failureClass === "credential_rejected") {
        setValidationError('Google rejected this API key. Check the key and try again.');
        setIsValidating(false);
        reportDiagnostic({
          area: "brain-gemini",
          event: "api_key_rejected",
          level: "error",
          whatHappened: "Google rejected the Gemini API key during validation.",
          whatItMeans: "The supplied credential was not accepted; the key was not saved as valid.",
          whatToCheck: ["Check that the key was copied correctly.", "Confirm the key is active and belongs to a project with Gemini API access."],
          details: {
            source: "gemini-key-settings",
            subsystem: "brain",
            kind: "api_key_validation",
            status: "failed",
            expected: "Google accepts the Gemini API key",
            actual: "Google rejected the credential",
            recommendedActions: ["Check that the key was copied correctly.", "Confirm the key is active and belongs to a project with Gemini API access."],
            confidence: "confirmed",
            privacy: "sanitized",
            metadata: { providerStatus: status || undefined, failureClass: "credential_rejected" },
          },
        });
        return false;
      }
      setApiKey(trimmedKey);
      const permissionDenied = failureClass === "permission_denied";
      const rateLimited = failureClass === "rate_limited";
      const providerUnavailable = failureClass === "provider_unavailable";
      if (permissionDenied) {
        setValidationError('Key saved locally, but Google denied verification. Check that Gemini API access is enabled and the project has permission.');
      } else if (rateLimited) {
        setValidationError('Key saved locally, but Google rate-limited verification. Retry later; generation quota is checked separately when an AI feature runs.');
      } else if (providerUnavailable) {
        setValidationError('Key saved locally, but Gemini is temporarily unavailable. Retry verification when the provider is reachable.');
      } else {
        setValidationError('Key saved locally. Google could not verify the connection right now; you can retry or test it when using an AI feature.');
      }
      setIsValidating(false);
      reportDiagnostic({
        area: "brain-gemini",
        event: "api_key_verification_degraded",
        level: "warn",
        whatHappened: permissionDenied
          ? "Gemini API key was saved locally, but Google denied verification."
          : rateLimited
            ? "Gemini API key was saved locally, but provider verification was rate-limited."
            : providerUnavailable
              ? "Gemini API key was saved locally, but the provider was unavailable."
              : "Gemini API key was saved locally, but provider verification could not be completed.",
        whatItMeans: "Key storage succeeded, but provider connectivity is not confirmed.",
        whatToCheck: permissionDenied
          ? ["Enable the Gemini API for the key's project.", "Check project permissions and API restrictions."]
          : rateLimited
            ? ["Wait before retrying model discovery.", "Check provider quota and rate limits separately from key storage."]
            : ["Retry provider verification later.", "Check network access and Gemini API availability."],
        details: {
          source: "gemini-key-settings",
          subsystem: "brain",
          kind: "api_key_validation",
          status: "degraded",
          expected: "Google verifies the credential through model discovery",
          actual: permissionDenied ? "Provider denied verification" : rateLimited ? "Provider rate-limited verification" : providerUnavailable ? "Provider unavailable" : "Provider verification unavailable",
          recommendedActions: permissionDenied
            ? ["Enable the Gemini API for the key's project.", "Check project permissions and API restrictions."]
            : rateLimited
              ? ["Wait before retrying model discovery.", "Check provider quota and rate limits separately from key storage."]
              : ["Retry provider verification later.", "Check network access and Gemini API availability."],
          confidence: "confirmed",
          privacy: "sanitized",
          metadata: { providerStatus: status || undefined, failureClass },
        },
      });
      return true;
    }
  };

  return (
    <GeminiKeyContext.Provider value={{
      apiKey,
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
