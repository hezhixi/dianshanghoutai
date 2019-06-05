import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 1.获取token
  var token = localStorage.getItem('itcastpro_token')
  if (token) {
    // 2.在发送请求的时候传递token
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 实现登陆验证
export const login = (obj) => {
  // axios.post是一个promise对象
  // .then返回的还是一个promise对象
//   console.log(obj)
  return axios.post('login', obj)
    .then((result) => {
      // then的回调函数中的返回值最终会返回到这个对象的then方法中
      return result.data
    })
}
export const getUserList = (ob) => {
  return axios.get('users', { params: ob })
    .then((result) => {
      return result.data
    })
}
