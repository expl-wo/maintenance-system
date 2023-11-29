<template>
  <div class="app-container">
    <el-tabs :tab-position="tabPosition" class="hp content">
      <el-tab-pane label="点检记录" class="hp">
        <checkRecord :eqpId="data.number" :needShow="false" ></checkRecord>
      </el-tab-pane>
      <el-tab-pane label="保养记录" class="hp">
        <maintenanceRecord :eqpId="data.number" :needShow="false" ></maintenanceRecord>
      </el-tab-pane>
      <el-tab-pane label="鉴定记录" class="hp">
        <appraisalTask :eqpId="data.number" :needShow="false"></appraisalTask>
      </el-tab-pane>
      <el-tab-pane label="维修记录" class="hp">
        <repairRecord :eqpId="data.number" :needShow="false"></repairRecord>
      </el-tab-pane>
      <el-tab-pane label="检测计划" class="hp">
        <inspectionPlan :eqpId="data.number" :needShow="false"></inspectionPlan>
      </el-tab-pane>
      <el-tab-pane label="大修记录" class="hp">
        <overhaulExamine :eqpId="data.number" :needShow="false"></overhaulExamine>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import checkRecord from '@/views/em/emCheck/emCheck_002_Record'
  import maintenanceRecord from '@/views/em/emMaintenance/emMaintenance_003_record'
  import appraisalTask from '@/views/em/emIntegrityAppraisal/appraisalTask'
  import repairRecord from '@/views/em/emRepair/emRepair_002_record'
  import overhaulExamine from '@/views/em/emMaintenance/emMaintenance_005_overhaulExamine'
  import inspectionPlan from '@/views/em/InspectionPlan/inspectionPlan'
  export default{
    components:{checkRecord,maintenanceRecord,appraisalTask,repairRecord,overhaulExamine,inspectionPlan},
    data(){
      return{
        data: JSON.parse(this.$route.query.row),
        tabPosition: 'left'
      }
    },
    methods:{

    }
  }
</script>

<style scoped>
</style>
