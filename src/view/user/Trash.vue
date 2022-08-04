<template>
  <!-- 全部照片 原 文件类型 -->
  <div class="main">
    <h4>回收站</h4>
    <el-button plain @click="refresh" circle>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shuaxin"></use>
      </svg>
    </el-button>
    <el-divider></el-divider>

    <!--图片加载-->
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
      <!--          <p v-if="scrollLoading" id="load_div" class="el-icon-loading"></p>-->
      <p v-if="noMore">没有更多了</p>


    </div>
    <br><br><br><br>

  </div>
</template>

<script>
import Global from "../../js/global";
import fileDownload from "js-file-download";
import QRCode from "qrcodejs2";

export default {
  name: "Trash",
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
            label: "查看信息",
            onClick: () => {
              this.imgMsg(row);
            }
          },
          {
            label: "还原",
            onClick: () => {
              this.restored(row);
            }
          },
          {
            label: "删除",
            onClick: () => {
              this.delOpen(row);
            }
          },

          /* {label: "前进(F)",},
           {label: "重新加载(R)", icon: "el-icon-refresh"},*/
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
        url: Global.SERVER_ADDRESS + '/trashs/data' + '/p/' + page,
        params: {},
        method: 'GET',
      }).then(function (rs) {
        console.log("rs", rs)
        let data = rs.data;
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

    download(row, preview, callback) {
      delete row.data
      this.$message('正在获取文件，请不要重复点击，稍等...');
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/trashs/data',
        params: {
          trashJSON: JSON.stringify(row),
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
      this.delFile(row);
    },
    delFile: function (row) {
      delete row.data
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/trashs/by-file',
        params: {
          trashJSON: JSON.stringify(row),
        },
        method: 'DELETE',
      }).then(function (rsp) {

        that.notification(true, rsp.data);

        that.getList(that);
      })
    },
    restored(row) {
      delete row.data
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/trashs/restored',
        params: {
          trashJSON: JSON.stringify(row),
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
