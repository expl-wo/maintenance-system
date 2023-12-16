<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="关键字">
        <el-input v-model="listQuery.keyWord" placeholder="生产号/图号/项目名称" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="是否绑定" size="mini">
          <el-select v-model="listQuery.processPlanSource" size="mini" placeholder="是否绑定mes工艺模板"
                     style="width: 170px;" clearable>
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="onQuery">查询</el-button>
        </el-form-item>
        <el-form-item label="" size="mini">
          <el-select v-model="scheduleParam.planId" placeholder="请选择工艺计划" style="width: 140px;" clearable>
            <el-option v-for="item in processPlanList" :key="item.id" :label="item.pName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="success" @click="bindFront">绑定</el-button>
        </el-form-item>
      </el-form>
      <el-table stripe ref="tableRef" height="400" highlight-current-row border :data="dataList"
                style="font-size: 0.7rem"
      >
        <el-table-column header-align="center" align="center" type="selection" fixed width="40" property="selection"
        ></el-table-column>
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
          <template #default="scope">
            {{ numFilter(scope.row.noTaxAmount) }}
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
          <template #default="scope">
            {{ timeTranslate(scope.row.delivery) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="factoryStorageDate"
          align="center"
          label="厂内完成时间"
          min-width="10%"
        >
          <template #default="scope">
            {{ timeTranslate(scope.row.factoryStorageDate) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="processPlanSource"
          align="center"
          label="工艺计划来源"
          min-width="15%"
        >
        <template #default="scope">
          <xui-dictionary itemCode="processPlanSource" :code="scope.row.processPlanSource"></xui-dictionary>
        </template>
        </el-table-column>
        <el-table-column
          prop="processPlanName"
          align="center"
          label="工艺模板名称"
          min-width="15%"
        />
        <el-table-column
          prop="limitName"
          align="center"
          label="期量"
          min-width="15%"
        />
      </el-table>
      <el-pagination
        :current-page="listQuery.pg_pagenum"
        :page-sizes="[10, 20, 50,100]"
        :page-size="listQuery.pg_pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog title="绑定原因" v-model="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
        <el-form :model="scheduleParam">
          <el-form-item label="原因" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="scheduleParam.reason" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false;bind()">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import planWeek from '@/api/plan/planWeek'
import XuiDictionary from '@/components/xui/dictionary/dictionary.vue'
export default {
  name: "ps_022_bandMesProcessPlan",
  components: {XuiDictionary},
  data() {
    return {
      total: 0, // 列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        processPlanSource: "0",//是否绑定
        keyWord: null
      },
      scheduleParam: {
        "planId": "",
        "reason": ""
      },
      dataList: [],
      processPlanList : [],
      dialogFormVisible:false,
      checkboxData: [], // 表格选中哪条(主表)
      formLabelWidth:'100px',
    };
  },
  mounted() {
    this.onQuery(); // 查询
    this.getProcess(); // 工艺计划获取
  },
  methods: {
    onQuery() {
      this.dataList = [];
      planWeek.getOrderList(this.getParams()).then(response => {
        this.dataList = response.data;
        this.total = response.total_count;
      });
    },
    getParams() {
      return {
        ...this.listQuery,
        processPlanSource: parseInt(this.listQuery.processPlanSource),
      };
    },
    // 工艺计划查询
    getProcess() {
      planWeek.getMesProcessList().then(res => {
        this.processPlanList = res.data;
      });
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val;
      this.getDataList(); // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val;
      this.getDataList(); // 查询
    },
    bindFront(){
      this.checkboxData = this.$refs.tableRef.getSelectionRows();
      if(this.scheduleParam.planId.length == 0 || this.scheduleParam.planId.length == ''){
        this.$message({ type: 'warning', message: '请选择要使用的工艺计划！' })
        return
      }
      this.dialogFormVisible = true
    },
    bind(){
      if(this.scheduleParam.reason.length == 0 || this.scheduleParam.reason == "" || this.scheduleParam.reason == null){
        this.$message({ type: 'warning', message: '绑定原因不能为空' })
        return
      }
      const req = []
      this.checkboxData.forEach(item =>{
        req.push(item.id)
      })
      planWeek.bindProcessPlan({ids: req , planId : this.scheduleParam.planId,reason:this.scheduleParam.reason}).then(res=>{
        this.$message({ message: res.data, type: 'success' })
        this.checkboxData = []
        this.scheduleParam.reason = ""
        this.onQuery()
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
    }
  }
};
</script>

<style scoped>

</style>
