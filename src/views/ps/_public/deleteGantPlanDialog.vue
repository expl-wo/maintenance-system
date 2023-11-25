<template>
  <el-dialog draggable  appendToBody title="选择要删除的生产号" width="800px" v-model="dialogVisible" modal>
    <div class="filter-container searchCon">

    </div>
    <div class="otherCon wp">
      <el-table stripe  ref="tableRef" height="500px" highlight-current-row border :data="dataList"
                style="font-size: 0.7rem"
      >
        <el-table-column
          align="center"
          type="selection"
          fixed
          property="selection"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="生产号"
          property="productNo"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="计划开始"
          property="startDate"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="计划结束"
          property="nodeDate"
        >
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button @click="handleDelete" icon="el-icon-delete" type="danger">删除</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
export default {
  name: 'deleteGantPlanDialog',
  data() {
    return {
      dialogVisible: false,
      menuDesc: '',
      nodeId: '',
      dataList: [],
    }
  },
  methods: {
    init(dataList, menuDesc, nodeId) {
      this.dialogVisible = true;
      this.menuDesc = menuDesc;
      this.nodeId = nodeId;
      this.dataList = dataList;
    },
    handleDelete(){
      let selection = this.$refs.tableRef.selection;
      if(selection.length === 0){
        this.$message.error('请选中需要删除的生产计划');
        return;
      }
      let productIds = [], productNos = [];
      selection.forEach(item=>{
        productIds.push(item.pl14Id);
        productNos.push(item.productNo);
      })
      this.$confirm(`请是否确定删除生产号为${productNos.join(',')}的${this.menuDesc}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        planWeekHttp.delWeekPlan({
          pl14Id: productIds,
          nodeId: this.nodeId
        }).then(response=>{
          if(response.err_code === this.$constants.status.success){
            this.$message.success('删除成功');
            this.$emit('refresh', {});
            this.dialogVisible = false;
          }else{
            this.$message.error(response.err_msg);
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.filter-container{
  margin-bottom: 6px;
}

</style>
