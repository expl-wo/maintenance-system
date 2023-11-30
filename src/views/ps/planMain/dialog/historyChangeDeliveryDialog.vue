<template>
  <el-dialog draggable  appendToBody :title="this.params.productNo+'厂内完工时间申请记录'" width="1000px" v-model="dialogVisible" modal>
    <el-table stripe  ref="tableDataRef" height="400" highlight-current-row border :data="dataList"
              style="font-size: 0.7rem"
    >
      <el-table-column
        header-align="center"
        align="center"
        label="序号"
        width="50"
      >
        <template #default="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="原计划完工时间"
        property="oldDeliveryDate"
        width="140"
      >
        <template #default="scope">
          <span>{{ scope.row.oldDeliveryDate | formatTimeToYmd }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="申请完工时间"
        property="newDeliveryDate"
        width="140"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="时间差(天)"
        property="diffDays"
        width="110"
      >
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        label="审批状态"
        property="status"
      >
        <template #default="scope">
          <xui-dictionary itemCode="finishTimeApprovalStatus" :code="scope.row.status"></xui-dictionary>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="申请人"
        property="udpName"
        width="100"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="时间差(天)"
        property="diffDays"
        width="100"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="修改原因"
        property="changeReason"
      >
      </el-table-column>
    </el-table>
    <xui-pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination"
                    class="searchCon wp"/>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">关闭</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
import XuiDictionary from '@/components/xui/dictionary/dictionary'

export default {
  name: 'historyFronzenDialog',
  components: { XuiDictionary },
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
      planWeekHttp.findDeliveryUpdRecord({
        productNo: this.params.productNo,
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
