/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_NAME: string
  readonly VITE_DEFAULT_ROUNDS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}