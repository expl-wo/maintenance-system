<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="节点编码" size="mini">
          <el-input v-model="listQuery.nodeId" placeholder="输入节点编号" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="节点名称" size="mini">
          <el-input v-model="listQuery.name" placeholder="输入节点名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

  <el-table stripe  highlight-current-row  :data="tableData" class="otherCon wp" :stripe=true style="width: 100%;font-size:0.7rem;" row-key="id"
    border >
    <el-table-column prop="nodeId" align="center" width="250" label="节点编号" />
    <el-table-column prop="name" align="center" label="节点名称" />
    <el-table-column prop="type" align="center" width="100" label="节点类型">
      <template v-slot="{row}">
        <div v-if="row.type == 0">设计</div>
        <div v-if="row.type == 1">采购</div>
        <div v-if="row.type == 2">生产</div>
        <div v-if="row.type == 3">BOM</div>
      </template>
    </el-table-column>
    <el-table-column prop="" align="center" width="260" label="X轴坐标">
      <template v-slot="{row}">
        <el-input type="number"  v-model="row.coordinateX" placeholder="请输入X轴坐标" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="" align="center" width="260" label="Y轴坐标">
      <template v-slot="{row}">
        <el-input type="number" v-model="row.coordinateY" placeholder="请输入Y轴坐标" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
      </template>
    </el-table-column>

    <el-table-column header-align="center" align="center" width="240" label="操作">
      <template v-slot="scope">
        <el-button-group>
          <el-button size="mini" title="修改" type="primary" icon="Edit"
            @click="updateOrAdd(scope.row)">保存修改</el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>

  <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
      @pagination="getList" />
  </div>

</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {deleteCoordinate,updateOrAddcoordinate,queryCoordinate} from '@/api/plan'
export default {
  name: 'Table',
  components: {Pagination},
    data() {
      return {
        total: 0, // 角色列表表格总条数
        listQuery: { // 查询条件
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
          name:'',
          nodeId: '', //
          id: ''
        },
        tableData: [], // 节点坐标表格数据
        nowItem:null,
        //数据输入
        submitRules: {
          xData: [{ type: 'number', message: '必须为数字值'}],
          yData: [{ type: 'number', message: '必须为数字值'}],
        }
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
      // 查询
      onQuery() {
        this.tableData = []
        queryCoordinate(this.listQuery).then(response => {
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
      },
      updateOrAdd(row){
        updateOrAddcoordinate(row).then(response => {
          if(response.data == 10000)
          this.$message({ message: "保存成功", type: 'success' })
          else
          this.$message({ message: response.err_msg, type: 'success' })
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
