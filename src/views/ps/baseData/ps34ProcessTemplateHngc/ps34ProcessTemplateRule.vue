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
        <el-form-item size="mini">
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item size="mini">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
        <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
          <el-table-column prop="processPlanNumber" align="center" min-width="100" label="工艺模板编码" />
          <el-table-column prop="processPlanName" align="center" min-width="100"  label="工艺模板名称" />
          <el-table-column prop="isUse" align="center" label="是否可用" min-width="70">
            <template v-slot="{row}">
              <div v-if="row.isUse == 1">是</div>
              <div v-if="row.isUse == 0">否</div>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="300" label="操作">
            <template v-slot="scope">
                <el-button size="mini" title="" type="primary" icon="Edit"
                           @click="initEditData(scope.row)">
                  编辑模板
                </el-button>
                <el-button size="mini" title="" type="primary" icon="Plus"
                           @click="handleItemAddDict(scope.row);">
                  添加工序
                </el-button>
            </template>
          </el-table-column>
        </el-table>
      <pagination :total="total" :page ="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
                  @pagination="getList" />

    <el-dialog v-dialogDrag  appendToBody :title="listModeUpdate.id? '编辑': '新增'" v-model="dialogVisible" modal width="600">
      <el-form :model="listModeUpdate" class="element-list" ref="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="processPlanNumber" label="工艺模板编码" size="mini">
              <el-input v-model="listModeUpdate.processPlanNumber" placeholder="请输入子工艺模板编码" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 工艺模板名称:" prop="processPlanName" size="mini">
              <el-input v-model="listModeUpdate.processPlanName" placeholder="请输入子工艺模板名称" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 是否可用:" prop="isUse" size="mini">
              <el-switch v-model="listModeUpdate.isUse" active-value='1' inactive-value='0' active-color="#13ce66"
                         inactive-color="#808080" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible=false"> 取消</el-button>
        <el-button size="mini" type="primary" @click="createOrUpdateProcess">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog v-dialogDrag  :close-on-click-modal="false" title="选择" v-model="dialogConfigCaiGouFormVisible">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQueryProduces" class="demo-form-inline demo-form-zdy">
          <el-form-item label="工序编号" size="mini">
            <el-input v-model="listQueryProduces.gxUid" placeholder="工序编号" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="工序名称" size="mini">
            <el-input v-model="listQueryProduces.gxName" placeholder="工序名称" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" icon="Search" @click="onRuleConfigQuery">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableRuleConfigData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe height="300px">
        <el-table-column prop="gxUid" label="工序编码" align="center" min-width="15%"/>
        <el-table-column prop="gxName" label="工序名称" align="center" min-width="15%"/>
        <el-table-column header-align="center" align="center" width="160" label="操作">
          <template v-slot="scope">
            <el-button-group>
              <el-button size="mini" type="primary"
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
          <el-button @click="dialogConfigCaiGouFormVisible = false" size="mini">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHbCraftMode, insertGx, insertMaterialNode,
  insertPLMProcessCrafts,
  queryMaterialNotNode,
  queryProduces,
  saveProcedure,
  saveProcess
} from '@/api/plan'
import Pagination from "@/components/Pagination/index";

export default {
  name: 'ps34ProcessTemplateRule',
  components: {Pagination},


  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: { // 查询条件
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
      dialogConfigCaiGouFormVisible: false,
      value: [],
      lineWorkSpace: [],
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
    chooseItemData(row){
      this.dialogConfigCaiGouFormVisible = false;
      this.createItemData(row);
    },
    // 点击添加分类关系
    createItemData(classzzItem) {
      this.saveItemData(classzzItem)
    },
    saveItemData(classzzItem) {
      let params = {
        id:this.nowChooseData.id,
        gxUid:classzzItem.gxUid,
        gxName:classzzItem.gxName,
      }
      insertGx(params).then(response => {
        this.$message({
          message: "新增成功",
          type: 'success'
        })
        this.nowChooseData = null;
        this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
      })
    },

    createOrUpdateProcess() {
      this.dialogVisible = false;
      let params = {
        procedures: [{
          gxUid: this.listQueryProduces.gxUid,
          gxName: this.listQueryProduces.gxName,
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

    handleItemAddDict(params) {
      this.nowChooseData = params;
      this.onRuleConfigQuery()
    },

    tagClose(i) {
      this.owner.ownerItemArray.splice(i, 1);
      this.owner.ownerIdArray.splice(i, 1);
      this.owner.ownerNameArray.splice(i, 1);
      //this.onPeopleQuery();
      return true;
    },
    createProcedures() {
      let params = {
        procedures: []
      }
      if ((this.owner.ownerIdArray.length == 0) || (this.nowChooseData == null)) {
        this.$message({
          type: 'warning',
          message: '请选择工序数据!'
        })
      } else {
        this.dialogTablePeopleVisible = false
        this.owner.ownerItemArray.forEach(item => {
          let param = {
            id: item.id,
            gxId: item.gxUid,
            processPlanId: this.nowChooseData.processPlanId,
            preGx: null,
            workspaceNumber: item.workspaceNumber,
            workspaceName: item.workspaceName
          }
          params.procedures.push(param)
        })
      }
      saveProcedure(params).then(response => {
        this.$message({
          message: "操作成功",
          type: 'success'
        })
        this.nowChooseData = null;
        this.owner.ownerIdArray = [];
        this.owner.ownerNameArray = [];
        this.owner.ownerItemArray = []
      })
    },
    onRuleConfigQuery() {
      // var oldes = [];
      // if (this.listConfigUpdate.ruleConfig && this.listConfigUpdate.ruleConfig.length > 3) {
      //   oldes = JSON.parse(this.listConfigUpdate.ruleConfig);
      // }
      this.tableRuleConfigData = [];
      queryProduces(this.listQueryProduces).then(response => {
        this.tableRuleConfigData = response.data
        this.clazzTotal = response.total_count
        // this.tableRuleConfigData.forEach(element => {
        //   // element.checked = false
        //   for (let oes in oldes) {
        //     if (oldes[oes].id === element.id) {
        //       // element.checked = true
        //       self.checkboxRuleConfigList.push(element)
        //       break
        //     }
        //   }
        // })
      })
      this.dialogConfigCaiGouFormVisible = true;
    },

    updateProcedures(row) {
      let params = {
        procedures: []
      }
      row.dicts.forEach(item => {
        let param = {
          id: item.id,
          gxId: item.gxUid,
          processPlanId: row.processPlanId,
          preGx: item.preGx,
          workspaceNumber: item.workspaceNumber,
          workspaceName: item.workspaceName
        }
        params.procedures.push(param);
      })
      saveProcedure(params).then(response => {
        this.$message({
          message: "操作成功",
          type: 'success'
        })
        this.nowChooseData = null;
        this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
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
