<template>
  <div>
    <el-col :span="18">
      <el-input v-model="keyword" placeholder="input"></el-input>
    </el-col>
    <el-col :span="5">
      <el-button  circle @click="searchData">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-sousuo2"></use>
        </svg>
      </el-button>
    </el-col>


  </div>
</template>

<script>
import Global from "../js/global";
import eventBus from "../js/eventBus";

export default {
  name: "Search",
  data() {
    return {
      keyword: ''
    };
  },

  methods: {
    searchData() {
      let keyword = this.keyword;
      if (keyword === '') {
        this.$message.error("请输入要搜索文件的关键字");
        return;
      }

      var rule = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
      if (keyword === "" || rule.test(keyword)) {
        this.$message.error("禁止输入特殊符号");
        return;
      }
      const that = this
      this.axios({
        url: Global.SERVER_ADDRESS + "/searchs/" + keyword,
        params: {}
      }).then(function (rs) {
        eventBus.$emit("searData", rs.data);
      })
    },
  }
}
</script>

<style scoped>

</style>
