<template>
  <div class="main">
    <el-card class="card">
      <div class="button">
        <router-link to="/register">
          <el-button circle title="去注册">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-denglu-yonghu"></use>
            </svg>
          </el-button>
        </router-link>
        <el-divider direction="vertical"></el-divider>
        <router-link to="/getshare">
          <el-button circle title="获取分享文件">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fenxiang7"></use>
            </svg>
          </el-button>
        </router-link>
      </div>
      <br><br>
      <h3 @click="repwd">登录</h3>
      <el-form :model="ruleForm"
               @submit.native.prevent
               status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="userName">
          <el-input v-model.number="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>

        <el-row type="flex" justify="end">
          <span @click="repwd" class="pointer" style="font-size: 12px;color: #868585;"> 忘记密码？</span>
        </el-row>
        <el-switch class="remember_me"
                   v-model="remember"
                   active-text="自动登录">
        </el-switch>
        <br><br>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" native-type="submit">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>

    </el-card>
    <div class="foot_text">
      <el-col>Copyright ©2022 By Mr.文</el-col>
      <br>
      <el-col>桂ICP备2021009133号</el-col>
    </div>
  </div>
</template>

<script>
import Global from '../js/global'
import QRCode from 'qrcodejs2'


export default {
  name: "Login",
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号'));
      }

    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      remember: false,
      ruleForm: {
        userName: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        age: [
          {validator: checkAge, trigger: 'blur'}
        ]
      }
    };
  },

  methods: {
    repwd() {
      let path = "/re_pwd";
      if (this.ruleForm.userName !== "") {
        path = "/re_pwd/" + this.ruleForm.userName;
      }
      this.$router.push({path: path})
    },


    /*接入登录接口*/
    submitForm(formName) {
      var that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/login',
        params: {
          loginName: this.ruleForm.userName,
          password: this.ruleForm.pass,
          remember: that.remember,
        },
        method: 'POST',
        withCredentials: true,
      }).then(function (rs) {
        if (that.remember === true) {
          that.$cookies.set("TOKEN", rs.data, Global.COOKIES_TIME);
        } else {
          that.$cookies.set("TOKEN", rs.data, "Session");
        }
        that.$router.push({path: '/index'});
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

}
</script>

<style scoped>

.foot_text {
  line-height: 20px;
  color: #a9a8a8;
  position: absolute;
  bottom: 2%;
  font-size: 12px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", serif;
}

.main {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url('../img/login_bg.png');
  display: flex;
  justify-content: center;
  align-items: center;

}


.card {
  background-color: #FCFDFD;
  text-align: center;
  position: absolute;
  top: 10%;
  width: 20%;
  height: auto;
  padding: 3% 5% 3% 2%;
}

.button {
  margin-top: -15%;
  margin-right: -15%;
  text-align: right;
}

.remember_me {
  margin-top: 31%;
}

@media only screen and (max-width: 900px) {
  .card {
    width: 80%;
    height: auto;
  }

  .remember_me {
    margin-top: 20%;
  }

  .button {
    margin-top: -10%;
    margin-right: -10%;
    text-align: right;
  }

  .card {
    width: 80%;
    height: auto;
  }

  .remember_me {
    margin-top: 20%;
  }

  .button {
    margin-top: -10%;
    margin-right: -10%;
    text-align: right;
  }

}

.pointer:hover {
  cursor: pointer;
  color: #409EFF;
}

</style>
