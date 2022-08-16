<template>
  <div class="main">
    <h4>{{ type }}</h4>
    <el-button plain @click="refresh" circle>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shuaxin"></use>
      </svg>
    </el-button>
    <el-button plain @click="delOpen(null)" circle type="danger">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shanchu2"></use>
      </svg>
    </el-button>

    <el-divider></el-divider>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="myFileList.filter(data => !search || data.myFileName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;margin-bottom: 10%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="myFileName"
          label="文件名"
          sortable
          width="400">
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.myFileName!=null" class="pointer"
                  @click="preview(scope.row)">
              <i style="font-size: 20px;">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon--wenjian"></use>
                </svg>
              </i>
              <span v-html="scope.row.myFileName"></span>
            </span>
            <span style="margin-left: 10px" v-if="scope.row.fileFolderName!=null" class="pointer"
                  @click="openFolder(scope.row.fileFolderId)">
              <i style="font-size: 20px;">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-wenjianjia"></use>
                </svg>
              </i>
              &nbsp; <span v-html="scope.row.fileFolderName"></span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="size"
          label="大小"
          sortable
          width="230"
          :formatter="formSize">
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          sortable
          width="100">
        </el-table-column>

        <el-table-column
          prop="updateTime"
          label="修改日期"
          sortable
          width="230"
          :formatter="formDate">
        </el-table-column>

        <el-table-column
          fixed="right"
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="input"/>
          </template>
          <template slot-scope="scope">
            <el-button circle v-if="scope.row.myFileName!=null"
                       @click="download(scope.row)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiazai6"></use>
              </svg>
            </el-button>
            <el-button circle v-if="scope.row.myFileName!=null"
                       @click="shareOpen(scope.row)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fenxiang7"></use>
              </svg>
            </el-button>
            <el-button circle @click="updateOpen(scope.row)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bianji3"></use>
              </svg>
            </el-button>
            <el-button type="danger" icon="el-icon-delete" circle
                       @click="delOpen(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>

      <el-drawer
        title="内容展示"
        :visible.sync="drawer"
        size="60%">
        <el-card style="font-size: 15px" shadow="hover">
          <p v-if="previewFile.type==='text'" style="white-space:pre-wrap;">
            <editor></editor>
          </p>
          <img :src="previewFile.data" width="500px" v-if="previewFile.type==='img'"/>
        </el-card>
      </el-drawer>

      <el-drawer
        title="扫二维码，下载文件"
        :visible.sync="drawer_qrcode"
        size="20%"
        style="text-align: center;"
      >
        <el-card style="font-size: 15px" shadow="hover">
          <p>{{ shareMsg }}</p>
          <div id='qrCode' ref='qrCodeDiv' style="padding: 10% 25% 10% 25%;"></div>
        </el-card>

      </el-drawer>
    </div>


  </div>

</template>


<script>
import Global from "../../../js/global";
import eventBus from "../../../js/eventBus";
import QRCode from "qrcodejs2"
import fileDownload from "js-file-download";
import Editor from "../../../components/file/Editor";


