<template>
  <v-container class="py-6">
    <ElementWrapper v-for="el in pageElements" :key="el.id" :element="el" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ElementWrapper from '@/_builder/components/ElementWrapper.vue';
import { getPageByPath } from '@/_builder/composables/useIdbPage';

const pageElements = ref<any[]>([]);

// import store from '@/_builder/stores/index';
// const collection = store.useDataCollectionStore();
// 컬렉션 데이터 설정 (테스트는 임시 지정)
// collectionApi rest api 호출 후 store에 데이터 설정
// collection.setDataMap(elements);
// collection.setDataListMap(elements);

const route = useRoute();

// onMounted(async () => {
//   const fullPath = route.fullPath; // 예: "/page/home"
//   const page = await getPageByPath(fullPath);
//   if (page) {
//     pageElements.value = JSON.parse(page.schema);
//   } else {
//     console.warn('페이지 데이터 없음');
//   }
// });
watch(
  () => route,
  async (r: any) => {
    const fullPath = route.fullPath; // 예: "/page/home"
    const page = await getPageByPath(fullPath);
    if (page) {
      pageElements.value = JSON.parse(page.schema);
    } else {
      console.warn('페이지 데이터 없음');
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
