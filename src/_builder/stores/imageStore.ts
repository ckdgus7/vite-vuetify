import { defineStore } from 'pinia';
// import type { ImageItem } from '@/_builder/composables/useImageDB';
import { useImageDB, type ImageItem } from '@/_builder/composables/useImageDB';

type State = {
  items: ImageItem[];
  loading: boolean;
  error: string | null;
};

export const useImageStore = defineStore('image', {
  state: (): State => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const db = useImageDB();
        this.items = (await db.list()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } catch (e: any) {
        this.error = e?.message ?? '불러오기 실패';
      } finally {
        this.loading = false;
      }
    },
    async createOne(payload: { name: string; downloadUrl: string }) {
      const db = useImageDB();
      const created = await db.add(payload);
      this.items.unshift(created);
      return created.id;
    },
    async updateOne(id: string, patch: { name?: string; downloadUrl?: string }) {
      const db = useImageDB();
      const updated = await db.update(id, patch);
      if (!updated) return false;
      const idx = this.items.findIndex((i) => i.id === id);
      if (idx !== -1) this.items[idx] = updated;
      return true;
    },
    async removeOne(id: string) {
      const db = useImageDB();
      await db.remove(id);
      this.items = this.items.filter((i) => i.id !== id);
    },
  },
});
