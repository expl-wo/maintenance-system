<template>
  <el-dialog draggable  appendToBody title="驳回原因" width="600px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="rejectReason" label="驳回原因：" required>
            <el-input type="textarea" v-model="model.rejectReason" :rows="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'

export default {
  name: 'rejectDialog',
  data(){
    return {
      dialogVisible: false,
      selectedData: [],
      searchParams: {},
      model: {
        rejectReason: ''
      },
      rules: {
        rejectReason: [{
          required: true,message: '驳回原因不能为空', trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    initData(selectedData, searchParams){
      this.model.rejectReason = '';
      this.$refs.form && this.$refs.form.clearValidate();
      this.searchParams = searchParams;
      this.selectedData = selectedData;
      this.dialogVisible = true;
    },
    handleSubmit(){
      this.$refs.form.validate(valid=>{
        if(!valid){
          return;
        }
        let submitData = {
          nodeId: this.searchParams.nodeId,
          planId: [],
          approvalStatus: this.$constants.confirmStatus.reject,
          rejectReason: this.model.rejectReason
        };
        this.selectedData.forEach(item=>{
          submitData.planId.push(item.pl14Id)
        })
        planWeekHttp.approvalPlanZ(submitData).then(response=>{
          if(response.err_code ===this.$constants.statusCode.success){
            this.$message.success('数据审批完成');
            this.dialogVisible = false;
            this.$emit('refresh', {})
          }else{
            this.$message.error(response.err_msg);
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
