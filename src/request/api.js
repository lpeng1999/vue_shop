import request from './http'

/**
 * @description: 登录
 * @param {Object} [请求参数]
 * @return {Object}
 */
export const login = data =>
  request({
    url: '/login',
    method: 'POST',
    data: data
  })
