import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface FileItem {
  id: string; // 파일ID(자동생성)
  name: string; // 파일명
  url: string; // 다운로드 URL
  createdAt: number; // 등록일 (epoch ms)
}

interface FileDB extends DBSchema {
  files: {
    key: string;
    value: FileItem;
    indexes: { 'by-name': string; 'by-createdAt': number };
  };
}

let dbPromise: Promise<IDBPDatabase<FileDB>> | null = null;
const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<FileDB>('ui-builder-filedb', 1, {
      upgrade(db) {
        const store = db.createObjectStore('files', { keyPath: 'id' });
        store.createIndex('by-name', 'name');
        store.createIndex('by-createdAt', 'createdAt');
      },
    });
  }
  return dbPromise;
};

export function useFileDB() {
  const list = async (keyword?: string): Promise<FileItem[]> => {
    const db = await getDB();
    const tx = db.transaction('files');
    const store = tx.store;

    if (!keyword) {
      const all = await store.getAll();
      return all.sort((a, b) => b.createdAt - a.createdAt);
    }

    // 간단한 prefix/substring 검색 (소문자 기준)
    const lower = keyword.toLowerCase();
    const all = await store.getAll();
    return all
      .filter((f) => f.name.toLowerCase().includes(lower))
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const get = async (id: string) => {
    const db = await getDB();
    return db.get('files', id);
  };

  const put = async (item: FileItem) => {
    const db = await getDB();
    await db.put('files', item);
  };

  const remove = async (id: string) => {
    const db = await getDB();
    await db.delete('files', id);
  };

  return { list, get, put, remove };
}
