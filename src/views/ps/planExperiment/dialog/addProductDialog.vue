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
      <el-form-item label="叠片台">
        <el-select size="mini" v-model="dialogForm.spt"  label="叠片台：" placeholder="请选择">
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
      <el-form-item label="生产模式" prop="isMultipleType">
        <el-radio-group v-model="dialogForm.isMultipleType">
          <el-radio label="0">单台生产</el-radio>
          <el-radio label="1">多台生产</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addToNodeInfo(dialogForm)">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import flipTable from '@/api/plan/flipTable'
// import LaminationPlan from '@/api/plan/laminationPlan'
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
      isAdd:this.$constants.flag.n,
      isApproval:this.$constants.flag.n
    }
  },
  methods: {
    initData(rowData, isAdd, isApproval) {
      this.isApproval = isApproval
      this.rowData = rowData
      this.isAdd = isAdd
      flipTable.findAllFlipTable({tableCode: ''}).then(res => {
        this.dialogForm.laminationTables = res.data
      })
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
      if(!dialogFormData.planStartTime || !dialogFormData.planEndTime || !this.dialogForm.spt){
        this.$message.error("计划时间或叠片台为空，不允许提交");
        return
      }
      this.nodeInfo = []
      this.addInfo.planStartTime = moment(dialogFormData.planStartTime).format('YYYY-MM-DD HH:mm:ss'); // format end date as yyyy-mm-dd string
      this.addInfo.planEndTime = moment(dialogFormData.planEndTime).format('YYYY-MM-DD HH:mm:ss');
      // this.addInfo.planEndTime = dialogFormData.planEndTime;
      this.addInfo.isMultiple = parseInt(dialogFormData.isMultipleType);
      this.addInfo.pl15Id = this.rowData.pl15Id
      this.addInfo.pl14Id = this.rowData.pl14Id
      this.addInfo.nodeId = this.rowData.nodeId
      this.addInfo.nodeName = this.rowData.nodeName
      this.addInfo.productNo = this.rowData.productNo
      this.addInfo.id = this.rowData.id

      this.nodeInfo.push(this.addInfo);
      this.laminationTable = this.dialogForm.laminationTables.find(item => item.id === this.dialogForm.spt);
      if(this.isAdd === this.$constants.flag.y){
        LaminationPlan.addToPlan({nodeInfo:this.nodeInfo,laminationTable:this.laminationTable,isApproval:this.isApproval}).then(res=>{
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
        LaminationPlan.editPlan({nodeInfo:this.nodeInfo,laminationTable:this.laminationTable,isApproval:this.isApproval}).then(res=>{
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
