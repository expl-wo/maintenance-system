<template>
  <el-dialog
    :title="modalTitle"
    width="70%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    draggable
    @close="handleClose"
  >
    <div class="form-wrapper">
      <el-form
        ref="templateFrom"
        :model="templateFrom"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="模板名称" prop="name">
              <el-input v-model="templateFrom.name"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="模板类型" prop="type">
              <el-select v-model="templateFrom.type" placeholder="请选择">
                <el-option
                  v-for="item in docTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="tinymce-wrapper">
      <my-tinymce ref="editor" :height="200" v-model="content"></my-tinymce>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="handleConfirm"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import MyTinymce from "@/components/MyTinymce";
import { safeLimit, requiredVerify } from "@/common/js/validator";
import {
  getTemplateTypeList,
  addOrEditTemplate,
} from "@/api/overhaul/templateLib";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editorHtml: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
      default: null,
    },
  },
  components: {
    MyTinymce,
  },
  data() {
    return {
      templateFrom: {
        docId: "",
        name: "",
        type: "",
      },
      rules: {
        name: safeLimit("名称", true),
        type: requiredVerify("类型", true),
      },
      content: "",
      loading: false,
      docTypeList: [],
    };
  },
  computed: {
    isAdd() {
      return !!this.info;
    },
    modalTitle() {
      return `${this.isAdd ? "新增" : "编辑"}文档模板`;
    },
  },
  watch: {
    async visible(newVal) {
      if (newVal) {
        let res = await getTemplateTypeList();
        if (res.success && res.data) {
          let typeData = res.data || {};
          this.docTypeList = Object.keys(typeData).map((item) => {
            return {
              value: item,
              label: typeData[item],
            };
          });
        }
        if (newVal && this.info) {
          let { name, type, content, docId } = this.info;
          this.templateFrom.docId = docId;
          this.templateFrom.name = name;
          this.templateFrom.type = type;
          this.content = content;
        }
      }
    },
  },
  methods: {
    // 关闭
    handleClose() {
      this.$refs.templateFrom.resetFields();
      this.$emit("closeModal", "add", false);
    },
    // 确定
    handleConfirm() {
      this.$refs.templateFrom.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        let activeEditor = tinymce.activeEditor;
        let editBody = activeEditor.getBody();
        activeEditor.selection.select(editBody);
        let text = activeEditor.selection.getContent({ format: "text" });
        let params = {
          docId: this.templateFrom.docId,
          name: this.templateFrom.name,
          type: this.templateFrom.type,
          content: this.content,
          contentStr: text,
        };
        addOrEditTemplate(params).then((res) => {
          if (res.success) {
            this.$message.success("操作成功");
            this.$refs.templateFrom.resetFields();
            this.loading = false;
            this.$emit("closeModal", "add", true);
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-wrapper ::v-deep(.el-input) {
  width: 250px;
}
.tinymce-wrapper {
  margin-top: 10px;
  ::v-deep(.tox-tinymce) {
    width: 100% !important;
  }
}
::v-deep(.tox-menu) {
  z-index: 3000 !important;
}
</style>