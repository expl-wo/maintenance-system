<template>
  <!--设备分类列表-->
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="辅材类型名称" >
          <el-input v-model="listQuery.auxiliaryTypeName" placeholder="输入辅材类型名称" style="width: 170px;" class="filter-item"
                    clearable />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="onBtnQuery">查询</el-button>
          <el-button type="primary"  icon="Plus"  @click="handleAdd" >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <div class="otherCon wp xui-table__highlight">
    <el-table ref ="tableRef" :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
      <el-table-column prop="index" label="序号" align="center" min-width="5%">
        <template v-slot:default="scope"><span>{{ (scope.$index + 1) }} </span></template>
      </el-table-column>
      <el-table-column prop="auxiliaryTypeName" label="辅材类型名称 " align="center" min-width="15%"/>
      <el-table-column prop="crafsName" label="中工序名称" align="center" min-width="15%"/>
      <el-table-column label="操作" align="center" width="200">
        <template v-slot="scope">
          <el-button-group>
            <el-button  type="primary" icon="Edit"
                        @click="handEdit(scope.row)">
            </el-button>
            <el-button type="danger"  icon="Delete"
                       @click="handleDelete(scope.row)">
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
      </div>
    <pagination class="otherCon wp" :data="tableData"  :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize"
                  @pagination="getList"
    />
    </div>
    <el-dialog draggable  appendToBody :title="listItemQuery.id? '编辑': '新增'"
               v-model="dialogVisible" modal width="600">
      <el-form :model="listItemQuery" class="element-list" ref="form" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 辅材类型名称:" prop="craftsName" >
              <el-input v-model="listItemQuery.auxiliaryTypeName" placeholder="请输入辅材类型名称" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 中工序名称:" prop="crafsName" >
              <el-input v-model="listItemQuery.crafsName" placeholder="请输入中工序名称" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button  @click="dialogVisible=false">取消</el-button>
        <el-button  type="primary" @click="saveItemData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

// 辅材类型查询
import {deleteAuxiliary, getCrafsAndAuxiliary, saveAuxiliary} from '@/api/eqpLedger'
import Pagination from "@/components/Pagination/index";
import Constants from "@/utils/constants";


export default {
  components: {Pagination },
  data() {
    return {
      dialogVisible:false,
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        auxiliaryTypeName: '', // 模糊匹配，设备分类名称
        crafsName:'',
        crafsId:'',
        id:''
      },
      listItemQuery:{
        id:'',
        crafsId:'',
        crafsName:'',
        auxiliaryTypeName:''
      },
      tableData: [], // 角色分类列表表格数据
    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {

    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getCrafsAndAuxiliary(this.listQuery).then(response => {
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
    handleAdd() {
      this.listItemQuery = {
        id: '',
        crafsName: '',
        auxiliaryTypeName: '',
        crafsId: this.listQuery.crafsId,

      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
    },
    handEdit(row){
      this.dialogVisible = true
      this.listItemQuery.id = row.id
      this.listItemQuery.auxiliaryTypeName = row.auxiliaryTypeName
      this.listItemQuery.crafsName = row.crafsName
      this.crafsId = this.listQuery.crafsId
    },

    saveItemData() {
      this.dialogVisible = false;
      let params = {
        id:this.listItemQuery.id,
        auxiliaryTypeName: this.listItemQuery.auxiliaryTypeName,
        crafsName: this.listItemQuery.crafsName,
        crafsId:this.listQuery.crafsId
      }
      saveAuxiliary(params).then(response => {
        this.$message({
          message: "新增成功",
          type: 'success'
        })
        this.onQuery()
      })
    },

    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        deleteAuxiliary({
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

    initData(crafsId) {
      this.listQuery.crafsId = crafsId ==null ?'':crafsId.id
      // this.timeLimitId = data.id;
      getCrafsAndAuxiliary({
        crafsId:this.listQuery.crafsId,
        auxiliaryTypeName:'',
        crafsName: '',
        pg_pagesize: 10,
        pg_pagenum: 1,
      }).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },



  }
}
</script>

