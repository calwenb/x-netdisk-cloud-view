<template>
  <div class="main">
    <el-card class="card">
      <div class="button">
        <router-link to="/login">
          <el-button circle title="去登录">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-denglu-yonghu"></use>
            </svg>
          </el-button>
        </router-link>
        <el-divider direction="vertical"></el-divider>
        <router-link to="/getshare">
          <el-button  circle title="获取分享文件">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fenxiang7"></use>
            </svg>
          </el-button>
        </router-link>
      </div>

      <h3>重置密码</h3>

      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="账号" prop="loginName">
          <el-input v-model="ruleForm.loginName"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code">
            <el-button slot="append" size="mini" @click="sendCode">发送验证码</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

        <span style="color:red;font-size: 15px">&nbsp;{{ msg }}</span>
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
import Global from "../js/global";

export default {
  name: "Repwd",
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
      verifyCode: "",
      ruleForm: {
        loginName: '',
        email: '',
        code: '',
        pass: '',
        checkPass: '',
      },
      msg: '',
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    sendCode() {
      var that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/send-code',
        params: {
          loginName: this.ruleForm.loginName,
          email: this.ruleForm.email,
          password: this.ruleForm.pass
        },
        method: 'POST',
      })
    },
    repwd() {
      var that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/re-pwd',
        params: {
          loginName: this.ruleForm.loginName,
          password: this.ruleForm.pass,
          code: this.ruleForm.code
        },
        method: 'POST',
      }).then(function (rs) {
        that.notification(true, rs.data + " 正在去登录页面...");
        setTimeout(function () {
            that.$router.push({path: '/login'});
          },
          3000,
        );

      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.repwd();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    let loginName = this.$route.params.loginName;
    if (loginName !== undefined) {
      this.ruleForm.loginName = loginName;
    }
  }
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
  padding: 3% 5% 2.4% 2%;
}

.button {
  margin-top: -15%;
  margin-right: -15%;
  text-align: right;
}


@media only screen and (max-width: 900px) {
  .card {
    width: 80%;
    height: auto;
    padding: 3% 5% 0% 2%;
  }

  .button {
    margin-top: -10%;
    margin-right: -10%;
    text-align: right;
  }

  .foot_text {
    bottom: 0%;
  }
}
</style>


