<template>
  <div>
    <v-dialog v-model="value" width="auto">
      <v-card v-bind="{ ...props.options.body }">
        <template v-slot:actions>
          <v-btn v-bind="{ ...props.options.btn }" @click="value = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const value = defineModel<boolean>('value');
const props = defineProps(['options']);
</script>
