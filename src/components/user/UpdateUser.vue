<template>
  <el-dialog
    title="修改信息"
    :visible.sync="userDialog"
    class="pwdDialog"
    append-to-body>
    <upload-head :userId="user.userId" :avatarUrl="avatarUrl"/>
    <el-form :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="昵称">
        <el-input v-model="form.userName"></el-input>
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
import eventBus from "../../js/eventBus";
import Global from "../../js/global";
import UploadHead from "../nav/UploadHead";

export default {
  name: "UpdateUser",
  props: ['user', 'token', 'avatarUrl'],
  components: {
    'UploadHead': UploadHead,
  },
  data() {
    return {
      userDialog: false,
      form: {
        userName: '',
        email: '',
        phoneNumber: '',
      },
    }
  },
  methods: {
    updateUser() {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/users/' + that.user.userId,
        data: {
          userName: that.form.userName,
          phoneNumber: that.form.phoneNumber,
          email: that.form.email,
        },
        method: 'PUT',
      }).then(function (rs) {
        that.userDialog = false;
        that.notification(true, rs.message);
      })
    },
  },

  created() {
    eventBus.$on("userDialog", data => {
      this.userDialog = data;
      this.form.userName = this.user.userName;
      this.form.email = this.user.email;
      this.form.phoneNumber = this.user.phoneNumber;
    });
  },

}
</script>

<style scoped>

</style>
