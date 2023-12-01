<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="中工序名称" >
          <el-input v-model="listQuery.craftsName" placeholder="请输入中工序名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" icon="Search" @click="handleSearch">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <div class="otherCon wp xui-table__highlight">
        <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
          <el-table-column prop="craftsCode" align="center" width="150" label="中工序编码" />
          <el-table-column prop="craftsName" align="center" width="150" label="中工序名称"/>
          <el-table-column prop="isOntology" label="是否本体" align="center" width="100">
            <template v-slot="{row}">
              <div v-if="row.isOntology == 0">否</div>
              <div v-if="row.isOntology == 1">是</div>
            </template>
          </el-table-column>
          <el-table-column label="前置条件" align="center" min-width="300">
            <template v-slot="scope">
              <el-select multiple value-key="k" v-model="scope.row.preCrafts" style="width: 270px">
                <el-option v-for="item in scope.row.allCrafts" :key="item.k" :value="item" :label="item.v"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" width="160" label="操作">
            <template v-slot="scope">
              <el-button-group>
                <el-button size="small" title="操作" type="primary" icon="Cellphone"
                           @click="handleItemSave(scope.row)">
                  保存
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :total="total" :page ="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
                  @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import {findAllCrafts,insertCraftsOrder} from '@/api/plan'
import Pagination from "@/components/Pagination/index";

export default {
  name: 'ps31ChildHeadRule',
  components: {Pagination},


  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: { // 查询条件
        id: '', //PLM工序子工艺模板头ID
        name: '', //
        type: null, //
        gxUid: '', //PLM工序编码
        gxName: '', //PLM工序名称
        standardtime: '', //标准工时
        node_id: '', //
        craftsCode: '', //子工艺模板头编码
        craftsName: '', //子工艺模板头名称
        isOntology: '', //是否本体
        percentage: '', //百分比
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
      },
      tableData: [],
      selectRow:[]
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    onload() {
      this.getDataList() // 查询
    },
    getDataList() {
        this.tableData = []
        findAllCrafts(this.listQuery).then(response => {
          this.tableData = response.data
          this.total = response.total_count
        })
    },
    handleClick(item) {
      this.$emit('updateChild', item)
    },

    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.getDataList() // 查询
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
    handleItemSave(params) {
      insertCraftsOrder(params).then(response => {
        this.$message({
          message: "保存成功",
          type: 'success'
        })
      })
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





