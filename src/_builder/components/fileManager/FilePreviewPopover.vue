<!-- src/_builder/modules/files/components/FilePreviewPopover.vue -->
<template>
  <v-menu open-on-hover location="bottom" :close-on-content-click="false">
    <template #activator="{ props }">
      <!-- hover 시 미리보기, 클릭 시 다운로드 -->
      <span v-bind="props" class="cursor-pointer">
        <a
          href="#"
          class="text-primary text-decoration-underline"
          @click.prevent="() => onDownload()"
          @keydown.enter.prevent="() => onDownload()"
        >
          {{ shortUrl }}
        </a>
      </span>
    </template>

    <v-card min-width="320" max-width="520" class="ma-2">
      <v-card-text>
        <div v-if="type === 'image'" class="d-flex justify-center">
          <v-img :src="url" :alt="url" max-width="480" max-height="360" cover />
        </div>
        <div v-else-if="type === 'pdf'" style="width: 480px; height: 360px">
          <embed :src="url" type="application/pdf" style="width: 100%; height: 100%" />
        </div>
        <div v-else class="text-body-2">
          미리보기를 지원하지 않는 형식입니다. 링크를 클릭하면 다운로드됩니다.
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDownloader } from '@/_builder/composables/useDownloader';

const props = defineProps<{ url: string; filename?: string }>();

const shortUrl = computed(() => (props.url.length > 40 ? props.url.slice(0, 38) + '…' : props.url));

const type = computed<'image' | 'pdf' | 'other'>(() => {
  const u = props.url.toLowerCase();
  if (/(\\.png|\\.jpg|\\.jpeg|\\.gif|\\.webp|\\.bmp)(\\?|$)/.test(u)) return 'image';
  if (/(\\.pdf)(\\?|$)/.test(u)) return 'pdf';
  return 'other';
});

const { downloadByUrl } = useDownloader();
const onDownload = async () => {
  await downloadByUrl(props.url, props.filename);
};
</script>
