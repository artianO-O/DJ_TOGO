/**
 * 动态路由 API 示例
 * 
 * 文件路径：server/api/users/[id].get.ts
 * 对应 API：GET /api/users/:id
 * 
 * 访问示例：
 * const { data } = await useFetch('/api/users/1')
 */

// 模拟用户数据
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
]

export default defineEventHandler((event) => {
  // 获取路由参数
  const id = Number(getRouterParam(event, 'id'))

  // 查找用户
  const user = users.find(u => u.id === id)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: `User with id ${id} not found`
    })
  }

  return {
    success: true,
    data: user
  }
})


