// composables/useRuntimeFunctions.ts
import { useRouter } from 'vue-router';
import { useFormStore } from '@/_builder/stores/useFormStore';
import axios from 'axios';

export function useRuntimeFunctions() {
  const formStore = useFormStore();
  const router = useRouter();

  const submitForm = async (el: any) => {
    if (!el?.props?.apiUrl) {
      console.warn('API URL이 없습니다');
      return;
    }

    const url = el.props.apiUrl;
    const method = (el.props.apiMethod || 'POST').toUpperCase();
    const successMessage = el.props.successMessage || '요청 성공';
    const errorMessage = el.props.errorMessage || '요청 실패';
    const redirectPath = el.props.redirectPath || '/';

    try {
      let res;

      switch (method) {
        case 'GET':
          res = await axios.get(url, {
            params: el.props.apiParams || formStore.formData,
          });
          break;
        case 'POST':
          res = await axios.post(url, el.props.apiPayload || formStore.formData);
          break;
        case 'PATCH':
          res = await axios.patch(url, el.props.apiPayload || formStore.formData);
          break;
        case 'PUT':
          res = await axios.put(url, el.props.apiPayload || formStore.formData);
          break;
        case 'DELETE':
          res = await axios.delete(url, {
            params: el.props.apiParams || formStore.formData,
          });
          break;
        default:
          alert(`지원하지 않는 요청 방식: ${method}`);
          return;
      }

      alert(successMessage);

      // ✅ 성공 후 리다이렉션 처리
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (e) {
      console.error(e);
      alert(errorMessage);
    }
  };

  const alertMessage = (msg: string) => {
    alert(msg);
  };

  const resetForm = () => {
    formStore.resetForm();
  };

  return {
    submitForm,
    alertMessage,
    resetForm,
  };
}
