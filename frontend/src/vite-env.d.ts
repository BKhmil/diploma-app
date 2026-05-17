/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_URL?: string;
  readonly VITE_STRAPI_LOCALE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
