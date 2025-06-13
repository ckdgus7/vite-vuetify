/**
 * sessionStorage에서 안전하게 데이터를 다루기 위한 유틸 함수
 */

class SessionStorageUtil {
  // 데이터 저장
  static set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`sessionStorage set error for key "${key}":`, error);
    }
  }

  // 데이터 가져오기
  static get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`sessionStorage get error for key "${key}":`, error);
      return null;
    }
  }

  // 데이터 수정 (기존 값 불러와서 병합)
  static update<T extends object>(key: string, newValue: Partial<T>): void {
    try {
      const existing = SessionStorageUtil.get<T>(key);
      if (existing) {
        const updated = { ...existing, ...newValue };
        SessionStorageUtil.set(key, updated);
      } else {
        // 존재하지 않으면 새로 저장
        SessionStorageUtil.set(key, newValue);
      }
    } catch (error) {
      console.error(`sessionStorage update error for key "${key}":`, error);
    }
  }

  // 데이터 삭제
  static remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`sessionStorage remove error for key "${key}":`, error);
    }
  }

  // 전체 sessionStorage 초기화 (주의!)
  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("sessionStorage clear error:", error);
    }
  }
}

export default SessionStorageUtil;
