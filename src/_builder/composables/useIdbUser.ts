// composables/usePageStore.ts
import { openDB } from 'idb';
import { toRaw } from 'vue';

export interface UserSchema {
  id: string; // 사용자 ID
}

const DB_NAME = 'user-db';
const STORE_NAME = 'users';

export async function getDb() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export const getUser = async (id: string): Promise<UserSchema | undefined> => {
  const db = await getDb();
  return await db.get(STORE_NAME, id);
};
export const remove = async () => {
  const db = await getDb();
  return await db.deleteObjectStore(STORE_NAME);
};
export async function saveUser(id: string) {
  const db = await getDb();
  // await remove();
  console.log({ id });
  await db.add(STORE_NAME, { id });
}
