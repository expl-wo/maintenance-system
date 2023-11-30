<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon hasLegend">
      <el-form
        ref="searchQuery"
        :inline="true"
        :model="searchQuery"
        style="margin-bottom: 4px;"
        class="demo-form-inline demo-form-zdy"
      >
        <el-form-item label="生产号:" size="small" prop="model">
          <el-input v-model="searchQuery.productNo" placeholder="生产号" @keyup.native="queryTableDataParam"
                    style="width: 180px;" class="filter-item" size="mini">
          </el-input>
        </el-form-item>
        <el-button icon="Search"  size="small" @click="queryTableDataParam">查询</el-button>
      </el-form>
    </div>
    <addProductDialog ref="addProductDialog" @refresh="queryTableDataParam"></addProductDialog>
    <addDismantlProductDialog ref="addDismantlProductDialog" @refresh="queryTableDataParam"></addDismantlProductDialog>
    <el-table stripe
              :data="tableData"
              ref="tableDataRef"
              style="width: 100%;margin-bottom: 20px;"
              border
              highlight-current-row
              v-loading="loadingData"
              height="100%"
    >
      <el-table-column align="center" label="操作" width="70">
        <template #default="scope">
          <el-button size="small" type="primary" v-if="$isAuth('0406Experiment.entry')||$isAuth('0407dismantlePlan.entry')"
                     @click="addToNodeInfo(scope.row)">加入
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="productNo" label="生产号" align="center" width="135"></el-table-column>
      <el-table-column prop="model" label="型号" align="center" width="105"></el-table-column>
      <el-table-column prop="outPut" label="产量（万kVA）" align="center"></el-table-column>
      <el-table-column prop="noTaxAmount" label="产值（万元）" align="center"></el-table-column>
    </el-table>
    <xui-pagination :total="total" :page="pageNum" :limit="pageSize" :layout="'total,prev, pager, next'"
                    @pagination="handlePagination" class="searchCon wp" />

  </div>
</template>

<script>
import planWeekHttp from "@/api/plan/planWeek";
import addProductDialog from "./dialog/addProductDialog.vue";
import addDismantlProductDialog from "@/views/ps/planDismantle/dialog/addProductDialog.vue";

export default {
  name: "optionalProduct",

  components: {
    addProductDialog,
    addDismantlProductDialog,
  },
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      loadingData: true,
      isApproval: this.$constants.flag.n,
      plantype: "",
      params: {},
      searchQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 1000, // 查询第几页数据，默认第一页 pg_pagesize
        productNo: ""
      },
      nodeInfo: []
    };
  },
  methods: {
    async initData(isApproval, planType) {
      debugger
      this.isApproval = isApproval;
      this.planType = planType;
      await this.queryTableDataParam();
    },
    getParams() {
      let params = {
        productNo: this.searchQuery.productNo,
        planType: this.planType
      };
      this.params = params;
      return true;
    },
    queryTableDataParam() {
      let flag = this.getParams();
      if (!flag) {
        return;
      }
      this.queryTableData();
    },
    queryTableData() {
      planWeekHttp.optionalProduct(this.params).then(res => {
        this.tableData = res.data;
        this.total = res.total_count;
        this.loadingData = false;
      });
    },
    handlePagination({ page, limit }) {
      this.pageNum = page;
      this.pageSize = limit;
      let params = {
        productNo: this.searchQuery.productNo,
        planType: this.planType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      this.params = params;
      this.queryTableData();
    },
    addToNodeInfo(rowData) {
      debugger
      if(this.planType ==='experiment'){
        this.$refs.addProductDialog.initData(rowData, this.$constants.flag01.y, this.isApproval);
      }else{
        this.$refs.addDismantlProductDialog.initData(rowData, this.$constants.flag01.y, this.isApproval);
      }
    }
  }
};
</script>

<style scoped>
</style>
