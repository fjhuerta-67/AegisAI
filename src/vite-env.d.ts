/// <reference types="vite/client" />

// Build-time settings (baked into the bundle by Vite; see Dockerfile build args).
interface ImportMetaEnv {
  /** Comma-separated email domains allowed to sign in (exact match), or '*' for any Google account. */
  readonly VITE_ALLOWED_DOMAINS?: string;
  /** 'true' shows the demo-mode button that bypasses Google sign-in. Leave unset for real deployments. */
  readonly VITE_ENABLE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}
