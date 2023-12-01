<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="工步名称" >
          <el-input v-model="listQuery.craftsDeName" placeholder="输入工步名称" style="width: 180px;" class="filter-item"
                    clearable />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="onBtnQuery">查询</el-button>
          <el-button type="primary"  icon="Plus"  @click="handleAdd" >新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe   :data="tableData" class="otherCon wp"    style="width: 100%;font-size:0.7rem;" row-key="id">
      <el-table-column prop="craftsDeCode" align="center" label="工步编码" />
      <el-table-column prop="craftsDeName" align="center" label="工步名称" />
      <el-table-column prop="standardWorkingHour" align="center" label="标准工时" />
      <el-table-column label="操作" width="300" align="center">
        <template v-slot="scope">
          <el-button-group>
            <el-button type="primary" icon="Edit"
                       @click="handleEdit(scope.row)"
            >
            </el-button>
            <el-button type="danger"  icon="Delete"
                       @click="handleItemDeleteDict(scope.row)"
            >
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
                @pagination="getList" />
    <template-form-dialog @refresh="onBtnQuery" ref="templateFromDialogRef"></template-form-dialog>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import {findAllCraftsDe,deleteProcessCraftsDe} from '@/api/plan'
import templateFormDialog from "@/views/ps/baseData/ps50WorkContent/components/templateFormDialog";
export default {
  components: {Pagination,templateFormDialog},
  data() {
    return {
      total: 0, // 总个数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        craftsDeCode:'',
        craftsDeName:'',
        standardWorkingHour: '', //标准工时
      },
      tableData: [], // plm工序数据集合
    }
  },
  mounted() {
    this.onQuery();
  },
  methods: {
    //查询按钮响应
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询关键节点数据（第一层）,identifier为delete时，为删除调用。其他时候没有特殊限制
    onQuery(identifier) {
      this.tableData = []
      findAllCraftsDe(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
        // this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
        // this.expands = []
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
      this.$refs.templateFromDialogRef.init();
    },
    handleEdit(rowData){
      this.$refs.templateFromDialogRef.init(rowData);
    },

    // 删除子模板行
    handleItemDeleteDict(row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProcessCraftsDe({
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
  }
}
</script>
