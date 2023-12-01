<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="标准工序名称" >
          <el-input v-model="listQuery.gxName" placeholder="输入标准工序名称" style="width: 180px;" class="filter-item"
                    clearable />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="search" @click="handleSearch">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <div class="otherCon wp xui-table__highlight">
        <el-table  ref="tableRef" :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700" @row-click="handleClick">
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
import {queryProduces} from '@/api/plan'
import Pagination from "@/components/Pagination/index";
import ps30ChildRuleItem from "@/views/ps/baseData/ps30ChildProcessTemplateHead/ps30ChildRuleItem";

export default {
  components: {Pagination,ps30ChildRuleItem},
  name: 'ps30ChildRule',


  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: { // 查询条件
        id:'',
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
      queryProduces(this.listQuery).then(response => {
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

  }
}
</script>

<style scoped>
</style>
