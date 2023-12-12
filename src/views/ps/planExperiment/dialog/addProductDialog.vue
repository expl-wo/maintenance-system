<template>
  <el-dialog v-model="dialogVisible" :append-to-body="true">
    <el-form ref="dialogForm" :model="dialogForm" :rules="experimentFormRules" label-position="left" label-width="120px">
<!--      <el-form-item label="计划开工时间" prop="planStartTime">-->
<!--        <el-date-picker-->
<!--          v-model="dialogForm.planStartTime"-->
<!--          type="datetime"-->
<!--          placeholder="请选择计划开工时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item label="试验场所">
        <el-select  size="small" v-model="dialogForm.spt"  label="试验场所：" placeholder="请选择">
          <el-option
            v-for="item in dialogForm.laminationTables"
            :key="item.id"
            :label="item.trialShopName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="计划完工时间" prop="planEndTime">-->
<!--        <el-date-picker-->
<!--          v-model="dialogForm.planEndTime"-->
<!--          type="datetime"-->
<!--          placeholder="请选择计划完工时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item prop="dateValue" label="计划时间：" >
        <el-date-picker
          v-model="dialogForm.dateValue"
          type="datetimerange"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"

          style="width: 330px;"
          :clearable="false">
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
import experimentTable from '@/api/plan/experimentTable'
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
        dateValue: []
      },
      nodeInfo: [],
      rowData:{},
      addInfo:{},
      laminationTable:{},
      isAdd:this.$constants.flag01.n,
      isApproval:this.$constants.flag.n,
      planType: 'experiment',
      experimentFormRules: {
        planStartTime: [
          {required: true, validator: this.validateStartTime, trigger: 'blur'}
        ],
        planEndTime: [
          {required: true,validator: this.validateEndTime, trigger: 'blur' }
        ],
        dateValue: [{required: true,validator: this.validaterangeTime, trigger: 'blur' }]
      },
    }
  },
  methods: {
    initData(rowData, isAdd, isApproval) {
      this.isApproval = isApproval
      this.rowData = rowData
      this.isAdd = isAdd
      //获取试验场所
      experimentTable.findAllTrialShop({tableCode: ''}).then(res => {
        this.dialogForm.laminationTables = res.data
      })
      if (this.isAdd === this.$constants.flag.n) {
        this.dialogForm.dateValue[0] = rowData.planStartTime
        this.dialogForm.dateValue[1] = rowData.planEndTime
        this.dialogForm.planStartTime = rowData.planStartTime
        this.dialogForm.planEndTime = rowData.planEndTime
        this.dialogForm.spt = rowData.tableId
      } else {
        this.dialogForm.planStartTime = ''
        this.dialogForm.planEndTime = ''
        this.dialogForm.spt = ''
        this.dialogForm.dateValue[0] = ''
        this.dialogForm.dateValue[1] = ''
      }
      this.dialogVisible = true;
    },
    onSptChange() {
      this.laminationTable = this.dialogForm.laminationTables.find(item => item.id === this.dialogForm.spt);
      const endDate = moment(this.dialogForm.dateValue[0]).add(this.laminationTable.productionCycle-1, 'days'); // add 2 days to start date
      this.dialogForm.dateValue[1] = moment(endDate).format('YYYY-MM-DD'); // format end date as yyyy-mm-dd string
    },
    addToNodeInfo(dialogFormData) {
      debugger
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.nodeInfo = []
          this.addInfo.planStartTime = moment(this.dialogForm.dateValue[0]).format('YYYY-MM-DD HH:mm:ss'); // format end date as yyyy-mm-dd string
          this.addInfo.planEndTime = moment(this.dialogForm.dateValue[1]).format('YYYY-MM-DD HH:mm:ss');
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
            planWeekHttp.addToExperimentPlan({planType:this.planType,nodeInfo:this.nodeInfo,workSpaceTable:this.laminationTable,isApproval:this.isApproval}).then(res=>{
              if(res.err_code===10000){
                this.dialogVisible = false;
                this.$message.success("加入成功！");
                this.$emit('refresh', {})
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
    },
    validaterangeTime: function (rule, value, callback) {
      if (this.dialogForm.dateValue[0] <= new Date().getTime()) {
        callback(new Error('开始时间不能小于当前时间'))
      } else {
          callback()
        }
      }
    }
}
</script>

<style scoped>

</style>
