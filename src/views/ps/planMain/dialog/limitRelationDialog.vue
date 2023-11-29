<template>
  <el-dialog draggable  appendToBody :title="this.selectedData.productNo+'限制工序前后关系'" v-model="dialogVisible" modal width="30%">
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="100px"
    >
      <div class="col-md-24">
        <el-form-item prop="status" label="是否限制" required>
          <xui-dict-select itemCode="flag01" v-model="model.status" style="width: 100%;"></xui-dict-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'

export default {
  name: 'limitRelationDialog',
  data() {
    return {
      dialogVisible: false,
      initModel: {
        status: '',
      },
      model: {},
      rules: {
        status: [{
          required: true, message: '不能为空'
        }]
      },
      selectedData: {},
    }
  },
  methods: {
    init(selectedData) {
      this.selectedData = selectedData;
      this.model = {
        ...this.initModel,
      }
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      })
    },

    handleSubmit() {
      if(this.$constants.isEmptyObj(this.selectedData)){
        return;
      }
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return
        }
        let params = {
          planId: this.selectedData.id,
          status: parseInt(this.model.status)
        }
        planWeekHttp.setLimitRelation(params).then(response => {
          if (response.err_code === this.$constants.statusCode.success) {
            this.$message.success('数据保存成功')
            this.$emit('refresh', {});
            this.dialogVisible = false
          } else {
            this.$message.error(response.err_msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
