import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../view/login/Login";
import Index from "../view/Index";
import Register from "../view/login/Register";
import Miss from "../view/error/404"
import GetShare from "../view/model/file/GetShare";
import Test from "../view/test/Test";
import Repwd from "../view/login/Repwd";
import AdminUserMsg from "../view/model/admin/AdminUserMsg";
import StoreMsg from "../view/model/admin/StoreMsg";
import allFiles from "../view/model/file/AllFiles";
import FilesType from "../view/model/file/FilesType";
import Trash from "../view/model/file/Trash";

Vue.use(VueRouter);
export default new VueRouter({
  mode: "history", /*配置路由*/
  routes: [{
    path: "/test",
    component: Test,
  },
    {
    path: "/login",
    component: Login,
  },
    {
    path: "/re_pwd",
    component: Repwd,
  },
    {
    path: "/re_pwd/:loginName",
    component: Repwd,
  },
    {
    path: "/register",
    component: Register
  }, /* 左导航栏路由 */
    {
      path: "/",
      component: Index,
      children: [{
        path: "/file/index",
        component: allFiles
      },
        {
        path: "/file/type/:type",
          component: FilesType
      },
         {
           path: "/file/trash",
           component: Trash
         },
        /*管理员路由*/
        {
          path: "/admin/user_msg",
          component: AdminUserMsg,
        },
        {
          path: "/admin/store_msg",
          component: StoreMsg,
        }]
    },
    {
      path: "/index",
      component: Index,
      children: [{
        path: "/file/index",
        component: allFiles
      }]
    },
    {
      path: "/getshare",
      component: GetShare
    },
    {
      path: "/getshare/:code",
      component: GetShare
    },
    {
      path: "/*",
      component: Miss
    }

  ]
})

const VueRouterPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
