<template>
  <div class="app-container app-containerC ">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="关键字">
          <el-input v-model="listQuery.search" placeholder="项目名、生产号、图号"
                    style="width:170px;" @keyup.enter="handleSearch" @clear="handleSearch" class="filter-item"
                    clearable/>
        </el-form-item>
        <el-form-item label="审批状态">
          <xui-dict-select item-code="mainConfirmStatus" multiple includeAll
                           v-model="listQuery.approvalStatus" :widthFull="false"
                           style="width:140px;" class="filter-item" clearable></xui-dict-select>
        </el-form-item>
        <el-form-item label="生产状态">
          <xui-dict-select item-code="mainPlanStatus" multiple includeAll
                           v-model="listQuery.status" :widthFull="false"
                           style="width:140px;" class="filter-item" clearable></xui-dict-select>
        </el-form-item>
        <el-form-item label="计划完工时间:" prop="dateGroup">
          <el-date-picker v-model="listQuery.dateGroup" type="monthrange" range-separator="至" :clearable="false"
                          style="width: 180px;" start-placeholder="开始月份" end-placeholder="结束月份"/>
        </el-form-item>
        <el-form-item label="甘特图时间段:" prop="gantDate">
          <el-date-picker v-model="listQuery.gantDate" type="monthrange" range-separator="至" :clearable="false"
                          style="width: 180px;" start-placeholder="开始月份" end-placeholder="结束月份"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" v-if="pageType === 'arrange'" icon="Coordinate" @click="handleApprovalSubmit">提交审批
          </el-button>
          <!--          <el-button type="warning" v-if="pageType === 'arrange'" icon="Delete" @click="handleApprovalCancel">取消申请</el-button>-->
          <el-button type="warning" v-if="pageType === 'approval'" icon="Select" @click="handleApprovalPass">审批通过
          </el-button>
          <el-button type="danger" v-if="pageType === 'approval'" icon="Close" @click="handleApprovalReject">审批驳回
          </el-button>
          <el-button icon="Switch" @click="handleToggleExpand">展开/折叠</el-button>
        </el-form-item>
      </el-form>
      <div class="toolTip">
        <el-button type="primary" @click="handleGoToday" style="margin-right: 10px;">定位到{{ dateTypeDesc }}</el-button>
        <date-type-select @changeDateType="handleChangeDateType"></date-type-select>
        <preview-legend></preview-legend>
      </div>
    </div>
    <div class="app-container app-containerC preview-chart-wrapper" style="height: calc(100% - 33px)">
      <div class="preview-gant-chart">
        <product-list
            ref="productListRef"
            :BGScrollTop="BGScrollTop"
            @tableScrollTop="tableScrollTop"
            @handlerRowClick="handlerRowClick"
            @handlerExpandRow="handlerExpandRow"
        ></product-list>
        <gantt-list ref="ganttListRef"
                    @handleBGScroll="handleBGScroll"
                    @setCurrentRow="setCurrentRow"
                    @handleRefresh="handleRefresh"></gantt-list>
      </div>
    </div>
    <reject-desc-dialog ref="rejectDescDialogRef" @submit="handleRejectDesc"></reject-desc-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ps_050_main_arrange',
}
</script>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, nextTick, defineEmits} from "vue";
import dayjs from 'dayjs'
import slider from "./components/slider";
import leftMenu from "./components/productList";
import planMain from '@/api/plan/planMain'
import {getDictListByKey} from '@/components/xui/dictionary'
import {deepClone} from '@/utils'
import {getData} from './util/testData'
import previewLegend from './components/previewLegend.vue'
import dateTypeSelect from './components/dateTypeSelect.vue'
import constants from "@/utils/constants";
import ganttList from './components/ganttList.vue'
import productList from './components/productList.vue'
import {formatMonthStartDate, formatMonthEndDate} from '@/utils/dateUtil'
import {ElMessage} from "element-plus";
import {useRoute} from 'vue-router'
import {useDeleteConfirm} from "@/components/use/useCommon";
import rejectDescDialog from './components/rejectDescDialog.vue'


const pageTypeEnum = {
  arrange: 'arrange',
  approval: 'approval',
  view: 'view',
}
const pageType = ref(pageTypeEnum.arrange);
const route = useRoute();
const fullPath = route.fullPath;
let approvalStatus = [];
if (fullPath.indexOf('ps_051_main_approval') >= 0) {
  pageType.value = pageTypeEnum.approval;
  approvalStatus = ['2'];
} else if (fullPath.indexOf('ps_052_main_view') >= 0) {
  pageType.value = pageTypeEnum.view
}

const ganttListRef = ref();
const productListRef = ref();
const rejectDescDialogRef = ref();
const intervalMonths = 2;
const list = ref([]);
const BGScrollTop = ref(0);
const expand = ref(false);
const dateTypeDesc = ref('今天');

const listQuery = reactive({
  search: '',
  dateGroup: [dayjs().format('YYYY-MM-DD'),
    dayjs().add(intervalMonths, 'months').format('YYYY-MM-DD')],
  gantDate: [dayjs().subtract(1, "months").format('YYYY-MM-DD'),
    dayjs().add(3, 'months').format('YYYY-MM-DD')],
  status: [],
  op: "",
  opStatus: [],
  approvalStatus,
  workShop: "",
  workShopProduct: "",
  voltage: []
});

