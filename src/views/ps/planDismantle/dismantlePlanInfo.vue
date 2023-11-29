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
        <el-form-item label="生产号:" size="mini" prop="model">
          <el-input v-model="searchQuery.productNo" placeholder="生产号" @keyup.enter.native="queryTableDataParam" style="width: 180px;" class="filter-item" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="计划开始时间:" size="mini">
          <el-date-picker
            v-model="searchQuery.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            @change="queryTableDataParam"
          ></el-date-picker>
        </el-form-item>
        <el-button icon="Search" size="mini" v-if="$isAuth('0407dismantlePlan.search')" @click="queryTableDataParam">查询</el-button>
        <el-button type="primary" icon="Coordinate" size="mini" v-if="$isAuth('0407dismantlePlan.approval')" @click="handleApply">提交审批</el-button>
        <el-button type="danger" icon="Delete" size="mini"  v-if="$isAuth('0407dismantlePlan.delete')" @click="handleDelete">取消计划</el-button>
        <el-button type="success" icon="SuccessFilled" size="mini" v-if="isApproval === 1" @click="handlePass">审批通过</el-button>
        <el-button type="warning" icon="CircleCloseFilled" size="mini" v-if="isApproval === 1" @click="handleReject">审批驳回</el-button>
      </el-form>
    </div>

    <el-table stripe
      :data="tableData"
      ref="tableDataRef"
      style="width: 100%;margin-bottom: 20px;"
      border
      highlight-current-row
      v-loading="loadingData"
      @selection-change="selectChange"
      :height="'100%'"
              :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @cell-click="handleCellClick"
    >
      <el-table-column align="center" type="selection" :selectable="checkBoxT" width="40"></el-table-column>
      <el-table-column align="center" label="操作" width="70">
        <template v-slot="scope">
          <el-button size="mini" type="primary" v-if="scope.row.id && $isAuth('0407dismantlePlan.editTime')" @click="editPlan(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="confirmStatus" label="状态" align="center" width="50">
        <template v-slot="scope">
          <span v-if="scope.row.confirmStatus==1" :class="statusClass(scope.row.confirmStatus)">预排</span>
          <span v-if="scope.row.confirmStatus==2" :class="statusClass(scope.row.confirmStatus)">待审</span>
          <span v-if="scope.row.confirmStatus==3">通过</span>
        </template>
      </el-table-column>
      <el-table-column prop="productNo" label="生产号" align="center" width="135"></el-table-column>
      <el-table-column prop="model" label="型号" align="center"></el-table-column>
      <el-table-column prop="planStartTime" label="计划开始时间" align="center" width="100" :sortable="true" :sort-method="dateSortMethod"></el-table-column>
      <el-table-column prop="planEndTime" label="计划结束时间" align="center" width="100"></el-table-column>
      <el-table-column prop="tentativePhase" label="计划员排产时间" align="center" width="100" :sortable="true" :sort-method="dateSortMethod"></el-table-column>
      <el-table-column prop="noTaxAmount" label="产值(万元)" align="center" width="90"></el-table-column>
      <el-table-column prop="outPut" label="产量(万kVA)" align="center" width="90"></el-table-column>
    </el-table>

    <rejectPlanDialog ref="RejectPlanDialog" @refresh="queryTableDataParam"></rejectPlanDialog>
    <addProductDialog ref="addProductDialog" @refresh="queryTableDataParam"></addProductDialog>
  </div>
</template>

<script>
import planWeek from '@/api/plan/planWeek'
import RejectPlanDialog from "./dialog/rejectPlanDialog.vue";
import AddProductDialog from "./dialog/addProductDialog.vue";
import moment from "moment";
const propertyClassFromDict = ['designSource', 'importmentLevel', 'urgentLevel', 'processStatus','nodeWeekStatus']
const frozenDesc = '冻结'

