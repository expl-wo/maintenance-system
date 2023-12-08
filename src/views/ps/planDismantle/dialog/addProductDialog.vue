<template>
  <el-dialog v-model="dialogVisible" :append-to-body="true">
    <el-form ref="dialogForm" :rules="dismantleFormRules" :model="dialogForm" label-position="left" label-width="120px">
      <el-form-item label="计划开工时间" prop="planStartTime">
        <el-date-picker
          v-model="dialogForm.planStartTime"
          type="datetime"
          placeholder="请选择计划开工时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划完工时间" prop="planEndTime">
        <el-date-picker
          v-model="dialogForm.planEndTime"
          type="datetime"
          placeholder="请选择计划完工时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
    <div class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addToNodeInfo(dialogForm)">确定</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
import moment from 'moment'

export default {
  name: 'addDismantlProductDialog',
  data(){
    return {
      dialogVisible: false,
      dialogForm: {
        planStartTime: '',
        planEndTime: '',
        spt: '',
        isMultipleType: '0',
        laminationTables:[],
      },
      nodeInfo: [],
      rowData:{},
      addInfo:{},
      laminationTable:{},
      isAdd:this.$constants.flag01.n,
      isApproval:this.$constants.flag.n,
      planType: 'dismantle',
      dismantleFormRules: {
        planStartTime: [
          {required: true, validator: this.validateStartTime, trigger: 'blur'}
        ],
        planEndTime: [
          {required: true,validator: this.validateEndTime, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    initData(rowData, isAdd, isApproval) {
      this.isApproval = isApproval
      this.rowData = rowData
      this.isAdd = isAdd
      if (this.isAdd === this.$constants.flag.n) {
        this.dialogForm.planStartTime = rowData.planStartTime
        this.dialogForm.planEndTime = rowData.planEndTime
        this.dialogForm.spt = rowData.tableId
      } else {
        this.dialogForm.planStartTime = ''
        this.dialogForm.planEndTime = ''
        this.dialogForm.spt = ''
      }
      this.dialogVisible = true;
    },
    onSptChange() {
      this.laminationTable = this.dialogForm.laminationTables.find(item => item.id === this.dialogForm.spt);
      const endDate = moment(this.dialogForm.planStartTime).add(this.laminationTable.productionCycle-1, 'days'); // add 2 days to start date
      this.dialogForm.planEndTime = moment(endDate).format('YYYY-MM-DD'); // format end date as yyyy-mm-dd string
    },
    addToNodeInfo(dialogFormData) {
      debugger
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.nodeInfo = []
          this.addInfo.planStartTime = moment(dialogFormData.planStartTime).format('YYYY-MM-DD HH:mm:ss'); // format end date as yyyy-mm-dd string
          this.addInfo.planEndTime = moment(dialogFormData.planEndTime).format('YYYY-MM-DD HH:mm:ss');
          // this.addInfo.planEndTime = dialogFormData.planEndTime;
          this.addInfo.isMultiple = parseInt(dialogFormData.isMultipleType);
          this.addInfo.productNodeId = this.rowData.pl15Id
          this.addInfo.productPlanId = this.rowData.pl14Id
          this.addInfo.nodeId = this.rowData.nodeId
          this.addInfo.productNodeName = this.rowData.nodeName
          this.addInfo.productNo = this.rowData.productNo
          this.addInfo.id = this.rowData.id

          this.nodeInfo.push(this.addInfo);
          this.laminationTable = this.dialogForm.laminationTables.find(item => item.id === this.dialogForm.spt);
          if(this.isAdd === this.$constants.flag01.y){
            planWeekHttp.addToExperimentPlan({planType:this.planType,nodeInfo:this.nodeInfo,workSpaceTable:this.laminationTable,isApproval:this.isApproval}).then(res=>{
              if(res.err_code===10000){
                this.dialogVisible = false;
                this.$message.success("加入成功！");
                this.$emit('refresh', {})
                this.$emit('queryRightData',null)
              } else {
                this.$message.error("操作失败："+res.err_msg);
              }
            })
          }else {
            planWeekHttp.editExperimentPlan({planType:this.planType,nodeInfo:this.nodeInfo,workSpaceTable:this.laminationTable,isApproval:this.isApproval}).then(res=>{
              if(res.err_code===10000){
                this.dialogVisible = false;
                this.$message.success("修改成功！");
                this.$emit('refresh', {})
                this.$emit('queryRightData',null)
              } else {
                this.$message.error("操作失败："+res.err_msg);
              }
            })
          }
        }
      })
    },
    // 时间的校验
    validateStartTime: function (rule, value, callback) {
      if (value === undefined) {
        callback(new Error('开始时间不能为空'))
      } else {
        if (this.dialogForm.planStartTime <= new Date().getTime()) {
          callback(new Error('开始时间不能小于当前时间'))
        } else {
          callback()
        }
      }
    },
    validateEndTime: function (rule, value, callback) {
      if (value === undefined) {
        callback(new Error('结束时间不能为空'))
      } else {
        if (
          this.dialogForm.planStartTime >=
          this.dialogForm.planEndTime
        ) {
          callback(new Error('截止时间必须大于开始时间！'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
