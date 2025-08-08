import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDataCollectionStore = defineStore('data-collection', () => {
  // const dataMap = ref<any[]>([]);
  // const dataListMap = ref<any[]>([]);
  const dataMap = ref<any[]>([
    {
      id: 'nameDataMap',
      type: 'dataMap',
      columns: [
        {
          id: 'firstName',
          name: 'firstName',
          dataType: 'text',
        },
        {
          id: 'lastName',
          name: 'lastName',
          dataType: 'text',
        },
      ],
      datas: {
        firstName: '',
        lastName: '',
      },
    },
    {
      id: 'emailDataMap',
      type: 'dataMap',
      columns: [
        {
          id: 'email',
          name: 'email',
          dataType: 'text',
        },
        {
          id: 'telephone',
          name: 'telephone',
          dataType: 'text',
        },
      ],
      datas: {
        email: '',
        telephone: '',
      },
    },
  ]);
  const dataListMap = ref<any[]>([
    {
      id: 'missionDataListMap',
      type: 'dataListMap',
      columns: [
        {
          id: 'mission',
          name: 'mission',
          dataType: 'text',
        },
        {
          id: 'company',
          name: 'company',
          dataType: 'text',
        },
        {
          id: 'location',
          name: 'location',
          dataType: 'text',
        },
        {
          id: 'date',
          name: 'date',
          dataType: 'text',
        },
        {
          id: 'price',
          name: 'price',
          dataType: 'text',
        },
        {
          id: 'successful',
          name: 'successful',
          dataType: 'text',
        },
        {
          id: 'rocket',
          name: 'rocket',
          dataType: 'text',
        },
      ],
      datas: [
        {
          mission: '',
          company: '',
          location: '',
          date: '',
          price: '',
          successful: '',
          rocket: '',
        },
      ],
    },
    {
      id: 'mission2DataListMap',
      type: 'dataListMap',
      columns: [
        {
          id: 'mission_2',
          name: 'mission_2',
          dataType: 'text',
        },
        {
          id: 'company_2',
          name: 'company_2',
          dataType: 'text',
        },
        {
          id: 'location_2',
          name: 'location_2',
          dataType: 'text',
        },
        {
          id: 'date_2',
          name: 'date_2',
          dataType: 'text',
        },
        {
          id: 'price_2',
          name: 'price_2',
          dataType: 'text',
        },
        {
          id: 'successful_2',
          name: 'successful_2',
          dataType: 'text',
        },
        {
          id: 'rocket_2',
          name: 'rocket_2',
          dataType: 'text',
        },
      ],
      datas: [
        {
          mission_2: '',
          company_2: '',
          location_2: '',
          date_2: '',
          price_2: '',
          successful_2: '',
          rocket_2: '',
        },
      ],
    },
  ]);

  function setDataMap(value: any) {
    dataMap.value = value;
    console.log(value);
  }

  function getDataMap(id: string) {
    const data = dataMap.value.find((map: any) => {
      return map.id === id;
    });
    return data ?? '';
  }

  function setDataListMap(value: any) {
    dataListMap.value = value;
    console.log(value);
  }

  function getDataListMap(id: string) {
    const data = dataListMap.value.find((listMap: any) => {
      return listMap.id === id;
    });
    return data ?? '';
  }

  const getAllDataMap = computed(() => dataMap);
  const getAllDataListMap = computed(() => dataListMap);

  return {
    getAllDataMap,
    getAllDataListMap,
    dataListMap,
    setDataMap,
    getDataMap,
    setDataListMap,
    getDataListMap,
  };
});
