// global.d.ts

declare module 'vite-plugin-raw' {
    const content: any;
    export default content;
  }
  
  declare module '*.css?raw' {
    const content: string;
    export default content;
  }
  
  declare module '*.txt?raw' {
    const content: string;
    export default content;
  }