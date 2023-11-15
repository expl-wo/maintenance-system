<template>
  <el-dialog v-dialogDrag  appendToBody :title="'查看'+this.params.productNo +'历史冻结原因'" width="1000px" v-model="dialogVisible" modal>
    <el-table stripe  ref="tableDataRef" height="400" highlight-current-row border :data="dataList"
              style="font-size: 0.7rem"
    >
      <el-table-column
        align="center"
        label="冻结原因"
        property="reasonName"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="冻结时间"
        property="freezeDate"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="解冻时间"
        property="unFreezeDate"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="备注"
        property="freezeReason"
      >
      </el-table-column>
    </el-table>
    <xui-pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination"
                    class="searchCon wp"
    />
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
  name: 'historyFronzenDialog',
  data() {
    return {
      dialogVisible: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dataList: [],
      params: {}
    }
  },
  methods: {
    init(params) {
      console.log(params)
      this.resetData()
      this.params = params
      this.dialogVisible = true
      this.getDataList()
    },
    resetData() {
      this.dataList = []
      this.pageNum = 1
      this.pageSize = 10
      this.total = 0
    },
    getDataList() {
      planWeekHttp.findFreezeByPlan({
        planId: this.params.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(response => {
        this.dataList = response.data;
        this.total = response.total_count;
      })
    },
    handlePagination({ page, limit }) {
      this.pageNum = page
      this.pageSize = limit
      this.getDataList()
    }
  }
}
</script>

<style scoped>

</style>
