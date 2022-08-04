<template>
  <div>
    <el-dialog
      title="添加管理员"
      :visible.sync="addDialog"
      class="pwdDialog">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>

        <el-form-item label="账号" prop="loginName">
          <el-input v-model="ruleForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder=""></el-input>
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

      </el-form>
      <br>
      <!--      <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialog = false">取 消</el-button>
                    <el-button type="primary" @click="updateUser">确 定</el-button>
            </span>-->
    </el-dialog>
  </div>
</template>

<script>
import eventBus from "../../js/eventBus";
import Global from "../../js/global";

export default {
  name: "AdminAddD",
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
      ruleForm: {
        loginName: '',
        userName: '',
        email: '',
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
      },
      addDialog: false,
      /* form: {
         userName: '',
         email: '',
         phoneNumber: '',
       },*/
    }
  },
  methods: {
    addAdmin() {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/admins',
        params: {
          userName: this.ruleForm.userName,
          loginName: this.ruleForm.loginName,
          password: this.ruleForm.pass,
          email: this.ruleForm.email,
        },
        method: 'POST',
      }).then(function (rs) {
        that.addDialog = false;
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addAdmin();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },

  created() {
    eventBus.$on("addDialog", data => {
      this.addDialog = data;
    });
  },

}
</script>

<style scoped>

</style>
