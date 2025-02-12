import { TPerson } from "~/lib/api";

// utils/cache.ts
const cache = {
    get: (key: string): TPerson | undefined => {
      if (typeof window !== 'undefined') {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : undefined;
      }
    },
    set: (key: string, value: TPerson) => {
      if (typeof window !== 'undefined') {
        
        localStorage.setItem(key, JSON.stringify(value),);
      }
    },
    remove: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
  };
  
  export default cache;
  