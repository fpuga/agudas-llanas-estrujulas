/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_NAME: string
  readonly VITE_DEFAULT_ROUNDS: string
  readonly VITE_COMPLETE_GAME_MODE: 'choice' | 'input'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}