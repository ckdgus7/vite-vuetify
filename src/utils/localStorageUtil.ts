/**
 * localStorage에서 안전하게 데이터를 다루기 위한 유틸 함수
 */

class LocalStorageUtil {
  // 데이터 저장
  static set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`localStorage set error for key "${key}":`, error);
    }
  }

  // 데이터 가져오기
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`localStorage get error for key "${key}":`, error);
      return null;
    }
  }

  // 데이터 수정 (기존 값 불러와서 병합)
  static merge<T extends object>(key: string, newValue: Partial<T>): void {
    try {
      const existing = LocalStorageUtil.get<T>(key);
      if (existing) {
        const updated = { ...existing, ...newValue };
        LocalStorageUtil.set(key, updated);
      } else {
        // 존재하지 않으면 새로 저장
        LocalStorageUtil.set(key, newValue);
      }
    } catch (error) {
      console.error(`localStorage update error for key "${key}":`, error);
    }
  }

  // 데이터 삭제
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`localStorage remove error for key "${key}":`, error);
    }
  }

  // 전체 localStorage 초기화 (주의!)
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("localStorage clear error:", error);
    }
  }
}

export default LocalStorageUtil;
