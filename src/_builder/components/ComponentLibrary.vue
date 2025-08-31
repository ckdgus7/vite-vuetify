<template>
  <v-card>
    <v-list>
      <v-list-item
        v-for="item in componentList"
        :key="item.type"
        @dragstart="
          (e: DragEvent) =>
            onDragStart(e, item.type, item.label, item.styles, item.cssClass, item.props)
        "
      >
        <div draggable="true">
          <v-list-item-title class="ex-font-size">
            <v-icon size="small" start>{{ item.mdi }}</v-icon>
            {{ item.label }}
          </v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
interface CompList {
  type: string;
  label: string;
  mdi: string;
  cssClass?: string;
  styles?: Record<string, any>;
  props?: Record<string, any>;
}
const componentList: CompList[] = [
  {
    type: 'group',
    label: '그룹',
    mdi: 'mdi-group',
    styles: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '100px',
      minHeight: '100px',
    },
  },
  {
    type: 'v-btn',
    label: 'button',
    mdi: 'mdi-gesture-tap-button',
    props: {
      density: 'default',
      disabled: false,
      exact: false,
      flat: true,
      readonly: false,
      size: 'default',
      slim: false,
      text: '버튼1',
      tile: false,
      variant: 'elevated',
    },
  },
  {
    type: 'my-text-field',
    label: 'input',
    mdi: 'mdi-form-textbox',
    props: {
      autofocus: false,
      clearable: false,
      density: 'compact',
      details: false,
      direction: 'horizontal',
      dirty: false,
      disabled: false,
      flat: true,
      focused: false,
      'hide-details': true,
      'hide-spin-buttons': true,
      'min-width': 200,
      readonly: false,
      tile: false,
      variant: 'filled',
    },
  },
  {
    type: 'my-autocomplete',
    label: 'autocomplete',
    mdi: 'mdi-form-dropdown',
    props: {
      autofocus: false,
      chips: false,
      clearable: false,
      density: 'compact',
      details: false,
      disabled: false,
      flat: true,
      focused: false,
      'hide-details': true,
      'hide-no-data': true,
      'hide-selected': true,
      'hide-spin-buttons': true,
      items: [
        {
          title: 'List1',
          value: 'list1',
        },
        {
          title: 'List2',
          value: 'list2',
        },
      ],
      'item-title': 'title',
      'item-value': 'value',
      multiple: false,
      'no-auto-scroll': false,
      'no-filter': false,
      readonly: false,
      tile: false,
      variant: 'filled',
    },
  },
  {
    type: 'my-textarea',
    label: 'textarea',
    mdi: 'mdi-form-textarea',
    props: {
      autofocus: false,
      'auto-grow': false,
      clearable: false,
      counter: false,
      density: 'compact',
      details: false,
      direction: 'horizontal',
      dirty: false,
      disabled: false,
      flat: true,
      focused: false,
      'hide-details': true,
      'hide-spin-buttons': true,
      'no-resize': false,
      readonly: false,
      rows: 5,
      tile: false,
      variant: 'filled',
    },
  },
  {
    type: 'v-checkbox',
    label: 'checkbox',
    mdi: 'mdi-checkbox-marked-outline',
    props: {
      density: 'compact',
      direction: 'horizontal',
      disabled: false,
      label: 'text1',
      focused: false,
      'hide-details': true,
      'hide-spin-buttons': true,
      multiple: false,
      readonly: false,
    },
  },
  {
    type: 'my-checkbox-group',
    label: 'checkbox-group',
    mdi: 'mdi-checkbox-multiple-marked-outline',
    props: {
      density: 'compact',
      direction: 'horizontal',
      disabled: false,
      focused: false,
      'hide-details': true,
      'hide-spin-buttons': true,
      items: [
        {
          label: '남',
          value: 'M',
        },
        {
          label: '여',
          value: 'F',
        },
      ],
      multiple: false,
      readonly: false,
    },
  },
  {
    type: 'my-radio-group',
    label: 'radio-group',
    mdi: 'mdi-radiobox-marked',
    props: {
      density: 'compact',
      direction: 'horizontal',
      disabled: false,
      'hide-details': true,
      'hide-spin-buttons': true,
      items: [
        {
          label: '남',
          value: 'M',
        },
        {
          label: '여',
          value: 'F',
        },
      ],
      inline: true,
      readonly: false,
    },
  },
  {
    type: 'my-combobox',
    label: 'combobox',
    mdi: 'mdi-form-select',
    props: {
      autofocus: false,
      clearable: false,
      density: 'compact',
      details: false,
      direction: 'horizontal',
      disabled: false,
      eager: false,
      flat: true,
      focused: false,
      'hide-details': true,
      'hide-no-data': false,
      'hide-selected': false,
      'hide-spin-buttons': true,
      items: [
        {
          title: 'List1',
          value: 'list1',
        },
        {
          title: 'List2',
          value: 'list2',
        },
      ],
      'item-title': 'title',
      'item-value': 'value',
      multiple: false,
      'no-auto-scroll': false,
      'no-filter': false,
      'open-on-clear': false,
      readonly: false,
      tile: false,
      variant: 'filled',
    },
  },
  {
    type: 'my-file-input',
    label: 'file-input',
    mdi: 'mdi-file-upload-outline',
    props: {
      clearable: false,
      density: 'compact',
      details: false,
      direction: 'horizontal',
      dirty: false,
      disabled: false,
      flat: true,
      focused: false,
      'hide-details': true,
      'hide-input': false,
      'hide-spin-buttons': true,
      multiple: false,
      readonly: false,
      'show-size': false,
      tile: false,
      variant: 'filled',
    },
  },
  {
    type: 'my-select',
    label: 'Select',
    mdi: 'mdi-form-select',
    props: {
      autofocus: false,
      clearable: false,
      density: 'compact',
      details: false,
      direction: 'horizontal',
      disabled: false,
      eager: false,
      flat: true,
      focused: false,
      'hide-details': true,
      'hide-no-data': false,
      'hide-selected': false,
      'hide-spin-buttons': true,
      items: [
        {
          title: 'List1',
          value: 'list1',
        },
        {
          title: 'List2',
          value: 'list2',
        },
      ],
      'item-title': 'title',
      'item-value': 'value',
      multiple: false,
      'no-auto-scroll': false,
      'open-on-clear': false,
      readonly: false,
      tile: false,
      variant: 'filled',
    },
  },
  {
    type: 'my-switch',
    label: 'switch',
    mdi: 'mdi-toggle-switch-outline',
    props: {
      density: 'compact',
      direction: 'horizontal',
      disabled: false,
      flat: true,
      focused: false,
      'hide-details': true,
      'hide-spin-buttons': true,
      multiple: false,
      readonly: false,
    },
  },
  {
    type: 'v-chip',
    label: 'chip',
    mdi: 'mdi-shape-oval-plus',
    props: {
      border: false,
      density: 'compact',
      pill: false,
      size: 'default',
      tile: false,
      variant: 'tonal',
    },
  },
  {
    type: 'v-img',
    label: 'img',
    mdi: 'mdi-image-outline',
    props: {
      cover: false,
      inline: false,
      tile: false,
      height: 250,
      src: 'http://localhost:5050/232-500x300.jpg',
      transition: 'fade-transition',
    },
  },
  {
    type: 'my-date-input',
    label: 'date-input',
    mdi: 'mdi-calendar-month-outline',
    props: {
      'allowed-dates': [],
      'allowed-months': [],
      'allowed-years': [],
      autofocus: false,
      border: false,
      'cancel-text': '취소',
      clearable: false,
      density: 'compact',
      details: false,
      direction: 'horizontal',
      dirty: false,
      disabled: false,
      divided: false,
      flat: true,
      focused: false,
      'hide-actions': true,
      'hide-details': true,
      'hide-header': true,
      'hide-spin-buttons': true,
      'hide-weekdays': true,
      multiple: false,
      'ok-text': '확인',
      readonly: false,
      'show-week': false,
      tile: false,
      variant: 'filled',
      'view-mode': 'month',
      'weeks-in-month': 'static',
    },
  },
  {
    type: 'my-file-uploader',
    label: 'file-uploader',
    mdi: 'mdi-file-upload-outline',
    props: {
      clearable: false,
      density: 'compact',
      dirty: false,
      disabled: false,
      'hide-browse': true,
      multiple: false,
      'show-size': false,
      tile: false,
    },
  },
  {
    type: 'my-data-table',
    label: 'data table',
    mdi: 'mdi-table',
    props: {
      density: 'compact',
      'fixed-footer': false,
      'fixed-header': false,
      // headers: [
      //   // { title: 'ID', align: 'center', sortable: false, key: 'id' },
      //   // { title: 'Plant', align: 'start', sortable: false, key: 'name' },
      //   // { title: 'Light', align: 'end', key: 'light' },
      //   // { title: 'Height', align: 'end', key: 'height' },
      //   // { title: 'Pet Friendly', align: 'end', key: 'petFriendly' },
      //   // { title: 'Price ($)', align: 'end', key: 'price' },
      // ],
      // items: [
      //   {
      //     // id: '1',
      //     // name: 'Fern',
      //     // light: 'Low',
      //     // height: '20cm',
      //     // petFriendly: 'Yes',
      //     // price: 20,
      //   },
      // ],
      'hide-default-body': false,
      'hide-default-footer': false,
      'hide-default-header': false,
      'hide-no-data': false,
      'items-per-page': '10',
      loading: false,
      sticky: false,
    },
  },
  {
    type: 'my-tabs',
    label: 'tabs',
    mdi: 'mdi-tab',
    props: {
      'align-tabs': 'start',
      'center-active': false,
      density: 'compact',
      disabled: false,
      'hide-slider': false,
      items: [
        {
          text: 'tab1',
          color: 'success',
        },
        {
          text: 'tab2',
          color: 'success',
        },
      ],
      'selected-class': 'v-tab-item--selected',
      'show-arrows': false,
    },
  },
  {
    type: 'my-note-box',
    label: 'Note box',
    mdi: 'mdi-note-outline',
    props: {
      title: 'Editing...',
    },
    cssClass: '',
  }, // 사용자 정의 컴포넌트
  {
    type: 'my-subject-text',
    label: 'Subject Text',
    mdi: 'mdi-format-title',
    props: {
      title: 'Editing...',
    },
    cssClass: '',
  }, // 사용자 정의 컴포넌트
  {
    type: 'my-page-title',
    label: 'Page Ttile',
    mdi: 'mdi-page-layout-header',
    props: {
      title: 'Home',
      breadcrumbs: [
        {
          title: 'Home',
        },
        {
          title: 'Test',
        },
      ],
    },
    cssClass: '',
  }, // 사용자 정의 컴포넌트
  {
    type: 'my-ck-editor',
    label: 'CKEditor',
    mdi: 'mdi-file-document-edit-outline',
    cssClass: '',
  }, // CKEditor 컴포넌트
  {
    type: 'my-ag-grid',
    label: 'AG Grid',
    mdi: 'mdi-grid-large',
    props: {
      columnDefs: [
        { field: 'mission' },
        { field: 'company' },
        { field: 'location' },
        { field: 'date' },
        { field: 'price' },
        { field: 'successful' },
        { field: 'rocket' },
      ],
      // apiUrl: 'https://www.ag-grid.com/example-assets/space-mission-data.json',
    },
    cssClass: '',
  }, // AG Grid 컴포넌트
  {
    type: 'my-carousel',
    label: 'Carousel',
    mdi: 'mdi-view-carousel',
    props: {
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        },
      ],
    },
    cssClass: '',
  },
  {
    type: 'my-card',
    label: 'Card',
    mdi: 'mdi-card-text-outline',
    props: {
      topImage: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      title: 'Subject를 입력하세요',
      contents: 'Contents를 입력하세요',
    },
    cssClass: '',
  },
  {
    type: 'my-footer',
    label: 'Footer',
    mdi: 'mdi-page-layout-footer',
    cssClass: '',
  },
];

const onDragStart = (
  e: DragEvent,
  type: string,
  label: string,
  styles: any,
  cssClass: any,
  props: any
) => {
  e.dataTransfer?.setData('component-type', type);
  e.dataTransfer?.setData('component-label', label);
  e.dataTransfer?.setData('component-styles', JSON.stringify(styles || {}));
  e.dataTransfer?.setData('component-class', cssClass);
  e.dataTransfer?.setData('component-props', JSON.stringify(props || {}));
};
</script>
<style scoped>
.ex-font-size {
  font-size: 14px;
}
</style>
