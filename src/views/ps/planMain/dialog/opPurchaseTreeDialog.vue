<template>
  <el-dialog v-dialogDrag  append-to-body title="采购齐套信息" v-model="dialogVisible" modal>
    <div class="otherCon wp" style="height: calc(100vh - 400px); overflow: auto;">
      <el-table stripe
        ref="tableDataRef"
        height="400"
        highlight-current-row
        border
        :data="dataList"
        style="font-size: 0.7rem; width: 100%"
        row-key="id"
        :default-expand-all="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          property="name"
          label="名称"
          min-width="130%"
        />
        <el-table-column
          property="code"
          label="编码"
          min-width="70%"
        />
        <el-table-column
          property="requireQuantity"
          label="需求数量"
          min-width="70%"
        />
        <el-table-column
          property="stockQuantity"
          label="库存数量"
          min-width="70%"
        />
        <el-table-column
          property="isMatch"
          label="是否齐套"
          min-width="40%">
          <template slot-scope="scope">
            <span v-if="scope.row.isMatch === '0'">不齐套</span>
            <span v-if="scope.row.isMatch === '1'">齐套</span>
          </template>
        </el-table-column>
      </el-table></div>
    <div slot="footer">
      <el-button size="mini" @click="dialogVisible=false">关闭</el-button>
    </div></el-dialog>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
export default {
  name: 'OpPurchaseTreeDialog',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dataList: [],
      params: {
        planId: '',
        planNodeId: ''
      },
      nodeIdProperty: '',
      cellStyle: {
        width: '200px'
      }

    }
  },
  methods: {
    init(row, column) {
      const property = column.property
      this.nodeIdProperty = property.replace('_status', '_nodeId')
      this.params.planNodeId = row[this.nodeIdProperty]
      this.params.planId = row.id
      this.column = column
      this.dialogVisible = true
      this.getDataList()
    },
    getDataList() {
      this.dataList = []
      planWeekHttp.findMaterialMatch(this.params).then(response => {
        if (response.err_code === this.$constants.status.success) {
          const res = response.data
          res._showChildren = true
          this.dataList = res
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
