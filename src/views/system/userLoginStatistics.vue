<template>
  <!--角色分类列表-->
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">

        <el-form-item label="用户姓名" size="mini">
          <el-input v-model="listQuery.name" placeholder="模糊查询用户姓名" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item><el-form-item label="用户编号" size="mini">
          <el-input v-model="listQuery.code" placeholder="模糊查询用户编号" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="排序方式" size="mini">
          <el-select v-model="listQuery.orderBy" style="width: 200px;" @change="onQuery">
            <el-option label="登录次数倒序" value="1" />
            <el-option label="登录次数正序" value="2" />
            <el-option label="用户名称排序" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
      <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
        <el-table-column prop="index" label="序号" align="center" min-width="5%">
          <template v-slot:default="scope"><span>{{ (scope.$index + 1) }} </span></template>
        </el-table-column>
        <el-table-column prop="code" label="员工编码" align="center" min-width="15%"/>
        <el-table-column prop="name" label="员工姓名" align="center" min-width="15%"/>
        <el-table-column prop="lgnSize" label="累积登录次数" align="center" min-width="15%">
        </el-table-column>
      </el-table>
    <table-simple
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      @pagination="handlePagination"
    />

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'

import { getUserLgnCrd } from '@/api/user'

export default {
  name: 'Table',
  components: { TableSimple },
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        code: '', // 登录用户工号
        name: '', // 登录用户名称
        orderBy: ''
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
      getUserLgnCrd(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 分页数据发生变化
    handlePagination({ page, limit }) {
      this.listQuery.pg_pagenum = page
      this.listQuery.pg_pagesize = limit
      this.onQuery()
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

