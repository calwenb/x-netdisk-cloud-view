import axios from "axios";
import VueCookies from "vue-cookies";
import router from "../router";
import vm from "../main.js";

axios.defaults.withCredentials = true;
export default axios;


export const request = (config) => {
  return axios(config)
}


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let token = VueCookies.get("TOKEN");
  if (token != null) {
    config.headers.common = {
      'token': token
    }
  } else {
    router.push('/login')
  }
  return config;
}, function (error) {

  return Promise.reject(error);
});


// 请求完成后 拦截器
axios.interceptors.response.use(
  resp => {
    const rs = resp.data;
/*    if (resp.status !== 200) {
      if (resp.status === 503) {
        vm.errorMsg("服务调用失败");
        return Promise.reject(new Error("服务调用失败: " + rs.message || 'Error'))
      }
      vm.errorMsg("请求错误  ，错误代码：" + resp.status);
      return Promise.reject(new Error("请求错误 ，错误代码：" + resp.status || 'Error'))
    }*/

    if (resp.headers['content-type'] === "application/octet-stream;charset=UTF-8") {
      return resp;
    }
    let code = rs.code;
    let errTag;
    switch (code) {
      case 2000:
        return resp.data;
      case 7000:
        errTag = "[操作失败]";
        break;
      case 4010:
        router.push('/login');
        errTag = "[验证失败]";
        break;
      case 5000:
        errTag = "[服务器异常]";
        break;
      default:
        vm.errorMsg(rs.message + " ，错误代码：" + rs.code);
        errTag = "[未知代码]"
        return Promise.reject(new Error(errTag + rs.message || 'Error'))
    }
    vm.errorMsg(rs.message);
    return Promise.reject(new Error(errTag + rs.message || 'Error'))
  },
  error => {
    let msg = error.message;
    let code = msg.substring(msg.indexOf('status code') + 12);
    switch (code) {
      case '500':
        vm.errorMsg("服务器发生了意外");
        break
      case '503':
        vm.errorMsg("服务或未启动");
        break
      case '401':
        vm.errorMsg("无权限调用")
        break
      default:
        if (msg === "Network Error") {
          vm.errorMsg("服务或未启动");
        } else {
          vm.errorMsg("未知错误：" + error.message);
        }
    }
    return Promise.reject(new Error(error || 'Error'))
  }
)


