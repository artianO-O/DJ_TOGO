// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  // 启用 pages 功能
  pages: true,

  // 禁用 SSR，使用 SPA 模式（更适合学习）
  ssr: false,
});
