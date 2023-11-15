<template>
  <el-dialog v-dialogDrag  appendToBody :title="'查看'+this.params.productNo +'历史备注信息'" width="1000px" v-model="dialogVisible" modal>
    <el-table stripe  ref="tableDataRef" height="400" highlight-current-row border :data="dataList"
              style="font-size: 0.7rem">
      <el-table-column
        align="center"
        label="时间"
        property="createDt"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="备注描述"
        property="remarkDes"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="录入人"
        property="creatorName"
        width="180"
      >
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
      <el-button size="mini" @click="dialogVisible=false">关闭</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
export default {
  name: 'historyRemarkDialog',
  data(){
    return {
      dialogVisible: false,
      dataList: [],
      params: {},
    }
  },
  methods: {
    init(params){
      this.params = params;
      this.dialogVisible = true;
      this.getDataList();
    },
    getDataList(){
      planWeekHttp.findWorkRemarks({
        proPlanId: this.params.id
      }).then(response=>{
        this.dataList = response.data;
      })
    }
  }
}
</script>

<style scoped>

</style>
