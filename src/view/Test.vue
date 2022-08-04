<template>
  <uploader
    @file-success="onFileSuccess"
    :options="options" class="uploader-example">
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>Drop files here to upload or</p>
      <uploader-btn>select files</uploader-btn>
      <uploader-btn :attrs="attrs">select images</uploader-btn>
      <uploader-btn :directory="true">select folder</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      options: {
        target: 'http://localhost:8070/api/files/upload?fid=0',
        testChunks: false,
        chunkSize: 1024 * 1024 * 2,  //1MB
        simultaneousUploads: 3, //并发上传数
        headers: {
          'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMCJ9.YqlNyBjYyVIO1hDU41AtBUj0Asg4k7vQD2Jfpro3pxY'
        },
      },
      attrs: {
        accept: 'image/*'
      }
    }
  },
  methods: {
    onFileSuccess(rootFile, file, response, chunk) {
      axios.post('http://localhost:9999/uploader.php?action=merge', {
        fileid: file.uniqueIdentifier,
        chunks: chunk.offset + 1
      }).then(function (res) {
        if (res.code === 0) {
          console.log('上传成功')
        } else {
          console.log(res.message);
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>

<style>
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
