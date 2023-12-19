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
    <el-table ref ="tableRef" :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="400">
      <el-table-column prop="index" label="序号" align="center" min-width="10%">
        <template v-slot:default="scope"><span>{{ (scope.$index + 1) }} </span></template>
      </el-table-column>
      <el-table-column prop="auxiliaryTypeName" label="辅材类型名称 " align="center" />
      <el-table-column label="操作" align="center" width="200">
        <template v-slot="scope">
          <el-button-group>
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
    <el-dialog draggable  :close-on-click-modal="false" title="选择" v-model="dialogConfigCaiGouFormVisible">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
          <el-form-item label="辅材类型名称" >
            <el-input v-model="listQuery.auxiliaryTypeName" placeholder="辅材类型名称" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item >
            <el-button type="primary" icon="Search" @click="onRuleConfigQuery">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableRuleConfigData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe height="300px">
        <el-table-column prop="auxiliaryTypeName" label="辅材类型名称" align="center" min-width="15%"/>
        <el-table-column header-align="center" align="center" width="160" label="操作">
          <template v-slot="scope">
            <el-button-group>
              <el-button type="primary"
                         @click="chooseItemData(scope.row)">
                选择
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-tag v-for="x in checkboxRuleConfigList" :key = x.crafsId style="margin-right:10px;">{{x.auxiliaryTypeName}}</el-tag>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogConfigCaiGouFormVisible = false" size="mini">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>

// 辅材类型查询
import {deleteAuxiliary, getAuxiliaryType, getCrafsAndAuxiliary, saveAuxiliary} from '@/api/eqpLedger'
import Pagination from "@/components/Pagination/index";
import Constants from "@/utils/constants";
import {insertGx, queryProduces} from "@/api/plan";


export default {
  components: {Pagination },
  data() {
    return {
      checkboxRuleConfigList:[],
      tableRuleConfigData:[],
      dialogConfigCaiGouFormVisible:false,
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        auxiliaryTypeName: null, // 模糊匹配，设备分类名称
        crafsName:null,
        crafsId:'',
        id:''
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
      this.onRuleConfigQuery()
    },

    chooseItemData(row){
      this.dialogConfigCaiGouFormVisible = false;
      this.createItemData(row);
    },
    //
    createItemData(classzzItem) {
      this.saveItemData(classzzItem)
    },
    saveItemData(classzzItem) {
      this.dialogConfigCaiGouFormVisible = false;
      let params = {
        id:classzzItem.id,
        crafsId:this.listQuery.crafsId,
        auxiliaryTypeName:classzzItem.auxiliaryTypeName,
      }
      saveAuxiliary(params).then(response => {
        if(response.err_code === this.$constants.statusCode.success){
          this.$message.success('数据保存成功');
        }else{
          this.$message.error(response.err_msg);
        }
        this.onQuery()
      })
    },


    onRuleConfigQuery() {
      this.tableRuleConfigData = [];
      getAuxiliaryType(this.listQuery).then(response => {
        this.tableRuleConfigData = response.data
        this.total = response.total_count
      })
      this.dialogConfigCaiGouFormVisible = true;
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

