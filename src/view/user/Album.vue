<!--
<template>
  <div class="main">
    <h4>{{ title }}</h4>
    <el-button plain @click="backToRoot" circle>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zhuye"></use>
      </svg>
    </el-button>
    <el-button plain @click="backToPrevious" circle>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xingzhuanggongnengtubiao-"></use>
      </svg>
    </el-button>
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
    <el-button @click="folderTreeOpen" circle>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shuzhuangtu2"></use>
      </svg>
    </el-button>
    <folder-tree></folder-tree>

    <el-divider></el-divider>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="myFileList.filter(data => !search || data.myFileName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;margin-bottom: 10%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="myFileName"
          label="照片名"
          sortable
          width="550">
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.myFileName!=null" class="pointer"
                  @click="preview(scope.row)">
              <i style="font-size: 20px;">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhaopian"></use>
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
          prop="updateTime"
          label="修改日期"
          sortable
          width="250"
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
        title="照片浏览"
        :visible.sync="drawer"
        size="50%">
        <el-card style="font-size: 15px" shadow="hover">
          <p v-if="previewFile.type=='text'" style="white-space:pre-wrap;">{{ previewFile.data }}</p>
          <img :src="previewFile.data" width="500px" v-if="previewFile.type=='img'"/>
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
import Global from "../../js/global";
import eventBus from "../../js/eventBus";
import QRCode from "qrcodejs2"
import fileDownload from "js-file-download";
import folderTree from "../../components/FolderTree";


export default {
  name: "Album",
  components: {"folderTree": folderTree},
  data() {
    return {
      title: '相册',
      shareMsg: '',
      drawer_qrcode: false,
      previewFile: {
        type: '',
        data: ''
      },
      drawer: false,
      dataUrl: '',
      myFileList: [{
        myFileId: '',
        myFileName: '',
        fileStoreId: '',
        myFilePath: '',
        downloadCount: '',
        updateTime: '',
        parentFolderId: '',
        size: '',
        type: ''
      }],
      parentFolderId: '0',
      previousPFID: '0',
      bookPFID: [0],
      multipleSelection: [],
      search: '',
      loading: true,
    }
  },
  created() {
    eventBus.$on("refresh", data => {
      if (data === "do") {
        this.refresh();
      }
    })
    eventBus.$on("searData", data => {
      this.myFileList = data;
      this.title = "搜索文件";
    })
    eventBus.$on("folderData", data => {
      this.getMyFileList(this, data);
    })
  },
  methods: {
    folderTreeOpen() {
      eventBus.$emit("folderTreeDialog", true);
      console.log("222")
    },
    //返回上一个文件夹
    backToPrevious() {
      if (this.bookPFID.length > 1) {
        this.bookPFID.pop();
      }
      this.getMyFileList(this, this.bookPFID[this.bookPFID.length - 1]);
    },
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

        // that.refresh();
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
    updateOpen(row) {
      const that = this;
      this.$prompt('输入新文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        that.updateFile(row, value);
      }).catch((msg) => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    updateFile(row, value) {
      let newName;
      let that = this;
      let url = Global.SERVER_ADDRESS + '/files/' + row.myFileId;
      if (row.fileFolderId != null) {
        newName = value;
        url = Global.SERVER_ADDRESS + '/folders/' + row.fileFolderId;
      } else {
        let oldName = row.myFileName + "";
        let suffix = oldName.substring(oldName.lastIndexOf("."));
        newName = value + suffix
      }
      this.axios({
        url: url,
        params: {
          newName: newName,
        },
        method: 'PUT',
      }).then(function (rsp) {
        that.notification(true, rsp.data);
        that.refresh();
      })
    },
    backToRoot() {
      this.getMyFileList(this, 0, false, true);
    },

    refresh() {
      this.getMyFileList(this, this.parentFolderId);
    },
    openFolder(FolderId) {
      this.getMyFileList(this, FolderId, true);
    },
    getMyFileList(that, FolderId, openFolder, toRoot) {
      that.title = "相册";
      that.loading = true;
      eventBus.$emit("FolderId", FolderId);
      const token = that.$cookies.get("TOKEN");
      if (token === null) {
        that.$router.push({path: '/login'});
      }
      that.axios({
        url: Global.SERVER_ADDRESS + '/files/file-folder',
        params: {
          parentFolderId: FolderId,
        },
        method: 'GET',
      }).then(function (rs) {
        let files = rs.data;
        that.myFileList = files;
        that.previousPFID = that.parentFolderId;
        that.parentFolderId = FolderId;
        if (openFolder === true) {
          that.bookPFID.push(FolderId);
        }
        if (toRoot == true) {
          that.bookPFID = [0];
        }
        that.loading = false;

      })
    },
    preview(row) {
      const that = this;
      this.download(row, true, (rs) => {
        if (rs !== false) {
          that.filePreview(rs, row.type);
          this.drawer = true;
        }
      });
    },
    filePreview(file, type) {

      let self = this;
      // 看支持不支持FileReader
      if (!file || !window.FileReader) {
        return;
      }

      //if (/^image/.test(file.type)) {
      // 创建一个reader
      let reader = new FileReader();
      if (type === "图片") {
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file);
        self.previewFile.type = 'img';
      } else if (type === "文档") {
        // reader.readAsText(file, 'GB2312');
        reader.readAsText(file, 'utf-8');
        self.previewFile.type = 'text';
      } else if (type === "代码") {
        reader.readAsText(file);
        self.previewFile.type = 'text';
      } else {

      }
      // 读取成功后的回调
      reader.onloadend = function () {
        self.previewFile.data = this.result;
      }
    },
    download(row, preview, callback) {
      let fileIdList = new Array();
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
          //照片浏览
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
          //照片浏览
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          /*是否多选*/
          if (row === null) {
            this.delSelect(that);
          } else {
            /*删除的是否为文件夹*/
            if (row.fileFolderId != null) {
              this.handleClick(row);
            } else {
              this.handleClick(row);
            }
          }
        }
      ).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    }
    ,
    delSelect: function (thiss) {
      if (thiss.multipleSelection.length == 0) {
        thiss.$message.error("请选择要删除的文件");
        return;
      }
      let fileIdList = new Array();
      for (const ms of thiss.multipleSelection) {
        if (ms.myFileId == null) {
          thiss.$message.error("多选不能删除文件夹");
          return;
        }
        fileIdList.push(ms.myFileId);
      }
      thiss.delFile(fileIdList);
    }
    ,
    handleClick: function (row) {
      let list = new Array();
      if (row.fileFolderId != null) {
        list.push(row.fileFolderId);
        this.delFile(list, 'folder');
      } else {
        list.push(row.myFileId);
        this.delFile(list);
      }

    }
    ,
    delFile: function (list, type) {
      /*默认删除文件*/
      let url = Global.SERVER_ADDRESS + '/files/ids'
      if (type === 'folder') {
        url = Global.SERVER_ADDRESS + '/folders/ids';
      }

      const that = this;
      this.axios({
        url: url,
        params: {
          IdList: JSON.stringify(list),
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
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.getMyFileList(vm, 0);
      vm.token = vm.$cookies.get("TOKEN");
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
-->
