// composables/usePageStore.ts
import { openDB } from 'idb';

interface PageSchema {
  id: string; // 화면 ID
  name: string; // 화면 이름
  routerPath: string; // /page/home
  schema: string; // JSON 문자열
  onMountedScript?: string; // JSON 문자열
}

const DB_NAME = 'page-builder-db';
const STORE_NAME = 'pages';

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function savePage(data: PageSchema) {
  const db = await getDb();
  await db.put(STORE_NAME, data);
}

export async function getPageByPath(path: string): Promise<PageSchema | null> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME);
  return all.find((p) => p.routerPath === path) || null;
}

export async function getAllPages(): Promise<PageSchema[]> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}
