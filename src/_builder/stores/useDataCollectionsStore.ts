import { defineStore } from 'pinia';
import { openDB, type IDBPDatabase } from 'idb';

export type DataType = 'text' | 'number' | 'date' | 'boolean';

export interface DataColumn {
  id: string;
  name?: string;
  dataType: DataType;
  defaultValue?: any;
  encYN?: boolean;
  length?: number;
  nullYN?: boolean;
  // dataListMap 확장 필드
  ignoreStatus?: boolean;
  importFormatter?: string;
  useFilter?: boolean;
  valueType?: string;
}

export interface DataMap {
  key: string; // 데이터셋 ID (상단 셀렉트)
  useData: boolean; // Data 탭 "use data"
  columns: DataColumn[]; // Key 탭
  rows: Array<{ id: string; value: any }>; // Data 탭
}

export interface DataListMap {
  key: string;
  useData: boolean;
  columns: DataColumn[]; // Column 탭
  rows: Array<Record<string, any>>; // Data 탭 (동적 컬럼 기반)
}

type Stores = 'dataMaps' | 'dataListMaps';

let db: IDBPDatabase | null = null;
async function getDb() {
  if (db) return db;
  db = await openDB('ui_builder', 1, {
    upgrade(up) {
      if (!up.objectStoreNames.contains('dataMaps')) {
        up.createObjectStore('dataMaps', { keyPath: 'key' });
      }
      if (!up.objectStoreNames.contains('dataListMaps')) {
        up.createObjectStore('dataListMaps', { keyPath: 'key' });
      }
    },
  });
  return db;
}

async function listKeys(store: Stores): Promise<string[]> {
  const d = await getDb();
  const tx = d.transaction(store, 'readonly');
  const keys: string[] = [];
  for await (const cursor of tx.store) {
    keys.push(cursor.value.key);
  }
  await tx.done;
  return keys.sort();
}

async function getItem<T>(store: Stores, key: string): Promise<T | undefined> {
  const d = await getDb();
  return (await d.get(store, key)) as T | undefined;
}
async function putItem<T>(store: Stores, data: T): Promise<void> {
  const d = await getDb();
  await d.put(store, data as any);
}
async function deleteItem(store: Stores, key: string): Promise<void> {
  const d = await getDb();
  await d.delete(store, key);
}

