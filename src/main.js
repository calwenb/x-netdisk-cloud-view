// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './assets/fonts/iconfont/iconfont'
import './assets/css/index.css'
import router from './router' //自动扫描里面的路由配置
import axios from './js/axios.js'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCookies from "vue-cookies";
import './assets/css/mobile.css'; // 全局css
import Contextmenu from "vue-contextmenujs"
import uploader from 'vue-simple-uploader'


Vue.use(Contextmenu);
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueAxios, axios)
Vue.use(VueCookies);
Vue.use(uploader)

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/login' || to.path === '/register' || to.path.includes('/getshare') || to.path.includes('/re_pwd')) {
    next();
  } else {
    if (VueCookies.get("TOKEN") === null) {
      //vm.errorMsg( " 身份未验证，正在去登录页面...");
      setTimeout(function () {
        router.push('/login');
      }, 3000);
      next('/login');

    }
    next();
  }
})

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
export default vm;
Vue.prototype.notification = function (type, msg) {//changeData是函数名
  if (type === true) {
    this.$notify({
      title: '成功',
      message: msg,
      type: 'success'
    });
  } else {
    this.$notify.error({
      title: '失败',
      message: msg
    });
  }
}
Vue.prototype.successMsg = function (msg) {//changeData是函数名
  this.$notify({
    title: '成功',
    message: msg,
    type: 'success'
  });
}

Vue.prototype.errorMsg = function (msg) {//changeData是函数名
  this.$notify.error({
    title: '失败',
    message: msg
  });
}



