<template>
  <v-dialog v-model="open" max-width="1200" persistent>
    <v-card class="rounded-xl">
      <v-toolbar flat density="comfortable">
        <v-toolbar-title>사용자 관리</v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-model="q"
          density="compact"
          variant="outlined"
          hide-details
          placeholder="검색(이름/아이디/부서)"
          class="mx-2"
          @update:model-value="() => onQuickFilter()"
        />
        <v-btn class="mx-1" color="primary" @click="() => reload()" :loading="loading">조회</v-btn>
        <v-btn class="mx-1" color="secondary" @click="() => openCreate()">등록</v-btn>
        <v-btn
          class="mx-1"
          color="error"
          variant="tonal"
          :disabled="selIds.length === 0"
          @click="() => onBulkDelete()"
        >
          선택 삭제
        </v-btn>
        <v-btn icon variant="text" @click="() => emitClose()" aria-label="닫기">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pt-0">
        <div class="ag-theme-quartz" style="width: 100%; height: 70vh">
          <ag-grid-vue
            :theme="myTheme"
            :columnDefs="columnDefs"
            :rowData="rows"
            :gridOptions="gridOptions"
            :rowHeight="42"
            style="height: 500px"
            @grid-ready="onGridReady"
            @selection-changed="onSelectionChanged"
            @row-double-clicked="onRowDblClick"
          />
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="() => emitClose()">닫기</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 상세/등록은 별도 팝업으로 확장 예정 -->
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { v4 as uuidv4 } from 'uuid';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import { AllCommunityModule, ModuleRegistry, themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
// Mark all grids as using legacy themes
const myTheme = themeBalham.withParams({ accentColor: 'red' });

type Tel = { area: string; number: string; ext?: string };
type UserRow = {
  id: string; // PK
  userId: string; // 로그인 ID
  name: string; // 이름
  dept: string; // 소속
  position?: string; // 직위
  role?: string; // 권한
  tel?: Tel; // 내선
  email?: string;
  joinDate?: string; // YYYY-MM-DD
};

interface UserDB extends DBSchema {
  users: {
    key: string; // id
    value: UserRow;
    indexes: { by_userId: string; by_name: string; by_dept: string };
  };
}

const open: any = defineModel();
// const emit = defineEmits<{
//   (e: 'update:open', v: boolean): void;
//   (e: 'saved'): void;
// }>();

// const open = ref(true);
// watch(
//   () => props.open,
//   (v) => (open.value = v)
// );
// watch(open, (v) => emit('update:open', v));

/** IDB 핸들러 (간단 래퍼) */
let _db: IDBPDatabase<UserDB> | null = null;
async function getDB() {
  if (_db) return _db;
  _db = await openDB<UserDB>('user-db', 1, {
    upgrade(db) {
      const s = db.createObjectStore('users', { keyPath: 'id' });
      s.createIndex('by_userId', 'userId', { unique: true });
      s.createIndex('by_name', 'name');
      s.createIndex('by_dept', 'dept');
    },
  });
  return _db;
}
async function dbGetAll() {
  const db = await getDB();
  return db.getAll('users');
}
async function dbPutMany(rows: UserRow[]) {
  const db = await getDB();
  const tx = db.transaction('users', 'readwrite');
  for (const r of rows) await tx.store.put(r);
  await tx.done;
}
async function dbDeleteMany(ids: string[]) {
  const db = await getDB();
  const tx = db.transaction('users', 'readwrite');
  for (const id of ids) await tx.store.delete(id);
  await tx.done;
}

/** UI 상태 */
const rows = ref<UserRow[]>([]);
const loading = ref(false);
const q = ref('');
let api: any = ref(null);
const selIds = ref<string[]>([]);

/** 컬럼 정의 */
const telRenderer = (p: any) => {
  const t: Tel | undefined = p.value;
  if (!t) return '';
  return [t.area, t.number, t.ext].filter(Boolean).join('-');
};

const columnDefs = ref<ColDef[]>([
  // {
  //   headerName: '',
  //   width: 46,
  //   pinned: 'left',
  // },
  { headerName: '아이디', field: 'userId', minWidth: 120, editable: true },
  { headerName: '이름', field: 'name', minWidth: 110, editable: true },
  { headerName: '소속', field: 'dept', minWidth: 140, editable: true },
  { headerName: '직위', field: 'position', minWidth: 100, editable: true },
  { headerName: '권한', field: 'role', minWidth: 110, editable: true },
  {
    headerName: '내선',
    field: 'tel',
    minWidth: 150,
    valueGetter: (p) => p.data?.tel,
    cellRenderer: telRenderer,
    editable: true,
  },
  { headerName: '이메일', field: 'email', minWidth: 180, flex: 1, editable: true },
  { headerName: '입사일', field: 'joinDate', minWidth: 120, editable: true },
]);

/** 그리드 옵션(성능/접근성) */
const gridOptions: GridOptions = {
  suppressCellFocus: true,
  ensureDomOrder: true,
  rowBuffer: 20,
  headerHeight: 36,
  defaultColDef: { sortable: true, resizable: true },
};

function onGridReady(p: any) {
  api.value = p.api as GridApi;
  onQuickFilter();
}
function onSelectionChanged() {
  if (!api.value) return;
  selIds.value = api.value.getSelectedNodes().map((n: any) => n.data.id as string);
}
function onQuickFilter() {
  // api.value.setQuickFilter(q.value.trim());
}

/** 조회/시드 */
async function reload() {
  loading.value = true;
  try {
    rows.value = await dbGetAll();
    onQuickFilter();
  } finally {
    loading.value = false;
  }
}
async function seedIfEmpty() {
  await reload();
  if (rows.value.length === 0) {
    const demo: UserRow[] = [
      {
        id: uuidv4(),
        userId: 'yoonsj',
        name: '윤세진',
        dept: 'SW컨설팅팀',
        position: '팀장',
        role: 'ADMIN',
        tel: { area: '02', number: '2082', ext: '1000' },
        email: 'yoon@example.com',
        joinDate: '2011-04-01',
      },
      {
        id: uuidv4(),
        userId: 'kimyh',
        name: '김영희',
        dept: '서비스사업3팀',
        position: '팀장',
        role: 'USER',
        tel: { area: '02', number: '2182', ext: '1001' },
        email: 'kim@example.com',
        joinDate: '2012-04-03',
      },
    ];
    await dbPutMany(demo);
    await reload();
  }
}

/** 등록(간단 목업: 실제는 상세 팝업 연동) */
async function openCreate() {
  const nu: UserRow = {
    id: uuidv4(),
    userId: `user_${Date.now()}`,
    name: '새 사용자',
    dept: '미지정',
    role: 'USER',
  };
  await dbPutMany([nu]);
  await reload();
  // emit('saved'); // 상위에 저장 이벤트 통지(필요 시)
}

/** 삭제 */
async function onBulkDelete() {
  if (selIds.value.length === 0) return;
  await dbDeleteMany(selIds.value);
  selIds.value = [];
  await reload();
  // emit('saved');
}

/** 더블클릭 시 상세 팝업 연결(후속 확장지점) */
function onRowDblClick(e: any) {
  // TODO: emit('open-detail', e.data.id) 또는 라우팅
  // 현재는 콘솔만:
  console.debug('open detail:', e.data?.id);
}

/** 닫기 */
function emitClose() {
  open.value = false;
}

/** 마운트/해제 */
onMounted(async () => {
  await seedIfEmpty();
  // 단축키: Delete 로 선택 삭제
  window.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  api.value = null; // GC 유도
  window.removeEventListener('keydown', onKeydown);
});

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === 'Delete' && selIds.value.length > 0) {
    e.preventDefault();
    onBulkDelete();
  }
}
</script>

<style scoped>
/* 필요 시 팝업 내부 여백/반응형 조정 */
</style>
