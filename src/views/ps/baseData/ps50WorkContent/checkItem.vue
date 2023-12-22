<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="工步编码" v-show="!hidden">
          <el-input v-model="listQuery.stepCode" placeholder="输入工步编码" style="width: 120px;"
                    class="filter-item" clearable />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container app-containerC">
      <div class="otherCon wp">
        <el-table stripe ref="tableRef" border  :data="tableData" class="otherCon wp" style="width: 100%;font-size:0.7rem;" row-key="id" >
          <el-table-column align="center" width="110" label="工步编码" property="stepCode"></el-table-column>
          <el-table-column align="center" width="110" label="工步名称" property="stepName"></el-table-column>
          <el-table-column align="center" width="110" label="操作项序号" property="operationNumber"></el-table-column>
          <el-table-column align="center" width="110" label="操作项编码" property="operationCode"></el-table-column>
          <el-table-column align="center" width="110" label="操作项名称" property="operationName"></el-table-column>
          <el-table-column align="center" width="110" label="操作项描述" property="operationDescription"></el-table-column>
          <el-table-column align="center" width="110" label="操作项类型" property="operationType">
            <template v-slot="{row}">
              <xui-dictionary  item-code="WorkContentType" :code="row.operationType"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="选项名称" width="110" property="dictCode">
            <template v-slot="{row}">
              <xui-dict-name v-if="row.operationType === '3' || row.operationType === '4'" :itemCode="row.dictionaryCode"></xui-dict-name>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下限"  property="lowerLimit"></el-table-column>
          <el-table-column align="center" label="上限"  property="upperLimit"></el-table-column>
          <el-table-column align="center" label="正确值" width="100" property="correctValue"></el-table-column>
          <el-table-column align="center" label="数据单位" width="100" property="dataUnit"></el-table-column>
          <el-table-column align="center" label="内容最大长度" width="100" property="maximumContentLength"></el-table-column>
          <el-table-column prop="requireImageFile" align="center" width="100" label="是否上传图片/文件">
            <template v-slot="{row}">
              <xui-dictionary itemCode="yn" :code="row.requireImageFile"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column prop="isMultiline" align="center" width="100" label="是否多行">
            <template v-slot="{row}">
              <xui-dictionary itemCode="yn" :code="row.isMultiline"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column prop="isRequire" align="center" width="100" label="是否必填">
            <template v-slot="{row}">
              <xui-dictionary itemCode="yn" :code="row.isRequired"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column align="center" label="依赖操作项" prop="reOperationName">
          </el-table-column>
          <el-table-column align="center" label="依赖操作项选项" >
            <template v-slot="{row}">
              <xui-dictionary v-if="row.dependentOperation" :item-code="row.reDictionaryCode"  :code="row.dependentOperationOption"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column align="center" label="执行频次"  property="executionFrequency"></el-table-column>
          <el-table-column align="center" label="合格标准"  property="eligibilityCriteria"></el-table-column>
          <el-table-column align="center" label="复核时效"  property="reviewTimeLimit"></el-table-column>
          <el-table-column label="操作"  align="center" header-align="center">
            <template v-slot="scope">
              <el-button-group>
                <el-button type="primary" icon="Edit"   @click="handleEdit(scope.row)"></el-button>
                <el-button type="danger"  icon="Delete" @click="handleItemDeleteDict(scope.row)"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
                @pagination="getList" />
    <check-item-form-dialog ref="checkItemFormDialogRef"  @refresh="getDataList"></check-item-form-dialog>

  </div>
</template>

<script>
import checkItemFormDialog from './components/checkItemFormDialog.vue'
import Pagination from '@/components/Pagination'

import {deleteWorkContent,  getWorkContent} from "@/api/plan";
import XuiDictionary from "@/components/xui/dictionary/dictionary";

export default {
  name: 'checkItemFormTab',
  components: {XuiDictionary, checkItemFormDialog,Pagination},
  data() {
    return {
      data: JSON.parse(this.$route.query.row),
      total:0,
      checkItem: {},
      entity: {},
      dataList: [],
      hidden:false,
      listQuery:{
        stepId:'',
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
      },
      tableData:[]
    }
  },
  watch: {
    //监听到路由（参数）改变
    '$route'(val, from) {
      // 拿到目标参数 val.query.id 去请求接口
      this.getDataList()
    }
  },
  mounted() {
    if (this.data){
      this.listQuery.stepId = this.data.id
      this.hidden = true
    }
    this.getDataList();
  },
  methods: {
    init() {
      this.getDataList();
      this.dialogVisible = true;
    },
    handleSearch(){
      this.listQuery.pg_pagenum = 1
      this.getDataList();
    },
    handleAdd(){
      this.$refs.checkItemFormDialogRef.init(this.data,this.tableData,null);
    },
    getDataList() {
      this.tableData = []
      getWorkContent(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
        this.tableData.forEach(item=>{
          item.allName = item.operationName
          if(this.$constants.isNotEmpty(item.dependentOperation)){
            this.setRelyPropertyAttr(this.tableData, item);
          }

        })
      })
    },
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.getDataList() // 查询
    },

    handleEdit(row){
      this.$refs.checkItemFormDialogRef.init(this.data,this.tableData,row);
    },
    handleItemDeleteDict(row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorkContent({
          id: row.id
        }).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    setRelyPropertyAttr(dataList, data){
      dataList.some(item=>{
        if(item.id === data.dependentOperation){
          data.reOperationName = item.operationName;
          data.reDictionaryCode = item.dictionaryCode;
          return true;
        }else{
          return false;
        }
      })
    },

    initData(stepId) {
      console.log(stepId)
      let temp = stepId ==null ?'':stepId.id
      getWorkContent({
        stepId: temp,
        stepCode: '',
        stepName:'',
        pg_pagenum: 1,
        pg_pagesize: 10
      }).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
  }
}
</script>

<style scoped>

</style>
