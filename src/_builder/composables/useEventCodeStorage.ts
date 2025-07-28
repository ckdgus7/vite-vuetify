export const useEventCodeStorage = () => {
  const saveCode = async (id: string, code: string) => {
    localStorage.setItem(`event-code:${id}`, code)
  }

  const getCode = async (id: string): Promise<string | null> => {
    return localStorage.getItem(`event-code:${id}`)
  }

  return { saveCode, getCode }
}
