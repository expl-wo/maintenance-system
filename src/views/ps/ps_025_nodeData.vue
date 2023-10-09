<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="节点名称" size="mini">
          <el-input v-model="listQuery.name" placeholder="输入节点名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="车间名称" size="mini">
          <el-input v-model="listQuery.workshopName" placeholder="输入车间名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="节点类型" size="mini">
          <el-select v-model="listQuery.type" size="mini" placeholder="节点类型" style="width: 120px;" filterable
            default-first-option>
            <el-option v-for="items in nodeType" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <table-simple class="otherCon wp" :data="tableData" :row-header="rowHeader" :total="total"
      :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" @pagination="getList" />
  </div>
</template>

<script>
import TableSimple from '@/components/Table/index.vue'
import {findAllNode} from '@/api/plan'
export default {
  name: 'Table',
  components: { TableSimple },
    data() {
      return {
        total: 0, // 角色列表表格总条数
        listQuery: { // 查询条件
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
          number: '', //
          name: '', //
          workshopName: '',
          type: null,
          id: '',
        },
        nodeType: [{
          'id': null,
          'name': '全部'
        }, {
          'id': 0,
          'name': '设计'
        }, {
          'id': 1,
          'name': '采购'
        }, {
          'id': 2,
          'name': '生产'
        },{
          'id': 3,
          'name': 'BOM'
        }],
        tableData: [], // 角色分类列表表格数据
        rowHeader: []
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
            width: 50,
            align: 'center',
            label: '序号'
          },
          {
            prop: 'name',
            align: 'center',
            label: '节点名称'
          },
          {
            prop: 'workshopName',
            align: 'center',
            label: '车间名称'
          },
          {
            prop: 'type',
            align: 'center',
            label: '节点类型',
            render: (h, params) => {
              var typeHtml = ''
              switch (params.row.type) {
                case 0:
                  typeHtml = '设计'
                  break
                case 1:
                  typeHtml = '采购'
                  break
                case 2:
                  typeHtml = '生产'
                  break
                case 3:
                  typeHtml = 'BOM'
                  break
                case null:
                  typeHtml = ''
                  break
              }
              return h('a', [typeHtml])
            }
          },
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
        findAllNode(this.listQuery).then(response => {
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
  .line {
    text-align: center;
  }

  .el-form-item {
    margin-bottom: 10px;
  }
</style>
