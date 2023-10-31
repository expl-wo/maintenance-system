<template>
  <el-dialog v-dialogDrag  appendToBody title="报工信息" width="1000" v-model="dialogVisible" modal>
    <el-table stripe  ref="tableDataRef" height="400" highlight-current-row border :data="dataList"
              style="font-size: 0.7rem">
      <el-table-column
        header-align="center"
        align="center"
        label="报工时间"
        property="reportTime"
        width="150"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="报工人"
        property="reportName"
        width="100"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="工序"
        property="opName"
        width="120"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="报工进度"
        property="reportProcess"
      >
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button size="mini" @click="dialogVisible=false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
export default {
  name: 'opStatusDialog',
  data(){
    return {
      dialogVisible: false,
      dataList: [],
      params: {},
      nodeIdProperty: ''
    }
  },
  methods: {
    init(params, column){
      let property = column.property;
      this.nodeIdProperty = property.replace('_status', '_nodeId');
      this.params = params;
      this.column = column;
      this.dialogVisible = true;
      this.getDataList();
    },
    getDataList(){
      planWeekHttp.searchByPlan({
        planNodeId: this.params[this.nodeIdProperty]
      }).then(response=>{
        this.dataList = response.data;
      })
    },
    initFromFlowChart(params){
      this.dialogVisible = true;
      this.getDataListFromFlowChart(params.planNodeId);
    },
    initFromFlowChartLung(opList){
      this.dialogVisible = true;
      this.dataList = opList;
    },
    getDataListFromFlowChart(planNodeId){
      planWeekHttp.searchByPlan({
        planNodeId
      }).then(response=>{
        this.dataList = response.data;
      })
    },
  }
}
</script>

<style scoped>

</style>
