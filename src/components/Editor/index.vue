<template>
  <div class="full-content">
    <div class="full-content editor-wrapper">
      <Toolbar
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        class="editor-content"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
    <preview-modal :visible="visible" :editorHtml="html" @closeDialog="closeDialog" />
  </div>
</template>
<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import PreviewModal from "./components/previewModal";
export default {
  components: {
    Editor,
    Toolbar,
    PreviewModal
  },
  props: {
    contentHtml: {
      type: String,
      default: ''
    },

  },
  data() {
    return  {
      editor: null,
      html: '',
      toolbarConfig: {
        excludeKeys: ["group-video", "fullScreen"]
      },
      editorConfig: {
        placeholder: "请输入内容..."
      },
      mode: 'default',
      visible: false
    }
  },
  watch: {
    contentHtml(newVal, oldVal) {
      this.html = newVal;
    },
    html(newVal, oldVal) {
      this.$emit('valChange', newVal);
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor);
    },
    // 预览
    preview() {
      this.visible = true;
    },
    // 关闭预览框
    closeDialog() {
      this.visible = false;
    }
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
  .full-content {
    width: 100%;
    height: 100%;
  }
  .editor-wrapper {
    border-bottom: 1px solid #ccc;
    .editor-content {
      height: calc(100% - 40px) !important;
      border-top: 1px solid #ccc;
      overflow-y: hidden;
    }
  }
</style>