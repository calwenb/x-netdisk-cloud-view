<template>
  <div>
    <el-row type="flex" class="row-bg" :gutter="10">
      <el-col :xs="4" :md="4" style="overflow:hidden;" v-if="user.userType!==0||user.userType!==1">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="uploadOpen">
            <i class="el-icon-upload el-icon--right" style="color: white;"></i>
            <span class="mobileHide">上传</span>
          </el-button>
        </div>
      </el-col>

      <el-col :xs="4" :md="4" style="overflow:hidden;" v-if="user.userType!==0||user.userType!==1">
        <div class="grid-content bg-purple-light">
          <el-button type="primary" @click="FolderOpen">
            <i class="el-icon-folder-add" style="color: white;"></i>
            <span class="mobileHide">新建文件夹</span>
          </el-button>
        </div>
      </el-col>
      <el-col :xs="10" :md="4" :offset="6" class="search" v-if="user.userType!==0||user.userType!==1">
        <div class="grid-content bg-purple">
          <Search/>
        </div>
      </el-col>

      <el-col :xs="3" :md="1" style="overflow:hidden;" v-if="user.userType!==0||user.userType!==1">
        <div class="grid-content bg-purple">
          <el-button circle @click="$router.push('/getshare')" title="获取分享文件">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fenxiang7"></use>
            </svg>
          </el-button>
        </div>
      </el-col>

      <!--      <el-col :xs="20" :md="20" v-if="user.userType!==2"/>-->
      <!--用户信息-->
      <el-col :xs="4" :md="4" style="text-align: left;padding-left: 1%; padding-top: 10px;" class="userMsg">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar :size="45">
               <el-image :src="avatarUrl"/>
            </el-avatar>
            <span class="mobileHide">
              <span>{{ user.userName }}</span>
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updateUser">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bianji4"></use>
              </svg>
              修改信息
            </el-dropdown-item>
            <el-dropdown-item command="updatepwd">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yanzhengma"></use>
              </svg>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item command="outLogin">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tuichudenglu"></use>
              </svg>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-col>
      <el-col :xs="5" :md="5">
        <svg class="icon" aria-hidden="true" v-if="user.userType%10===0">
          <use xlink:href="#icon-guanliyuan1"></use>
        </svg>
        <svg class="icon" aria-hidden="true" v-if="user.userType%10===1">
          <use xlink:href="#icon-guanliyuan1"></use>
        </svg>
        <svg class="typeIcon" aria-hidden="true" v-if="user.userType%10===2">
          <use xlink:href="#icon-chuangxiangbaiyinvip"></use>
        </svg>
        <svg class="typeIcon" aria-hidden="true" v-if="user.userType%10===3">
          <use xlink:href="#icon-chuangxianghuangjinvip"></use>
        </svg>
        <svg class="typeIcon" aria-hidden="true" v-if="user.userType%10===4">
          <use xlink:href="#icon-chuangxiangzijinvip"></use>
        </svg>
        <svg class="typeIcon" aria-hidden="true" v-if="user.userType%10===5">
          <use xlink:href="#icon-chuangxiangzuanshivip"></use>
        </svg>
        <svg class="typeIcon" aria-hidden="true" v-if="user.userType%10===6">
          <use xlink:href="#icon-huaban"></use>
        </svg>
      </el-col>
    </el-row>
    <upload-file/>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      class="pwdDialog">
      <span><el-input placeholder="请输入密码" v-model="newPassword" show-password></el-input></span>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="updatePassword">确 定</el-button>
            </span>
    </el-dialog>
    <update-user :user="user" :token="token" :avatarUrl="avatarUrl"/>

  </div>
</template>

<script>
import UploadFile from "./UploadFile";
import Global from "../js/global";
import eventBus from "../js/eventBus";
import Search from "./Search";
import UpdateUser from "./UpdateUser";
import test from "../view/Test";
import Test from "../view/Test";

