<template>
  <div class="full-content">
    <div class="content-wrapper">
      <editor :contentHtml="content" @valChange="valChange" ref="editor"/>
    </div>
    <div class="btn-wrapper">
      <el-button class="mr12" @click="cancel">取消</el-button>
      <el-button type="primary" class="mr12" @click="perview">预览</el-button>
      <el-button type="primary" :loading="loading" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import { getTemplateData, addOrEditTemplate, getTemplateById } from '@/api/overhaul/templateLib';
import Editor from "@/components/Editor/index.vue";
export default {
  components: { Editor },
  data() {
    return {
      content: '',
      loading: false,
      revData: {}
    };
  },
  mounted() {
    this.getTemplate();
  },
  methods: {
    async getTemplate() {
      let docData = {};
      let res = await getTemplateData({ type: 0 });
      if (res && res.success && res.data && res.data.value) {
        let revData = res.data.value;
        if (!revData.length) return;
      }
      docData = res.data.value[0];
      if (docData.docId) {
        let revRes = await getTemplateById({ docId: docData.docId });
        if (revRes && revRes.success) {
          this.revData = revRes.data;
          this.content = this.revData.content || '';
        }
      } else {
        this.$message.error('模板详情获取失败');
      }
      
    },
    valChange(val) {
      this.content = val;
    },
    // 取消
    cancel() {
      this.content = this.revData.content || '';
    },
    // 预览
    perview() {
      this.$refs.editor.preview();
    },
    // 保存
    save() {
      this.loading = true;
      let params = {
        ...this.revData,
        content: this.content,
        contentStr: this.$refs.editor.editor.getText(),
        type: '0',
        createrId: localStorage.getItem("userId")
      }
      addOrEditTemplate(params)
      .then(res => {
        if (res && res.success) {
          this.$message.success('操作成功');
          this.getTemplate();
        }
      })
      .catch(err => {
        console.log(err);
        this.$message.error('操作失败');
      })
      .finally(() => {
        this.loading = false;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.full-content {
  width: 100%;
  height: 100%;
}
.content-wrapper {
  width: 100%;
  height: calc(100% - 80px);
}
.btn-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 80px;
  padding-right: 20px;
}
.mr12 {
    margin-right: 12px;
}
</style>
