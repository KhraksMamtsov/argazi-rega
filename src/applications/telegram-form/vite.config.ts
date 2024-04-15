import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// console.log("TELEGRAM_APP_FORM_URL_PORT: ", process.env);
// https://vitejs.dev/config/
export default defineConfig((mode) => {
  return {
    server: {
      strictPort: true,
      // port: process["TELEGRAM_APP_FORM_URL_PORT"],
    },
    plugins: [vue()],
  };
});
