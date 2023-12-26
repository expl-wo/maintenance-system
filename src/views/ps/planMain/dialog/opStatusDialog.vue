<template>
  <el-dialog draggable  appendToBody title="报工信息" width="1000" v-model="dialogVisible" modal>
    <el-row :gutter="12" class="hp">
      <el-col :span="9" class="hp p-lf">中工序进度
        <el-card shadow="hover" class="hp">
          <el-table ref="processTableRef" :data="processTableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700"  @row-click="handleClick">
            <el-table-column prop="procedureName" align="center" label="中工序名称"/>
            <el-table-column prop="workProgress" align="center" label="中工序进度" width="100">
              <template #default="scope">
                <el-progress percentage={{ scope.row.workProgress }} />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="15" class="hp p-lf">工步进度
        <el-card shadow="hover" class="hp">
          <el-table ref="craftsTableRef" :data="craftsTableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700"  @row-click="handleClick">
            <el-table-column prop="procedureName" align="center" label="工步名称"/>
            <el-table-column prop="workProgress" align="center" label="工步进度" width="100"/>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible=false">关闭</el-button>
      </div>
    </template>
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
      processTableData: [],
      craftsTableData: [],
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
        if(response.err_code===10000){
          this.processTableData = response.data;
          if(this.processTableData && this.processTableData.length > 0){
            this.$refs.processTableRef.setCurrentRow(this.processTableData[0]);
            this.handleClick(this.processTableData[0])
          }
        } else {
          this.$message.error("操作失败："+response.err_msg);
        }
      })
    },
    initFromFlowChart(params){
      this.dialogVisible = true;
      this.getDataListFromFlowChart(params.planNodeId);
    },
    getDataListFromFlowChart(planNodeId){
      planWeekHttp.searchByPlan({
        planNodeId
      }).then(response=>{
        if(response.err_code===10000){
          this.processTableData = response.data;
          if(this.processTableData && this.processTableData.length > 0){
            this.$refs.processTableRef.setCurrentRow(this.processTableData[0]);
            this.handleClick(this.processTableData[0])
          }
        } else {
          this.$message.error("操作失败："+response.err_msg);
        }
      })
    },
    handleClick(item){
      let workProcedureInfoId = item.workProcedureInfoId
      planWeekHttp.searchCraftsByProcess({
        workProcedureInfoId
      }).then(response=>{
        if(response.err_code===10000){
          this.craftsTableData = response.data;
        } else {
          this.$message.error("操作失败："+response.err_msg);
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