export default {
  name: 'planInfo',

  components:{
    RejectPlanDialog,
    AddProductDialog,
  },
  data() {
    return {
      tableData: [],
      loadingData: true,
      selectList: [],
      isApproval:this.$constants.flag01.n,
      params: {},
      searchQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 1000, // 查询第几页数据，默认第一页 pg_pagesize
        productNo:'',
        dateRange: '',
        sortedBy:'',
      },
      laminationTables:[],
      planType: 'dismantle',
    }
  },
  created(){
    this.$emit('queryRightData',() => {
      this.queryTableDataParam()
    })
  },
  methods: {
    async initData(isApproval) {
      this.isApproval = isApproval
      await this.queryTableDataParam()
    },
    getParams(){
      let params = {
        productNo:this.searchQuery.productNo,
        planType:this.planType,
      }
      if(this.searchQuery.dateRange != null){
        params.startDate=this.searchQuery.dateRange[0]==null?null:moment(this.searchQuery.dateRange[0]).format('YYYY-MM-DD')
        params.endDate=this.searchQuery.dateRange[1]==null?null:moment(this.searchQuery.dateRange[1]).format('YYYY-MM-DD')
      }
      this.params = params;
      return true;
    },
    queryTableDataParam() {
      let flag = this.getParams();
      if(!flag){
        return;
      }
      this.queryTableData()
    },
    async queryTableData() {
      let response = await planWeek.getExperimentPlan(this.params)
      this.total = response.total_count;
      this.loadingData = false;
      this.formatSearchData(response.data)
      this.tableData = response.data
    },
    selectChange(selection) {
      this.selectList = selection;
    },
    //获取选中的数据
    getSelectedData(){
      return new Promise((resolve, reject)=>{
        let selectedData = this.$refs.tableDataRef.selection;
        if(!selectedData || selectedData.length === 0){
          this.$message({ message: '请选择要处理的数据', type: 'warning' })
          return resolve([]);
        }
        return resolve(selectedData);
      })
    },
    statusClass(confirmStatus) {
      if (confirmStatus == 1) {
        return 'status-1';
      } else if (confirmStatus == 2) {
        return 'status-0';
      }
      return '';
    },
    checkBoxT(row, rowIndex) {
      if(row.id && row.confirmStatus!==3) {
        return true;
      }else {
        return false;
      }
    },
    isIndex(rowIndex){
      if(rowIndex === 0) {
        return null;
      }else {
        return rowIndex;
      }
    },
    handleApply(){
      this.$confirm('确认全部提交审批？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let nodeId = '23'
        let planId = []
        this.tableData.forEach(item=>{
          if(item.id && item.confirmStatus === 1){
            nodeId = item.nodeId
            planId.push(item.pl14Id)
          }
        })
        planWeek.applyWeekPlan({planId:planId,nodeId:nodeId}).then(res=>{
          if(res.err_code===10000){
            this.queryTableDataParam()
            this.$message.success("申请成功！");
          } else {
            this.$message.error("申请失败："+res.err_msg);
          }
        })
      })
    },
    handlePass(){
      if(this.selectList.length === 0){
        this.$message.error("无可申请的计划");
        return;
      }
      let nodeId = '23'
      let passInfo = []
      debugger
      this.selectList.forEach(item=>{
        nodeId = item.nodeId
        let passPlan = {}
        passPlan.pl14Id = item.pl14Id
        passPlan.isPass = this.$constants.isPass.yes
        passInfo.push(passPlan)
      })
      planWeek.approvalPlan({planType:this.planType,nodeId:nodeId,condition:passInfo,approveStatus:this.$constants.isPass.yes}).then(res=>{
        if(res.err_code===10000){
          this.queryTableDataParam()
          this.$message.success("审批成功！");
        } else {
          this.$message.error("审批失败："+res.err_msg);
        }
      })
    },
    handleReject(){
      if(this.selectList.length === 0){
        this.$message.error("未选择计划进行驳回！");
        return;
      }
      this.$refs.RejectPlanDialog.initData(this.selectList);
    },
    editPlan(rowData){
      this.$refs.addProductDialog.initData(rowData,this.$constants.flag.n,this.isApproval);
    },
    handleDelete(){
      if(this.selectList.length === 0){
        this.$message.error("未选择需删除计划");
        return;
      }
      let delId = []
      this.selectList.forEach(item=>{
        delId.push(item.pl14Id)
      })
      planWeek.delPlan({planType:this.planType,ids:delId}).then(res=>{
        if(res.err_code===10000){
          this.queryTableDataParam()
          this.$message.success("删除成功！");
        } else {
          this.$message.error("删除失败："+res.err_msg);
        }
      })
    },
    tableSortMethod(a, b, sortOrder) {
      if (a.id === null || b.id === null) {
        return 0;
      }
      if (a.tableName < b.tableName) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a.tableName > b.tableName) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    },
    dateSortMethod(a, b, sortOrder) {
      if (a.id === null || b.id === null) {
        return 0;
      }

      const dateA = moment(a.planStartTime);
      const dateB = moment(b.planStartTime);

      if (dateA.isBefore(dateB)) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (dateA.isAfter(dateB)) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    },
    //设置行样式
    tableRowClassName({ row, rowIndex }) {
      if (row.stateName === frozenDesc) {
        return 'trFrozenStatus'
      }
      return ''
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (this.$constants.isEmpty(column.property)) {
        return ''
      }
      let retClass = []

      //不能是冻结行，冻结行不能进行操作，样式也会在已冻结行方法中处理  且为生产主计划页面时
      if (row.stateName === frozenDesc && this.isMainPlanPage) {
        //只能查看列表
        if ( column.property.indexOf('_status') >= 0) {
          retClass.push('pointer-cursor')
        }
        return retClass.join(' ')
      }

      //有以下功能代表可点击
      if(this.isMainPlanPage){
        if (column.property.indexOf('_status') >= 0
          || column.property === 'salesPhase'||(row.isSpecialUser===1&&column.property === 'customerName')) {
          retClass.push('pointer-cursor')
        }
      }

      //加入产品期量、设计来源（PLM）、重点性、紧急性
      //加入的实际进度
      try {
        if (column.property.indexOf('_status') >= 0) {
          if (this.$constants.isNotEmpty(row[column.property])) {
            retClass.push(transformDictDetail('nodeWeekStatus', row[column.property], 'remark'))
          }
        } else if (propertyClassFromDict.indexOf(column.property) >= 0) {
          //从字典中获取数据
          retClass.push(transformDictDetail(column.property, row[column.property], 'remark'))
        } else if (column.property === 'model' ) {
          if (this.$constants.isEmpty(row.timeLimitName)) {
            retClass.push('cellNotPorductNum')
          }
        }else if (column.property ==='status_23') {
          if (row.status_23 == -1){
            retClass.push('celldelay')
          }else if (row.status_23 == 1){
            retClass.push('celladvance')
          }
        }else if (row.isSpecialUser===1&&column.property === 'customerName'){
          retClass.push('celladvance')
        }
      } catch (e) {
        console.error(e)
        console.error(JSON.stringify(column))
      }
      return retClass.join(' ')
    },
    handleCellClick(row, column, cell, event) {
      /* if (row.stateName === frozenDesc) {
         return ''
       }*/
      debugger
      if (this.$constants.isEmpty(column.property)) {
        return ''
      }

      //冻结的只允许查看详情
      if (row.stateName === frozenDesc) {
        return;
      }

      // if(this.isMainPlanPage){
        if (column.property === 'salesPhase') {
          this.$refs.changeDeliveryDialogRef.init(row)
        }else if(row.isSpecialUser===1&&column.property === 'customerName'){
          this.$refs.specialRequirementsDialogRef.init(row)
        }
      // }
    },
    formatSearchData(dataList) {
      dataList.forEach((item, index) => {
        if (item.tentativeTime!=null&&item.tentativeEndTime!=null){
          item['tentativePhase'] = item.tentativeTime+'至'+item.tentativeEndTime
        } else {
          item['tentativePhase'] = null
        }
        if (item.salesReply!=null&&item.salesEndReply!=null){
          item['salesPhase'] = item.salesReply+'至'+item.salesEndReply
        } else {
          item['salesPhase'] = null
        }
      })
    },
  }
}
</script>

<style scoped>
.status-0 {
  color: #fd8957;
}
.status-1 {
  color: #3abcff;
}
</style>
