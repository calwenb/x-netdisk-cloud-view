<template>
  <div class="main">
    <h4>用户信息</h4>
    <el-row>
      <el-col :span="5">
        <el-input v-model="keyword" placeholder="input"></el-input>
      </el-col>

      <el-col :span="5">
        <el-radio-group v-model="term" size="small">
          <el-radio-button label="id">id</el-radio-button>
          <el-radio-button label="user_name">用户名</el-radio-button>
          <el-radio-button label="login_name">账号</el-radio-button>
          <el-radio-button label="phone_number">电话</el-radio-button>
          <el-radio-button label="email">邮箱</el-radio-button>
        </el-radio-group>
      </el-col>

      <el-col :span="5">
        <el-switch
          v-model="accTerm"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      </el-col>

      <el-col :span="5">
        <el-button icon="el-icon-circle-plus-outline" circle
                   @click="addOpen"></el-button>
      </el-col>
    </el-row>


    <el-divider/>
    <div class="table">

      <el-table
        v-loading="loading"
        :data="storeList.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;margin-bottom: 10%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange">

        <el-table-column
          prop="storeId"
          label="仓库id"
          sortable
          width="150">
        </el-table-column>
        <el-table-column
          prop="user.id"
          label="用户id"
          sortable
          width="200">
        </el-table-column>


        <el-table-column
          prop="user.userName"
          label="用户名"
          sortable
          width="200">
        </el-table-column>

        <el-table-column
          prop="currentSize"
          label="已使用"
          sortable
          :formatter="currentSize"
          width="200">
        </el-table-column>

        <el-table-column
          prop="maxSize"
          label="总容量"
          sortable
          :formatter="maxSize"
          width="200">
        </el-table-column>

        <el-table-column
          prop="user.userType"
          label="vip等级"
          :formatter="typeSize"
          sortable
          width="250">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <!--              <el-tag size="medium" >{{ scope.row.user.userType%10 }}</el-tag>
                            <el-button >{{scope.row.user.userType>10?'去':''}}</el-button>-->
              <svg class="iconVip" aria-hidden="true" v-if="scope.row.user.userType%10===2">
                <use xlink:href="#icon-chuangxiangbaiyinvip"></use>
              </svg>
              <svg class="iconVip" aria-hidden="true" v-if="scope.row.user.userType%10===3">
                <use xlink:href="#icon-chuangxianghuangjinvip"></use>
              </svg>
              <svg class="iconVip" aria-hidden="true" v-if="scope.row.user.userType%10===4">
                <use xlink:href="#icon-chuangxiangzijinvip"></use>
              </svg>
              <svg class="iconVip" aria-hidden="true" v-if="scope.row.user.userType%10===5">
                <use xlink:href="#icon-chuangxiangzuanshivip"></use>
              </svg>
              <svg class="iconVip" aria-hidden="true" v-if="scope.row.user.userType%10===6">
                <use xlink:href="#icon-huaban"></use>
              </svg>
              <el-button v-if="scope.row.user.userType>10" circle @click="upLevel(scope.row.user.id)" size="mini">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-chixushengji"></use>
                </svg>

              </el-button>


            </div>
          </template>

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


            <el-button icon="el-icon-edit" circle
                       @click="updateOpen(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle
                       @click="delOpen(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" style="">
      <el-pagination align="center"
                     @current-change="handleCurrentChange"
                     background
                     layout="prev, pager, next"
                     :total="100">
      </el-pagination>
    </div>
    <br><br><br><br>

    <!-- 弹窗 -->
    <admin-add-d/>
    <admin-up-d/>

  </div>

</template>

<script>
import Global from "../../js/global";
import eventBus from "../../js/eventBus";
import AdminAddD from "../../components/admin/AdminAddD";
import AdminUpD from "../../components/admin/AdminUpD";
import el from "element-ui/src/locale/lang/el";

export default {
  name: "StoreMsg",
  components: {
    'adminAddD': AdminAddD,
    'adminUpD': AdminUpD,
  },
  data() {
    return {
      accTerm: false,
      term: 'id',
      keyword: '',
      storeList: [{
        storeId: '',

        currentSize: '',
        maxSize: '',
        user: {
          userId: '',
          userName: '',
          userType: '',
        }
      }],

      multipleSelection: [],
      search: '',
      loading: true,
    }
  },
  methods: {
    updateOpen(row) {
      console.log(row);
      eventBus.$emit("upUserDialog", row);
    },
    addOpen() {
      eventBus.$emit("addDialog", true);
    },
    /* searchData() {
       let keyword = this.keyword;
       if (keyword === '') {
         this.$message.error("请输入要搜索文件的关键字");
         return;
       }
       var rule = /[`~!@#$%^&*()_+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
       if (keyword === "" || rule.test(keyword)) {
         this.$message.error("禁止输入特殊符号");
         return;
       }
       const that = this
       this.axios({
         url: Global.SERVER_ADDRESS + "/admin/search_user",
         params: {
           term: that.term,
           value: that.keyword,
           accurate: that.accTerm

         }
       }).then(function (rs) {
         const reUsers = rs.data;
         for (let i = 0; i < reUsers.length; i++) {
           rs
           reUsers[i]["userId"] = reUsers[i]["id"];
         }
         that.userList = reUsers;
         that.loading = false;
         eventBus.$emit("searData", rs.data);

       })
     },*/
    getList(that) {
      that.loading = true;
      that.axios({
        url: Global.SERVER_ADDRESS + '/stores/user-store',
        params: {},
        method: 'GET',
      }).then(function (rs) {

        const reStore = rs.data;
        for (let i = 0; i < reStore.length; i++) {
          // reStore[i]["userName"] = reStore[i]["user"]["userName"];
          reStore[i]["storeId"] = reStore[i]["fileStoreId"]

        }
        that.storeList = reStore;
        that.loading = false;
        console.log("55", that.storeList)
      })
    },
    updateDialog(row) {
      eventBus.$emit("userDialog", row);
    },
    refresh() {
      this.getList(this);
    },
    handleCurrentChange(val) {

    },

    delOpen(row) {
      const that = this;
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
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
      this.delFile(row.id);
    },
    delFile: function (userId) {
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/admin/user/' + userId,
        params: {},
        method: 'DELETE',
      }).then(function (rs) {
        that.notification(true, rs.message);
        that.getList(that);
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    currentSize(row) {
      return Math.ceil(row.currentSize / 1024 + 0.5).toFixed(0) + " MB";
    },
    maxSize(row) {
      return Math.ceil(row.maxSize / 1024 + 0.5).toFixed(0) + " MB";
    },
    typeSize(row) {
      if (userType > 10) {
        return " 等级申请";
      }
    },
    upLevel(userId) {
      let that = this
      that.axios({
        url: Global.SERVER_ADDRESS + '/admins/up-level',
        params: {
          uid: userId
        },
        method: 'PUT',
      }).then(function (rs) {
        that.getList(that);
        that.successMsg(rs.message)
      })
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
.iconVip {
  width: 5em;
  height: 5em;
  vertical-align: 5em;
}

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

</style>
