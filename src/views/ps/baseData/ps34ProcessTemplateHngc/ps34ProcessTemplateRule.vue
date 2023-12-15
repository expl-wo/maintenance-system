<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="工艺模板编号" >
          <el-input v-model="listQuery.processPlanNumber" placeholder="输入子艺模板编号" style="width: 120px;"
                    class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="工艺模板名称" >
          <el-input v-model="listQuery.processPlanName" placeholder="输入工艺模板名称" style="width: 120px;" class="filter-item"
                    clearable />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
        <el-table ref="tableRef"
                  highlight-current-row
                  :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700" @row-click="handleClick">
          <el-table-column prop="processPlanNumber" align="center" min-width="100" label="工艺模板编码" />
          <el-table-column prop="processPlanName" align="center" min-width="100"  label="工艺模板名称" />
          <el-table-column prop="isUse" align="center" label="是否可用" min-width="70">
            <template v-slot="{row}">
              <div v-if="row.isUse == 1">是</div>
              <div v-if="row.isUse == 0">否</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="250" label="操作">
            <template v-slot="scope">
                <el-button  type="primary" icon="edit"
                           @click="initEditData(scope.row)">
                  编辑模板
                </el-button>
              <el-button   type="danger" icon="delete"
                          @click="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      <pagination :total="total" :page ="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
                  @pagination="getList" />

    <el-dialog draggable  appendToBody :title="listModeUpdate.id? '编辑': '新增'" v-model="dialogVisible" modal width="600">
      <el-form :model="listModeUpdate" class="element-list" ref="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="processPlanNumber" label="工艺模板编码" >
              <el-input v-model="listModeUpdate.processPlanNumber" placeholder="请输入子工艺模板编码" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 工艺模板名称:" prop="processPlanName">
              <el-input v-model="listModeUpdate.processPlanName" placeholder="请输入子工艺模板名称" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 是否可用:" prop="isUse" >
              <el-switch v-model="listModeUpdate.isUse" active-value='1' inactive-value='0' active-color="#13ce66"
                         inactive-color="#808080" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div >
        <el-button  @click="dialogVisible=false"> 取消</el-button>
        <el-button  type="primary" @click="createOrUpdateProcess">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  deleteProcessCraftsDe, deleteProcessPlan,
  getHbCraftMode, insertGx, insertMaterialNode,
  insertPLMProcessCrafts,
  queryMaterialNotNode,
  queryProduces,
  saveProcedure,
  saveProcess
} from '@/api/plan'
import Pagination from "@/components/Pagination/index";
import ps34ProcessTemplateRuleItem from "@/views/ps/baseData/ps34ProcessTemplateHngc/ps34ProcessTemplateRuleItem";
import Constants from "@/utils/constants";

export default {
  name: 'ps34ProcessTemplateRule',
  components: {Pagination},


  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: { // 查询条件
        id:'',
        processPlanId: '',
        processPlanName: '', //
        processPlanNumber: '', //
        isUse:'',
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
      },
      tableData: [],
      selectRow:[],
      nowChooseData: {
        processPlanId: null
      },
      listConfigUpdate: {
        ruleConfig: '',
        id: ''
      },
      listModeUpdate: { // 工艺模板数据
        processPlanId: '',
        processPlanName: '',
        processPlanNumber:'',
        isUse: '',
      },
      listQueryProduces: { // 查询条件
        gxUid: '', // 分类编号，模糊匹配
        gxName: '', // 分类名称，模糊匹配
        id: ''
      },
      dialogVisible: false,
      value: [],
      owner: {
        ownerItemArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      alreadyProduces: [],
      tableRuleConfigData: [], //分类数据表格
      rowRuleConfigHeader: [],
      heightTable: '300px', // 弹窗表格高度
      checkboxRuleConfigList: [],
    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    onload() {

      this.onQuery() // 查询
    },

    onQuery() {

        this.tableData = []
         getHbCraftMode(this.listQuery).then(response => {
          this.tableData = response.data
          this.total = response.total_count
           if(this.tableData && this.tableData.length > 0){
             this.$refs.tableRef.setCurrentRow(this.tableData[0]);
             this.handleClick(this.tableData[0])
           }
        })
    },
    handleClick(item) {
      this.$emit('updateChild', item)
    },

    clearnModedialog() {
      this.listModeUpdate.processPlanNumber = null;
      this.listModeUpdate.processPlanName = null;
      this.isUse = null;
    },

    handleSearch() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    handleAdd(){

      this.listModeUpdate,
          this.$nextTick(()=>{
            this.$refs.formRef && this.$refs.formRef.clearValidate();
          })
      this.dialogVisible  = true;
    },
    createOrUpdateProcess() {
      this.dialogVisible = false;
      let params = {
        procedures: [{
          processPlanId:this.listModeUpdate.processPlanId,
          processPlanNumber: this.listModeUpdate.processPlanNumber,
          processPlanName: this.listModeUpdate.processPlanName,
          isUse: parseInt(this.listModeUpdate.isUse),
        }]

      }
      saveProcess(params).then(response => {
        this.$message({
          message: "新增/修改成功",
          type: 'success'
        })
        this.onQuery()
      })
    },

    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },
    initEditData(row){
      this.dialogVisible = true,
      this.listModeUpdate.processPlanName = row.processPlanName
      this.listModeUpdate.processPlanNumber = row.processPlanNumber
      this.listModeUpdate.processPlanId = row.id
      this.listModeUpdate.isUse = row.isUse.toString()
    },


    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        deleteProcessPlan({
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

<style scoped>
</style>
