import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface MyTemplateItem {
  id: string; // 파일ID(자동생성)
  name: string; // 파일명
  templateCode: string; // 다운로드 URL
  createdAt: number; // 등록일 (epoch ms)
}

interface MyTemplateDB extends DBSchema {
  'my-template': {
    key: string;
    value: MyTemplateItem;
    indexes: { 'by-name': string; 'by-createdAt': number };
  };
}

let dbPromise: Promise<IDBPDatabase<MyTemplateDB>> | null = null;
const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<MyTemplateDB>('ui-builder-templatedb', 1, {
      upgrade(db) {
        const store = db.createObjectStore('my-template', { keyPath: 'id' });
        store.createIndex('by-name', 'name');
        store.createIndex('by-createdAt', 'createdAt');
      },
    });
  }
  return dbPromise;
};

export function useMyTemplateDB() {
  const list = async (keyword?: string): Promise<MyTemplateItem[]> => {
    const db = await getDB();
    const tx = db.transaction('my-template');
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
    return db.get('my-template', id);
  };

  const put = async (item: MyTemplateItem) => {
    const db = await getDB();
    await db.put('my-template', item);
  };

  const remove = async (id: string) => {
    const db = await getDB();
    await db.delete('my-template', id);
  };

  return { list, get, put, remove };
}
