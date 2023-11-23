<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="炉号" size="mini">
          <el-input v-model="listQuery.dryingTankCode" @keyup.enter.native="handleSearch"
                    class="filter-item" clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="干燥方式" size="mini">
          <xui-dict-select v-model="listQuery.dryingMethod" item-code="dryingMethod" size="mini"
                           class="filter-item" clearable
          ></xui-dict-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button @click="handleSearch"  icon="Search" size="mini">查询</el-button>
          <el-button type="primary"  icon="Plus"  @click="handleAdd" size="mini">新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container app-containerC">
      <div class="otherCon wp">
        <el-table stripe  ref="tableRef" :height="'100%'" highlight-current-row border :data="dataList"
                  style="font-size: 0.7rem"
        >
        <!--  <el-table-column
            header-align="center"
            align="center"
            type="selection"
            fixed
            width="45"
          >
          </el-table-column>-->
          <el-table-column
            header-align="center"
            align="center"
            label="炉号"
            property="dryingTankCode"
            fixed
            width="100"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="序号"
            property="serialNumber"
            fixed
            width="70"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="设备编码"
            property="equipmentCode"
            fixed
            width="70"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="设备名称"
            property="equipmentName"
            fixed
            width="160"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="分类"
            property="classification"
            fixed
            width="90"
          >
            <template v-slot="scope">
              <xui-dictionary itemCode="dryingClassification" :code="scope.row.classification"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="干燥方式"
            fixed
            property="dryingMethod"
            width="90"
          >
            <template v-slot="scope">
              <xui-dictionary itemCode="dryingMethod" :code="scope.row.dryingMethod"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="平车长(M)"
            property="flatcarLength"
            width="100"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="平车宽(M)"
            property="flatcarWidth"
            width="100"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="罐体长(M)"
            property="tankLength"
            width="100"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="罐体宽(M)"
            property="tankWidth"
            width="100"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="高(M)"
            property="height"
            width="90"
          >
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="所在车间"
            property="workshopName"
            width="120"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="干燥班组"
            property="teamName"
            width="120"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="气相干燥费用(元/h)"
            property="gasphaseCost"
            width="150"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="传统干燥费用(元/h)"
            property="traditionalCost"
            width="150"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="试验场所"
            property="testSite"
          >
          </el-table-column>
          <el-table-column label="操作" align="center"  fixed="right">
            <template v-slot="scope">
              <el-button-group>
                <el-button  type="primary" size="mini" icon="Edit"
                            @click="handleEdit(scope.row)">
                </el-button>
                <el-button type="danger" size="mini" icon="Delete"
                           @click="handleDelete(scope.row)">
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination" class="searchCon wp"/>
    </div>
    <add-or-update-dialog @refresh="handleSearch" ref="addOrUpdateDialogRef"></add-or-update-dialog>
  </div>
</template>

<script>
import dryingManage from '@/api/plan/dryingManage'
import Pagination from '@/components/Pagination/index.vue'
import addOrUpdateDialog from '@/views/ps/baseData/dryingManage/addOrUpdate/addOrUpdateDialog.vue'
import deleteMainConf from '@/api/eqpCheck'
import Constants from "../../../../utils/constants";

export default {
  name: 'index',
  components: {
    Pagination,
    addOrUpdateDialog
  },
  data() {
    return {
      dataList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      listQuery: {
        dryingTankCode: '',
        dryingMethod: ''
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      let params = this.getParams()
      dryingManage.findAllDryingTank(params).then(response => {
        if (response.err_code === Constants.statusCode.success) {
          this.dataList = response.data
          this.total = response.total_count
        } else {
          this.$message.error(response.err_msg)
        }
      })
    },
    //新增
    handleAdd(){
      this.$refs.addOrUpdateDialogRef.init();
    },
    handleEdit(rowData){
      this.$refs.addOrUpdateDialogRef.init(rowData);
    },
    handleDelete(rowData){
      this.$confirm(Constants.deleteTip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          dryingManage.deleteDryingTank({ id: rowData.id}).then(response => {
          this.$message.success( '删除成功');
          this.handleSearch()
        })
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.getDataList()
    },
    getParams() {
      return {
        ...this.listQuery,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
    },
    handlePagination({ page, limit }) {
      this.pageNum = page
      this.pageSize = limit
      this.getDataList()
    }
  }
}
</script>

<style scoped>

</style>
