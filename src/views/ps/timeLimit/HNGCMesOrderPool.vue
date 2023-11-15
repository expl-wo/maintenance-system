<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="关键字" size="mini">
          <el-input v-model="listQuery.keyWord" placeholder="生产号/图号/项目名称" style="width: 180px;" class="filter-item" size="mini" clearable/>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="onQuery">查询</el-button>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Edit" @click="handSyn" >手动同步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-if="mesOrderShow"
      :data="tableData"
      :border="true"
      header-cell-class-name="bgblue"
      style="width: 100%"
      stripe
      row-key="id"
      height="700"
    >
      <el-table-column
        prop="index"
        label="序号"
        align="center"
        min-width="5%"
      >
        <template v-slot:default="scope">
          <span>{{ (scope.$index + 1) }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="productNo"
        label="生产号"
        align="center"
        min-width="15%"
      />
      <el-table-column
        prop="productModel"
        align="center"
        label="型号"
        min-width="15%"
      />
      <el-table-column
        prop="drawingNo"
        align="center"
        label="图号"
        min-width="5%"
      />
      <el-table-column
        prop="quantity"
        align="center"
        label="台量"
        min-width="5%"
      />
      <el-table-column
        prop="customerName"
        align="center"
        label="用户单位"
        min-width="15%"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="不含税产值"
        property="noTaxAmount"
        width="150"
      >
        <template v-slot="scope">
          {{numFilter(scope.row.noTaxAmount)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="outPut"
        align="center"
        label="产量"
        min-width="5%"
      />
      <el-table-column
        prop="delivery"
        align="center"
        label="交货期"
        min-width="5%"
      >
        <template v-slot="scope">
          {{timeTranslate(scope.row.delivery)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="factoryStorageDate"
        align="center"
        label="厂内完成时间"
        min-width="10%"
      >
        <template v-slot="scope">
          {{timeTranslate(scope.row.factoryStorageDate)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="limitName"
        align="center"
        label="期量"
        min-width="15%"
      />
    </el-table>
    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
                @pagination="getList" />

  <el-dialog v-dialogDrag  :close-on-click-modal="false" title="手动同步" v-model="dialogVisible" @close="dialogClose" width="1200">
    <el-form :inline="true" :model="handQuery" class="demo-form-inline demo-form-zdy">
      <el-form-item label="数据来源:" size="mini" prop="nodeType">
        <el-select v-model="handQuery.isOrder" placeholder="请选择节点类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="生产号" size="mini">
        <el-input v-model="handQuery.productNo" placeholder="生产号" style="width: 180px;" class="filter-item" size="mini" clearable/>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" icon="Search" @click="getToMesOrder">查询</el-button>
      </el-form-item>
      <el-form-item size="mini">
      </el-form-item>
    </el-form>
    <el-table
      v-if="toMesOrderShow"
      :data="toMesOrderData"
      :border="true"
      header-cell-class-name="bgblue"
      style="width: 100%"
      stripe
      row-key="id"
      height="500"
    >
      <el-table-column
        prop="index"
        label="序号"
        align="center"
        min-width="5%"
      >
        <template v-slot:default="scope">
          <span>{{ (scope.$index + 1) }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="productNo"
        label="生产号"
        align="center"
        min-width="10%"
      />
      <el-table-column
        prop="productModel"
        align="center"
        label="型号"
        min-width="15%"
      />
      <el-table-column
        prop="drawingNo"
        align="center"
        label="图号"
        min-width="15%"
      />
      <el-table-column
        prop="quantity"
        align="center"
        label="台量"
        min-width="8%"
      />
      <el-table-column
        prop="customerName"
        align="center"
        label="用户单位"
        min-width="20%"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="不含税产值"
        property="noTaxAmount"
        width="140"
      >
        <template v-slot="scope">
          {{numFilter(scope.row.noTaxAmount)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="outPut"
        align="center"
        label="产量"
        min-width="8%"
      />
      <el-table-column
        prop="projectName"
        align="center"
        label="项目名称"
        min-width="20%"
      />
      <el-table-column
        prop="limitName"
        align="center"
        label="期量"
        min-width="10%"
      />
      <el-table-column
        prop="remarks"
        align="center"
        label="备注"
        min-width="8%"
      />
      <el-table-column
        min-width="10%"
        align="center"
        label="操作"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            plain
            type="warning"
            @click="toMesOrder(scope.row)"
          >同步
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="handQuery.pagenum"
      :page-sizes="[100, 200, 500]"
      :page-size="handQuery.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="toMesOrderTotal"
      @size-change="handleSizeChange()"
      @current-change="handleCurrentChange()"
    />
  </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { ElMessage } from "element-plus";
  import { queryHNGCMesOrderList, queryHandToMesOrder, toMesOrder } from '@/api/timeLimit';
export default {
  name: 'HBMesOrderPool',
  components: {Pagination},
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        keyWord: null
      },
      tableData: [],
      loadingData: true,
      rowHeader: [],
      toMesRowHeader: [],
      dialogVisible: false,
      productNo: null,
      handQuery: { // 查询条件
        pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        productNo: null,
        isOrder: true,
      },
      toMesOrderData: [],
      toMesOrderTotal: 0,
      options: [{
        value: true,
        label: 'ERP工单'
       }, {
        value: false,
        label: 'ERP销售合同'
       }],
       mesOrderShow: true,
       toMesOrderShow: false,
    }
  },
  mounted() {
    this.onload();
  },
  computed:{
      isOrder(){
          return this.handQuery.isOrder
      }
  },
  watch:{
    isOrder:function(newValue, oldValue){
      this.getToMesOrder();
    }
  },
  methods: {
    onload() {
      this.onQuery(); // 查询
    },
    onQuery(){
      queryHNGCMesOrderList(this.listQuery).then(res=>{
        this.tableData = res.data;
        this.total = res.total_count;
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
    getToMesOrder(){
      queryHandToMesOrder(this.handQuery).then(res=>{
          this.toMesOrderData = res.data;
          this.toMesOrderTotal = res.total_count;
      })
    },
    handSyn(){
      this.dialogVisible = true;
      this.mesOrderShow = false;
      this.toMesOrderShow = true;
      this.getToMesOrder();
    },
    dialogClose(){
      this.mesOrderShow = true;
      this.toMesOrderShow = false;
      this.onQuery();
    },
    toMesOrder(row){
      toMesOrder({"productNo": row.productNo,"isOrder":this.handQuery.isOrder}).then(res=>{
        if(res.err_code===10000){
          this.$message.success("同步成功！");
          this.getToMesOrder();
        } else this.$message.error("同步失败"+res.err_msg);
      })
    },
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let tempVal = parseFloat(value).toFixed(3);
      let realVal = tempVal.substring(0, tempVal.length - 1);
      return realVal;
    },
    timeTranslate(dateValue) {
      var date = dateValue ? new Date(dateValue) : new Date()
      var seperator1 = '-'
      var seperator2 = ':'
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      //     + " " + date.getHours() + seperator2 + date.getMinutes()
      //     + seperator2 + date.getSeconds();
      return currentdate
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.handQuery.pg_pagesize = val;
      this.getToMesOrder(); // 查询
    },
    handleCurrentChange(val) {
      this.handQuery.pg_pagenum = val;
      this.getToMesOrder(); // 查询
    },
  },
}
</script>

<style lang="scss">
.line{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}

</style>
