import request from './http'

// !--------------- 登录 ---------------
// 登录
export const login = data => request.post('/login', data)

// !--------------- 用户管理 ---------------
export const Users = {
  // 获取用户数据列表
  getUsers: params => request.get('/users', { params }),
  // 添加用户
  createUser: data => request.post('/users', data),
  // 根据 Id 查询用户
  getUserById: id => request.get(`/users/${id}`),
  // 根据 Id 编辑用户
  updateUserById: (id, data) => request.put(`/users/${id}`, data),
  // 根据 Id 删除用户
  deleteUserById: id => request.delete(`/users/${id}`),

  // 修改用户状态
  setUserState: (id, type) => request.put(`/users/${id}/state/${type}`),
  // 根据 Id 分配用户角色
  updateUserRoleById: (id, data) => request.put(`/users/${id}`, data)
}
// !--------------- 角色管理 ---------------
export const Roles = {
  // 获取角色列表
  getRoles: () => request.get('/roles'),
  // 添加角色
  createRole: data => request.post('/roles', data),
  // 根据 Id 查询角色
  getRoleById: id => request.get(`/roles/${id}`),
  // 根据 Id 编辑角色
  updateRoleById: (id, data) => request.put(`/roles/${id}`, data),
  // 根据 Id 删除角色
  deleteRoleById: id => request.delete(`/roles/${id}`),

  // 根据 Id 授权角色
  updateRoleRightById: (id, data) => request.post(`/roles/${id}/rights`, data),
  // 根据 Id 删除角色指定权限
  deleteRoleRightById: (roleId, rightId) => request.delete(`/roles/${roleId}/rights/${rightId}`)
}

// !--------------- 权限管理 ---------------
// 获取所有权限列表
export const getRights = type => request.get(`/rights/${type}`)

// 获取左侧菜单
export const getMenus = () => request.get('/menus')

// !--------------- 商品分类管理 ---------------
export const Categories = {
  // 获取商品分类列表
  getCategories: params => request.get('/categories', { params }),
  // 添加商品分类
  createCategory: data => request.post('/categories', data),
  // 根据 Id 查询商品分类
  getCategoryById: id => request.get(`/categories/${id}`),
  // 根据 Id 编辑商品分类
  updateCategoryById: (id, data) => request.put(`/categories/${id}`, data),
  // 根据 Id 删除角色
  deleteCategoryById: id => request.delete(`/categories/${id}`)
}

// !--------------- 商品分类参数管理 ---------------
export const CategoriesAttributes = {
  // 根据 Id 获取商品分类参数列表
  getAttributesById: (id, params) => request.get(`/categories/${id}/attributes`, { params }),
  // 根据 Id 添加商品 动态参数或者静态属性
  createAttributeById: (id, data) => request.post(`/categories/${id}/attributes`, data),
  // 根据 Id 查询商品分类参数
  getAttributeById: (id, attrId, params) => request.get(`/categories/${id}/attributes/${attrId}`, { params }),
  // 根据 Id 编辑商品分类参数
  updateAttributeById: (id, attrId, data) => request.put(`/categories/${id}/attributes/${attrId}`, data),
  // 根据 Id 删除商品分类参数
  deleteAttributeById: (id, attrId) => request.delete(`/categories/${id}/attributes/${attrId}`)
}

// !--------------- 商品管理 ---------------
export const Goods = {
  // 获取商品列表
  getGoods: params => request.get('/goods', { params }),
  // 添加商品
  createGoods: data => request.post('/goods', data),
  // 根据 Id 查询商品
  getGoodsById: id => request.get(`/goods/${id}`),
  // 根据 Id 编辑商品
  updateGoodsById: (id, data) => request.put(`/goods/${id}`, data),
  // 根据 Id 删除商品
  deleteGoodsById: id => request.delete(`/goods/${id}`)
}

// !--------------- 图片上传 ---------------
export const uploadImg = data => request.post('/upload', data)

// !--------------- 订单管理 ---------------
export const Orders = {
  // 获取订单列表
  getOrders: params => request.get('/orders', { params }),
  // 根据 Id 查询订单详情
  getOrderById: id => request.get(`/orders/${id}`),
  // 根据 Id 修改订单状态
  updateOrderStateById: (id, data) => request.put(`/orders/${id}`, data),
  // 根据 Id 查看物流信息
  getOrderLogisticById: id => request.get(`/kuaidi/${id}`)
  // 修改订单地址
}

// !--------------- 数据统计 ---------------
// 获取基于时间统计的折线图
export const getReports = () => request.get('/reports/type/1')
