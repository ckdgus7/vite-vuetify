<script setup lang="ts">
import LocalStorageUtil from '@/utils/localStorageUtil';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
// import { useRouter } from 'vue-router';
const title = ref('');
const category = ref('');
const content = ref('');
const drawioXml = ref<string | null>(`<mxfile host="app.diagrams.net">
  <diagram name="Page-1" id="sampleDiagramId">
    <mxGraphModel dx="1180" dy="640" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- Box 1 -->
        <mxCell id="2" value="Start" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="180" y="120" width="120" height="60" as="geometry" />
        </mxCell>

        <!-- Box 2 -->
        <mxCell id="3" value="End" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="400" y="120" width="120" height="60" as="geometry" />
        </mxCell>

        <!-- Arrow from Box 1 to Box 2 -->
        <mxCell id="4" style="endArrow=block;html=1;strokeColor=#000000;" edge="1" parent="1" source="2" target="3">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`);
const DRAWIO_KEY = 'drawio-diagram';
const categories = ['일반 문의', '기술 지원', '계정 문제', '기타'];

// const router = useRouter();
onMounted(() => {
  // const saved = LocalStorageUtil.getItem(DRAWIO_KEY);
  // if (saved) {
  //   drawioXml.value = saved;
  // }
});
const reload = ref(false);
watch(drawioXml, (val) => {
  reload.value = true;
  LocalStorageUtil.set(DRAWIO_KEY, val);
  reload.value = false;
});
// URL-safe encode XML for draw.io viewer
const drawioXmlEncoded = computed(() => {
  try {
    const xml = drawioXml?.value ?? '';
    console.log(xml);
    return encodeURIComponent(xml)
      .replace(/%20/g, '+')
      .replace(/%2F/g, '/')
      .replace(/%3D/g, '=')
      .replace(/%3A/g, ':');
  } catch {
    return '';
  }
});
const onSubmit = () => {
  // if (!title.value || !category.value || !content.value) {
  //   alert('모든 항목을 입력해주세요.');
  //   return;
  // }
  // console.log({
  //   title: title.value,
  //   category: category.value,
  //   content: content.value,
  //   drawioXml: drawioXml.value,
  // });
  alert('입력이 완료되었습니다.');
  LocalStorageUtil.remove(DRAWIO_KEY);
  LocalStorageUtil.set(DRAWIO_KEY, drawioXml.value);
  drawioXml.value = LocalStorageUtil.get(DRAWIO_KEY);
  // router.push('/');
};
// const onCancel = () => {
//   if (confirm('작성을 취소하시겠습니까?')) {
//     router.back();
//   }
// };
const page = ref({ title: '요구사항등록' });
const breadcrumbs = shallowRef([
  {
    title: 'Others',
    disabled: false,
    href: '#',
  },
  {
    title: '요구사항등록',
    disabled: true,
    href: '#',
  },
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-card>
    <v-card-title class="text-h6">게시글 작성</v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <v-text-field v-model="title" label="제목" />
        <v-select v-model="category" :items="categories" label="문의유형" />
        <v-textarea v-model="content" label="내용" rows="6" auto-grow />
        <v-textarea
          v-model="drawioXml"
          label="Draw.io XML 저장"
          hint="Draw.io XML 데이터를 입력하거나 자동으로 저장됩니다."
          rows="6"
          auto-grow
          persistent-hint
        />
        <div class="mt-4">
          <label class="text-subtitle-1 mb-2 d-block">Draw.io 미리보기</label>
          <iframe
            v-if="!reload"
            :src="`https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1#R${drawioXmlEncoded}`"
            width="100%"
            height="600"
            frameborder="0"
            allowfullscreen
          ></iframe>
          <div v-else class="text-caption text-grey">
            Draw.io XML이 없거나 미리보기를 표시할 수 없습니다.
          </div>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <!-- <v-btn variant="text" @click="onCancel">취소</v-btn> -->
      <v-btn color="primary" @click="onSubmit">입력</v-btn>
    </v-card-actions>
  </v-card>
</template>
<style scoped>
.v-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
