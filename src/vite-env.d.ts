/// <reference types="vite/client" />

/**
 * Augments the NodeJS namespace to include type definitions for environment variables
 * accessed via `process.env`. This ensures TypeScript recognizes these variables,
 * especially `API_KEY` which is injected by Vite's `define` configuration.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The API key for the Gemini service.
     * This is defined in `vite.config.ts` and injected at build time.
     */
    readonly API_KEY: string;
  }
}
