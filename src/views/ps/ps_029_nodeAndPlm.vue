<template>
  <div class="app-container app-containerC">


    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="节点名称" >
          <el-input v-model="listQuery.name" placeholder="输入节点名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="车间名称" >
          <el-input v-model="listQuery.workshopName" placeholder="输入车间名称" style="width: 180px;" class="filter-item"
                    clearable />
        </el-form-item>
        <el-form-item label="PLM工序名称" >
          <el-input v-model="listQuery.gxName" placeholder="输入工序名称" style="width: 180px;" class="filter-item"
                    clearable />
        </el-form-item>

        <el-form-item >
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
      <el-table-column prop="index" label="序号" align="center" min-width="5%">
        <template v-slot:default="scope"><span>{{ (scope.$index + 1) }} </span></template>
      </el-table-column>
      <el-table-column prop="gxName" label="PLM工序名称" align="center" min-width="15%"/>
      <el-table-column prop="erpGxName" label="ERP工序名称" align="center" min-width="15%"/>
      <el-table-column prop="standardTime" label="标准工时" align="center" min-width="15%"/>
      <el-table-column prop="name" label="节点名称" align="center" min-width="15%"/>
      <el-table-column prop="workshopName" label="车间名称" align="center" min-width="15%"/>
      <el-table-column prop="type" align="center" label="节点类型" min-width="15%">
        <template v-slot:default="scope">
          <el-tag v-if="scope.row.type ==0 ">设计</el-tag>
          <el-tag v-else-if="scope.row.type ==1 ">采购</el-tag>
          <el-tag v-else-if="scope.row.type ==2 ">生产</el-tag>
          <el-tag v-else-if="scope.row.type ==3 ">BOM</el-tag>
          <el-tag v-else-if="scope.row.type ==null "></el-tag>
        </template>
      </el-table-column>
    </el-table>

    <table-simple class="otherCon wp" :data="tableData"  :total="total"   layout="total, sizes, prev, pager, next, jumper"
                  :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize"  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />

  </div>
</template>

<script>
import TableSimple from '@/components/Table/index'
import { PlmProcessNode} from '@/api/plan'
export default {
  name: 'Table',
  components: { TableSimple },
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '', //节点基础数据名称
        workshopId: '', //车间ID
        workshopName: '', //车间名称
        type: '', //节点类型
        gxUid: '', //标准工序识别号
        gxName: '', //工序名称
        standardTime: '', //标准工时
        erpGxId: '', //对应的ERP工序id
        erpGxName: '', //对应的ERP工序名称
        node_id: '' //对应的HB-MES生产关键工序节点基础数据ID
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: []
    }
  },

  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      this.onQuery()
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      PlmProcessNode(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val;
      this.onQuery(); // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val;
      this.onQuery(); // 查询
    },
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>
