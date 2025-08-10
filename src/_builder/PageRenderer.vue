<template>
  <v-container class="py-6">
    <ElementWrapper v-for="el in pageElements" :key="el.id" :element="el" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ElementWrapper from '@/_builder/components/ElementWrapper.vue';
import { getPageByPath } from '@/_builder/composables/useIdbPage';

const route = useRoute();
const pageElements = ref<any[]>([]);

onMounted(async () => {
  const fullPath = route.fullPath; // 예: "/page/home"
  const page = await getPageByPath(fullPath);
  if (page) {
    pageElements.value = JSON.parse(page.schema);
  } else {
    console.warn('페이지 데이터 없음');
  }
});
</script>
