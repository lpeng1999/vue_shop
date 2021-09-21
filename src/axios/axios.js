import Vue from 'vue'
import axios from 'axios'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://lpeng.top/api/private/v1/'

axios('')
  .then(result => {
    console.log(result)
    if (result.status !== 200) {
      axios.defaults.baseURL = 'http://lpeng.top:8888/api/private/v1/'
    }
  })
  .catch(err => {
    console.log(err)
  })

// 请求拦截器添加 token
axios.interceptors.request.use(config => {
  // console.log(config)
  // 当进入request拦截器，表示发送了请求，开启进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束，结束进度条
  NProgress.done()
  return config
})
// 挂载 axios
Vue.prototype.$http = axios
