/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx';
import type { DataMap, DataListMap, DataColumn } from '@/_builder/stores/useDataCollectionsStore';

/** DataMap → XLSX (시트 2개: dataMap_key, dataMap_data) */
export function exportDataMapToXlsx(dm: DataMap, fileName?: string) {
  const wb = XLSX.utils.book_new();
  const wsKey = XLSX.utils.json_to_sheet(dm.columns);
  const wsData = XLSX.utils.json_to_sheet(dm.rows);
  XLSX.utils.book_append_sheet(wb, wsKey, 'dataMap_key');
  XLSX.utils.book_append_sheet(wb, wsData, 'dataMap_data');
  XLSX.writeFile(wb, fileName ?? `${dm.key || 'dataMap'}.xlsx`);
}

/** XLSX → DataMap (시트명 우선, 없으면 순서 1/2번째) */
export async function importDataMapFromXlsx(file: File, targetKey?: string): Promise<DataMap> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf);
  const wsKey = wb.Sheets['dataMap_key'] ?? wb.Sheets[wb.SheetNames[0]];
  const wsData = wb.Sheets['dataMap_data'] ?? wb.Sheets[wb.SheetNames[1]];
  const columns = (XLSX.utils.sheet_to_json(wsKey) as DataColumn[]) ?? [];
  const rows = (XLSX.utils.sheet_to_json(wsData) as Array<{ id: string; value: any }>) ?? [];
  return {
    key: targetKey || file.name.replace(/\.(xlsx|xls|csv)$/i, ''),
    useData: true,
    columns,
    rows,
  };
}

/** DataListMap → XLSX (시트 2개: dataList_column, dataList_data) */
export function exportDataListMapToXlsx(dlm: DataListMap, fileName?: string) {
  const wb = XLSX.utils.book_new();
  const wsCol = XLSX.utils.json_to_sheet(dlm.columns);
  const wsData = XLSX.utils.json_to_sheet(dlm.rows);
  XLSX.utils.book_append_sheet(wb, wsCol, 'dataList_column');
  XLSX.utils.book_append_sheet(wb, wsData, 'dataList_data');
  XLSX.writeFile(wb, fileName ?? `${dlm.key || 'dataListMap'}.xlsx`);
}

/** XLSX → DataListMap (컬럼시트 없으면 데이터 시트 헤더로 컬럼 생성) */
export async function importDataListMapFromXlsx(
  file: File,
  targetKey?: string
): Promise<DataListMap> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf);
  const wsCol = wb.Sheets['dataList_column'];
  const wsData = wb.Sheets['dataList_data'] ?? wb.Sheets[wb.SheetNames[0]];

  let columns: DataColumn[] = wsCol ? (XLSX.utils.sheet_to_json(wsCol) as DataColumn[]) : [];
  const rows = (XLSX.utils.sheet_to_json(wsData) as Array<Record<string, any>>) ?? [];

  // 컬럼 정의가 없다면, 데이터 헤더로 기본 컬럼 생성
  if (!columns.length && rows.length) {
    const keys = Object.keys(rows[0]);
    columns = keys.map((id) => ({ id, name: id, dataType: 'text' as const }));
  }

  return {
    key: targetKey || file.name.replace(/\.(xlsx|xls|csv)$/i, ''),
    useData: false,
    columns,
    rows,
  };
}
