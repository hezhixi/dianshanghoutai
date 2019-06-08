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
// 获取数据展示
export const getUserList = (ob) => {
  return axios.get('users', { params: ob })
    .then((result) => {
      return result.data
    })
}
// 获取编辑数据
export const editGetData = (obj) => {
  return axios.put(`users/${obj.id}`, obj)
    .then((result) => {
      return result.data
    })
}
// 获取删除数据
export const delGetDate = (id) => {
  return axios.delete(`users/${id}`)
    .then((result) => {
      console.log(result)
      return result.data
    })
}
// 获取修改用户状态信息
export const getUserState = (id, type) => {
  return axios.put(`users/${id}/state/${type}`)
    .then((result) => {
      return result.data
    })
}
