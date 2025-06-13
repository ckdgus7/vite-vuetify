/**
 * Cookie를 안전하게 다루기 위한 유틸 함수
 */
class CookieUtil {
  // 쿠키 저장
  static set(name: string, value: string, days?: number, path: string = '/'): void {
    try {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
      }
      document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`;
    } catch (error) {
      console.error(`Cookie set error for "${name}":`, error);
    }
  }

  // 쿠키 읽기
  static get(name: string): string | null {
    try {
      const nameEQ = name + '=';
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(nameEQ)) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }
      return null;
    } catch (error) {
      console.error(`Cookie get error for "${name}":`, error);
      return null;
    }
  }

  // 쿠키 수정 (실제로는 set으로 덮어쓰기)
  static update(name: string, value: string, days?: number, path: string = '/'): void {
    CookieUtil.set(name, value, days, path);
  }

  // 쿠키 삭제
  static remove(name: string, path: string = '/'): void {
    CookieUtil.set(name, '', -1, path);
  }
}

export default CookieUtil;
