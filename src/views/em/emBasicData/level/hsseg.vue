<template>
  <!--设备等级列表-->
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="等级名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="等级名称" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item label="等级描述"  size="small">
          <el-input v-model="listQuery.description" placeholder="等级描述" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <table-simple
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      @pagination="getList"
    />

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'

// 设备等级查询
import { getHsseManageLevelList } from '@/api/em/eqpLedger'

export default {
  name: 'Table',
  components: { TableSimple },
  data() {
    return {
      total: 0, // 设备列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '', // 模糊匹配，设备等级名称
        description: '' ,// 模糊匹配，设备等级描述
      },
      tableData: [], // 设备等级列表表格数据
      rowHeader: [],
      formLabelWidth: '120px'
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      const self = this
      self.rowHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'name',
          align: 'center',
          label: '等级名称'
        },
        {
          prop: 'description',
          align: 'center',
          label: '等级描述'
        }
      ]
      self.onQuery() // 查询
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getHsseManageLevelList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 分页数据发生变化
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}
</style>
