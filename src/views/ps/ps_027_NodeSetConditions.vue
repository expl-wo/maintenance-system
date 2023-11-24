<template>
  <div class="app-container app-containerC">


    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="节点名称">
          <el-input v-model="listQuery.name" placeholder="输入节点名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe  highlight-current-row  height="700" :data="tableData" style="font-size:12px;" row-key="pl24Id" border>
      <el-table-column prop="name" label="节点名称" align="center" />
      <el-table-column prop="type" label="节点类型" align="center">
        <template v-slot="{row}">
          <div v-if="row.type == 0">设计</div>
          <div v-if="row.type == 1">采购</div>
          <div v-if="row.type == 2">生产</div>
        </template>
      </el-table-column>
      <el-table-column label="前置条件" align="center" width="300">
        <template v-slot="scope">
          <el-select multiple value-key="k" v-model="scope.row.preNodeBasic" style="width: 270px">
            <el-option v-for="item in scope.row.allNodeBasic" :key="item.k" :value="item" :label="item.v"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="160" label="操作">
        <template v-slot="scope">
          <el-button-group>
            <el-button title="操作" type="primary" icon="Cellphone"
              @click="handleItemAddDict(scope.row)">
              保存前置条件
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
      @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {findAllNode,updateNodeOrder} from '@/api/plan'
export default {
  name: 'Table',
  components: {Pagination},
    data() {
      return {
        total: 0, // 角色列表表格总条数
        listQuery: { // 查询条件
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
          number: '', //
          name: '', //
          type: 2,
          nodeId: 23,
        },
        nodeType: [{'id': 0,'name': '设计'}, {'id': 1,'name': '采购'}, {'id': 2,'name': '生产'}],
        tableData: [],
        nodeData: [],
      }
    },
    mounted() {
      this.onload()
    },
    methods: {
      onload() {
        const self = this
        self.onQuery() // 查询
      },
      // 查询
      onBtnQuery() {
        this.listQuery.pg_pagenum = 1
        this.onQuery()
      },
      onQuery() {
        this.tableData = []
        findAllNode(this.listQuery).then(response => {
          this.tableData = response.data
          this.total = response.total_count
          //this.valuation();
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
      //保存前置条件
      handleItemAddDict(params) {
        updateNodeOrder(params).then(response => {
          this.$message({
            message: "保存成功",
            type: 'success'
          })
        })
      }
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
