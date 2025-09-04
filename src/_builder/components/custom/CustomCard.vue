<template>
  <v-card class="mx-auto" max-width="400" min-width="300" :style="props.style">
    <v-img class="align-end text-white" height="200" :src="props.topImage" cover>
      <v-card-title>{{ props.title }}</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4" v-if="props.subTitle">{{ props.subTitle }}</v-card-subtitle>

    <v-card-text>
      <div>
        <pre>{{ props.contents }}</pre>
      </div>
    </v-card-text>

    <!-- <v-card-actions>
        <v-btn color="orange" text="Share"></v-btn>

        <v-btn color="orange" text="Explore"></v-btn>
      </v-card-actions> -->
  </v-card>
</template>

<script setup lang="ts">
// import { computed } from 'vue';

const props = defineProps<{
  topImage: string;
  title: string;
  subTitle: string;
  contents: string;
  style?: string;
}>();
const emits = defineEmits(['click']);

// const getTopImage = computed(() => {
//   return props.topImage ? props.topImage : 'https://cdn.vuetifyjs.com/images/cards/docks.jpg';
// });
// const getTitle = computed(() => {
//   return props.title ? props.title : 'Subject를 입력하세요';
// });
// const getSubTitle = computed(() => {
//   return props.subTitle ? props.subTitle : '';
// });
// const getContents = computed(() => {
//   return props.contents ? props.contents : 'Contents를 입력하세요';
// });
</script>
