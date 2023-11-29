<template>
  <el-dialog draggable
    :title="modalTitle"
    width="70%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
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
            <el-form-item  label="模板名称" prop="name">
              <el-input v-model="templateFrom.name"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="模板类型" prop="type">
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
      <my-tinymce ref="editor" :height="200" :value="content" @input="contentChange"></my-tinymce>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="handleClose">取 消</el-button>
        <el-button

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
      modalTitle: '',
    };
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
          this.modalTitle = '编辑模板文档';
          let { name, type, content, docId } = this.info;
          this.templateFrom.docId = docId;
          this.templateFrom.name = name;
          this.templateFrom.type = type;
          this.content = content;
        } else {
          this.templateFrom.docId = '';
          this.templateFrom.name = '';
          this.templateFrom.type = '';
          this.content = '';
          this.modalTitle = '新增模板文档';
        }
      }
    },
  },
  methods: {
    // 内容发生变化
    contentChange(val) {
      this.content = val;
    },
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
          creatorId: localStorage.getItem('userId')
        };
        addOrEditTemplate(params)
        .then((res) => {
          if (res.success) {
            this.$message.success("操作成功");
            this.$refs.templateFrom.resetFields();
            this.$emit("closeModal", "add", true);
          } else {
            this.$message.error(res.errMsg);
          }
        })
        .catch(() => {
          this.$message.error('操作失败');
        })
        .finally(() => {
          this.loading = false;
        })
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-wrapper :deep(.el-input) {
  width: 250px;
}
.tinymce-wrapper {
  margin-top: 10px;
  :deep(.tox-tinymce) {
    width: 100% !important;
  }
}
:deep(.tox-menu) {
  z-index: 3000 !important;
}
</style>
