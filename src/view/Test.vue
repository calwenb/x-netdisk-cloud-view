<template>

  <div>
    <h @click="getTree">this</h>
    <el-tree :data="data" :props="defaultProps" default-expand-all=true highlight-current=true
             icon-class="el-icon-caret-right"
             @node-click="handleNodeClick"></el-tree>
  </div>
</template>
<script>

import Global from "../js/global";

export default {
  name: "",
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'childNode',
        label: 'name'

      }
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    getTree() {
      var that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/folders/tree',
        method: 'GET',
      }).then(function (rs) {
        console.log(that.data)
        that.data = [rs.data];
        console.log(that.data)
      })
    },

  }
}
;
</script>
