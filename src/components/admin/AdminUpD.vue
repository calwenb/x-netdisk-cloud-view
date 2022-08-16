<template>
  <el-dialog
    title="修改信息"
    :visible.sync="userDialog"
    class="pwdDialog">
    <el-form :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="昵称">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.loginName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="权限类型">
        <el-input v-model="form.userType"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phoneNumber"></el-input>
      </el-form-item>

    </el-form>
    <br>
    <span slot="footer" class="dialog-footer">
              <el-button @click="userDialog = false">取 消</el-button>
              <el-button type="primary" @click="updateUser">确 定</el-button>
            </span>
  </el-dialog>
</template>

<script>

import UploadHead from "../nav/UploadHead";
import eventBus from "../../js/eventBus";
import Global from "../../js/global";

export default {
  name: "AdminUpD",
  components: {
    'UploadHead': UploadHead,
  },
  data() {
    return {
      userDialog: false,
      userId: '',
      form: {
        userName: '',
        loginName: '',
        password: '',
        userType: '',
        email: '',
        phoneNumber: '',
      },
    }
  },
  methods: {
    updateUser() {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/admin/user/' + that.userId,
        params: {
          userName: that.form.userName,
          loginName: that.form.loginName,
          password: that.form.password,
          userType: that.form.userType,
          email: that.form.email,
          phoneNumber: that.form.phoneNumber
        },
        method: 'PUT',
      }).then(function (rs) {
        that.userDialog = false;
        that.notification(true, rs.message);
      })
    },
  },

  created() {
    eventBus.$on("upUserDialog", data => {
      if (data != null) {
        this.userDialog = true;
        this.userId = data.userId;
        this.form.userName = data.userName;
        this.form.loginName = data.loginName;
        this.form.userType = data.userType;
        this.form.email = data.email;
        this.form.phoneNumber = data.phoneNumber;
      }

    });
  },

}
</script>

<style scoped>

</style>
