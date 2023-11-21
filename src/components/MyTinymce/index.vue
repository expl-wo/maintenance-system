<!-- tinymc富文本 -->
<template>
  <div id="tinymce">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    >
    </editor>
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/skins/ui/oxide/skin.css";
import "../../../public/tinymce/zh-CN.js"; // 本地汉化
import "tinymce/themes/silver"; //编辑器主题，不引入则报错
import "tinymce/icons/default"; //引入编辑器图标icon，不引入则不显示对应图标
import "tinymce/plugins/advlist"; //高级列表
import "tinymce/plugins/anchor"; //锚点
import "tinymce/plugins/autolink"; //自动链接
import "tinymce/plugins/autoresize"; //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import "tinymce/plugins/autosave"; //自动存稿
import "tinymce/plugins/charmap"; //特殊字符
import "tinymce/plugins/code"; //编辑源码
import "tinymce/plugins/codesample"; //代码示例
import "tinymce/plugins/directionality"; //文字方向
import "tinymce/plugins/emoticons"; //表情
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/help"; //帮助
import "tinymce/plugins/image"; //插入编辑图片
import "tinymce/plugins/importcss"; //引入css
import "tinymce/plugins/insertdatetime"; //插入日期时间
import "tinymce/plugins/link"; //超链接
import "tinymce/plugins/lists"; //列表插件
import "tinymce/plugins/media"; //插入编辑媒体
import "tinymce/plugins/nonbreaking"; //插入不间断空格
import "tinymce/plugins/pagebreak"; //插入分页符
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/quickbars"; //快速工具栏
import "tinymce/plugins/save"; //保存
import "tinymce/plugins/searchreplace"; //查找替换
import "tinymce/plugins/table"; //表格
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/template"; //内容模板
import "tinymce/plugins/visualblocks"; //显示元素范围
import "tinymce/plugins/visualchars"; //显示不可见字符
import "tinymce/plugins/wordcount"; //字数统计
export default {
  name: "tinymce",
  components: {
    Editor,
  },
  props: {
    initOptions: {
      type: Object,
      default() {
        return {};
      },
    },
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        "image link code codesample table lists wordcount autosave autolink insertdatetime preview media fullscreen quickbars print template",
    },
    toolbar: {
      type: [String, Array],
      default: [
        {
          name: "history",
          items: ["undo", "redo"],
        },
        {
          name: "styles",
          items: ["styleselect"],
        },
        {
          name: "code",
          items: ["codesample"],
        },
        {
          name: "formatting",
          items: ["bold", "italic", "underline", "strikethrough"],
        },
        {
          name: "fonts",
          items: ["fontselect", "fontsizeselect"],
        },
        {
          name: "colors",
          items: ["forecolor", "backcolor"],
        },
        {
          name: "link",
          items: ["link", "image"],
        },
        {
          name: "alignment",
          items: ["alignleft", "aligncenter", "alignright", "alignjustify"],
        },
        {
          name: "indentation",
          items: ["outdent", "indent"],
        },
        {
          name: "blockquote",
          items: ["blockquote"],
        },
        {
          name: "table",
          items: ["table"],
        },
        {
          name: "lists",
          items: ["numlist", "bullist"],
        },
        {
          name: "tools",
          items: ["preview", "print", "fullscreen"],
        },
      ],
    },
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: "../../../public/tinymce/zh-CN.js", // 这里需要单独处理
        language: "zh_CN",
        height: 500,
        width: 1200,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: true,
        menubar: true,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        },
        resize: true,
      },
      myValue: this.value,
    };
  },
  created() {
    this.init = { ...this.init, ...this.initOptions };
  },
  mounted() {
    tinymce.init({});
    // setTimeout(() => {
    //   $("#tinymce").wordExport('模板');
    // }, 5000)
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>
<style lang="scss">
.tox-tinymce-aux {
  z-index: 3000;
}
</style>
