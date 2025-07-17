import { idbCommon } from './idbCommon';

const DB_NAME = 'TemplateManager3'
const STORE_NAME = 'plantuml'

export interface TemplateModel {
  id?: number
  name: string
  tags: string[]
  description: string
  xml: string
}

export const useTemplateDB = async () => idbCommon(DB_NAME, STORE_NAME);
