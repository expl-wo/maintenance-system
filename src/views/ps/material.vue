<template>
  <!--角色分类列表-->
  <div class="app-container">
    <!-- <div class="titlePrompt">1TT.201.21345</div> -->
    <el-table highlight-current-row 
      :data="tableData"
      height="300"
      style="width: 100%;height:300px;font-size:12px;"
      stripe
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="name"
        label="物料名称"
        width="180"
      />
      <el-table-column
        prop="number"
        label="物料编码"
        width="200"
      >
        <template slot-scope="scope">
          <a @click="downFileByDrawingNo(scope.row.number)">{{ scope.row.number }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
      />
      <el-table-column
        prop="amount"
        label="数量"
      />
    </el-table>
    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon wp" @pagination="getList" />
  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
// import TableSimple from '@/components/Table/index'
import Pagination from '@/components/Pagination/index'

// 分页查询指定父节点的BOM直属子节点
import { downFile, findDrawingPath, getMaterialDirectsubbomList } from '@/api/materialbom'

export default {
  name: 'Table',
  components: { Pagination },
  props: ['fatherData'],
  data() {
    return {
      heightTable: '300px',
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10 // 查询第几页数据，默认第一页 pg_pagesize
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: []
    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    load(tree, treeNode, resolve, aa) {
      getMaterialDirectsubbomList({ number: tree.number }).then(response => {
        const responseData = response.data
        responseData.forEach(element => {
          element.hasChildren = true
        })
        setTimeout(() => {
          resolve(responseData)
        }, 1000)
      })
    },
    // 查询
    onQuery() {
      this.tableData = []
      const req = { ...this.listQuery }
      req.number = this.fatherData.number
      // req.number = '5TT.180.T8011.2'
      getMaterialDirectsubbomList(req).then(response => {
        this.tableData = response.data
        this.tableData.forEach(element => {
          element.hasChildren = true
        })
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
    },
    downFileByDrawingNo(partNumber) {
      const data = { partNumber: partNumber }
      findDrawingPath(data).then(response => {
        const path = { path: response.data }
        downFile(path).then(res => {
          const content = res.data
          const blob = new Blob([content], { type: 'application/pdf' })
          // const fileName = partNumber + '.pdf' // 自定义下载文件的名字
          const elink = document.createElement('a')
          // elink.download = fileName
          // elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          elink.target = '_blank'
          document.body.appendChild(elink)
          elink.click()
          // URL.revokeObjectURL(elink.href) // 释放URL 对象
          // document.body.removeChild(elink)
        })
      })
    }
  }
}
</script>

<style scoped>
.titlePrompt{
  padding: 0 10px;
  font-size: 12px;
  color:#E6A23C;
}
a{
  color: #3ba3ff;
}
</style>
