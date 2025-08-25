// import pako from 'pako';

// const encode64 = (data: Uint8Array): string => {
//   const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
//   let result = ''
//   for (let i = 0; i < data.length; i += 3) {
//     const b1 = data[i]
//     const b2 = i + 1 < data.length ? data[i + 1] : 0
//     const b3 = i + 2 < data.length ? data[i + 2] : 0

//     const c1 = b1 >> 2
//     const c2 = ((b1 & 0x3) << 4) | (b2 >> 4)
//     const c3 = ((b2 & 0xf) << 2) | (b3 >> 6)
//     const c4 = b3 & 0x3f

//     result += alphabet.charAt(c1) + alphabet.charAt(c2) + alphabet.charAt(c3) + alphabet.charAt(c4)
//   }
//   return result
// }

// export const encodePlantUML = (uml: string): string => {
//   const deflated = pako.deflate(uml, { level: 9 })
//   return encode64(deflated)
// }
