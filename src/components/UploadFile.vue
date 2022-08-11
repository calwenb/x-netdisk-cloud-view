<template>
  <el-dialog
    title="上传文件"
    :visible.sync="dialog"
    :modal="false"
    width="5000">
    <uploader
      ref="uploader"
      :options="options"
      :file-status-text="fileStatusText"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-success="onFileSuccess"
      @file-error="onFileError"
      class="uploader">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn class="upfile"><i class="iconfont icon-upload"></i> 上传文件</uploader-btn>
        <uploader-btn class="updir" :directory="true"><i class="iconfont icon-dir"></i> 上传文件夹</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import SparkMD5 from 'spark-md5';
import eventBus from "../js/eventBus";
import Global from "../js/global";

export default {
  name: "UploadFile",
  data() {
    return {
      dialog: false,
      options: {
        target: 'http://localhost:8070/api/files/upload-big',
        // testChunks: false,
        chunkSize: 1024 * 1024 * 2,  //1MB
        simultaneousUploads: 3, //并发上传数
        headers: {
          'token': this.$cookies.get("TOKEN")
        },
        query: {
          'faFolderId': '',
          'filename': '',
        },
        maxChunkRetries: 2, //最大自动失败重试上传次数
        parseTimeRemaining: (timeRemaining, parsedTimeRemaining) => { //格式化时间
          return parsedTimeRemaining
            .replace(/\syears?/, '年')
            .replace(/\days?/, '天')
            .replace(/\shours?/, '小时')
            .replace(/\sminutes?/, '分钟')
            .replace(/\sseconds?/, '秒')
        },
        testChunks: true,   //开启服务端分片校验
        // 服务器分片校验函数
        checkChunkUploadedByResponse: (chunk, rs) => {
          rs = JSON.parse(rs);
          if (rs.data === 1) {
            console.log("秒传成功")
            this.statusTextMap.success = '秒传文件';
            return true;
          } else {
            this.statusTextMap.success = '';
          }
          return (rs.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
      },

      statusTextMap: {
        success: '上传成功',
        error: '上传出错了',
        uploading: '上传中...',
        paused: '暂停',
        waiting: '等待中...',
        cmd5: '计算md5...'
      },

      fileStatusText: (status, response) => {
        return this.statusTextMap[status];
      },
    }
  },
  mounted() {

  },
  created() {
    eventBus.$on("uploadDialog", data => {
      console.log("data", data)
      this.dialog = true;
      this.options.query.faFolderId = data
    });

  },
  methods: {
    onFileAdded(file) {
      // 计算MD5
      this.computeMD5(file);
    },

    //计算MD5
    computeMD5(file) {
      console.log(this.options.query)
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 2097152,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();
      let time = new Date().getTime();
      file.cmd5 = true;

      fileReader.onload = (e) => {
        spark.append(e.target.result);   // Append array buffer
        currentChunk++;

        if (currentChunk < chunks) {
          //console.log(`第${currentChunk}分片解析完成, 开始第${currentChunk +1} / ${chunks}分片解析`);
          let percent = Math.floor(currentChunk / chunks * 100);
          file.cmd5progress = percent;
          loadNext();
        } else {
          console.log('finished loading');
          let md5 = spark.end();
          console.log(`MD5计算完成：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
          spark.destroy(); //释放缓存
          file.uniqueIdentifier = md5; //将文件md5赋值给文件唯一标识
          file.cmd5 = false; //取消计算md5状态
          file.resume(); //开始上传
        }
      };
      fileReader.onerror = () => {
        console.warn('oops, something went wrong.');
        file.cancel();
      };
      let loadNext = () => {
        let start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      };

      loadNext();
    },
    // 文件进度的回调
    onFileProgress(rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },

    onFileSuccess(rootFile, file, response, chunk) {
      const that = this;
      let rs = JSON.parse(response);
      if (rs.data === 1) {
        this.successMsg(file.name + " ,秒传成功");
        return;
      }
      axios.post(Global.SERVER_ADDRESS + '/files/upload-big/merge', {
        identifier: file.uniqueIdentifier,
        chunkNumber: chunk.offset + 1,
        filename: file.name,
        'faFolderId': this.options.query.faFolderId,
      }).then(function (res) {
        that.successMsg(file.name + " ,上传成功");
      }).catch(function (error) {
        console.log(error);
      });
    },

    onFileError(rootFile, file, response, chunk) {
      this.errorMsg("文件上传失败");
      console.log('Error:', response)
    },
  }
}
</script>

<style scoped="scoped">
@media only screen and (min-width: 320px) and (max-width: 768px) {
  .uploader {
    width: 98%;
    padding: 0;
    box-shadow: none;
  }
}

.uploader {
  width: 880px;
  padding: 15px;
  margin: -30px auto 0;
  font-size: 14px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}

.uploader-btn {
  margin-right: 4px;
  color: #fff;
  padding: 6px 16px;
}

.upfile {
  border: 1px solid #409eff;
  background: #409eff;
}

.updir {
  border: 1px solid #67c23a;
  background: #67c23a;
}

.uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;

  height: 356px;
}

/deep/ .iconfont {
  font-size: 18px;
  color: #409eff;
}

</style>


