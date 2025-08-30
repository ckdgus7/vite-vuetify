import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface ImageItem {
  id: string; // 자동생성
  name: string; // 이미지명 (검색 대상)
  downloadUrl: string; // 다운로드 URL
  createdAt: string; // 등록일(ISO)
}

interface ImageDB extends DBSchema {
  images: {
    key: string;
    value: ImageItem;
    indexes: { 'by-name': string };
  };
}

let _db: IDBPDatabase<ImageDB> | null = null;

async function getDB() {
  if (_db) return _db;
  _db = await openDB<ImageDB>('ui-builder-image-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('images', { keyPath: 'id' });
      store.createIndex('by-name', 'name');
    },
  });
  return _db;
}

export function useImageDB() {
  const ensureDB = async () => await getDB();

  const list = async (): Promise<ImageItem[]> => {
    const db = await ensureDB();
    return await db.getAll('images');
  };

  const getById = async (id: string): Promise<ImageItem | undefined> => {
    const db = await ensureDB();
    return await db.get('images', id);
  };

  const add = async (payload: Omit<ImageItem, 'id' | 'createdAt'>): Promise<ImageItem> => {
    const db = await ensureDB();
    const item: ImageItem = {
      id: crypto.randomUUID(),
      name: payload.name,
      downloadUrl: payload.downloadUrl,
      createdAt: new Date().toISOString(),
    };
    await db.add('images', item);
    return item;
  };

  const update = async (
    id: string,
    patch: Partial<Omit<ImageItem, 'id' | 'createdAt'>>
  ): Promise<ImageItem | undefined> => {
    const db = await ensureDB();
    const current = await db.get('images', id);
    if (!current) return undefined;
    const next: ImageItem = { ...current, ...patch };
    await db.put('images', next);
    return next;
  };

  const remove = async (id: string): Promise<void> => {
    const db = await ensureDB();
    await db.delete('images', id);
  };

  return { list, getById, add, update, remove };
}
