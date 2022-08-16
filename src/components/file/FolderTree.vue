<template>
  <div>
    <el-dialog
      title="目录树"
      :visible.sync="dialog"
      class="pwdDialog"
      :modal="false"
      append-to-body>
      <el-tree :data="data" :props="defaultProps" default-expand-all=true highlight-current=true
               icon-class="el-icon-caret-right"
               @node-click="handleNodeClick"></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import Global from "../../js/global";
import eventBus from "../../js/eventBus";

export default {
  name: "FolderTree",
  data() {
    return {
      dialog: false,
      data: [],
      defaultProps: {
        children: 'childNode',
        label: 'name'

      }
    };
  },
  created() {
    eventBus.$on("folderTreeDialog", data => {
      if (data) {
        this.getTree();
      }
    });

  },
  methods: {
    handleNodeClick(data) {
      eventBus.$emit("folderData", data.id);
    },
    getTree() {
      var that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/folders/tree',
        method: 'GET',
      }).then(function (rs) {
        that.data = [rs.data];
        that.dialog = true;
      })
    },

  }
}
</script>

<style scoped>

</style>