export const useDataCollectionsStore = defineStore('dataCollections', {
  state: () => ({
    // Dialog open 상태
    isOpen: false,

    // 현재 탭
    activeTab: 'dataMap' as 'dataMap' | 'dataListMap',

    // dataMap
    dataMapKeys: [] as string[],
    selectedDataMapKey: '' as string,
    dataMap: null as DataMap | null,

    // dataListMap
    dataListMapKeys: [] as string[],
    selectedDataListMapKey: '' as string,
    dataListMap: null as DataListMap | null,

    // 내부 자동 저장 타이머
    _autosaveTimer: undefined as number | undefined,
  }),
  actions: {
    // ---------- 공통 ----------
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },

    _debounceSave(fn: () => Promise<void>, delay = 500) {
      if (this._autosaveTimer) window.clearTimeout(this._autosaveTimer);
      this._autosaveTimer = window.setTimeout(() => {
        void fn();
      }, delay);
    },

    // ---------- dataMap ----------
    async loadDataMapIndex() {
      this.dataMapKeys = await listKeys('dataMaps');
      if (!this.selectedDataMapKey && this.dataMapKeys.length) {
        this.selectedDataMapKey = this.dataMapKeys[0];
      }
    },
    async loadDataMap(key?: string) {
      const k = key ?? this.selectedDataMapKey;
      if (!k) {
        this.dataMap = null;
        return;
      }
      const item = await getItem<DataMap>('dataMaps', k);
      this.dataMap = item ?? {
        key: k,
        useData: true,
        columns: [],
        rows: [],
      };
      this.selectedDataMapKey = k;
      if (!this.dataMapKeys.includes(k)) await this.loadDataMapIndex();
    },
    async saveDataMap() {
      if (!this.dataMap) return;
      await putItem<DataMap>('dataMaps', this.dataMap);
      await this.loadDataMapIndex();
    },
    autosaveDataMap() {
      this._debounceSave(async () => {
        await this.saveDataMap();
      });
    },
    async newDataMap() {
      const base = 'dataMap';
      let idx = 1;
      let candidate = `${base}_${idx}`;
      while (this.dataMapKeys.includes(candidate)) {
        idx += 1;
        candidate = `${base}_${idx}`;
      }
      const fresh: DataMap = { key: candidate, useData: true, columns: [], rows: [] };
      await putItem('dataMaps', fresh);
      await this.loadDataMapIndex();
      await this.loadDataMap(candidate);
    },
    async renameDataMap(newKey: string) {
      if (!this.dataMap || !newKey || newKey === this.dataMap.key) return;
      const exists = this.dataMapKeys.includes(newKey);
      if (exists) throw new Error('이미 존재하는 ID 입니다.');
      const oldKey = this.dataMap.key;
      const clone = { ...this.dataMap, key: newKey };
      console.log('rename data', clone);
      await putItem('dataMaps', clone);
      await deleteItem('dataMaps', oldKey);
      await this.loadDataMapIndex();
      await this.loadDataMap(newKey);
    },
    async deleteDataMap() {
      if (!this.selectedDataMapKey) return;
      await deleteItem('dataMaps', this.selectedDataMapKey);
      await this.loadDataMapIndex();
      this.selectedDataMapKey = this.dataMapKeys[0] ?? '';
      await this.loadDataMap(this.selectedDataMapKey);
    },

    // ---------- dataListMap ----------
    async loadDataListMapIndex() {
      this.dataListMapKeys = await listKeys('dataListMaps');
      if (!this.selectedDataListMapKey && this.dataListMapKeys.length) {
        this.selectedDataListMapKey = this.dataListMapKeys[0];
      }
    },
    async loadDataListMap(key?: string) {
      const k = key ?? this.selectedDataListMapKey;
      if (!k) {
        this.dataListMap = null;
        return;
      }
      const item = await getItem<DataListMap>('dataListMaps', k);
      this.dataListMap = item ?? {
        key: k,
        useData: false,
        columns: [],
        rows: [],
      };
      this.selectedDataListMapKey = k;
      if (!this.dataListMapKeys.includes(k)) await this.loadDataListMapIndex();
    },
    async saveDataListMap() {
      if (!this.dataListMap) return;
      await putItem<DataListMap>('dataListMaps', this.dataListMap);
      await this.loadDataListMapIndex();
    },
    autosaveDataListMap() {
      this._debounceSave(async () => {
        await this.saveDataListMap();
      });
    },
    async newDataListMap() {
      const base = 'dataList';
      let idx = 1;
      let candidate = `${base}_${idx}`;
      while (this.dataListMapKeys.includes(candidate)) {
        idx += 1;
        candidate = `${base}_${idx}`;
      }
      const fresh: DataListMap = { key: candidate, useData: false, columns: [], rows: [] };
      await putItem('dataListMaps', fresh);
      await this.loadDataListMapIndex();
      await this.loadDataListMap(candidate);
    },
    async renameDataListMap(newKey: string) {
      if (!this.dataListMap || !newKey || newKey === this.dataListMap.key) return;
      const exists = this.dataListMapKeys.includes(newKey);
      if (exists) throw new Error('이미 존재하는 ID 입니다.');
      const oldKey = this.dataListMap.key;
      const clone = { ...this.dataListMap, key: newKey };
      await putItem('dataListMaps', clone);
      await deleteItem('dataListMaps', oldKey);
      await this.loadDataListMapIndex();
      await this.loadDataListMap(newKey);
    },
    async deleteDataListMap() {
      if (!this.selectedDataListMapKey) return;
      await deleteItem('dataListMaps', this.selectedDataListMapKey);
      await this.loadDataListMapIndex();
      this.selectedDataListMapKey = this.dataListMapKeys[0] ?? '';
      await this.loadDataListMap(this.selectedDataListMapKey);
    },
  },
});
