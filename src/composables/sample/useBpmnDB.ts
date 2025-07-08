import { idbCommon } from './idbCommon';

const DB_NAME = 'TemplateManager2'
const STORE_NAME = 'bpmn'


export interface TemplateModel {
  id?: number
  name: string
  tags: string[]
  description: string
  xml: string
}

export const useTemplateDB = async () => await idbCommon(DB_NAME, STORE_NAME);
