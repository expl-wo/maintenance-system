<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-button @click="handleAdd"  type="primary">新增</el-button>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
                  style="font-size: 0.7rem">
        <el-table-column prop="craftsName" align="center" label="子工艺模板头名称" />

        <el-table-column prop="isOntology" align="center" width="100" label="是否本体">
          <template v-slot="{row}">
            <div v-if="row.isOntology == 0">否</div>
            <div v-if="row.isOntology == 1">是</div>
          </template>
        </el-table-column>
        <el-table-column prop="standardWorkingHour" align="center" label="标准工时" />
        <el-table-column header-align="center" align="center" width="120" label="操作">
          <template v-slot="scope">
            <el-button-group>
              <el-button size="mini" title="删除" type="danger" icon="Delete"
                         @click="handleDelete(scope.row)" />
            </el-button-group>
          </template>
        </el-table-column>
        </el-table>
      <pagination :total="total" :page ="listItemUpdate.pg_pagenum" :limit="listItemUpdate.pg_pagesize" class="searchCon"
                  @pagination="getList"
      />
    </div>
      <el-dialog v-dialogDrag  appendToBody :title="listItemUpdate.id? '编辑': '新增'"
               v-model="dialogVisible" modal width="600">
      <el-form :model="listItemUpdate" class="element-list" ref="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="craftsCode" label="子工艺模板头编码" >
              <el-input v-model="listItemUpdate.craftsCode" placeholder="请输入子工艺模板头编码" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 子工艺模板头名称:" prop="craftsName" >
              <el-input v-model="listItemUpdate.craftsName" placeholder="请输入子工艺模板头名称" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 是否本体:" prop="isOntology">
              <el-switch v-model="listItemUpdate.isOntology" active-value='1' inactive-value='0' active-color="#13ce66"
                         inactive-color="#808080" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="标准工时:" prop="standardWorkingHour" >
              <el-input v-model="listItemUpdate.standardWorkingHour" placeholder="请输入标准工时" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button size="mini" type="primary" @click="saveItemData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Constants from "../../../../utils/constants";
import {queryListCrafts, deleteProcessCrafts, insertPLMProcessCrafts} from "@/api/plan";
import Pagination from "@/components/Pagination/index";

export default {
  components: {Pagination},
  data() {
    return {
      total: 0,
      dataList: [],
      dialogVisible: false,
      listItemUpdate: { // 数据
        id: '', //PLM工序子工艺模板头ID
        type: null, //
        gxUid: '', //PLM工序编码
        gxName: '', //PLM工序名称
        standardWorkingHour: '', //标准工时
        craftsCode: '', //子工艺模板头编码
        craftsName: '', //子工艺模板头名称
        isOntology: '0', //是否本体
        needRate:'',//是否需要打等级
        isEnd:'',//是否最后一道工序
        percentage: '', //百分比
         pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
         pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
      },
      rules:{
        craftsCode: [{
          required: true, trigger: 'blur',message: '子工艺模板头编码不能为空'
        }],
        craftsName: [{
          required: true,trigger: 'blur', message: '子工艺模板头编码不能为空'
        }],
      },
     tableData:[]
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    handleAdd(){

    this.listItemUpdate,
      this.$nextTick(()=>{
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      })
      this.dialogVisible  = true;
    },
    //获取
    getDataList() {
        this.tableData = []
        queryListCrafts(this.listItemUpdate).then(response => {
          this.tableData = response.data
          this.total = response.total_count
        })

    },
    getList(val) {
      this.listItemUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listItemUpdate.pg_pagesize = val.limit
      }
      this.getDataList() // 查询
    },
    // 保存
    saveItemData() {
      this.dialogVisible = false;
      let params = {
        craftsCode: this.listItemUpdate.craftsCode,
        craftsName: this.listItemUpdate.craftsName,
        isOntology: this.listItemUpdate.isOntology,
        isEnd: this.listItemUpdate.isEnd,
        needRate: this.listItemUpdate.needRate,
        percentage:this.listItemUpdate.percentage,
        standardWorkingHour: this.listItemUpdate.standardWorkingHour,
      }
      insertPLMProcessCrafts(params).then(response => {
        this.$message({
          message: "新增成功",
          type: 'success'
        })
        this.getDataList()
      })
    },
    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        deleteProcessCrafts({
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
          this.getDataList()
        })
      })
    },
    initData() {
      // this.timeLimitId = data.id;
     queryListCrafts({
        craftsCode: '',
        craftsName: '',
        pageNum: 1,
        pageSize: 10
      }).then(response => {
        this.dataList = response.data.map(item => {
          return {
            k: item.craftsCode,
            v: item.craftsName
          }
        })
        this.getDataList()
      })
    },
  }
}
</script>

<style scoped>

</style>
