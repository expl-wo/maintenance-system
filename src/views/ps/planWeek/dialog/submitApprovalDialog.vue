<template>
  <el-dialog draggable  appendToBody title="预排审批" width="600px" v-model="dialogVisible" modal>
    <div class="otherCon wp">
      <el-table stripe  ref="tableRef" height="500px" highlight-current-row border :data="dataList"
                style="font-size: 0.7rem"
      >
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="100"
        >
          <template v-slot="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="生产号"
          property="productNo"
        >
        </el-table-column>
        <el-table-column label="完成至工序" align="center" v-if="!notNeedGx">
          <template v-slot="scope">
            <el-button type="primary"
                       @click="handleChooseOp(scope.row)">选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
    </template>
    <plan-finish-op-dialog ref="planFinishOpDialogRef"></plan-finish-op-dialog>
  </el-dialog>
</template>

<script>
import planFinishOpDialog from './planFinishOpDialog'
import planWeek from '@/api/plan/planWeek'
export default {
  name: 'submitApprovalDialog',
  components: {
    planFinishOpDialog
  },
  data(){
    return {
      dialogVisible: false,
      dataList: [],
      params: {},
      notNeedGx: false
    }
  },
  methods: {
    initData(dataList, params){
      this.dataList = dataList;
      this.params = params;
      this.dialogVisible = true;
    },
    initDataNoNeedGx(dataList, params){
      this.initData(dataList, params);
      this.notNeedGx = true;
    },
    handleChooseOp(rowData){
      this.$refs.planFinishOpDialogRef.initData(rowData, this.params);
    },
    handleSubmit(){
      let commitData = {
        nodeId: this.params.nodeId,
        condition: [],
        planId: []
      }
      this.dataList.forEach(item=>{
        commitData.planId.push(item.pl14Id);
        // commitData.condition.push({
        //   k: this.notNeedGx ? item.pl14Id : item.productPlanId,
        //   v: this.formatData(item._condition)
        // })
      })
      planWeek.applyWeekPlan(commitData).then(response=>{
        if(response.err_code === this.$constants.status.success){
          this.$message.success('数据保存成功');
          this.$emit('refresh', {})
          this.dialogVisible = false;
        }else{
          this.$message.error(response.err_msg);
        }
      })
    },
    formatData(condition){
      if(this.notNeedGx){
        return '';
      }
      if(condition === undefined || condition === '' || condition === null){
        return '{}'
      }else{
        return condition;
      }
    }
  }
}
</script>

<style scoped>

</style>
