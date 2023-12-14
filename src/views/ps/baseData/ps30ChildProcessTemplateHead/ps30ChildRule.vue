<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-form :inline="true" :model="tableData" class="demo-form-inline demo-form-zdy">
        <el-form-item label="标准工序名称" >
          <el-input v-model="listQueryPlm.gxName" placeholder="请输入标准工序名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp"  >
      <div class="otherCon wp xui-table__highlight">
        <el-table ref="tableRef" :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="500" @row-click="handleClick">
          <el-table-column prop="gxUid" align="center" label="标准工序编码" />
          <el-table-column prop="gxName" align="center" label="标准工序名称" />
          <el-table-column header-align="center" align="center" width="120" label="操作">
            <template v-slot="scope">
              <el-button-group>
                <el-button  title="编辑" type="primary" icon="Edit"
                            @click="handEdit(scope.row)" />
                <el-button  title="删除" type="danger" icon="Delete"
                            @click="handleDelete(scope.row)" />
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :total="total" :page ="listQueryPlm.pg_pagenum" :limit="listQueryPlm.pg_pagesize" class="searchCon"
                  @pagination="getList"
      />
    </div>
    <el-dialog draggable  appendToBody :title="listQuery.id? '编辑': '新增'"
               v-model="dialogVisible" modal width="600">
      <el-form :model="listQuery" class="element-list" ref="form"  label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 标准工序编码:" prop="craftsName" >
              <el-input v-model="listQuery.gxUid" placeholder="请输入标准工序编码" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="标准工序名称:" prop="gxName" >
              <el-input v-model="listQuery.gxName" placeholder="请输入标准工序名称" style="width: 350px;"
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
import { saveGx,deleteGx, queryProduces} from '@/api/plan'
import Pagination from "@/components/Pagination/index";
import ps30ChildRuleItem from "@/views/ps/baseData/ps30ChildProcessTemplateHead/ps30ChildRuleItem";
import Constants from "@/utils/constants";

export default {
  components: {Pagination,ps30ChildRuleItem},
  name: 'ps30ChildRule',


  data() {
    return {
      dialogVisible: false,
      dataList: [],
      total: 0,
      listQuery:{
        gxUid:'',
        gxName:'',
        id:''
      },
      listQueryPlm: { // 查询条件
        id:'',
        name: '', //节点基础数据名称
        workshopId: '', //车间ID
        workshopName: '', //车间名称
        type: null, //节点类型
        gxUid: '', //标准工序识别号
        gxName: '', //工序名称
        standardtime: '', //标准工时
        erpGxId: '', //对应的ERP工序id
        erpGxName: '', //对应的ERP工序名称
        node_id: '', //对应的HB-MES生产关键工序节点基础数据ID
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

    getDataList() {
      this.tableData = []
      queryProduces(this.listQueryPlm).then(response => {
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

    handleSearch() {
      this.listQueryPlm.pg_pagenum = 1
      this.getDataList()
    },
    getList(val) {
      this.listQueryPlm.pg_pagenum = val.page
      if (val.limit) {
        this.listQueryPlm.pg_pagesize = val.limit
      }
      this.getDataList() // 查询
    },


    handleAdd() {
      this.listQuery = {
        gxUid: '',
        gxName: '',
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
    },
    handEdit(row){
      this.dialogVisible = true
       this.listQuery.id = row.id
      this.listQuery.gxUid = row.gxUid
      this.listQuery.gxName = row.gxName
    },

    saveItemData() {
      this.dialogVisible = false;
      let params = {
          id:this.listQuery.id,
          gxUid: this.listQuery.gxUid,
          gxName: this.listQuery.gxName
      }
      saveGx(params).then(response => {
        this.$message({
          message: "新增成功",
          type: 'success'
        })
        this.getDataList()
      })
    },
    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        deleteGx({
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

  }
}
</script>

<style scoped>
</style>
