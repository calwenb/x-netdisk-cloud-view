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
        :data="userList.filter(data => !search || data.myFileName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;margin-bottom: 10%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange">

        <el-table-column
          prop="userId"
          label="id"
          sortable
          width="80">
        </el-table-column>

        <el-table-column
          prop="userName"
          label="用户名"
          sortable
          width="150">
        </el-table-column>

        <el-table-column
          prop="loginName"
          label="账号"
          sortable
          width="150">
        </el-table-column>

        <el-table-column
          prop="passWord"
          label="密码"
          sortable
          width="200">
        </el-table-column>

        <el-table-column
          prop="userType"
          label="身份"
          sortable
          width="80">
        </el-table-column>

        <el-table-column
          prop="phoneNumber"
          label="电话"
          sortable
          width="200">
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
          sortable
          width="200">
        </el-table-column>

        <el-table-column
          prop="registerTime"
          label="注册日期"
          sortable
          width="250">
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
import Global from "../../../js/global";
import eventBus from "../../../js/eventBus";
import AdminAddD from "../../../components/admin/AdminAddD";
import AdminUpD from "../../../components/admin/AdminUpD";

export default {
  name: "AdminUserMsg",
  components: {
    'adminAddD': AdminAddD,
    'adminUpD': AdminUpD,
  },
  data() {
    return {
      accTerm: false,
      term: 'id',
      keyword: '',
      userList: [{
        userId: '',
        userName: '',
        loginName: '',
        passWord: '',
        userType: '',
        phoneNumber: '',
        email: '',
        registerTime: '',
      }],
      multipleSelection: [],
      search: '',
      loading: true,
    }
  },
  methods: {
    updateOpen(row) {
      eventBus.$emit("upUserDialog", row);
    },
    addOpen() {
      eventBus.$emit("addDialog", true);
    },
    searchData() {
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
        url: Global.SERVER_ADDRESS + "/admins/search-user",
        params: {
          term: that.term,
          value: that.keyword,
          accurate: that.accTerm

        }
      }).then(function (rs) {
        const reUsers = rs.data;
        for (let i = 0; i < reUsers.length; i++) {
          reUsers[i]["userId"] = reUsers[i]["id"];
        }
        that.userList = reUsers;
        that.loading = false;
        eventBus.$emit("searData", rs.data);

      })
    },
    getList(that) {
      that.loading = true;
      const token = that.$cookies.get("TOKEN");
      if (token === null) {
        that.$router.push({path: '/login'});
      }
      that.axios({
        url: Global.SERVER_ADDRESS + '/admins/users',
        params: {},
        method: 'GET',
      }).then(function (rs) {
        const reUsers = rs.data;
        for (let i = 0; i < reUsers.length; i++) {
          reUsers[i]["userId"] = reUsers[i]["id"];
        }
        that.userList = reUsers;
        that.loading = false;

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
