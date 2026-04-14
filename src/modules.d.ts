declare module 'nprogress' {
  const NProgress: any
  export default NProgress
}

declare module 'jsencrypt' {
  export class JSEncrypt {
    constructor()
    setPublicKey(key: string): void
    encrypt(text: string): string | false
  }
}

declare module 'vue-cropper'
