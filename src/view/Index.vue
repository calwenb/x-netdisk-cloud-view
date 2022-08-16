<template>
  <!-- 整个布局 -->
  <el-container style="height: 100vh; border: 1px solid #eee">
    <!--左导航栏-->
    <el-aside width="200px" style="background-color:  #F9F9F9">
      <!--管理员页面-->
      <admin-nav-left :user="user" :token="token" v-if="user.userType=== 0 || user.userType=== 1"/>
      <navLeft :user="user" :token="token" v-else/>
    </el-aside>

    <el-container>
      <el-header
        style="z-index: 1; padding-left:1%;padding-bottom: 4%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);">
        <!--头导航栏-->
        <navHead :user="user" :token="token"/>
      </el-header>

      <el-main>
        <transition name="slide-left" mode="out-in">
          <router-view/>
        </transition>
      </el-main>
    </el-container>

  </el-container>

</template>

<script>
import NavHead from "../components/nav/NavHead";
import AdminNavLeft from "../components/nav/AdminNavLeft";
import NavLeft from "../components/nav/NavLeft";
import Global from "../js/global";
import eventBus from "../js/eventBus";

export default {
  name: "Index",
  components: {
    'navHead': NavHead,
    'navLeft': NavLeft,
    'adminNavLeft': AdminNavLeft,
  },
  data() {
    return {
      token: '',
      hoursTip: "",
      user: {
        userId: '',
        loginName: '',
        userName: '',
        userType: '9',
        email: '',
        phoneNumber: '',
      },
    }
  },
  methods: {
    getTime() {
      let date = new Date();
      if (date.getHours() >= 0 && date.getHours() < 12) {
        this.hoursTip = " 上午好"
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        this.hoursTip = " 下午好"
      } else {
        this.hoursTip = " 晚上好"
      }
    },
    getUser(token, vm) {
      const that = vm;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/info',
        params: {},
        method: 'GET',
      }).then(function (rs) {
        let user = rs.data
        that.user.userId = user.id;
        that.user.userName = user.userName;
        that.user.loginName = user.loginName;
        that.user.userType = user.userType;
        that.user.token = that.token;
        that.user.email = user.email;
        that.user.phoneNumber = user.phoneNumber;
        const userType = user.userType;
        if (user.avatar !== "") {
          eventBus.$emit("loadAvatar", "do");
        }
        if (userType === 0 || userType === 1) {
          that.successMsg("尊敬的 管理员：" + user.userName + that.hoursTip);
          that.$router.push({path: '/admin/user_msg'});
        } else {
          that.successMsg("尊敬的 用户：" + user.userName + that.hoursTip);
          that.$router.push({path: '/file/index'});
        }
      })
    }
  },

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      alert("后端接口已升级为微服务，项目目前处于开发测试阶段，仍会出现许多缺陷，请见谅。")
      var token = vm.$cookies.get("TOKEN");
      if (token === null) {
        vm.$router.push({path: '/login'});
        return;
      }
      vm.token = token;
      vm.getTime();
      vm.getUser(token, vm);

    });
  },
}
</script>

<style scoped>
.leftNav {
  width: 200px !important;
}

@media only screen and (max-width: 900px) {
  .leftNav {
    width: 12% !important;
  }
}


.el-header {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  /*line-height: 160px;*/
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

/*过渡动画*/
.slide-left-enter {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}

.slide-left-enter-active {
  transition: all .5s ease;
}

.slide-left-leave-to {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}

.slide-left-leave-active {
  transition: all .3s ease;
}
</style>
