/// <reference types="svelte" />
/// <reference types="vite/client" />

declare global {
  namespace svelteHTML {
    interface HTMLAttributes<T> {
      [key: string]: any;
    }
  }
}

export {};
