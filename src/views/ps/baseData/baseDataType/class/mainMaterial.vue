<template>
  <!--设备分类列表-->
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="主材类型名称" size="mini">
          <el-input v-model="listQuery.mainTypeName" placeholder="主材类型名称" style="width: 180px;" class="filter-item" size="mini" clearable/>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="onBtnQuery">查询</el-button>
          <el-button type="primary"  icon="Plus"  @click="handleAdd" >新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container app-containerC">
      <div class="otherCon wp">
        <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
          <el-table-column prop="index" label="序号" align="center" min-width="5%">
            <template v-slot:default="scope"><span>{{ (scope.$index + 1) }} </span></template>
          </el-table-column>
          <el-table-column prop="mainTypeName" label="主材类型名称 " align="center" min-width="15%"/>
          <el-table-column label="操作" align="center" width="200">
            <template v-slot="scope">
              <el-button-group>
                <el-button  type="primary"  icon="Edit"
                            @click="handleEdit(scope.row)">
                </el-button>
                <el-button type="danger"  icon="Delete"
                           @click="handleDelete(scope.row)">
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination class="otherCon wp" :data="tableData" :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize"
          @pagination="getList"/>
    </div>
    <main-add-or-update-dialog @refresh="onBtnQuery" ref="mainAddOrUpdateDialogRef"></main-add-or-update-dialog>

  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";

// 设备分类查询
import {deleteMainMaterialType,  getMainMaterialType} from '@/api/eqpLedger'
import Constants from "@/utils/constants";
import mainAddOrUpdateDialog from "@/views/ps/baseData/baseDataType/class/mainAddOrUpdateDialog";

export default {
  name: 'Table',
  components: { Pagination ,mainAddOrUpdateDialog},
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        mainTypeName: '', // 模糊匹配，设备分类名称
        type:'0',
      },
      tableData: [], // 角色分类列表表格数据
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      this.onQuery() // 查询
    }, // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getMainMaterialType(this.listQuery).then(response => {
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

    handleAdd(){
      this.$refs.mainAddOrUpdateDialogRef.init();
    },
    handleEdit(rowData){
      this.$refs.mainAddOrUpdateDialogRef.init(rowData);
    },

    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        deleteMainMaterialType({
          id: rowData.id
        }).then(response => {
          if (response.err_code === Constants.respCode.success) {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
          this.onQuery()
        })
      })
    },
  }
}
</script>

