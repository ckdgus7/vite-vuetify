import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useMyTemplateDB, type MyTemplateItem } from '@/_builder/composables/useMyTemplateDB';
import { customAlphabet } from 'nanoid';

const nano = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 12);

export const useMyTemplateStore = defineStore('myTemplateStore', () => {
  const { list: dbList, get: dbGet, put: dbPut, remove: dbRemove } = useMyTemplateDB();

  const items = ref<MyTemplateItem[]>([]);
  const loading = ref(false);
  const keyword = ref('');

  const filtered = computed(() => items.value);

  const fetch = async () => {
    loading.value = true;
    try {
      items.value = await dbList(keyword.value.trim() || undefined);
    } finally {
      loading.value = false;
    }
  };

  const getById = async (id: string) => dbGet(id);

  const create = async (payload: { name: string; templateCode: string }) => {
    const item: MyTemplateItem = {
      id: nano(),
      name: payload.name.trim(),
      templateCode: payload.templateCode.trim(),
      createdAt: Date.now(),
    };
    await dbPut(item);
    await fetch();
    return item.id;
  };

  const update = async (id: string, payload: { name: string; templateCode: string }) => {
    const prev = await dbGet(id);
    if (!prev) throw new Error('존재하지 않는 파일입니다.');
    const next: MyTemplateItem = {
      ...prev,
      name: payload.name.trim(),
      templateCode: payload.templateCode.trim(),
    };
    await dbPut(next);
    await fetch();
  };

  const remove = async (id: string) => {
    await dbRemove(id);
    await fetch();
  };

  return { items, loading, keyword, filtered, fetch, getById, create, update, remove };
});
