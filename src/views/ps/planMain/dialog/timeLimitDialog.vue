<template>
  <el-dialog v-dialogDrag  appendToBody title="产品期量修改" v-model="dialogVisible" modal @close="handleClose">
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="100px"
    >
      <div class="col-md-12">
        <el-form-item prop="timeLimitId" label="产品期量" required size="mini">
          <el-select v-model="model.timeLimitId" style="width: 100%;">
            <el-option
              v-for="item in timeLimitList"
              :key="item.k"
              :label="item.v"
              :value="item.k"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button size="mini" @click="dialogVisible=false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit">提交</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
export default {
  name: 'timeLimitDialog',
  data(){
    return {
      dialogVisible: false,
      model: {
        timeLimitId: ''
      },
      rules: {
        timeLimitId: [{
          required: true, message: '产品期量不能为空'
        }]
      },
      timeLimitList: [],
      selectedData: null
    }
  },
  methods: {
    init(selectedData){
      this.selectedData = selectedData;
      this.model = {
        timeLimitId: this.selectedData.timeLimitId
      }
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      })
      if(this.timeLimitList.length === 0){
        this.getTimeLimitList();
      }
    },
    getTimeLimitList(){
      planWeekHttp.queryMainList({
        pageNum: 1,
        pageSize: this.$constants.pageEntryCount
      }).then(response=>{
        this.timeLimitList = response.data.map(item=>{
          return {
            k: item.id,
            v: item.name
          }
        })
      })
    },
    handleSubmit(){
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return
        }
        planWeekHttp.updateLimitForPlan({
          id: this.selectedData.id,
          timeLimitId: this.model.timeLimitId
        }).then(response=>{
          if(response.err_code === this.$constants.statusCode.success){
            this.$message.success('产品期量成功');
            this.$emit('refresh', {});
            this.dialogVisible = false;
          }else{
            this.$message.error(response.err_msg);
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
