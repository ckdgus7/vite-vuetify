import { idbCommon } from './idbCommon';

const DB_NAME = 'TemplateManager'
const STORE_NAME = 'templates'

export interface TemplateModel {
  id?: number
  name: string
  tags: string[]
  description: string
  xml: string
}

export const useTemplateDB = async () => await idbCommon(DB_NAME, STORE_NAME);
