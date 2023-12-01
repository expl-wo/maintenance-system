<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="标准工序名称" >
          <el-input v-model="listQuery.gxName" placeholder="输入标准工序名称" style="width: 180px;" class="filter-item"
                    clearable />
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" icon="search" @click="handleSearch">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <div class="otherCon wp xui-table__highlight">
        <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
          <el-table-column header-align="center" align="center" label="序号" width="50">
            <template v-slot="scope"><span>{{ scope.$index + 1 }}</span></template></el-table-column>
          <el-table-column prop="gxUid" label="标准工序编码" align="center" min-width="250"/>
          <el-table-column prop="gxName" label="标准工序名称" align="center" min-width="250"/>
        </el-table>
      </div>
      <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" @pagination="handlePagination"
                      class="searchCon wp"
      />
    </div>
  </div>
</template>

<script>
import {PlmProcessNode} from '@/api/plan'
import Pagination from "@/components/Pagination/index";

export default {
  components: {Pagination},
  name: 'ps30ChildRule',


  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '', //节点基础数据名称
        workshopId: '', //车间ID
        workshopName: '', //车间名称
        type: null, //节点类型
        gxUid: '', //标准工序识别号
        gxName: '', //工序名称
        standardtime: '', //标准工时
        erpGxId: '', //对应的ERP工序id
        erpGxName: '', //对应的ERP工序名称
        node_id: '' //对应的HB-MES生产关键工序节点基础数据ID
      },
      tableData: [],
      selectRow:[]
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {

    getDataList() {
        this.tableData = []
        PlmProcessNode(this.listQuery).then(response => {
          this.tableData = response.data
          this.total = response.total_count
        })
    },
    handleClick(item) {
      this.$emit('updateChild', item)
    },

    handleSearch() {
      this.listQuery.pg_pagenum = 1
      this.getDataList()
    },
    handlePagination({ page, limit }) {
      this.listQuery.pg_pagenum = page
      this.pg_pagesize = limit
      this.getDataList()
    },

    checkboxChange(event, item) {
      if (event) {
        // const checked = { id: item.id, productionCode: item.productNo }
        this.selectedRows.push(item)
      } else if (item) {
        const items = this.selectedRows
        if (items && items.length > 0) {
          this.selectedRows = []
          items.forEach(oldi => {
            if (item.id !== oldi.id) {
              // const checked = { id: oldi.id, productionCode: oldi.productionCode }
              this.selectedRows.push(oldi)
            }
          })
        }
      }
      console.log(this.selectedRows)
    },
  }
}
</script>

<style scoped>
</style>
