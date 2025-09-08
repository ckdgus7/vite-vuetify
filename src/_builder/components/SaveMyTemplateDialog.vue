<template>
  <v-dialog v-model="dialog" max-width="640">
    <v-card>
      <v-card-title>My Template 저장</v-card-title>
      <v-card-text class="pt-2">
        <v-text-field v-model="myTemplateName" label="템플릿 이름" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="() => save()">저장</v-btn>
        <v-btn @click="() => (dialog = false)">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import store from '@/_builder/stores';

const dialog = ref(false);
const myTemplateName = ref('');

const builder = store.useBuilderStore();
const myTemplate = store.useMyTemplateStore();

const save = async () => {
  const templateCode = builder.saveSchema();
  myTemplate.create({ name: myTemplateName.value, templateCode });
  dialog.value = false;
};

defineExpose({ dialog });
</script>
