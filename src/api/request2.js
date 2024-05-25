

import qs from 'qs'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';
import router from '../router'; 


// 创建axios实例
const service = axios.create({
  // baseURL: 'http://admin.itytl.com', // api的base_url
  timeout: 5000 // 请求超时时间
});
 
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加请求头等信息
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken();
    // }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (config.data && config.headers['Content-Type'] == 'application/x-www-form-urlencoded')
     config.data = qs.stringify(config.data)
    return config;
  },
  error => {
    // 请求错误处理
    console.log(error); // for debug
    Promise.reject(error);
  }
);
 
// 响应拦截器
service.interceptors.response.use(
  res => {
    // 对响应数据做处理，例如只返回data部分
    // console.log(res, '00')
    // if (res.data.code == 20000) {
    //   router.push('/login')
    // } else {
    //   if (res.data.code != 10000) {
    //     ElMessage.error({
    //       message: res.data.message
    //     })
    //   }
      
    // }
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   });
    //   // 50001: 非法的token; 50002: 其他客户端错误; 50003: 认证失败; 50004: 授权失败; 50005: 未找到用户
    //   if (res.code === 50001 || res.code === 50002 || res.code === 50003 || res.code === 50004 || res.code === 50005) {
    //     // 移除token
    //     resetToken();
    //     // 跳转到登录页面
    //     location.reload();
    //   }
    //   return Promise.reject('error');
    // } else {
    //   return res;
    // }
    return Promise.resolve(res);;
  },
  error => {
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // });
    return Promise.reject(error);
  }
);
 
export default service;