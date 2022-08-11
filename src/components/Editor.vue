<template>
  <div>
    <div id="container" style="height: 800px;"></div> <!--宽高自行设定 -->
    <el-button @click="saveEditor">保存</el-button>
    <el-button @click="submit">提交</el-button>
  </div>

</template>

<script>


import * as monaco from 'monaco-editor'
import Global from "../js/global";
import eventBus from "../js/eventBus";

export default {
  props: ['previewFile'],
  data() {
    return {
      editor: null,//文本编辑器
      isSave: true,//文件改动状态，是否保存
      oldValue: '',//保存后的文本
      file: {
        id: '',
        name: '',
        language: '',
        type: '',
        data: ''
      }
    }
  },
  created() {
    eventBus.$on("openEditor", data => {
      this.file = data;
      console.log("this.file", this.file)
      this.editor.setValue(this.file.data);
      monaco.languages.register('java')
    });
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('container'), {
        value: this.file.data,//编辑器初始显示文字
        language: '',//语言支持自行查阅demo
        automaticLayout: true,//自动布局
        theme: 'vs-dark', //官方自带三种主题vs, hc-black, or vs-dark
        fontSize: 17,       //字体大小
      });
      this.editor.onKeyUp(() => {
        // 当键盘按下，判断当前编辑器文本与已保存的编辑器文本是否一致
        if (this.editor.getValue() !== this.oldValue) {
          this.isSave = false;
        }
      });
    },
    //保存编辑器方法
    saveEditor() {
      this.oldValue = this.editor.getValue();
    },
    getValue() {
      this.editor.getValue(); //获取编辑器中的文本
    },
    submit() {
      const str = this.editor.getValue();
      const fileContent = new File([str], 'xxx', {type: ''})
      const formdata = new FormData();
      formdata.append('data', fileContent);
      formdata.append("id", this.file.id);
      const that = this;
      this.axios({
        url: Global.SERVER_ADDRESS + '/files/data',
        method: 'put',
        headers: {'content-type': 'multipart/form-data'},
        data: formdata
      }).then(function (rs) {
        if (rs.code === 2000) {
          that.successMsg(rs.message);
          return
        }
        that.errorMsg(rs.message);
      })
    },

  }
}

</script>

