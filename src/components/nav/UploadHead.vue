<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-progress="progress"
      :before-upload="beforeAvatarUpload"
      :data="uploadData"
      :headers="headerObj"
    >
      <el-avatar class="avatar">
        <el-image v-if="imageUrl" :src="imageUrl"/>
      </el-avatar>

    </el-upload>
  </div>
</template>


<script>
import Global from "../../js/global";
import eventBus from "../../js/eventBus";

export default {
  name: "UploadHead",
  props: ['userId', 'avatarUrl'],
  data() {
    return {
      headerObj: {
        token: this.$cookies.get("TOKEN")
      },
      imageUrl: this.avatarUrl,
      uploadUrl: Global.SERVER_ADDRESS + '/users/upload-head',
      uploadData: {
        userId: this.userId,
        token: this.$cookies.get("TOKEN")
      },
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.notification(true, "头像上传成功");
      eventBus.$emit("loadAvatar","do");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },
    progress(event, file, fileList) {

    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
