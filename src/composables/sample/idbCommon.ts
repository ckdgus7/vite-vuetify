import { openDB } from 'idb';
import { toRaw } from 'vue';

export interface TemplateModel {
  id?: number
  name: string
  tags: string[]
  description: string
  xml: string
}

export const idbCommon = async (dbName: string, storeName: string) => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
      }
    }
  })

  const getAll = async (): Promise<TemplateModel[]> => await db.getAll(storeName)
  const get = async (id: number): Promise<TemplateModel | undefined> => await db.get(storeName, id)
  const add = async (item: TemplateModel) => await db.add(storeName, toRaw(item))
  const update = async (item: TemplateModel) => await db.put(storeName, toRaw(item))
  const remove = async (id: number) => await db.delete(storeName, id)

  return { getAll, get, add, update, remove }
}
