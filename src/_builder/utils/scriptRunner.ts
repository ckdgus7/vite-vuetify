// 사용자 코드(onMountedScript)를 안전하게 비동기 실행하기 위한 유틸
export async function runUserScript(code: string, ctx: Record<string, any>) {
  // eslint-disable-next-line no-new-func
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as {
    new (...args: string[]): (ctx: any) => Promise<any>;
  };

  const wrapped = `
    "use strict";
    return (async (ctx) => {
      try {
        ${code}
      } catch (err) {
        console.error('[onMounted script error]', err);
        throw err;
      }
    })(ctx);
  `;

  const fn = new AsyncFunction('ctx', wrapped);
  return fn(ctx);
}
