// src/_builder/modules/files/composables/useDownloader.ts
import { ref } from 'vue';

export function useDownloader() {
  const downloading = ref(false);

  const downloadByUrl = async (url: string, filename?: string) => {
    if (!url) return;
    downloading.value = true;
    let objectUrl: string | null = null;
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`다운로드 실패: ${res.status}`);
      const blob = await res.blob();
      objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename || guessFileName(url);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      // fetch/CORS 실패 시 브라우저 기본 다운로드 시도 (동일 출처/적절한 CORS에 한해 동작)
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || guessFileName(url);
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      downloading.value = false;
    }
  };

  const guessFileName = (url: string) => {
    try {
      const u = new URL(url);
      const last = u.pathname.split('/').filter(Boolean).pop() || 'download';
      return decodeURIComponent(last);
    } catch {
      // 절대/상대경로 혼재 시
      const last = url.split('?')[0].split('/').filter(Boolean).pop() || 'download';
      try {
        return decodeURIComponent(last);
      } catch {
        return last;
      }
    }
  };

  return { downloading, downloadByUrl };
}
