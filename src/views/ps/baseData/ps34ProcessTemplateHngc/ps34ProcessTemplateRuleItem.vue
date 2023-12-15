<template>
  <div  class="wp hp app-containerC">
    <div class="filter-container searchCon">
       <el-form :inline="true" :model="listItemUpdate" class="demo-form-inline demo-form-zdy">
         <el-form-item label="标准工序编号" >
           <el-input v-model="listItemUpdate.gxName" placeholder="输入标准工序名称" style="width: 120px;"
                  class="filter-item" clearable />
         </el-form-item>
         <el-form-item label="标准工序名称" >
           <el-input v-model="listItemUpdate.gxUId" placeholder="输入标准工序编码" style="width: 120px;" class="filter-item" clearable />
         </el-form-item>
         <el-form-item >
           <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
         </el-form-item>
         <el-form-item >
           <el-button type="primary" icon="plus" @click="handleItemAddDict">新增</el-button>
         </el-form-item>
         <el-form-item >
           <el-button  title="保存" type="primary" icon="edit" @click="saveItemDataCondition">保存</el-button>
         </el-form-item>
      </el-form>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <el-table ref="tableRef"
                :data="tableData"
                border
                header-cell-class-name="bgblue"
                style="width: 100%;font-size: 0.7rem"
                stripe row-key="id"
                height="700">
        <el-table-column prop="gxUid" align="center" width="120" label="标准工序编号" />
        <el-table-column prop="gxName" align="center" label="标准工序名称" />
        <el-table-column label="前置条件" align="center" width="200">
          <template v-slot="scope">
            <el-select multiple value-key="k"  v-model="scope.row.preGx" style="min-width: 100px">
              <el-option v-for="item in dataList.filter( i => i.k !== scope.row.gxUid)" :key="item.k" :value="item" :label="item.v">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="工位" align="center" width="200">
          <template v-slot="scope">
            <el-cascader v-model="scope.row.workspaceNumber" :options="lineWorkSpace" :show-all-levels="false"
                         @change="handleBaseValue($event,scope.row)"
                         :props="{value: 'wkNumber',label: 'name',children: 'workSpace'}" style="min-width: 100px"
                         ></el-cascader>
          </template>
        </el-table-column>
        <el-table-column prop="workspaceNumber" align="center" label="工位编码" />
        <el-table-column prop="workspaceName" align="center" label="工位名称" />
        <el-table-column prop="erpValidationCode" align="center" label="ERP识别码" width="100"/>
        <el-table-column header-align="center" align="center" width="60" label="操作">
          <template v-slot="scope">
            <el-button  title="删除" type="danger" icon="Delete"
                        @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
        </el-table>
      <pagination :total="total" :page ="listItemUpdate.pg_pagenum" :limit="listItemUpdate.pg_pagesize" class="searchCon"
                  @pagination="getList" />
    </div>
    <el-dialog draggable  :close-on-click-modal="false" title="选择" v-model="dialogConfigCaiGouFormVisible">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQueryProduces" class="demo-form-inline demo-form-zdy">
          <el-form-item label="工序编号" >
            <el-input v-model="listQueryProduces.gxUid" placeholder="工序编号" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="工序名称" >
            <el-input v-model="listQueryProduces.gxName" placeholder="工序名称" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item >
            <el-button type="primary" icon="Search" @click="onRuleConfigQuery">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableRuleConfigData"
                border
                header-cell-class-name="bgblue"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                stripe height="300px">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="gxUid" label="工序编码" align="center" min-width="15%"/>
        <el-table-column prop="gxName" label="工序名称" align="center" min-width="15%"/>
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
        <el-tag v-for="x in checkboxRuleConfigList" :key="x.gxUid" style="margin-right:10px;">{{x.gxName}}</el-tag>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogConfigCaiGouFormVisible = false" size="small">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Constants from "@/utils/constants";
import {
  procedure, insertGxUid, deleteProcedure, queryProduces,productionLine
} from "@/api/plan";

import Pagination from "@/components/Pagination/index";

