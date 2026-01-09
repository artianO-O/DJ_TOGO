/**
 * Server API 示例
 * 
 * 文件命名规则：
 * - hello.get.ts  -> GET /api/hello
 * - hello.post.ts -> POST /api/hello
 * - hello.ts      -> 任意 HTTP 方法
 * 
 * 访问方式：
 * const { data } = await useFetch('/api/hello')
 */
export default defineEventHandler((event) => {
  return {
    message: 'Hello from Nuxt Server API!',
    timestamp: new Date().toISOString(),
    method: event.method
  }
})


