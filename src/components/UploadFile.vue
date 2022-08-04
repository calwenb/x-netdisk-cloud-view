<template>
  <div>
    <el-upload
      ref="upload_file"
      class="upload-demo"
      :action="uploadUrl"
      :data="uploadData"
      :headers="headerObj"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :limit="99999"
      multiple

      :before-upload="uploadBefore"
      :on-success="uploadSuccess"
    >
      <el-button slot="trigger" type="primary">
        <i class="el-icon-upload el-icon--right" style="color: white;"></i>
        <span class="mobileHide">上传文件</span>
      </el-button>
      <el-button class="el-icon-close" size="mini" plain circle style="margin-left: 5%;" hidden
                 v-show="close_list" @click="clear_list"></el-button>

    </el-upload>

  </div>

</template>
<script>
import Global from "../js/global";
import eventBus from "../js/eventBus"

export default {
  name: "UploadFile",
  props: ['user', 'token'],

  data() {
    return {
      headerObj: {
        token: this.$cookies.get("TOKEN")
      },
      close_list: false,
      uploadData: {
        fid: '0'
      },
      uploadUrl: Global.SERVER_ADDRESS + '/files/upload',
      parentFolderId: ''
    };
  },
  created() {
    eventBus.$on("FolderId", data => {
      this.uploadData.fid = data;
    });
  },
  methods: {
    outLogin() {
      this.$cookies.remove("TOKEN")
    },
    handleSelect(key, keyPath) {
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    uploadBefore(file) {

    },
    uploadSuccess(response) {
      const resp = response;
      if (resp.code === 2000) {
        this.successNotification(resp.message);
        eventBus.$emit("refresh", "do");
      } else {
        this.errorNotification(resp.message);
      }
    },
    successNotification(msg) {
      this.close_list = true;
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
      });
    },
    errorNotification(msg) {
      this.$notify.error({
        title: '失败',
        message: msg
      });
    },
    clear_list() {
      this.$refs.upload_file.clearFiles();
      this.close_list = false;
    },

  }
}
</script>

<style scoped>

</style>