export default {
  name: "FilesType",
  components: {
    "editor": Editor
  },
  data() {
    return {
      shareMsg: '',
      drawer_qrcode: false,
      previewFile: {
        id: '',
        name: '',
        type: '',
        data: ''
      },
      drawer: false,
      myFileList: [{
        myFileId: '',
        myFileName: '',
        fileStoreId: '',
        myFilePath: '',
        downloadCount: '',
        updateTime: '',
        parentFolderId: '0',
        size: '',
        type: ''
      }],
      parentFolderId: "0",
      type: '',
      multipleSelection: [],
      search: '',
      loading: true
    }
  },

  methods: {
    shareOpen(row) {
      let that = this;
      this.$confirm('分享生成临时文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          that.shareFile(row);
        }
      ).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    shareFile(row) {
      let that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/files/share/' + row.myFileId,
        method: 'POST',
      }).then(function (rsp) {
        that.drawer_qrcode = true;
        let shareUrl = Global.CLIENT_ADDRESS + "/getshare/" + rsp.data;
        that.shareMsg = "文件分享码 :  " + rsp.data + "  有限期1天";

        //生成分享二维码 定时器解决等待dom加载完
        setTimeout(function creatQrCode() {
          document.getElementById("qrCode").innerHTML = "";
          new QRCode(that.$refs.qrCodeDiv, {
            text: shareUrl,
            width: 200,
            height: 200,
            colorDark: "#333333",
            colorLight: "#ffffff",
          })
        }, 1000);

      })
    },
    creatQrCode(url) {
      document.getElementById("qrCode").innerHTML = "";
      new QRCode(this.$refs.qrCodeDiv, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
      })
    },
    getList(that) {
      that.loading = true;
      const type = that.$route.params.type;
      that.type = type;
      that.axios({
        url: Global.SERVER_ADDRESS + '/files',
        params: {
          type: that.type,
          page: 1,
        },
        method: 'GET',
      }).then(function (rs) {
        that.myFileList = rs.data;
        that.loading = false;
      })
    },
    refresh() {
      this.getList(this);
    },
    handleCurrentChange(val) {
      const token = this.$cookies.get("TOKEN");
      if (token === null) {
        this.$router.push({path: '/login'});
      }
      const type = this.$route.params.type;
      this.type = type;
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/file/queryFilesByType/' + that.type + '/P/' + val,
        params: {},
        method: 'GET',
      }).then(function (rs) {
        let data = rs.data;
        if (data.code === '200') {
          let files = JSON.parse(data.msg);
          that.myFileList = files;
        } else {
          that.$message.error(data.msg);
        }
      }).catch(function (error) {
        that.$message.error(error);
      })
    },
    preview(row) {
      const that = this;
      this.download(row, true, (rs) => {
        if (rs !== false) {
          that.filePreview(rs, row);
          this.drawer = true;
        }
      });
    },
    filePreview(file, row) {
      let self = this;
      // 看支持不支持FileReader
      if (!file || !window.FileReader) {
        return;
      }

      let reader = new FileReader();
      if (row.type === "图片") {
        reader.readAsDataURL(file);
        self.previewFile.type = 'img';
      } else if (row.type === "文档") {
        reader.readAsText(file, 'utf-8');
        self.previewFile.type = 'text';
      } else if (row.type === "代码") {
        reader.readAsText(file);
        self.previewFile.type = 'text';
      }
      // 读取成功后的回调
      reader.onloadend = function () {
        self.previewFile.data = this.result;
        self.previewFile.id = row.myFileId;
        self.previewFile.name = row.myFileName;
        eventBus.$emit("openEditor", self.previewFile);
      }
    },
    download(row, preview, callback) {
      let fileIdList = [];
      fileIdList.push(row.myFileId);
      this.$message('正在获取文件，请不要重复点击，稍等...');
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/files/download',
        params: {
          fileIdList: JSON.stringify(fileIdList),
          preview: preview
        },
        responseType: 'blob',
        method: 'GET',
      }).then(function (resp) {
        let size = resp.data.size
        if (size > 0) {
          //文件浏览
          if (preview === true) {
            // 文件类型非 文档,代码,图片不支持在线浏览
            if (row.type === "文档" || row.type === "代码" || row.type === "图片") {
              let fileName = row.myFileName;
              if (fileName.lastIndexOf(".") !== -1) {
                //文件没有后缀
                var suffixName = fileName.substring(fileName.lastIndexOf("."));
                // 且 office文件也不支持浏览
                if (suffixName === '.doc' || suffixName === '.docx'
                  || suffixName === '.xls' || suffixName === '.xlsx'
                  || suffixName === '.csv' || suffixName === '.PPTX'
                  || suffixName === '.pdf' || suffixName === '.PDF') {
                  that.$message.error("文件在线浏览暂不支持 " + suffixName + " 后缀文件 ");
                  return;
                }
                callback(resp.data);
              }
            } else {
              that.$message.error("文件在线浏览暂不支持 " + row.type + " 格式");
            }
            return;
          } else {
            fileDownload(resp.data, row.myFileName);
          }
          that.notification(true, row.myFileName + " 下载完成");
        } else {
          //文件浏览
          if (preview === true) {
            that.notification(false, row.myFileName + " 打开失败");
            callback(false);
            return;
          }
          that.notification(false, row.myFileName + " 下载失败");
        }
      }).catch(function (error) {
        console.log(error)
        that.$message.error(error);
      })
    },
    delOpen(row) {
      const that = this;
      this.$confirm('此操作将移至回收站（保留7天）, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row === null) {
          this.delSelect(that);
        } else {
          this.handleClick(row);
        }
      }).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    delSelect: function (thiss) {
      let fileIdList = new Array();
      for (const ms of thiss.multipleSelection) {
        fileIdList.push(ms.myFileId);
      }
      thiss.delFile(fileIdList);
    },
    handleClick: function (row) {
      let fileIdList = new Array();
      fileIdList.push(row.myFileId);
      this.delFile(fileIdList);
    },
    delFile: function (fileIdList) {

      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/files/ids',
        params: {
          IdList: JSON.stringify(fileIdList),
        },
        method: 'DELETE',
      }).then(function (rs) {
        that.notification(true, rs.message);
        that.refresh();
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formSize(row) {
      if (row.size == null) {
        return "";
      }
      return Math.ceil((row.size / 1024) + 0.5).toFixed(0) + " KB";
    },
    formDate(row) {
      if (row.updateTime == null) {
        return "";
      }
      let time = new Date(row.updateTime);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let h = time.getHours();
      let m = time.getMinutes();
      let s = time.getSeconds();
      return year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s;
    }
    ,
  },
  watch: {
    '$route'(to, from) {
      this.getList(this)
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.getList(vm)
    });
  }
}
</script>

<style scoped>

.main {
  text-align: left;
  padding: 0 2%;
}

.table {
  padding-left: 2%;
}

@media only screen and (max-width: 900px) {
  .main {
    padding: 0 0;
  }

  /deep/ .el-table {
    font-size: 10px;
  }

  .table {
    padding-left: 0;
  }

}

body {
  margin: 0;
}

.pointer:hover {
  cursor: pointer;
  color: #409EFF;
}
</style>
