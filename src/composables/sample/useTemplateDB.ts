import { openDB } from 'idb';
import { toRaw } from 'vue';

const DB_NAME = 'TemplateManager'
const STORE_NAME = 'templates'

export interface TemplateModel {
  id?: number
  name: string
  tags: string[]
  description: string
  xml: string
}

export const useTemplateDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }
  })

  const getAll = async (): Promise<TemplateModel[]> => await db.getAll(STORE_NAME)
  const get = async (id: number): Promise<TemplateModel | undefined> => await db.get(STORE_NAME, id)
  const add = async (item: TemplateModel) => await db.add(STORE_NAME, toRaw(item))
  const update = async (item: TemplateModel) => await db.put(STORE_NAME, toRaw(item))
  const remove = async (id: number) => await db.delete(STORE_NAME, id)

  return { getAll, get, add, update, remove }
}
