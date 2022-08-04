<!--
<template>
  &lt;!&ndash; 全部照片 原 文件类型 &ndash;&gt;
  <div class="main">
    <h4>照片</h4>
    <el-button plain @click="refresh" circle>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shuaxin"></use>
      </svg>
    </el-button>
    <el-button class="el-icon-delete" plain @click="delOpen(null)" circle type="danger"></el-button>
    <el-divider></el-divider>

    &lt;!&ndash;图片加载&ndash;&gt;
    <div class="scroll-image" v-loading="loading">
      <ul
        class="list infinite-list"
        v-infinite-scroll="scrollLoad"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="10"
        infinite-scroll-immediate="true"
        style="overflow:visible;">
        <el-row :gutter="10">
          <el-col :xs="2" :sm="3" :md="4" :lg="5" :xl="5" class="list-item img-box"
                  v-for="(file,i) in fileList" :key="i">
            <el-tooltip :content="file.myFileName+' 点击查看原图'" placement="top-start" :open-delay="1000">
              <div class="grid-content bg-purple pointer">
                <el-image :src="file.data"
                          @click="preview(file)"
                          :preview-src-list="[file.data]"
                          @contextmenu.prevent="onContextmenu($event,file)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </el-tooltip>


          </el-col>
        </el-row>
      </ul>
      &lt;!&ndash;          <p v-if="scrollLoading" id="load_div" class="el-icon-loading"></p>&ndash;&gt;
      <p v-if="noMore">没有更多了</p>


    </div>
    <br><br><br><br>


    &lt;!&ndash;  二维码  &ndash;&gt;
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


</template>

<script>
import Global from "../../js/global";
import fileDownload from "js-file-download";
import QRCode from "qrcodejs2";

export default {
  name: "MyImage",
  data() {
    return {
      shareMsg: '',
      drawer_qrcode: false,
      previewFile: {
        type: '',
        data: ''
      },
      drawer: false,
      fileList: [{
        myFileId: '',
        myFileName: '',
        fileStoreId: '',
        myFilePath: '',
        downloadCount: '',
        updateTime: '',
        parentFolderId: '0',
        size: '',
        type: '',
        data: '',
      }],
      parentFolderId: "0",
      type: '',
      multipleSelection: [],
      search: '',
      loading: true,
      page: 1,
      scrollLoading: false
    }
  },
  computed: {
    noMore() {
      return this.page >= 20
    },
    disabled() {
      return this.scrollLoading || this.noMore
    }
  },
  methods: {
    /**
     * 右键图片列表
     * @param event
     * @param row
     * @returns {boolean}
     */
    onContextmenu(event, row) {
      this.$contextmenu({
        /* 菜单*/
        items: [
          {
            label: "刷新",
            onClick: () => {
              this.message = "刷新";
              this.refresh();
            }
          },
          {
            label: "下载",
            onClick: () => {
              this.download(row);
            }
          },
          {
            label: "分享",
            onClick: () => {
              this.shareOpen(row);
            }
          },

          {
            label: "查看信息",
            onClick: () => {
              this.imgMsg(row);
            }
          },
          {
            label: "重命名",
            onClick: () => {
              this.updateOpen(row);
            }
          },
          {
            label: "删除",
            onClick: () => {
              this.delOpen(row);
            }
          },

        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 150 // 主菜单最小宽度
      });
      return false;
    },
    scrollLoad() {
      this.scrollLoading = true
      setTimeout(() => {
        this.page += 1;
        this.getList(this, this.page, "append"); //调用接口，此时页数+1，查询下一页数据
        this.scrollLoading = false
      }, 1000)
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


        that.refresh();
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
    /**
     * 加载文件列表
     * @param that
     * @param page 页数
     * @param type 加载类型 append 或 覆盖（默认）
     */
    getList(that, page, type) {
      if (page === undefined) {
        page = 1;
      }
      const token = that.$cookies.get("TOKEN");
      if (token === null) {
        that.$router.push({path: '/login'});
      }

      that.axios({
        url: Global.SERVER_ADDRESS + '/files/data' + '/p/' + page,
        params: {},
        method: 'GET',
      }).then(function (rs) {
        const data = rs.data;
        if (data === null) {
          that.fileList = "";
          that.loading = false;
          return;
        }
        if (type === "append") {
          for (let i = 0; i < data.length; i++) {
            const file = JSON.parse(data[i].msg);
            file['data'] = data[i].data;
            that.fileList.push(file)
          }
        } else {
          var rsFileList = [];
          for (let i = 0; i < data.length; i++) {
            const file = JSON.parse(data[i].msg);
            file['data'] = data[i].data;
            rsFileList.push(file);
          }
          that.fileList = rsFileList;
        }
        that.loading = false;

      })
      this.scrollLoading = false;
    },
    refresh() {
      this.getList(this);
    },
    handleCurrentChange(val) {

      const type = this.$route.params.type;
      this.type = type;
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/file/queryFilesByType/' + that.type + '/P/' + val,
        params: {},
        method: 'GET',
      }).then(function (rs) {
        that.fileList = rs.data;
      })
    },
    preview(row) {
      const that = this;
      setTimeout(function () {
        that.download(row, true, (rs) => {
          if (rs !== false) {
            let reader = new FileReader();
            // 将图片将转成 base64 格式
            reader.readAsDataURL(rs);

            // 读取成功后的回调
            reader.onloadend = function () {
              var element = document.getElementsByClassName("el-image-viewer__img")[0];
              element.setAttribute("src", String(this.result));
            }

          }
        });
      }, 500)


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
      }).then(function (rsp) {
        that.notification(true, rsp.data);
        that.getList(that);
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formSize(row) {
      return Math.ceil(row.size / 1024).toFixed(0) + " KB";
    },
    formDate(row) {
      let time = new Date(row.updateTime);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let h = time.getHours();
      let m = time.getMinutes();
      let s = time.getSeconds();
      return year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s;
    },


    imgMsg(row) {
      this.$alert('' +
        '    <p>名称：  ' + row.myFileName + '</p>' +
        '    <p>日期：  ' + this.formDate(row) + '</p>' +
        '    <p>大小：  ' + Math.ceil((row.size / 1024) + 0.5).toFixed(0) + " KB" + '</p>' +
        '    <p>下载量：' + row.downloadCount + '</p>' +
        '', '图片信息', {
          dangerouslyUseHTMLString: true
        }
      );

    },
    updateOpen(row) {
      const that = this;
      this.$prompt('输入新文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        //
        let oldName = row.myFileName;
        let suffix = oldName.substring(oldName.lastIndexOf("."));
        that.updateFile(row, value + suffix);
      }).catch((msg) => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    updateFile(row, newName) {
      let that = this;
      let url = Global.SERVER_ADDRESS + '/files/' + id;
      let id = row.myFileId;
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
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.getList(vm)
    });
  }
}
</script>

<style scoped>
.img-box {
  overflow: hidden;
  margin-top: 3%;
  text-align: center;

}

.infinite-list {
  height: 100vh;
}

.list-item {
  height: 300px;
}

.bg-purple {

}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}


.main {
  text-align: left;
  padding: 0 2%;
}

@media only screen and (max-width: 900px) {
  .main {
    padding: 0 0;
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
