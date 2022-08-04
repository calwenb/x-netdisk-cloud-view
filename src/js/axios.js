import axios from "axios";
import VueCookies from "vue-cookies";
import router from "../router";
import vm from "../main.js";
import el from "element-ui/src/locale/lang/el";

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
  response => {
    const rs = response.data;
    if (response.status !== 200) {
      console.log("restas", response.status)
      if (response.status === 503) {
        vm.errorMsg("服务调用失败");
        return Promise.reject(new Error("服务调用失败: " + rs.message || 'Error'))
      }
      vm.errorMsg("请求错误  ，错误代码：" + response.status);
      return Promise.reject(new Error("请求错误 ，错误代码：" + response.status || 'Error'))
    }


    let contentType = response.headers['content-type'];
    if (contentType === "application/octet-stream;charset=UTF-8") {
      return response;
    }
    let code = rs.code;
    if (code === 2000) {
      return response.data;
    } else if (code === 4010) {
      vm.errorMsg(rs.message + " 正在去登录页面...");
      router.push('/login');
    } else if (code === 7000) {
      vm.errorMsg(rs.message);
    } else if (code === 5000) {
      vm.errorMsg("服务器发生异常：" + rs.message);
      console.log("服务器发生异常：" + response);
    } else {
      vm.errorMsg(rs.message + " ，错误代码：" + rs.code);
      console.log("错误代码：" + rs.code, response)
    }
    return Promise.reject(new Error(rs.message || 'Error'))
  },
  error => {

    vm.errorMsg("错误：" + error);
    console.log(error)
    return error;
  }
)