const tableScrollTop = (scrollTop) => {
  ganttListRef.value.tableScrollTop(scrollTop);
}

const handlerRowClick = row => {
  ganttListRef.value.handlerRowClick(row);
}

const handlerExpandRow = (row, expand) => {
  ganttListRef.value.handlerExpandRow(row, expand);
}

const handleBGScroll = scrollTop => {
  BGScrollTop.value = scrollTop;
}

const handleToggleExpand = () => {
  expand.value = !expand.value;
  productListRef.value.handleToggleExpandAll(expand.value);
  ganttListRef.value.handleToggleExpandAll(expand.value);
}

const getSelectedRows = () => {
  const selectRows = productListRef.value.getSelectedData();
  return selectRows;
}

const handleApprovalSubmit = async () => {
  let selectRows = getSelectedRows();
  if (selectRows) {
    useDeleteConfirm("是否确定提交审批？").then(async _ => {
      let postParams = {
        planId: selectRows
      }
      let response = await planMain.applayPlan(postParams);
      if (response.err_code === constants.statusCode.success) {
        ElMessage.success("审批已提交");
        getDataList();
      }else{
        ElMessage.error(response.err_msg);
      }
    })
  }
}

const handleApprovalCancel = () => {
  let selectRows = getSelectedRows();
  if (selectRows) {
    //调后台接口，进行申报
  }
}

const handleApprovalPass = async () => {
  let selectRows = getSelectedRows();
  if (selectRows) {
    useDeleteConfirm("是否确定通过？").then(async _ => {
      //调后台接口，进行申报
      let postParams = {
        planId: selectRows,
        approvalStatus: constants.confirmStatus.pass
      }
      let response = await planMain.approvePlan(postParams);
      if (response.err_code === constants.statusCode.success) {
        ElMessage.success("审批已通过");
        getDataList();
      }else{
        ElMessage.error(response.err_msg);
      }
    })
  }
}

const handleApprovalReject = () => {
  let selectRows = getSelectedRows();
  if (selectRows) {
    rejectDescDialogRef.value.init(selectRows);
  }
}

const handleRejectDesc = async (rejectReason, planId) => {
  //调后台接口，进行申报
  let postParams = {
    planId,
    approvalStatus: constants.confirmStatus.reject,
    rejectReason
  }
  let response = await planMain.approvePlan(postParams);
  if (response.err_code === constants.statusCode.success) {
    ElMessage.warning("审批已被驳回");
    getDataList();
  }else{
    ElMessage.error(response.err_msg);
  }
}

const setCurrentRow = row => {
  productListRef.value.setCurrentRow(row);
}

const getParams = () => {
  let params = {
    ...listQuery
  }
  delete params.dateGroup;
  params.strDate = formatMonthStartDate(listQuery.dateGroup[0]) // 开始日期
  params.endDate = formatMonthEndDate(listQuery.dateGroup[1]) // 结束日期
  params.gantStrDate = formatMonthStartDate(listQuery.gantDate[0]) // 开始日期
  params.gantEndDate = formatMonthEndDate(listQuery.gantDate[1]) // 结束日期
  return params;
}

const getDataList = async () => {
  let commonAttr = {
    productOrNodeName: '',
    planStartDate: '',
    planEndDate: '',
    approvalName: '',
    stateName: '',
    pcModel: '',
  };
  let params = getParams();
  let gantMonth = dayjs(params.gantEndDate).diff(dayjs(params.gantStrDate), 'months') + 1;
  if(gantMonth > 12){
    ElMessage.error("甘特图时间段不能超过12个月");
    return;
  }
  let response = await planMain.planListWithNodes(params);
  // let response = getData();
  let resultList = [];
  response.data.forEach(item => {
    let productItem = {
      ...commonAttr,
      ...item,
      _status: item.schedulingStatus,
      productOrNodeName: item.productNo,
      planStartDate: item.planStartDate,
      planEndDate: item.dateEnd,
      dataType: constants.productOrGx.product
    }
    delete productItem.nodeList;
    let children = [];
    if (item.nodeList && item.nodeList.length > 0) {
      item.nodeList.forEach(subItem => {
        if(subItem.pnType == 2){
          let obj = {
            ...commonAttr,
            ...subItem,
            _status: subItem.status,
            productNo: item.productNo,
            planStartDate: subItem.startDate,
            planEndDate: subItem.nodeDate,
            productOrNodeName: subItem.nodeName,
            dataType: constants.productOrGx.gx
          }
          children.push(obj)
        }
      })
    }
    productItem.children = children;
    resultList.push(productItem);
  })
  list.value = resultList;
  initChildComponent(params);
}

const handleSearch = () => {
  getDataList();
}

const handleGoToday = () => {
  ganttListRef.value.handleGoToday();
}

const handleChangeDateType = dateTypeItem => {
  dateTypeDesc.value = dateTypeItem.locationDesc;
  ganttListRef.value.handleChangeDateType(dateTypeItem);
}

const initChildComponent = params => {
  productListRef.value.init(deepClone(list.value));
  ganttListRef.value.init(deepClone(list.value), [params.gantStrDate, params.gantEndDate]);
}

const handleRefresh = () => {
  handleSearch();
}

onMounted(() => {
  handleSearch();
})

</script>

<style lang="scss" scoped>
.filter-container {
  position: relative;
}
</style>

