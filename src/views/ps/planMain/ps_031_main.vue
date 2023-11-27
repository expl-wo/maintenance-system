<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="计划完工时间:" prop="dateCount">
          <el-date-picker v-model="listQuery.dateGroup" type="daterange" range-separator="至" style="width: 240px;"
                          start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="listQuery.search" placeholder="项目名、生产号、图号"
                    style="width:170px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="产品类型：">
          <el-select v-model="listQuery.productTypeParam" clearable style="width: 120px;" placeholder="选择类型">
            <el-option label="换流变" value="0" />
            <el-option label="变压器" value="1" />
            <el-option label="电抗器" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="电压等级：">
          <el-select multiple collapse-tags v-model="listQuery.voltage" clearable style="width: 130px;"
                     placeholder="选择电压">
            <el-option label="110" value="110" />
            <el-option label="220" value="220" />
            <el-option label="500" value="500" />
            <el-option label="750" value="750" />
            <el-option label="1000" value="1000" />
          </el-select>
        </el-form-item>
        <el-form-item label="工序：" v-if="!isMainPlanPage">
          <el-select v-model="listQuery.op" clearable="" style="width: 120px;" placeholder="选择工序"
                     @change="handleChangeOp">
            <el-option
              v-for="item in opList"
              :key="item.k"
              :label="item.v"
              :value="item.k"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序状态：" v-if="!isMainPlanPage">
          <el-select v-model="listQuery.opStatus" style="width: 120px;" clearable placeholder="选择工序状态">
            <el-option
              v-for="(item,index) in statusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" v-if="isMainPlanPage">
          <xui-dict-select multiple item-code="mainPlanStatus" includeAll v-model="listQuery.status"
                           class="filter-item" clearable
          ></xui-dict-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="showColumnConfigBtn" @click="handleConfigColumn">列配置</el-button>
        </el-form-item>
        <el-form-item v-if = "isMainPlanPage">
<!--          主计划界面操作按钮-->
          <el-button @click="handleFrozenOrder" v-if="$isAuth('mainPlan_editData')">冻结工单</el-button>
          <el-button @click="handleUnFrozenOrder" v-if="$isAuth('mainPlan_editData')">工单解冻</el-button>
          <el-button @click="handleShowFrozenList" v-if="$isAuth('mainPlan_none')">查看历史冻结原因</el-button>
          <el-button @click="handleAddRemark" v-if="$isAuth('mainPlan_editData')">添加备注</el-button>
          <el-button @click="handleShowRemarkList" v-if="$isAuth('mainPlan_none')">查看历史备注</el-button>
          <el-button @click="handleShowHistoryChangeDelivery" v-if="$isAuth('mainPlan_none')">查看厂内完工时间申请记录</el-button>
<!--          <el-button @click="handleChangeRepairStatus" v-if="$isAuth('mainPlan_editData')">返修</el-button>-->
          <el-button @click="handleChangeCompletionTime" v-if="false">修改生产完工时间</el-button>
          <el-button @click="exportMainPlan" v-if="$isAuth('mainPlan_editData')">导出</el-button>
          <el-button @click="exportBomSum" v-if="$isAuth('mainPlan-exportBom')">导出BOM汇总</el-button>
