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
// 获取所有角色数据
export const getAllRoleDate = () => {
  return axios.get('roles')
    .then((result) => {
      return result.data
    })
}
// 分配用户角色
export const allotUserRole = (obj) => {
  return axios.put(`users/${obj.id}/role`, obj)
    .then((result) => {
      return result.data
    })
}
// 新增用户数据
export const addUserData = (obj) => {
  return axios.post('users', obj)
    .then((result) => {
      return result.data
    })
}