export default {
  name: "NavHead",
  props: ['user', 'token'],
  components: {
    'UploadFile': UploadFile,
    'Search': Search,
    'UpdateUser': UpdateUser,
  },
  data() {
    return {
      fit: 'scale-down',
      activeIndex: '0',
      avatarUrl: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      dialogVisible: false,
      newPassword: '',
      parentFolderId: '0',
    };
  },
  created() {
    eventBus.$on("FolderId", data => {
      this.parentFolderId = data;
    });
    eventBus.$on("loadAvatar", data => {
      if (data === "do") {
        this.loadAvatar();
      }
    });

  },
  methods: {
    uploadOpen() {
      console.log("this.parentFolderId",this.parentFolderId)
      eventBus.$emit("uploadDialog", this.parentFolderId);
    },
    handleCommand(command) {
      if (command === "updateUser") {
        eventBus.$emit("userDialog", true);
      } else if (command === "updatepwd") {
        this.dialogVisible = true;
      } else if (command === "outLogin") {
        this.outLogin();
      }
    },
    loadAvatar() {
      const that = this;
      this.getAvatar((rs) => {
        if (rs !== false) {
          that.showAvatar(rs);
        }
      });
    },
    showAvatar(file) {
      let self = this;
      // 看支持不支持FileReader
      if (!file || !window.FileReader) {
        return;
      }
      let reader = new FileReader();
      // 将图片将转成 base64 格式
      reader.readAsDataURL(file);
      // 读取成功后的回调
      reader.onloadend = function () {
        self.avatarUrl = this.result;
      }
    },
    getAvatar(callback) {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/avatar',
        params: {},
        responseType: 'blob',
        method: 'GET',
      }).then(function (resp) {
        let size = resp.data.size
        if (size > 0) {
          //文件浏览
          callback(resp.data);
          console.log("头像加载成功");
        } else {
          console.log("头像加载失败");
        }
      }).catch(function (error) {
        console.log(error)
        that.$message.error(error);
      })
    },
    FolderOpen() {
      const that = this;
      this.$prompt('输入新建文件夹名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        that.newFolder(value);
      }).catch((msg) => {
        console.log(msg);
      });
    },
    newFolder(newFolderName) {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/folders',
        params: {
          parent_id: that.parentFolderId,
          name: newFolderName,
        },
        method: 'POST',
      }).then(function (rs) {
        that.dialogVisible = false;
        that.successNotification("新建文件夹成功");
        eventBus.$emit("refresh", "do");
      }).catch(function (error) {
        console.log(error)
      })
    },
    updatePassword() {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/password',
        params: {
          password: that.newPassword
        },
        method: 'PUT',
      }).then(function (rs) {
        that.dialogVisible = false;
        that.successNotification("修改密码成功");
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    outLogin() {
      var that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/out-login',
        method: 'POST',
      }).then(function (rs) {
        that.successMsg("退出登录中");
        //todo 定时器
        that.$cookies.remove("TOKEN")
        that.$router.push('/login');

      }).catch(function (error) {
        that.$message.error(error + " 后端服务可能未支持");
      })
    },
    handleSelect(key, keyPath) {
    }
    ,
    handleRemove(file, fileList) {
    }
    ,
    handlePreview(file) {
    }
    ,
    successNotification(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
      });
    }
    ,
    open3() {
      this.$notify.info({
        title: '消息',
        message: '这是一条消息的提示消息'
      });
    }
    ,
    errorNotification(msg) {
      this.$notify.error({
        title: '失败',
        message: msg
      });
    }
    ,
  }
}

</script>

<style scoped>
.typeIcon {
  width: 5em;
  height: 5em;
  vertical-align: -0.5em;
}

.userMsg:hover {
  cursor: pointer;
  color: #409EFF;
}

@media only screen and (max-width: 900px) {

  .search {
    margin-left: 0;
  }
}

a {
  text-decoration: none;
}
</style>