export default {
  name: 'ps34ProcessTemplateRuleItem',
  components: {Pagination},
  data() {
    return {
      total: 0,
      dataList: [],
      dialogVisible: false,
      dialogConfigCaiGouFormVisible:false,
      tableRuleConfigData: [], //分类数据表格
      selectData:[],
      listQueryProduces: { // 查询条件
        gxUid: '', // 分类编号，模糊匹配
        gxName: '', // 分类名称，模糊匹配
        id: ''
      },
      lineWorkSpace: [],
      listItemUpdate: { // 数据
        id:'',
          gxUId:'',
          gxName:'',
        workSpaceName:'',
        workSpaceNumber:'',
        processPlanId:'',

          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
      },
     tableData:[],
      checkboxRuleConfigList: [],
    }
  },
  mounted() {
    this.getWorkSpace();
  },
  methods: {
    //获取
    getDataList() {
        this.tableData = []
        procedure(this.listItemUpdate).then(response => {
          this.tableData = response.data
          this.total = response.total_count
          this.dataList = response.data.map(item => {
            return {
              k: item.gxUid,
              v: item.gxName
            }
          })
        })
    },
    getWorkSpace(){
      productionLine().then(res =>{
        if (res.err_code === 10000){
          this.lineWorkSpace = res.data
        }else {
          this.$message({
            message: "查询工位信息失败",
            type: 'error'
          })
        }
      })

    },
    getList(val) {
      this.listItemUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listItemUpdate.pg_pagesize = val.limit
      }
      this.getDataList() // 查询
    },

    handleBaseValue(val,data){

      data.workspaceNumber = val[val.length-1]
      // console.log(data)
    },
    handleSelectionChange(val){
      this.selectData = val
    },
    saveItemDataCondition() {

      let procedures = []
      this.tableData.forEach(row =>{
        procedures.push({
          id: row.id,
          processPlanId: this.listItemUpdate.processPlanId,
          gxUid: row.gxUid,
          gxName: row.gxName,
          processPlanNumber:row.processPlanNumber,
          processPlanName:row.processPlanName,
          processTime:row.processTime,
          workspaceNumber:row.workspaceNumber,
          workspaceName:row.workshopName,
          erpValidationCode:row.erpValidationCode,
          isUse:row.isUse,
          preGx:row.preGx,
        })
      })

      insertGxUid({procedures:procedures}).then(response => {
        if (response.err_code === 10000){
          this.$message({
            message: "保存成功",
            type: 'success'
          })
        }else {
          this.$message({
            message: "保存失败",
            type: 'error'
          })
        }

      })
    },
    handleSearch() {
      this.listItemUpdate.pg_pagenum = 1
      this.getDataList()
    },

    handleItemAddDict() {
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
        procedures:[{
          id: classzzItem.id,
          processPlanId: this.listItemUpdate.processPlanId,
          gxUid: classzzItem.gxUid,
          gxName: classzzItem.gxName,
          processPlanNumber:classzzItem.processPlanNumber,
          processPlanName:classzzItem.processPlanName,
          processTime:classzzItem.processTime,
          workspaceNumber:classzzItem.workspaceNumber,
          workspaceName:classzzItem.workspaceName,
          erpValidationCode:classzzItem.erpValidationCode,
          isUse:classzzItem.isUse,
          preGx:null
        }]
      }
      insertGxUid(params).then(response => {
        if (response.err_code === 10000){
          this.$message({
            message: "新增成功",
            type: 'success'
          })
          this.getDataList()
        }else{
          this.$message({
            message: "新增失败",
            type: 'error'
          })
        }

      })
    },


    onRuleConfigQuery() {
      this.tableRuleConfigData = [];
      queryProduces(this.listQueryProduces).then(response => {
        this.tableRuleConfigData = response.data
        this.total = response.total_count
      })
      this.dialogConfigCaiGouFormVisible = true;
    },

    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        deleteProcedure({
          id:rowData.id
        }).then(response => {
          if (response.err_code === Constants.statusCode.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
          this.getDataList()
        })
      })
    },
    initData(processPlanId) {
      this.listItemUpdate.processPlanId = processPlanId ==null ?'':processPlanId.id
      procedure({
        processPlanId: this.listItemUpdate.processPlanId,
        gxUId: '',
        gxName: '',
        workshopName:'',
        workshopNumber:'',
        pg_pagenum: 1,
        pg_pagesize: 10
       }).then(response => {
         this.tableData = response.data;
         this.total = response.total_count;
         this.dataList = response.data.map(item => {
           return {
             k: item.gxUid,
             v: item.gxName
           }
         })

      })
    },


  }
}
</script>

<style scoped>

</style>
