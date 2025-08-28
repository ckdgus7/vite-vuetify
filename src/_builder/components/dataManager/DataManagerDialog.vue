<template>
  <v-dialog v-model="store.isOpen" max-width="1200" :scrim="true" persistent>
    <v-card min-width="1000">
      <div class="px-2 pt-2 d-flex align-center">
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="store.close">닫기</v-btn>
      </div>
      <v-card-title class="text-subtitle-1 font-medium">DataCollection Editor</v-card-title>

      <v-card-subtitle class="pt-0">
        <v-tabs v-model="store.activeTab" density="comfortable">
          <v-tab value="dataMap">dataMap</v-tab>
          <v-tab value="dataListMap">dataListMap</v-tab>
        </v-tabs>
      </v-card-subtitle>

      <v-card-text class="pt-0">
        <!-- 상단 제어바 -->
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center ga-2">
            <template v-if="store.activeTab === 'dataMap'">
              <v-select
                v-model="store.selectedDataMapKey"
                :items="store.dataMapKeys"
                density="compact"
                hide-details
                label="dataMap ID"
                style="min-width: 240px"
                @update:model-value="(k) => store.loadDataMap(k)"
              />
              <v-btn variant="text" @click="() => store.newDataMap()">
                <v-icon start>mdi-plus-box-multiple-outline</v-icon>
                신규
              </v-btn>
              <v-btn variant="text" @click="() => onRename('dataMap')">
                <v-icon start>mdi-rename-outline</v-icon>
                ID 변경
              </v-btn>
              <v-btn variant="text" color="error" @click="() => store.deleteDataMap()">
                <v-icon start>mdi-trash-can-outline</v-icon>
                삭제
              </v-btn>
            </template>

            <template v-else>
              <v-select
                v-model="store.selectedDataListMapKey"
                :items="store.dataListMapKeys"
                density="compact"
                hide-details
                label="dataListMap ID"
                style="min-width: 240px"
                @update:model-value="(k) => store.loadDataListMap(k)"
              />
              <v-btn variant="text" @click="() => store.newDataListMap()">
                <v-icon start>mdi-plus-box-multiple-outline</v-icon>
                신규
              </v-btn>
              <v-btn variant="text" @click="() => onRename('dataListMap')">
                <v-icon start>mdi-rename-outline</v-icon>
                ID 변경
              </v-btn>
              <v-btn variant="text" color="error" @click="() => store.deleteDataListMap()">
                <v-icon start>mdi-trash-can-outline</v-icon>
                삭제
              </v-btn>
            </template>
          </div>

          <div class="d-flex align-center ga-2">
            <v-btn variant="tonal" @click="() => apply(false)">Apply</v-btn>
            <v-btn color="primary" @click="() => apply(true)">Apply and Close</v-btn>
            <v-btn variant="text" @click="() => store.close()">Cancel</v-btn>
          </div>
        </div>

        <v-window v-model="store.activeTab">
          <v-window-item value="dataMap">
            <DataMapEditor />
          </v-window-item>
          <v-window-item value="dataListMap">
            <DataListMapEditor />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn variant="flat" color="primary" @click="store.close">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDataCollectionsStore } from '@/_builder/stores/useDataCollectionsStore';
import DataMapEditor from '@/_builder/components/dataManager/DataMapEditor.vue';
import DataListMapEditor from '@/_builder/components/dataManager/DataListMapEditor.vue';

const store = useDataCollectionsStore();

const apply = async (close: boolean) => {
  if (store.activeTab === 'dataMap') {
    await store.saveDataMap();
  } else {
    await store.saveDataListMap();
  }
  if (close) store.close();
};

const onRename = async (type: 'dataMap' | 'dataListMap') => {
  const newKey = prompt('새 ID를 입력하세요');
  if (!newKey) return;
  try {
    if (type === 'dataMap') {
      await store.renameDataMap(newKey);
    } else {
      await store.renameDataListMap(newKey);
    }
  } catch (e: any) {
    alert(e?.message ?? 'ID 변경 실패');
  }
};
</script>

<style scoped>
/* ag-grid는 각 에디터에서 개별 import */
</style>
