import { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    switch (status) {
      case 400 :
        return '잘못된 요청입니다.';
      case 401 :
        return '인증이 필요합니다.';
      case 403 :
        return '접근 권한이 없습니다.';
      case 404 :
        return '요청한 리소스를 찾을 수 없습니다.';
      case 500 :
        return '서버 오류가 발생했습니다.';
      default :
        return '알 수 없는 오류입니다..';
    }
  }
}
