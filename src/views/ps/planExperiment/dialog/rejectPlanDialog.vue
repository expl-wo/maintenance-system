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
    <div slot="footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import LaminationPlan from '@/api/plan/laminationPlan'

export default {
  name: 'rejectPlanDialog',
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
    initData(selectedData){
      this.model.rejectReason = '';
      this.$refs.form && this.$refs.form.clearValidate();
      this.selectedData = selectedData;
      this.dialogVisible = true;
    },
    handleSubmit(){
      this.$refs.form.validate(valid=>{
        if(!valid){
          return;
        }
        let nodeId = '4'
        let rejectInfo = []
        this.selectedData.forEach(item=>{
          nodeId = item.nodeId
          let rejectPlan = {}
          rejectPlan.pl14Id = item.pl14Id
          rejectPlan.isPass = this.$constants.isPass.no
          rejectPlan.rejectReason = this.model.rejectReason
          rejectInfo.push(rejectPlan)
        })
        LaminationPlan.approvalPlan({nodeId:nodeId,condition:rejectInfo,approveStatus:this.$constants.isPass.no}).then(response=>{
          if(response.err_code ===this.$constants.status.success){
            this.$message.success('数据审批完成');
            this.dialogVisible = false;
            this.$emit('refresh', {})
            this.$emit('queryRightData',null)
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
