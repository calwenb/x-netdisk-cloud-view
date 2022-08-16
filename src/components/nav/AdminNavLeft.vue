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
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/user_msg">
            <el-menu-item index="1-1">用户信息</el-menu-item>
          </router-link>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>仓库管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/store_msg">
            <el-menu-item index="2-1">仓库信息</el-menu-item>
          </router-link>
          <el-menu-item index="2-2">选项2</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <!--      <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item index="2">
              <span slot="title">
                <router-link to="/index/Album/1/document"><i class="el-icon-document"></i>
                  <span class="mobileHide">文档</span>
                </router-link>
              </span>
            </el-menu-item>-->

      <!--      <el-menu-item index="3">
              <span slot="title">
                <router-link to="/index/Album/2/code"><i class="el-icon-coin"></i>
                  <span class="mobileHide">代码</span>
                </router-link>
              </span>
            </el-menu-item>

            <el-menu-item index="4">
              <span slot="title">
                <router-link to="/index/Album/3/compressedFile"><i class="el-icon-box"></i>
                  <span class="mobileHide">压缩</span></router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="5">
              <span slot="title">
                <router-link to="/index/Album/4/image"><i class="el-icon-picture-outline"></i>
                  <span class="mobileHide">图片</span></router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="6">
              <span slot="title">
                <router-link to="/index/Album/5/audio"><i class="el-icon-headset"></i>
                  <span class="mobileHide">音频</span></router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="7">
              <span slot="title">
                <router-link to="/index/Album/6/video"><i class="el-icon-video-camera"></i>
                  <span class="mobileHide">视频</span></router-link>
              </span>
            </el-menu-item>

            <el-menu-item index="8">
              <span slot="title">
                <router-link to="/index/Album/7/other"><i class="el-icon-more-outline"></i>
                  <span class="mobileHide">其他</span></router-link>
              </span>
            </el-menu-item>-->

    </el-menu>
  </div>
</template>

<script>
import logoL from "../../img/logo_l.png";

export default {
  name: "AdminNavLeft",
  data() {
    return {
      logoSrc: logoL
    }
  },
  methods: {
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
</style>
