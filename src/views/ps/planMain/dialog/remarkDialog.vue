<template>
  <el-dialog draggable  appendToBody title="添加备注" v-model="dialogVisible" modal @close="handleClose">
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="100px"
    >
      <div class="col-md-12">
        <el-form-item prop="remarkDes" label="备注描述" required>
          <el-input v-model="model.remarkDes" type="textarea" :rows="5" maxlength="256"></el-input>
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
  name: 'remarkDialog',
  data() {
    return {
      dialogVisible: false,
      model: {
        remarkDes: ''
      },
      rules: {
        remarkDes: [{
          required: true, message: '备注描述不能为空', trigger: 'blur'
        }]
      },
      selectedData: []
    }
  },
  methods: {
    init(selectedData) {
      this.selectedData = selectedData
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return
        }
        let ids = [];
        this.selectedData.forEach(item=>{
          ids.push(item.id)
        })
        planWeekHttp.addWorkRemark({
          proPlanIds: ids,
          remarkDes: this.model.remarkDes
        }).then(response=>{
          if(response.err_code === this.$constants.statusCode.success){
            this.$message.success('保存成功');
            this.dialogVisible = false;
          }else{
            this.$message.warning(response.err_msg);
          }
        })
      })
    },
    handleClose(){
      this.$refs.formRef && this.$refs.formRef.clearValidate();
    }
  }
}
</script>

<style scoped>

</style>
