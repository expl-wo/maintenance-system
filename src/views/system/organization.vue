<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="组织机构名称" size="mini">
          <el-input v-model="listQuery.name" placeholder="组织机构名称" style="width: 180px;" class="filter-item" size="mini" clearable/>
        </el-form-item>
        <el-form-item label="组织机构编号" size="mini">
          <el-input v-model="listQuery.orgCode" placeholder="组织机构编号" style="width: 180px;" class="filter-item" size="mini" clearable/>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      class="otherCon wp"
      :data="tableData"
      :border="true"
      header-cell-class-name="bgblue"
      style="width: 100%"
      stripe
      row-key="id"
      height="700"
      @changeUploadFile="changeUploadFile"
    >
      <el-table-column
        prop="index"
        label="序号"
        align="center"
        min-width="5%"
      >
        <template v-slot:default="scope">
          <span>{{(scope.$index + 1)}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="组织机构名称"
        align="center"
        min-width="15%"
      />
      <el-table-column
        prop="orgCode"
        label="组织机构编号"
        align="center"
        min-width="15%"
      />
    </el-table>
    <el-pagination
      :current-page="listQuery.pg_pagenum"
      :page-sizes="[100, 200, 500]"
      :page-size="listQuery.pg_pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
// 组织机构列表查询
import { getOrgAll } from '@/api/org'

export default {
  name: 'Table',
  data() {
    return {
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        orgCode: '', // 模糊匹配，部门编号
        name: '' // 模糊匹配，部门姓名
      },
      tableData: [], // 表格数据
      rowHeader: []
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      this.onQuery() // 查询
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getOrgAll(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val
      this.onQuery() // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val
      this.onQuery() // 查询
    },
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

