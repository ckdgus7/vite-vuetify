import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface Columns {
  id: string;
  name: string;
  dataType: string;
}
export interface DataMap {
  id: string;
  type: string;
  columns: Columns[];
  datas: Record<string, any>;
}
export interface DataListMap {
  id: string;
  type: string;
  columns: Columns[];
  datas: any[];
}

export const useDataCollectionStore = defineStore('data-collection', () => {
  // const dataMap = ref<any[]>([]);
  // const dataListMap = ref<any[]>([]);
  const dataMap = ref<DataMap[]>([
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
        firstName: '최',
        lastName: '창현',
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
        email: 'niceckdgus7@naver.com',
        telephone: '010-2744-9307',
      },
    },
  ]);
  const dataListMap = ref<DataListMap[]>([
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

  function setDataMap(value: DataMap[]) {
    if (value) dataMap.value = value;
    console.log(value);
  }

  function getDataMap(id: string): DataMap | undefined {
    const data = dataMap.value.find((map) => {
      return map.id === id;
    });
    return data;
  }

  function setDataListMap(value: DataListMap[]) {
    dataListMap.value = value;
    console.log(value);
  }

  function getDataListMap(id: string): DataListMap | undefined {
    const data = dataListMap.value.find((listMap: any) => {
      return listMap.id === id;
    });
    return data;
  }

  const getAllDataMap = computed(() => dataMap);
  const getAllDataListMap = computed(() => dataListMap);

  const getDataSchema = () => {
    return dataMap.value.map((d: any) => d.id);
  };
  const getDataKey = () => {
    const returnVal = dataMap.value.reduce((accumulator: any[], currentValue) => {
      let title: any = '';
      currentValue.columns.forEach((col, i) => {
        title = `${currentValue.id}:${col.id}`;
        accumulator.push(title);
      });
      return accumulator;
    }, []);
    return returnVal;
  };
  const getDataListSchema = () => {
    return dataListMap.value.map((d: any) => d.id);
  };
  const getDataListKey = () => {
    const returnVal = dataListMap.value.reduce((accumulator: any[], currentValue) => {
      let title: any = '';
      currentValue.columns.forEach((col, i) => {
        title = `${currentValue.id}:${col.id}`;
        accumulator.push(title);
      });
      return accumulator;
    }, []);
    return returnVal;
  };

  return {
    dataListMap,
    setDataMap,
    getDataMap,
    setDataListMap,
    getDataListMap,
    getAllDataMap,
    getAllDataListMap,
    getDataSchema,
    getDataKey,
    getDataListSchema,
    getDataListKey,
  };
});
