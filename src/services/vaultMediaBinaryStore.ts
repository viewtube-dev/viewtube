export interface VaultMediaBinaryRecord {
  id: string
  blob: Blob
  name: string
  mimeType: string
  sourceAssetId: string
  operation: string
  parameters: Record<string, unknown>
  createdAt: number
}

const DATABASE_NAME = "viewtube-vault-media-binary";
const DATABASE_VERSION = 1;
const STORE_NAME = "derivatives";

const openDatabase = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  if (typeof indexedDB === "undefined") {
    reject(new Error("Durable browser media storage is unavailable in this environment."));
    return;
  }
  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex("sourceAssetId", "sourceAssetId", { unique: false });
      store.createIndex("createdAt", "createdAt", { unique: false });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error("Could not open Vault binary storage."));
});

const requestResult = <T>(request: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error("Vault binary storage request failed."));
});

export const saveVaultMediaBinary = async (input: Omit<VaultMediaBinaryRecord, "id" | "createdAt"> & { id?: string }): Promise<VaultMediaBinaryRecord> => {
  if (!(input.blob instanceof Blob) || input.blob.size <= 0) {
    throw new Error("A non-empty media output is required.");
  }
  if (!input.sourceAssetId.trim()) throw new Error("The source asset ID is required for derivative lineage.");
  const record: VaultMediaBinaryRecord = {
    ...input,
    id: input.id || crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const database = await openDatabase();
  try {
    await requestResult(database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(record));
    return record;
  } finally {
    database.close();
  }
};

export const getVaultMediaBinary = async (id: string): Promise<VaultMediaBinaryRecord | null> => {
  const database = await openDatabase();
  try {
    return (await requestResult<VaultMediaBinaryRecord | undefined>(
      database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id),
    )) || null;
  } finally {
    database.close();
  }
};

export const listVaultMediaBinaries = async (sourceAssetId?: string): Promise<VaultMediaBinaryRecord[]> => {
  const database = await openDatabase();
  try {
    const store = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME);
    const records = sourceAssetId
      ? await requestResult<VaultMediaBinaryRecord[]>(store.index("sourceAssetId").getAll(sourceAssetId))
      : await requestResult<VaultMediaBinaryRecord[]>(store.getAll());
    return records.sort((left, right) => right.createdAt - left.createdAt);
  } finally {
    database.close();
  }
};

export const deleteVaultMediaBinary = async (id: string): Promise<void> => {
  const database = await openDatabase();
  try {
    await requestResult(database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id));
  } finally {
    database.close();
  }
};

export const createVaultMediaBinaryObjectUrl = async (id: string): Promise<string | null> => {
  const record = await getVaultMediaBinary(id);
  return record ? URL.createObjectURL(record.blob) : null;
};
