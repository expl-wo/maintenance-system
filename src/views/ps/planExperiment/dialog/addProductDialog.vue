<template>
  <el-dialog v-model="dialogVisible" :append-to-body="true">
    <el-form ref="dialogForm" :model="dialogForm" label-position="left" label-width="120px">
      <el-form-item label="计划开工时间" prop="planStartTime">
        <el-date-picker
          v-model="dialogForm.planStartTime"
          type="datetime"
          placeholder="请选择计划开工时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="试验场所">
        <el-select size="mini" v-model="dialogForm.spt"  label="试验场所：" placeholder="请选择">
          <el-option
            v-for="item in dialogForm.laminationTables"
            :key="item.id"
            :label="item.tableName"
            :value="item.id">
          </el-option>
        </el-select>
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
// import flipTable from '@/api/plan/flipTable'
import planWeekHttp from '@/api/plan/planWeek'
import moment from 'moment'

export default {
  name: 'addProductDialog',
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
      isApproval:this.$constants.flag.n
    }
  },
  methods: {
    initData(rowData, isAdd, isApproval) {
      debugger
      this.isApproval = isApproval
      this.rowData = rowData
      this.isAdd = isAdd
      //获取试验场所
      // flipTable.findAllFlipTable({tableCode: ''}).then(res => {
      //   this.dialogForm.laminationTables = res.data
      // })
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
      // if(!dialogFormData.planStartTime || !dialogFormData.planEndTime || !this.dialogForm.spt){
      //   this.$message.error("计划时间或叠片台为空，不允许提交");
      //   return
      // }
      this.nodeInfo = []
      this.addInfo.planStartTime = moment(dialogFormData.planStartTime).format('YYYY-MM-DD HH:mm:ss'); // format end date as yyyy-mm-dd string
      this.addInfo.planEndTime = moment(dialogFormData.planEndTime).format('YYYY-MM-DD HH:mm:ss');
      // this.addInfo.planEndTime = dialogFormData.planEndTime;
      this.addInfo.isMultiple = parseInt(dialogFormData.isMultipleType);
      this.addInfo.productNodeId = this.rowData.productNodeId
      this.addInfo.productPlanId = this.rowData.productPlanId
      this.addInfo.nodeId = this.rowData.nodeId
      this.addInfo.productNodeName = this.rowData.productNodeName
      this.addInfo.productNo = this.rowData.productNo
      this.addInfo.id = this.rowData.id

      this.nodeInfo.push(this.addInfo);
      this.laminationTable = this.dialogForm.laminationTables.find(item => item.id === this.dialogForm.spt);
      if(this.isAdd === this.$constants.flag01.y){
        planWeekHttp.addToExperimentPlan({nodeInfo:this.nodeInfo,workSpaceTable:this.laminationTable,isApproval:this.isApproval}).then(res=>{
          if(res.err_code===10000){
            this.dialogVisible = false;
            this.$message.success("修改成功！");
            this.$emit('refresh', {})
            this.$emit('queryRightData',null)
          } else {
            this.$message.error("操作失败："+res.err_msg);
          }
        })
      }else {
        planWeekHttp.editExperimentPlan({nodeInfo:this.nodeInfo,workSpaceTable:this.laminationTable,isApproval:this.isApproval}).then(res=>{
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

    },
  }
}
</script>

<style scoped>

</style>
