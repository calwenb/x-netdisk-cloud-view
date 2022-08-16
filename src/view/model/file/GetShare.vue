<template>
  <el-container>

    <el-header style="height: 100px">
      <el-row type="flex" justify="center">
        <el-col :xs="7" :span="2">
          <el-image :src="logoSrc" style="width: 100%;" class="logo" title="回到主页"
                    @click="$router.push('/index')"></el-image>
        </el-col>
        <el-col :xs="9" :span="4" style="padding-top: 1%;padding-left: 1%;">
          <el-input
            placeholder="请输入分享码"
            v-model="input"
            clearable>
          </el-input>
        </el-col>
        <el-col :xs="2" :span="1" style="padding-top: 1%">
          <el-button circle @click="getShare">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo2"></use>
            </svg>
          </el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-divider></el-divider>
    <el-main>
      <div>
        <el-row type="flex" justify="center">
          <el-col :xs="24" :span="10">
            <el-card :body-style="{ padding: '0 5% 20% 5%'}" shadow="hover" v-if="file!==''">
              <div>
                <el-descriptions title="分享的文件" direction="vertical" :column="4" border>
                  <el-descriptions-item label="文件名">{{ file.myFileName }}</el-descriptions-item>
                  <el-descriptions-item label="文件大小"><span>{{ file.size }} KB</span></el-descriptions-item>
                  <el-descriptions-item label="类型" :span="2">
                    <el-tag size="small">{{ file.type }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
                <div class="bottom clearfix" type="flex" justify="right">
                  <el-button circle @click="download()" class="button"
                             :disabled="disabled">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-xiazai6"></use>
                    </svg>
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <h3>{{ msg }}</h3>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Global from "../../../js/global";
import fileDownload from "js-file-download";
import logoM from "../../../img/logo_l.png";

export default {
  name: "GetShare",
  data() {
    return {
      disabled: true,
      logoSrc: logoM,
      input: '',
      msg: '',
      file: {
        myFileId: '',
        myFileName: '',
        fileStoreId: '',
        myFilePath: '',
        downloadCount: '',
        updateTime: '',
        parentFolderId: '',
        size: '',
        type: ''
      },
    }
  },
  methods: {
    download() {
      let fileIdList = new Array();
      fileIdList.push(this.file.myFileId);
      this.$message('正在获取文件，请稍后...');
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/files/download',
        params: {
          fileIdList: JSON.stringify(fileIdList),
        },
        responseType: 'blob',
        method: 'GET',
      }).then(function (resp) {
        let size = resp.data.size
        if (size > 0) {
          fileDownload(resp.data, that.file.myFileName);
          that.notification(true, that.file.myFileName + " 下载完成");
        } else {
          that.notification(false, that.file.myFileName + " 下载失败");
        }
      }).catch(function (error) {
        console.log(error)
        that.$message.error(error);
      })
    },
    getShare() {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/files/share/' + that.input,
      }).then(function (rs) {
        that.file = rs.data;
        that.file.size = parseFloat(that.file.size / 1024).toFixed(2)
        that.disabled = false;
        that.msg = '';
      })
    }
  },
  created() {
    // 生扫分享二维码 打开链接直接获取文件
    let code = this.$route.params.code;
    if (code !== undefined) {
      this.input = code;
      this.getShare();
    }
  }
}
</script>


<style scoped>
@media only screen and (max-width: 900px) {
  /deep/ .el-input__inner {
    font-size: 12px;
  }
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  float: right;
}


.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.el-header, .el-footer {
  /*background-color: #F9F9F9;*/
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  /*background-color: #F9F9F9;*/
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.logo:hover {
  cursor: pointer;
  color: #409EFF;
}

</style>
