<template>
  <el-dialog v-dialogDrag  :close-on-click-modal="false" :title="this.updateForm.productNo+'计划时间修改'" v-model="dialogVisible" class="roleDialog720">
    <el-form label-position="right" label-width="160px" :model="updateForm" :rules="rules" ref="updateRuleForm">
      <el-form-item label="生产号:" size="mini">
        <el-input v-model="updateForm.productNo" placeholder="生产号" style="width: 240px;" class="filter-item" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="期量周期:" size="mini">
        <el-input v-model="updateForm.duration" placeholder="期量周期" style="width: 240px;" class="filter-item" size="mini" disabled>
          <template v-slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="计划时间:" size="mini" prop="daterange" required>
        <el-date-picker
          v-model="updateForm.daterange"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          size="mini"
          style="width: 330px;"
          :clearable="false">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="mini" @click="submitForm('updateRuleForm')">
        保存
      </el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
import moment from "moment";
export default {
  name: 'planDateChange',
  data() {
    var validDate = (rule,value,callback) => {
        if(!value || !value[0] || !value[1]){
            callback(new Error("请选择时间区间"))
        }else{
            callback()
        }
    }
    return {
      dialogVisible: false,
      updateForm: {
        productNo: null,
        nodeId: null,
        pl14Id: null,
        duration: 0,
        startDate: null,
        finishDate: null,
        daterange: null,
        weekId:null
      },
      isWeekPlan: false,
      rules:{
        daterange: [{ validator: validDate , trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  methods: {
    initData(data,isWeekPlan=false) {
      this.updateForm.daterange = [];
      this.updateForm.productNo = data.productNo;
      this.updateForm.nodeId = data.nodeId;
      this.updateForm.pl14Id = data.pl14Id;
      this.updateForm.duration = data.duration;
      this.updateForm.weekId = data.weekId;
      if(data.startDate && data.nodeDate){
        this.updateForm.daterange[0] = data.startDate;
        this.updateForm.daterange[1] = data.nodeDate;
      }
      this.dialogVisible = true;
      if(isWeekPlan) this.isWeekPlan = true;
      else this.isWeekPlan = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updatePlanDate();
        } else {
          return false;
        }
      });
    },
    updatePlanDate(){
      this.updateForm.startDate = moment(this.updateForm.daterange[0]).format('YYYY-MM-DD HH:mm:ss');
      this.updateForm.finishDate = moment(this.updateForm.daterange[1]).format('YYYY-MM-DD HH:mm:ss');
      planWeekHttp.updatePlanDate(this.updateForm).then(res=>{
        if(res.err_code===10000) {
          this.$message.success("修改成功");
          this.dialogVisible = false;
          this.$emit('refresh', {})
        } else this.$message.error("修改失败"+res.err_msg);
      })
    }
  }
}
</script>

<style scoped lang="scss">
  >>>.el-form-item{
    margin-bottom: 16px;
  }
</style>