<!--          <el-button @click="handleChangeLimitRelationStatus" v-if="$isAuth('mainPlan_editData')">设置工序限制</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container app-containerC" v-if="showTable">
      <div class="tableCase" id="paMainPlan">
        <el-table stripe ref="tableRef" :height="'100%'" highlight-current-row border :data="dataList"
                  style="font-size: 0.7rem"
                  :row-class-name="tableRowClassName" :cell-class-name="cellClassName"
                  :header-cell-class-name="headerCellClassName"
                  @cell-click="handleCellClick"
                  :row-style="{height: '54px'}"
        >
          <el-table-column header-align="center" align="center" type="selection" fixed width="40" property="selection"
          ></el-table-column>
          <el-table-column label="操作"
                           align="center" width="78" fixed property="caozuo">
            <template v-slot="scope">
              <el-button-group>
                <el-button type="default"
                           @click="handleShowFlowchart(scope.row)">进度查询
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="生产号"
            property="productNo"
            fixed

            width="110"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="设计型号"
            property="pcModel"
            v-if="isNeedShow('model')"
            fixed
            width="130"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="计划生产完工时间"
            property="planCompletime"
            width="100"
            fixed
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="厂内完工时间"
            property="dateEnd"
            width="100"
            fixed
          >
            <template v-slot="scope">
              {{ dateFilter(scope.row.dateEnd) }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="图号"
            property="drawingNo"
            width="90"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="用户单位"
            property="customerName"
            width="230"
          >
            <template v-slot="scope">
              <div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.customerName"
                  placement="top"
                >
                  <div class="cell-content">{{ scope.row.customerName }}</div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="产值(万元)"
            property="noTaxAmount"
            width="80"
          >
            <template v-slot="scope">
              {{ numFilter(scope.row.noTaxAmount) }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="产量(万kVA)"
            property="outPut"
            width="80"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="产品期量"
            property="timeLimitName"
            width="150"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="产品类型"
            property="isExportProduct"
            width="130"
          >
            <template v-slot="scope">
              <el-select :disabled="!$isAuth('mainPlan_editData')" v-model="scope.row.isExportProduct"
                         @change="changeExport(scope.row)" clearable placeholder="请选择">
                <el-option
                  v-for="item in exportProduct"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="设计来源"
            property="designSource"
            width="70"
          >
            <template v-slot="scope">
              <xui-dictionary itemCode="designSource" :code="scope.row.designSource"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="台量"
            property="count"
            width="60"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="状态"
            property="schedulingStatusName"
            width="70"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="重点性"
            property="importmentLevel"
            width="60"
          >
            <template v-slot="scope">
              <xui-dictionary itemCode="importmentLevel" :code="scope.row.importmentLevel"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="紧急性"
            property="urgentLevel"
            width="60"
          >
            <template v-slot="scope">
              <xui-dictionary itemCode="urgentLevel" :code="scope.row.urgentLevel"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="实际进度"
            property="processStatus"
            width="70"
          >
            <template v-slot="scope">
              <xui-dictionary itemCode="processStatus" :code="scope.row.processStatus"></xui-dictionary>
            </template>
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="厂内开工时间"
            property="actualStartTime"
            width="100"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="项目经理"
            property="projectManager"
            width="70"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="开工批复"
            property="orderIssuedTime"
            width="100"
          >
            <template v-slot="scope">
              {{ dateFilter(scope.row.orderIssuedTime) }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="工序先后关系限制"
            property="limitRelation"
            width="80"
          >
            <template v-slot="scope">
              <xui-dictionary itemCode="flag01" :code="scope.row.limitRelation"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in moreHeaders" :key="index" :label="item.label"
                           align="center"
                           :class-name="item.className"
          >
            <el-table-column
              v-for="(item2, index2) in item.children" :key="index2"
              :label="item2.label" align="center"
              :class-name="item2.className"
            >
              <el-table-column
                v-for="(item3, index3) in item2.children"
                :key="index3"
                :labelClassName="item3.nodeType"
                :label="item3.label" :property="item3.property"
                align="center" width="85"
                :class-name="item3.className"
              >
                <template v-slot="scope">
                  <cell-transform :item="item" :item3="item3" :property="item3.property"
                                  :data="scope.row"></cell-transform>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <pagination :total="total" :page="pageNum" :limit="pageSize" :page-sizes="[10, 20, 30, 50,100,200]"
                  @pagination="handlePagination" class="searchCon wp" />
    </div>
<!--    dialog 弹窗-->
    <op-status-dialog ref="opStatusDialogRef"></op-status-dialog>
    <op-purchase-tree-dialog ref="opPurchaseTreeDialogRef"></op-purchase-tree-dialog>
    <op-start-date-dialog ref="opStartDateDialogRef" @refresh="getDataList" ></op-start-date-dialog>
    <time-limit-dialog ref="timeLimitDialogRef" @refresh="getDataList"></time-limit-dialog>
    <change-delivery-dialog ref="changeDeliveryDialogRef" @refresh="getDataList"></change-delivery-dialog>
    <select-user-dialog ref="selectUserDialogRef"  @refresh="getDataList"></select-user-dialog>
    <process-flowchart ref="processChartRef"></process-flowchart>
    <config-column-dialog ref="configColumnDialogRef" @refreshColumn="handleConfigColumnSuccess"></config-column-dialog>
    <frozen-dialog ref="frozenDialogRef" @refresh="getDataList"></frozen-dialog>
    <history-frozen-dialog ref="historyFrozenDialogRef"></history-frozen-dialog>
    <remark-dialog ref="remarkDialogRef"></remark-dialog>
    <history-remark-dialog ref="historyRemarkDialogRef"></history-remark-dialog>
    <history-change-delivery-dialog ref="historyChangeDeliveryDialogRef"></history-change-delivery-dialog>
    <repair-dialog ref="repairDialogRef" @refresh="getDataList"></repair-dialog>
    <change-completion-time-dialog ref="changeCompletionTimeDialogRef" @refresh="getDataList"></change-completion-time-dialog>
    <limit-relation-dialog ref="limitRelationDialogRef" @refresh="getDataList"></limit-relation-dialog>
    <change-plan-completime-dialog ref="changePlanCompletimeDialogRef" @refresh="getDataList"></change-plan-completime-dialog>
  </div>
</template>

<script>
import { getDictListByKey,transformDictDetail } from "@/components/xui/dictionary";
import planWeekHttp from "@/api/plan/planWeek";
import Pagination from "@/components/Pagination/index.vue";
import { timeTranslate,timeTranslateYM } from '@/utils/common' // 时间转化
import XuiDictionary from '@/components/xui/dictionary/dictionary.vue'
import opStatusDialog from './dialog/opStatusDialog.vue'
import OpPurchaseTreeDialog from './dialog/opPurchaseTreeDialog'
import opStartDateDialog from './dialog/opStartDateDialog'
import timeLimitDialog from './dialog/timeLimitDialog'
import changeDeliveryDialog from './dialog/changeDeliveryDialog'
import { selectUserDialog } from '@/views/ps/planTentative/dialog/selectUserDialog'
import processFlowchart from '@/components/x6/processFlowchart'
import configColumnDialog from '@/views/ps/_public/configColumnDialog.vue'
import configColumnMixins from '@/views/ps/_public/configColumnMixins'
import formatPlanMixins from '@/views/ps/_public/formatPlanMixins'
import frozenDialog from './dialog/frozenDialog'
import historyFrozenDialog from './dialog/historyFrozenDialog'
import remarkDialog from './dialog/remarkDialog'
import historyRemarkDialog from './dialog/historyRemarkDialog'
import historyChangeDeliveryDialog from './dialog/historyChangeDeliveryDialog'
import repairDialog from './dialog/repairDialog'
import changeCompletionTimeDialog from './dialog/changeCompletionTimeDialog'
import limitRelationDialog from './dialog/limitRelationDialog'
import changePlanCompletimeDialog from './dialog/changePlanCompletimeDialog'
import moment from 'moment'

const propertyClassFromDict = ['designSource', 'importmentLevel', 'urgentLevel', 'processStatus']
const frozenDesc = '冻结'
export default {
  mixins: [ formatPlanMixins, configColumnMixins],
  components: { Pagination, XuiDictionary, opStatusDialog, OpPurchaseTreeDialog,opStartDateDialog,
    timeLimitDialog, changeDeliveryDialog, selectUserDialog, processFlowchart,configColumnDialog, frozenDialog,
    historyFrozenDialog,remarkDialog,historyRemarkDialog, historyChangeDeliveryDialog,repairDialog,
    changeCompletionTimeDialog,limitRelationDialog,changePlanCompletimeDialog},
  data() {
    return {
      processType: '',
      isMainPlanPage: true,
      pageId: "ps_031_main",
      listQuery: {
        dateGroup: [],
        search: "",
        productTypeParam: "",//产品类型
        voltage: "",//电压等级
        op: "",//工序
        opStatus: [],//工序状态
        status: [],
        strDate: '', // 开始查询日期：只有此日期则查询全部大于等于此日期的时间
        endDate: '', // 截止查询日期：只有此日期则查询全部小于等于此日期的时间
        yearMonth:'',
        year:'',
        month:'',
        productType: '',
        isExportProduct:'',
      },
      selectedFreeze:[],
      statusOptions: [{
        value: [0, 3, 5],
        label: "未开工"
      },
        {
          value: [-1, 10, 15],
          label: "开工中"
        },
        {
          value: [20],
          label: "完工"
        },
        {
          value: [4],
          label: "暂停"
        }],
      exportProduct: [{
        value: 0,
        label: '国内产品'
      }, {
        value: 1,
        label: '出口产品'
      }],
      opList: [],
      showOp: false,
      productModelOptions: [],
    };
  },
  created() {
    let path = this.$route.fullPath;
    console.log("路径:", path);
    if (path && path === "/ps/ps_032_workOrder") {
      //说明此页面为车间在制工单
      this.isMainPlanPage = false;
      this.pageId = "ps_032_workOrder";
    }
    if (this.isMainPlanPage) {
      let dictList = getDictListByKey("mainPlanStatus");
      let dictArr = [];
      dictList.forEach(item => {
        if (item.code != 4) {
          dictArr.push(item.code);
        }
      });
      this.listQuery.status = dictArr;
      console.log("主计划状态字典:", this.listQuery.status);
    } else {
      //状态为冻结和已开工 已下发
      this.listQuery.status = [-2, 2, 10];
    }
    this.initDate()
  },
  mounted() {
    // this.getProductModel()
    this.initData()
    // if(!this.isMainPlanPage) this.getSearchQuery()
    // else this.initData()
  },
  methods: {
    handleSearch() {
      this.pageNum = 1;
      this.getDataList();
    },
    // getProductModel(){
    //   planWeekHttp.queryProductModel().then(res=>{
    //     this.productModelOptions = res.data;
    //   })
    // },
    async getDataList() {
      this.dataList = [];
      let response = await planWeekHttp.planListWithNodes(this.getParams());
      this.total = response.total_count;
      this.formatSearchData(response.data);
      this.dataList = response.data;
      this.$nextTick(()=>{
        this.$refs.tableRef &&this.$refs.tableRef.doLayout();
      })
    },
    //格式化数据
    formatSearchData(dataList) {
      try{
        console.log('格式化数据',dataList)
        dataList.forEach((item, index) => {
          let nodeList = item.nodeList;
          if (nodeList && nodeList.length > 0) {
            nodeList.forEach(secondItem => {
              /* item['23_startDate'] = '4/15'
               item['23_status'] = 'delay'*/
              //startDate 计划开始时间
              //nodeDate 计划结束时间(计划完工时间)
              //finishDate 实际完工时间
              let finishDate = secondItem.finishDate ? new Date(secondItem.finishDate) : "";
              if (finishDate) {
                let month = finishDate.getMonth() + 1;
                let strDate = finishDate.getDate();
                if (month >= 1 && month <= 9) {
                  month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                  strDate = "0" + strDate;
                }
                finishDate = "(" + finishDate.getFullYear() + "-" + month + "-" + strDate + ")";
              }
              item["_" + secondItem.nodeId + "_startDate"] = (secondItem.type === 0 || secondItem.type === 1) ? secondItem.startDate : secondItem.nodeDate;
              item["_" + secondItem.nodeId + "_status"] = secondItem.status;
              item["_" + secondItem.nodeId + "_progressStatus"] = transformDictDetail("nodeWeekDeStatus", secondItem.progressStatus) + finishDate;
              item["_" + secondItem.nodeId + "_nodeId"] = secondItem.id;
              item["_" + secondItem.nodeId + "_finishDate"] = secondItem.finishDate;
            });
          }
        });
      }catch (e) {
        console.error(e);
      }
    },
    getParams() {
      let status = this.listQuery.status;
      this.listQuery.productType = parseInt(this.listQuery.productTypeParam);
      let intStatus = [];
      status.forEach(item => {
        intStatus.push(parseInt(item));
      });
      if (this.listQuery.dateGroup != null) {
        this.listQuery.strDate = timeTranslate(this.listQuery.dateGroup[0]); // 开始日期
        this.listQuery.endDate = timeTranslate(this.listQuery.dateGroup[1]); // 结束日期
      } else {
        this.listQuery.strDate = null;
        this.listQuery.endDate = null;
      }
      if (this.listQuery.yearMonth != null) {
        var date = new Date(this.listQuery.yearMonth);
        this.listQuery.year = date.getFullYear().toString();
        this.listQuery.month = (date.getMonth() + 1).toString();
      } else {
        this.listQuery.year = null;
        this.listQuery.month = null;
      }
      return {
        ...this.listQuery,
        status: intStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
    },
    handleChangeOp(val) {
      // let label = '';
      //  this.opList.some(item=>{
      //   if(item.k == val){
      //     label = item.v;
      //     return true;
      //   }else{
      //     return false;
      //   }
      // });
      //  this.searchQuery.opName = label;
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
        if (column.property === 'timeLimitName' || column.property === 'dateEnd'||column.property === 'completionTime'||column.property === 'projectManager'
          ||column.property === 'planCompletime') {
          retClass.push('pointer-cursor')
        }
      }

      //加入产品期量、设计来源（PLM）、重点性、紧急性
      //加入的实际进度
      try {
        if (column.property.indexOf('_status') >= 0) {
          if (this.$constants.isNotEmpty(row[column.property])) {
            retClass.push(transformDictDetail('nodeWeekStatus', row[column.property], 'remark'))
            retClass.push('pointer-cursor')
          }
        }else if(column.property.indexOf('_startDate') >= 0 && this.$constants.isNotEmpty(row[column.property])){
          if(column.labelClassName === (this.$constants.opType.product+'')){ //为生产才能点击
            retClass.push('pointer-cursor');
          }
        } else if (propertyClassFromDict.indexOf(column.property) >= 0) {
          //从字典中获取数据
          retClass.push(transformDictDetail(column.property, row[column.property], 'remark'))
        } else if (column.property === 'model' || column.property === 'timeLimitName') {
          if (this.$constants.isEmpty(row.timeLimitName)) {
            retClass.push('cellNotPorductNum')
          }
        }else if (column.property ==='completionTime') {
          if (row.isUpdateTime == 1){
            retClass.push('celldelay')
          }
        }
      } catch (e) {
        console.error(e)
        console.error(JSON.stringify(column))
      }
      return retClass.join(' ')
    },
    headerCellClassName(){
      return ''
    },
    handleCellClick(row, column, cell, event) {
      if (this.$constants.isEmpty(column.property)) {
        return ''
      }
      /* if (row.stateName === frozenDesc) {
         return ''
       }*/
      //冻结的只允许查看详情
      if (row.stateName === frozenDesc) {
        //只能查看列表
        if ( column.property.indexOf('_status') >= 0 && this.$constants.isNotEmpty(row[column.property])) {
          this.$refs.opStatusDialogRef.init(row)
        }
        return;
      }

      if(this.isMainPlanPage){
        //符合一下逻辑的，是有事件处理的
        if (column.property.indexOf('_startDate') >= 0 && this.$constants.isNotEmpty(row[column.property])) {
          //处理工序开始时间点击事件
          if(column.labelClassName === (this.$constants.opType.product+'')){ //为生产才能点击
            this.$refs.opStartDateDialogRef.init(row, column)
          }
        } else if (column.property.indexOf('_status') >= 0) {
          this.dealStatusCell(row, column);
        } else if (column.property === 'timeLimitName') {
          if(this.$isAuth('mainPlan_editData')) {
            //处理产品期量点击事件
            this.$refs.timeLimitDialogRef.init(row)
          }
        } else if (column.property === 'dateEnd') {
          if(this.$isAuth('mainPlan-factoryStorageDate')){
            //修改厂内完成时间（交货期）弹框
            this.$refs.changeDeliveryDialogRef.init(row)
          }
        } else if (column.property === 'completionTime') {
          if(this.$isAuth('mesGYBD50031.submit')){
            this.dealCompletion(row)
          }
        }else if (column.property === 'projectManager') {
          if(this.$isAuth('mainPlan-editProjectManager')) {
            this.$refs.selectUserDialogRef.init(row)
          }
        }else if(column.property === 'planCompletime'){
          if(this.$isAuth('mesGYBD50031.submit')) {
            this.dealPlanCompletime(row)
          }
        }
      }else{
        //符合以下逻辑的，是有事件处理的
        if (column.property.indexOf('_status') >= 0) {
          //处理工序实际进度点击事件
          this.dealStatusCell(row, column);
        }
      }
    },
    dealStatusCell(row, column){
      if(this.$constants.isNotEmpty(row[column.property])){
        //处理工序实际进度点击事件
        if(column.labelClassName === (this.$constants.opType.product+'')){ //为生产节点为生产是报工时间列表
          this.$refs.opStatusDialogRef.init(row, column)
        }else if(column.labelClassName === (this.$constants.opType.purchase+'')){//采购为采购树
          this.$refs.opPurchaseTreeDialogRef.init(row, column)
        }
      }
    },
    dealCompletion(row){
      console.log(row)
      if (row.schedulingStatus ===4){
        this.$message({ message: `请选择排产状态为非完工的数据`, type: 'warning' })
      }else {
        this.$refs.changeCompletionTimeDialogRef.initData(row)
      }
    },
    dealPlanCompletime(row){
      if (row.schedulingStatus ===4){
        this.$message({ message: `请选择排产状态为非完工的数据`, type: 'warning' })
      }else {
        this.$refs.changePlanCompletimeDialogRef.initData(row)
      }
    },
    handleShowFlowchart(rowData){
      this.$refs.processChartRef.init({
        nodeList: rowData.nodeList,
        productNo: rowData.productNo,
        id: rowData.id
      });
    },
    dateFilter(value) {
      if(value == null){
        return null;
      }
      let realVal = value.substring(0, 10);
      return realVal;
    },
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let tempVal = parseFloat(value).toFixed(3);
      let realVal = tempVal.substring(0, tempVal.length - 1);
      return realVal;
    },
    changeExport(item){
      console.log(item)
      planWeekHttp.changeExport({'id':item.id,'isExportProduct':parseInt(item.isExportProduct)}).then(res=>{
        //if(res.err_code === 10000) this.getDataList();
        if(res.err_code === 10000) this.$message({ message: '修改成功', type: 'success' })
        else this.$message({ message: res.err_msg, type: 'error' })
      })
    },
    handlePagination({ page, limit }) {
      this.pageNum = page
      this.pageSize = limit
      this.getDataList()
    },
    handleFrozenOrder() {
      this.getSelectedData('freeze').then(selectedData=>{
        if(selectedData.length === 0){
          return;
        }
        this.$refs.frozenDialogRef.init(selectedData)
      })
    },
    handleUnFrozenOrder() {
      this.getSelectedData('unFreeze').then(selectedData=>{
        if(selectedData.length === 0){
          return;
        }
        let list = [];
        this.selectedFreeze =selectedData;
        this.selectedFreeze.forEach(item=>{
          list.push({
            id: item.id
          })
        })
        this.$confirm(`此操作将解除这${selectedData.length}条工单的冻结, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          planWeekHttp.unfreezeWork(list).then(response => {
            if (response.err_code === this.$constants.statusCode.success) {
              this.$message.success('数据保存成功')
              this.getDataList()
            } else {
              this.$message.error(response.err_msg)
            }
          })
        })
      })
    },
    handleShowFrozenList(){
      let selectedData = this.canOnlySelectedOneRow();
      if(!selectedData){
        return;
      }
      this.$refs.historyFrozenDialogRef.init(selectedData)
    },
    canOnlySelectedOneRow(){
      let selectedData = this.$refs.tableRef.getSelectionRows();
      if(!selectedData || selectedData.length === 0){
        this.$message({ message: '请选择要处理的数据', type: 'warning' })
        return null;
      }else if(selectedData.length > 1){
        this.$message({ message: '只能选择一条记录', type: 'warning' })
        return null;
      }
      return selectedData[0];
    },
    handleAddRemark() {
      let selectedData = this.$refs.tableRef.getSelectionRows();
      if(!selectedData || selectedData.length === 0){
        this.$message({ message: '请选择要处理的数据', type: 'warning' })
        return;
      }
      this.$refs.remarkDialogRef.init(selectedData)
    },
    handleShowRemarkList(){
      let selectedData = this.canOnlySelectedOneRow();
      if(!selectedData){
        return;
      }
      this.$refs.historyRemarkDialogRef.init(selectedData)
    },
    handleShowHistoryChangeDelivery(){
      let selectedData = this.canOnlySelectedOneRow();
      if(!selectedData){
        return;
      }
      this.$refs.historyChangeDeliveryDialogRef.init({
        productNo: selectedData.productNo
      })
    },
    handleChangeRepairStatus(){
      let selectedData = this.canOnlySelectedOneRow();
      if(!selectedData){
        return;
      }
      this.$refs.repairDialogRef.init(selectedData)
    },
    handleChangeLimitRelationStatus(){
      let selectedData = this.canOnlySelectedOneRow();
      if(!selectedData){
        return;
      }
      this.$refs.limitRelationDialogRef.init(selectedData)
    },
    handleChangeCompletionTime(){
      this.getSelectedData('completionTime').then(selectedData=>{
        console.log(selectedData)
        if(selectedData.length === 0){
          return;
        }
        this.$refs.changeCompletionTimeDialogRef.init(selectedData)
      })
    },
    exportMainPlan(){
      planWeekHttp.mainPlanExport(this.getParams()).then(res=>{
        const link = document.createElement('a')
        link.href = res.data
        let now = moment(new Date());
        let dateTime = now.format('YYYY-MM-DD HH_mm_ss').toString()
        link.download = '生产主计划'+dateTime+'.xlsx'
        link.click()
      })
    },
    exportBomSum(){
      let selectedData = this.canOnlySelectedOneRow();
      if(!selectedData){
        return;
      }
      window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/bomSumExport?drawingNo='+`${selectedData.drawingNo}`
    },
    getSelectedData(type){
      let legalStatus = [], desc = '';
      if(type === 'freeze'){
        //如果是获取加入周计划的数据
        legalStatus = this.$constants.confirmStatus.freeze;
        desc = this.$constants.confirmStatus.canFreezeDesc;
      }else if(type === 'unFreeze'){
        //如果是要求审批的数据
        legalStatus = this.$constants.confirmStatus.unfreeze;
        desc = this.$constants.confirmStatus.canUnFreezeDesc;
      }else if(type === 'completionTime'){
        //如果是要求审批的数据
        legalStatus = this.$constants.confirmStatus.completionTime;
        desc = this.$constants.confirmStatus.canCompletionTime;
      }else{
        return new Promise((resolve, reject)=>{
          resolve([])
        })
      }
      return new Promise((resolve, reject)=>{
        let selectedData = this.$refs.tableRef.getSelectionRows();
        if(!selectedData || selectedData.length === 0){
          this.$message({ message: '请选择要处理的数据', type: 'warning' })
          return resolve([]);
        }
        if(type === 'completionTime' && selectedData.length > 5){
          this.$message({ message: '只大允许修改5条', type: 'warning' })
          return resolve([]);
        }
        //刷选出符合条件的数据和错误的数据
        let rightData = [], errorData= [];
        selectedData.forEach(item=>{
          if(legalStatus.indexOf(item.schedulingStatus.toString())>=0){
            rightData.push(item);
          }else{
            errorData.push(item);
          }
        })
        if(rightData.length === 0){
          this.$message({ message: `请选择排产状态为${desc}的数据`, type: 'warning' })
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
    initDate(){
      const sDate = new Date()
      if (sDate.getMonth() === 0) {
        sDate.setMonth(11)
        sDate.setFullYear(sDate.getFullYear() - 1)
      } else {
        sDate.setMonth(sDate.getMonth() - 1)
      }
      this.listQuery.dateGroup[0] = sDate.toString()
      const eDate = new Date()
      if (eDate.getMonth() === 11) {
        eDate.setMonth(0)
        eDate.setFullYear(eDate.getFullYear() + 1)
      } else {
        eDate.setMonth(eDate.getMonth() + 1)
      }
      this.listQuery.dateGroup[1] = eDate.toString()
      this.listQuery.strDate = timeTranslate(this.listQuery.dateGroup[0])
      this.listQuery.endDate = timeTranslate(this.listQuery.dateGroup[1])
      const nowDate = new Date()
      // this.listQuery.yearMonth = timeTranslateYM(nowDate.toString())
      this.listQuery.yearMonth = null
      this.listQuery.year = nowDate.getFullYear().toString()
      this.listQuery.month = (nowDate.getMonth()+1).toString()
    },
  }
};
</script>
<style scoped>
.tableCase {
  min-height: 100px;
  height: calc(100vh - 290px);
  overflow: auto;
}

.cell-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
}

.item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
