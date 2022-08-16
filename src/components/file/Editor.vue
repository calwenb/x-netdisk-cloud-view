<template>
  <div style="height: 80vh;margin-top: -3vh;padding-bottom: 4vh;">
    <div id="container"></div>
    <el-button plain @click="submit" circle style="float: right;" title="提交">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-tijiaochenggong"></use>
      </svg>
    </el-button>
  </div>

</template>

<script>
import * as monaco from 'monaco-editor'
import Global from "../../js/global";
import eventBus from "../../js/eventBus";

export default {
  data() {
    return {
      languageMap: {
        '.py': 'python',
        '.java': 'java',
        '.go': 'go',
        '.c': 'cpp',
        '.cpp': 'cpp',
        '.html': 'html',
        '.vue': 'html',
        '.xml': 'xml',
        '.yaml': 'yaml',
        '.css': 'css',
        '.js': 'javascript',
        '.sql': 'sql',
        '.json': 'json',
        '.md': 'markdown',
      },
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
      this.editor.setValue(this.file.data);
      this.setLanguage(this.file.name);
    });
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    setLanguage(fileName) {
      if (fileName.lastIndexOf(".") !== -1) {
        //文件没有后缀
        const suffixName = fileName.substring(fileName.lastIndexOf("."));
        let language = this.languageMap[suffixName];
        if (language == null) {
          language = 'javascript';
        }
        monaco.editor.setModelLanguage(this.editor.getModel(), language)
        return;
      }
      monaco.editor.setModelLanguage(this.editor.getModel(), 'javascript')
    },
    initEditor() {
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('container'), {
        value: this.file.data,//编辑器初始显示文字
        // language: '',//语言支持自行查阅demo
        automaticLayout: true,//自动布局
        theme: 'vs-dark', //官方自带三种主题vs, hc-black, or vs-dark
        fontSize: 15,       //字体大小
      });
      this.editor.onKeyUp(() => {
        // 当键盘按下，判断当前编辑器文本与已保存的编辑器文本是否一致
        if (this.editor.getValue() !== this.oldValue) {
          this.isSave = false;
        }
      });
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
<style scoped="scoped">
#container {
  height: 100%;
  margin-bottom: 1vh;
}

.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.5em;
}
</style>

