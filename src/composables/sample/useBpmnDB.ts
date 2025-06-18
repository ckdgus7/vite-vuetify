import { idbCommon } from './idbCommon';

const DB_NAME = 'TemplateManager'
const STORE_NAME = 'bpmn'

export interface TemplateModel {
  id?: number
  name: string
  tags: string[]
  description: string
  xml: string
}

export const useTemplateDB = async () => idbCommon(DB_NAME, DB_NAME);
