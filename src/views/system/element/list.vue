<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="参数编码" >
          <el-input v-model="listQuery.code" @keyup.enter.native="handleSearch"
                    class="filter-item" clearable
          ></el-input>
        </el-form-item>
        <el-form-item >
          <el-button @click="handleSearch"  icon="Search" >查询</el-button>
          <el-button type="primary"  icon="Plus"  @click="handleAdd" >新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container app-containerC">
      <div class="otherCon wp">
        <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
          style="font-size: 0.7rem">
          <el-table-column header-align="center" align="center" label="参数编码" property="code" width="400">
          </el-table-column>
          <el-table-column header-align="center" align="center" label="参数名称" property="name">
          </el-table-column>
          <el-table-column header-align="center" align="center" label="参数值" property="value">
          </el-table-column>
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
      <pagination :total="total" :page ="pageNum" :limit="pageSize" class="searchCon"
                  @pagination="getList"
      />
    </div>
    <add-or-update-dialog @refresh="handleSearch" ref="addOrUpdateDialogRef"></add-or-update-dialog>
  </div>
</template>

<script>
import { deleteElement, pageList} from '@/api/sys/element'
import addOrUpdateDialog from '@/views/system/element/addOrUpdateDialog'
import Pagination from "@/components/Pagination/index";



export default {
  name: 'list',
  components: {
    addOrUpdateDialog,Pagination
  },
  data() {
    return {
      dataList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      listQuery: {
        code: '',
        name:'',
        remark:'',
        value:'',
      },
      tableData :[]
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.tableData = []
      pageList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })

    },

    //新增
    handleAdd(){
      this.$refs.addOrUpdateDialogRef.init();
    },
    handleEdit(rowData){
      this.$refs.addOrUpdateDialogRef.init(rowData);
    },
    handleDelete(rowData) {
      let Constants;
      this.$confirm(Constants.deleteTip).then(() => {
        deleteElement({
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
    handleSearch() {
      this.pageNum = 1
      this.getDataList()
    },
    getList(val) {
      this.pageNum = val.page
      if (val.limit) {
        this.pageSize = val.limit
      }
      this.getDataList() // 查询
    },
  }
}
</script>

<style scoped>

</style>
