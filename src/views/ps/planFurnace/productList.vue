<template>
  <div style="height: 100%;">
    <el-card shadow="hover" class="hp">
      <div  class="hasLegend">
        <div class="filter-container searchCon hasLegend">
          <el-form
            ref="listQuery"
            :inline="true"
            style="margin-bottom: 4px;"
            class="demo-form-inline demo-form-zdy"
          >
            <el-form-item>
              <el-input @keyup.enter="handleSearch" v-model="listQuery.productNumber" placeholder="请输入生产号" style="width: 150px;" class="filter-item" clearable />
            </el-form-item>
            <el-form-item>
              <xui-dict-select multiple item-code="nodeConfirmStatus" includeAll v-model="listQuery.statusModel"
                               style="width:160px;" class="filter-item" :clearable="false">状态</xui-dict-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
            <el-form-item v-if="isApprovePage || $isAuth('0404planFurnace.entry')">
              <el-button type="primary" @click="joinFurnace">入炉</el-button>
            </el-form-item>
            <el-form-item v-if="isApprovePage || $isAuth('0404planFurnace.editTime')">
              <el-button type="primary" @click="HandleChangePlanData">修改计划时间</el-button>
            </el-form-item>
            <el-form-item v-if="isApprovePage || $isAuth('0404planFurnace.approval')">
              <el-button type="primary" icon="Coordinate" @click="handleApproval">提交审批</el-button>
            </el-form-item>
            <el-form-item v-if="isApprovePage">
              <el-button type="success" icon="SuccessFilled" @click="handlePass">审批通过</el-button>
            </el-form-item>
            <el-form-item v-if="isApprovePage">
              <el-button type="warning" icon="CircleCloseFilled" @click="handleReject">审批驳回</el-button>
            </el-form-item>
          </el-form>
        </div>
        <plan-status-legend></plan-status-legend>
      </div>
      <div class="wp hp app-containerC" style="height: fit-content;">
        <div class="app-container app-containerC">
          <div class="otherCon wp" id="psMainPlan">
            <el-table stripe ref="tableRef" :height="'100%'" highlight-current-row border
                    :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @cell-click="handleCellClick"
                    :data="dataList" @selection-change="selectChange" style="font-size: 0.7rem" >
              <el-table-column
                header-align="center"
                align="center"
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="生产号"
                width="100"
                property="productNo">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="计划开始"
                property="startDate"
                width="85">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="计划结束"
                property="nodeDate"
                width="85">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="周期"
                property="duration"
                width="50">
                <template #default="scope">
                  <span>{{scope.row.duration}}天</span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="操作设备"
                property="tableName"
                width="180"
                >
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="状态"
                width="60"
                property="status">
                <template #default="scope">
                  <xui-dictionary itemCode="confirmStatus" :code="scope.row.status"></xui-dictionary>
                </template>
              </el-table-column>
            </el-table>
            <pagination :total="total" :page="pageNum" :limit="pageSize" :layout="'total, sizes, prev, pager, next'" @pagination="handlePagination" class="searchCon wp" />
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog draggable  appendToBody title="预排检查" width="1200px" v-model="dialogVisible" @close="dialogClosed" modal>
      <div class="otherCon wp">
        <el-form
          ref="formRef"
          style="height: calc(100% - 95px)"
          :model="model">
          <el-table stripe  ref="tableRef" height="500px" highlight-current-row border :data="model.checkDataList"
                    style="font-size: 0.7rem" :row-class-name="tableRowClassName">
            <el-table-column
              header-align="center"
              align="center"
              label="序号"
              width="50"
            >
              <template #default="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="生产号"
              property="productNo"
              width="140"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="工序"
              property=""
              width="100"
            >
              <template #default="scope">
                {{opName}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="干燥罐"
              property="tankName"
              width="100"
            >
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="计划开始"
              property="startDate"
              width="330">
              <template #header>
                <el-date-picker
                  v-model="dateValue"
                  type="datetimerange"
                  align="right"
                  popper-class="noNormal"
                  start-placeholder="开始日期"
                  range-separator="至"
                  end-placeholder="结束日期"

                  style="width: 330px;"
                  @change="changeDateRange"
                  :disabled="!canChange"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </template>
              <template  #default="scope">
                <el-date-picker
                  v-model="scope.row.daterange"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  range-separator="至"
                  end-placeholder="结束日期"

                  style="width: 330px;"
                  :disabled="!canChange"
                  :clearable="false"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="120">
              <template #default="scope">
                <el-button-group>
                  <el-button type="danger"  @click="handleDelete(scope.row)"  icon="Delete">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
      </template>
    </el-dialog>
    <plan-date-change ref="planDateChangeRef" @refresh="handleRefresh"></plan-date-change>
    <reject-dialog ref="rejectDialogRef" @refresh="handleRefresh"></reject-dialog>
    <op-status-dialog ref="opStatusDialogRef"></op-status-dialog>
  </div>
</template>

<script>
import planWeekHttp from '@/api/plan/planWeek'
import Pagination from '@/components/Pagination/index'
import { transformDictDetail } from '@/components/xui/dictionary'
import { getDictListByKey } from '@/components/xui/dictionary'
import rejectDialog from '@/views/ps/planWeek/dialog/rejectDialog'
import opStatusDialog from '@/views/ps/planMain/dialog/opStatusDialog'
import planStatusLegend from '@/views/ps/_public/planStatusLegend'
import planDateChange from '@/views/ps/_public/planDateChange'
import moment from "moment";
export default {
  name: 'productList',
  components: {
    Pagination,
    rejectDialog,
    opStatusDialog,
    planStatusLegend,
    planDateChange
    },
  props: {
    furnace: {
      type: Object,
      default: null
    }
  },
  data(){
    let isApprovePage = false, statusModel = ['-1', '0', '1', '2', '3'];
    let routePath = this.$route.fullPath;
    if(routePath.indexOf('0405planFurnaceApproval')>=0){
      isApprovePage = true
      statusModel = ['2']
    }

    return {
      isApprovePage,
      dataList: [],
      total: 0,
      pageNum: 1,
      pageSize: 50,
      listQuery: {
        productNumber:'',
        nodeId: '20',
        statusModel: statusModel
      },
      selectList: [],
      pl14Ids: [],
      params: {},
      opName: '入炉',
      dialogVisible: false,
      usedEquipment: null,
      model: {
        checkDataList: [],
        rules:{
          usedEquipment: [
            { required: true, message: '请选择干燥罐', trigger: 'blur'}
          ]
        }
      },
      tankName: '',
      dateValue: '',
      checkDate: [],
      canChange: true,
      pickerOptions:{
          disabledDate:time => {
              let nowDate = new Date(time);
              let month,day = null;
              if(nowDate.getMonth()<9) month = "0"+(nowDate.getMonth()+1);
              else month = nowDate.getMonth()+1
              if(nowDate.getDate()<=9) day = "0"+nowDate.getDate();
              else day = nowDate.getDate();
              let date = nowDate.getFullYear()+"-"+month+"-"+day;
              return (date < this.furnace.startDate || date > this.furnace.nodeDate);
          }
      },
      planType: 'furance',
      nodeInfo: [],
      isApproval:this.$constants.isApprove.no
    }
  },
  mounted(){
    this.initData();
    // this.handleSearch();
  },
  created() {
    //this.listQuery.statusModel = ['-1', '0', '1', '2', '3']
  },
  methods: {
    handleSearch(){
      this.initData();
      this.$emit('refresh', {});
    },
    initData(){
      this.pageNum = 1;
      this.getDataList();
    },
    handleRefresh(){
      this.$emit('refresh', {});
      this.getDataList();
    },
    async joinFurnace(){
      debugger
      if(this.furnace) {
        console.log(this.furnace)
        if(this.furnace.children.length>0) this.canChange = false
        if(this.selectList.length === 0) this.$message.error("请至少选择一条数据！");
        else {
          // this.planNodeIds = [];
          // this.planNodeIds = this.selectList.map(item=>{
          //   return item.planNodeId;
          // })
          planWeekHttp.findTankById({id:this.furnace.tableId}).then(data=>{
            this.tankName = data.data.dryingTankCode
            this.selectList.forEach(item =>{
              item.tankName = this.tankName
              item.usedEquipment = this.furnace.tableId
            })
          })
          this.model.checkDataList = this.selectList
          console.log('结果',this.model.checkDataList)
          this.dialogVisible = true;
        }
      } else this.$message.error("请先选择干燥罐")
    },
    getDataList(){
      let intStatus = [];
      this.listQuery.statusModel.forEach(item=>{
        intStatus.push(parseInt(item))
      })
      planWeekHttp.queryFurnaceProducts({productNumber:this.listQuery.productNumber,confirmStatus:intStatus,nodeId: "20",pg_pagenum:this.pageNum,pg_pagesize:this.pageSize})
        .then(res=>{
          this.dataList = res.data;
          this.total = res.total_count;
        })
    },
    handlePagination({ page, limit }){
      this.pageNum = page;
      this.pageSize = limit;
      this.getDataList();
    },
    selectChange(selection) {
      this.selectList = selection;
    },
    handleSubmit() {
      let data = {
        nodeId: '20',
        condition: [],
      }
      this.$refs.formRef.validate(valid=>{
        if(!valid){
          return;
        }
        if(this.model.checkDataList.length === 0) {
          this.$message.warning("没有数据！");
          return;
        }
        this.nodeInfo = []
          this.model.checkDataList.forEach(item => {
            let itemObj = {
              productPlanId: item.pl14Id,
              productNodeId: item.planNodeId,
              usedEquipment: item.usedEquipment,
              planStartTime: moment(item.daterange[0]).format('YYYY-MM-DD HH:mm:ss'),
              planEndTime: moment(item.daterange[1]).format('YYYY-MM-DD HH:mm:ss')
            }
            this.nodeInfo.push(itemObj)
          })
          planWeekHttp.addToExperimentPlan({planType:this.planType,nodeInfo:this.nodeInfo,workSpaceTable:'',isApproval:this.isApproval}).then(response=>{
            if(response.err_code === this.$constants.statusCode.success){
              this.$message.success('数据保存成功');
              this.dialogVisible = false;
              this.handleRefresh();
            }else{
              this.$message.error(response.err_msg);
            }
          })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if(this.selectList.indexOf(row)>=0) return "selected-row"
      else return transformDictDetail('confirmStatus', row.status, 'remark');
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if(!column.property){
        return;
      }
      return ''
    },
    handleCellClick(row, column, cell, event) {
      if(!column.property){
        return;
      }
      if ( column.property.indexOf('_status') >= 0) {
        //处理工序实际进度点击事件
        this.$refs.opStatusDialogRef.init(row)
      }
      return ''
    },
    getSelectedData(type){
      let legalStatus = [], desc = '';
     if(type === 'approval'){
        //如果是要求审批的数据
        legalStatus = this.$constants.confirmStatus.canApproval;
        console.log(legalStatus)
        desc = this.$constants.confirmStatus.canApprovalDesc;
      }else if(type === 'apply'){
        //apply  待审批数据
        legalStatus = this.$constants.confirmStatus.waitApproval;
        desc = this.$constants.confirmStatus.waitApprovalDesc;
      }else{
       return new Promise((resolve, reject)=>{
         resolve([])
       })
     }
      return new Promise((resolve, reject)=>{
        let selectedData = this.selectList;
        if(!selectedData || selectedData.length === 0){
          this.$message({ message: '请选择要处理的数据', type: 'warning' })
          return resolve([]);
        }
        //刷选出符合条件的数据和错误的数据
        let rightData = [], errorData= [];
        selectedData.forEach(item=>{
          if(legalStatus.indexOf(item.status.toString())>=0){
            rightData.push(item);
          }else{
            errorData.push(item);
          }
        })
        if(rightData.length === 0){
          this.$message({ message: `请选择状态为${desc}的数据`, type: 'warning' })
          return resolve(rightData);
        }else if(errorData.length > 0){
          this.$confirm(`您选择了状态不为${desc}的数据，是否剔除错误数据后继续操作？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            return resolve(rightData);
          }).catch(() => {
            return resolve([]);
          });
        }else{
          return resolve(rightData);
        }
      })
    },
    handleApproval(){
      debugger
      this.$emit('approval', {});
     /* this.getSelectedData('approval').then(selectedData=>{
        if(selectedData.length === 0){
          return;
        }
        console.log(selectedData)
        this.$refs.submitApprovalDialogRef.initDataNoNeedGx(selectedData, this.listQuery);
      })*/
    },
    handlePass(){
      this.getSelectedData('apply').then(selectedData=>{
        if(selectedData.length === 0){
          return;
        }
        this.$confirm(`确定审批通过吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //处理数据
          this.pass(selectedData);
        })
      })
    },

    pass(selectedData){
      let submitData = {
        nodeId: this.listQuery.nodeId,
        planId: [],
        approvalStatus: this.$constants.confirmStatus.pass
      };
      selectedData.forEach(item=>{
        submitData.planId.push(item.pl14Id)
      })
      planWeekHttp.approvalPlanZ(submitData).then(response=>{
        if(response.err_code ===this.$constants.statusCode.success){
          this.$message.success('数据审批完成');
          this.handleRefresh();
        }else{
          this.$message.error(response.err_msg);
        }
      })
    },
    handleReject(){
      this.getSelectedData('apply').then(selectedData=>{
        if(selectedData.length === 0){
          return;
        }
        this.$refs.rejectDialogRef.initData(selectedData, this.listQuery);
      })
    },
    handleDelete(rowData){
      this.model.checkDataList.find((item, index) =>{
        if(item === rowData){
          this.model.checkDataList.splice(index, 1)
        }
      })
    },
    HandleChangePlanData(){
      if(this.selectList.length === 0) this.$message.error("请至少选择一条数据！");
      else if(this.selectList.length > 1) this.$message.error("该功能只支持单数据操作！");
      else {
        let data = this.selectList[0];
        data['nodeId'] = this.listQuery.nodeId;
        this.$refs.planDateChangeRef.initData(data);
      }
    },
    dataFormat(list){
      list.forEach(item=>{
        if(this.furnace.startDate && this.furnace.nodeDate) item.daterange = [this.furnace.startDate,this.furnace.nodeDate]
        else item.daterange = [item.planStartTime,item.planEndTime]
      })
    },
    changeDateRange(e){
      this.model.checkDataList.forEach(item=>{
        item.daterange = e
      })
    },
    dialogClosed(){
      this.dateValue = ''
      this.canChange = true
    }
  }
}
</script>

<style scoped>
:deep .el-table-column--selection .cell{
  text-align: center;
  padding-right: 10px;
}

:deep .selected-row {
    background: rgb(235, 244, 255);
}

</style>

<style lang="scss">
.noNormal .el-picker-panel__body .normal{
    background: none;
}

</style>
