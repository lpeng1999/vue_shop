/** axios封装
 * 请求拦截、响应拦截、错误统一处理
 */

import axios from 'axios'
import QS from 'qs'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 创建axios实例
var instance = axios.create({
  // 设置请求超时
  timeout: 1000 * 12
})

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  instance.defaults.baseURL = 'http://lpeng.top/api/private/v1/'
} else if (process.env.NODE_ENV === 'production') {
  instance.defaults.baseURL = 'http://lpeng.top/api/private/v1/'
} else if (process.env.NODE_ENV === 'debug') {
  instance.defaults.baseURL = ''
}

// 线上接口出错时
axios('')
  .then(result => {
    if (result.status !== 200) {
      instance.defaults.baseURL = 'http://lpeng.top:8888/api/private/v1/'
    }
  })
  .catch(err => {
    console.log(err)
  })

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 当进入request拦截器，表示发送了请求，开启进度条
    NProgress.start()

    // console.log(config)

    // 设置 post请求头
    config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

    // post 请求 序列化参数
    if (config.method === 'post') {
      console.log('config.data ===>>>', config.data)
      config.data = QS.stringify({ ...config.data })
    }

    // 携带 token
    const token = window.sessionStorage.getItem('token')
    token && (config.headers.Authorization = token)

    console.log(config)

    return config
  },
  error => {
    console.log('error ===>>>', error)
    return error
  }
)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  response => {
    // 当进入response拦截器，表示请求已经结束，结束进度条
    NProgress.done()

    console.log('response ===>>>', response)

    // 根据后端提供的数据进行对应的处理
    if (response.status === 200) {
      return response.data
    } else {
      return response.data
    }
  },
  // 请求失败
  error => {
    console.log(JSON.stringify(error))
    return error
  }
)

export default instance
