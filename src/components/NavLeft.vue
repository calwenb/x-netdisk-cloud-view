<template>
  <!-- 修改 -->
  <div style="height: 100%;">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#F9F9F9"
      text-color="#000000"
      active-text-color="#3C8CFF" style="height: 100%;">
      <div>
        <el-image class="pointer" :src="logoSrc" @click="$router.push('/index')"></el-image>
      </div>
      <el-menu-item index="1">
        <span slot="title">
          <router-link to="/file/index">
             <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-quanbu2"></use>
             </svg>
            <span class="mobileHide">全部</span>
          </router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="2">
        <span slot="title">
          <router-link to="/file/type/document">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zonghewendang"></use>
            </svg>
            <span class="mobileHide">文档</span>
          </router-link>
        </span>
      </el-menu-item>

      <el-menu-item index="3">
        <span slot="title">
          <router-link to="/file/type/code">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-java"></use>
            </svg>
            <span class="mobileHide">代码</span>
          </router-link>
        </span>
      </el-menu-item>

      <el-menu-item index="4">
        <span slot="title">
          <router-link to="/file/type/compressedFile">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yasuobao"></use>
            </svg>
            <span class="mobileHide">压缩</span></router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="5">
        <span slot="title">
          <router-link to="/file/type/image">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhaopian"></use>
            </svg>
            <span class="mobileHide">图片</span></router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="6">
        <span slot="title">
          <router-link to="/file/type/audio">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-music"></use>
            </svg>
            <span class="mobileHide">音频</span></router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="7">
        <span slot="title">
          <router-link to="/file/type/video">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shipin1"></use>
            </svg>
            <span class="mobileHide">视频</span></router-link>
        </span>
      </el-menu-item>

      <el-menu-item index="8">
        <span slot="title">
          <router-link to="/file/type/other">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-qita5"></use>
            </svg>
            <span class="mobileHide">其他</span></router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="3">
        <span slot="title">
          <router-link to="/file/trash">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-huishouzhan"></use>
            </svg>
            <span class="mobileHide">回收站</span>
          </router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="4">
        <span slot="title">
          <router-link to="/test"><i class="el-icon-coin"></i>
            <span class="mobileHide">测试</span>
          </router-link>
        </span>
      </el-menu-item>
      <div>
        <el-row>
          <el-progress type="circle" :percentage="storePercen"></el-progress>
        </el-row>
        <p>已使用：{{ (storeMsg.currentSize / 1024 + 0.5).toFixed(0) }} M</p>
        <p>总容量：{{ storeMsg.maxSize / (1024) }} M</p>
        <el-row>
          <span>我要升级</span>
          <el-button circle @click="upLevel">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shengji"></use>
            </svg>
          </el-button>
        </el-row>
      </div>

    </el-menu>

  </div>
</template>

<script>
import logoL from "../img/logo_l.png";
import Global from "../js/global";

export default {
  name: "NavLeft",
  data() {
    return {
      storePercen: 0,
      storeMsg: {
        currentSize: 0,
        maxSize: 0
      },
      logoSrc: logoL
    }
  },
  created() {
    this.getStore();
  },

  methods: {
    upLevel() {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/level',
        params: {},
        method: 'PUT',
      }).then(function (rsp) {
        that.successMsg(rsp.message);
      })
    },
    getStore() {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/stores/my',
        params: {},
        method: 'GET',
      }).then(function (rsp) {
        var data = rsp.data;
        that.storeMsg = data;
        that.storePercen = Math.ceil(data.currentSize / data.maxSize)
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
.router-link-active {
  text-decoration: none;
  color: #3C8CFF;
}

a {
  text-decoration: none;
  color: #000000;
}

.pointer:hover {
  cursor: pointer;
  color: #409EFF;
}

.icon {
  width: 1.8em;
  height: 1.8em;
  vertical-align: -0.5em;
}

</style>
