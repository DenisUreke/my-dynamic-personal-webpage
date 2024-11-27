import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Denis-Ureke-Website/',
});

declare module '*.css?raw' {
    const content: string;
    export default content;
  }

declare module'*.txt?raw'{
  const content: string;
  export default content;
}