<template>
  <div class="app-container app-containerC ">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="关键字">
          <el-input v-model="listQuery.search" placeholder="项目名、生产号、图号"
                    style="width:170px;" @keyup.enter.native="handleSearch" @clear="handleSearch" class="filter-item"
                    clearable/>
        </el-form-item>
        <el-form-item label="审批状态">
          <xui-dict-select item-code="mainConfirmStatus" multiple includeAll
                           v-model="listQuery.approvalStatus"
                           style="width:160px;" class="filter-item" clearable></xui-dict-select>
        </el-form-item>
        <el-form-item label="生产状态">
          <xui-dict-select item-code="mainPlanStatus" multiple includeAll
                           v-model="listQuery.status"
                           style="width:160px;" class="filter-item" clearable></xui-dict-select>
        </el-form-item>
        <el-form-item label="计划完工时间:" prop="dateCount">
          <el-date-picker v-model="listQuery.dateGroup" type="monthrange" range-separator="至" :clearable="false"
                          style="width: 240px;" start-placeholder="开始月份" end-placeholder="结束月份"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" v-if="pageType === 'arrange'" icon="Coordinate" @click="handleApprovalSubmit">提交审批</el-button>
          <el-button type="warning" v-if="pageType === 'arrange'" icon="Delete" @click="handleApprovalCancel">取消申请</el-button>
          <el-button type="warning" v-if="pageType === 'approval'" icon="Select" @click="handleApprovalPass">审批通过</el-button>
          <el-button type="danger" v-if="pageType === 'approval'" icon="Close" @click="handleApprovalReject">审批驳回</el-button>
          <el-button icon="Switch" @click="handleToggleExpand">展开/折叠</el-button>
        </el-form-item>
      </el-form>
      <div class="toolTip">
        <el-button type="primary" @click="handleGoToday" style="margin-right: 10px;">定位到{{dateTypeDesc}}</el-button>
        <date-type-select @changeDateType="handleChangeDateType"></date-type-select>
        <preview-legend></preview-legend>
      </div>
    </div>
    <number-statistical :data-list="list"></number-statistical>
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

const pageTypeEnum = {
  arrange: 'arrange',
  approval: 'approval',
  view: 'view',
}
const pageType = ref(pageTypeEnum.arrange);
const route = useRoute();
const fullPath = route.fullPath;
let approvalStatus = [];
if (fullPath.indexOf('ps_051_main_approval')>=0) {
  pageType.value = pageTypeEnum.approval;
  approvalStatus = ['2'];
}else if(fullPath.indexOf('ps_052_main_view')>=0){
  pageType.value = pageTypeEnum.view
}

const ganttListRef = ref();
const productListRef = ref();
const intervalDay = 2;
const list = ref([]);
const BGScrollTop = ref(0);
const expand = ref(true);
const dateTypeDesc = ref('今天');

const listQuery = reactive({
  search: '',
  dateGroup: [dayjs().format('YYYY-MM-DD'),
    dayjs().add(intervalDay, 'months').format('YYYY-MM-DD')],
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

const getSelectedRows = ()=>{
  const selectRows = productListRef.value.getSelectedData();
  if (selectRows.length > 0) {
    //过滤出生产数据
    const productDataList = selectRows.filter(item => {
      return item.dataType === constants.productOrGx.product
    })
  }
  if (!productDataList || productDataList.length === 0) {
    ElMessage.warning("请勾选生产号行数据后，提交审批");
    return;
  }
  return selectRows;
}

const handleApprovalSubmit = () => {
  let selectRows = getSelectedRows();
  if(selectRows){
    //调后台接口，进行申报
  }
}

const handleApprovalCancel = ()=>{
  let selectRows = getSelectedRows();
  if(selectRows){
    //调后台接口，进行申报
  }
}

const handleApprovalPass = ()=>{
  let selectRows = getSelectedRows();
  if(selectRows){
    //调后台接口，进行申报
  }
}

const handleApprovalReject = ()=>{
  let selectRows = getSelectedRows();
  if(selectRows){
    useDeleteConfirm("是否确定驳回？").then(response=>{

    })
    //调后台接口，进行申报
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
  // let response = await planMain.planListWithNodes(params);
  let response = getData();
  let resultList = [];
  response.data.forEach(item => {
    let productItem = {
      ...commonAttr,
      ...item,
      productOrNodeName: item.productNo,
      planStartDate: item.planStartDate,
      planEndDate: item.dateEnd,
    }
    delete productItem.nodeList;
    let children = [];
    if (item.nodeList && item.nodeList.length > 0) {
      item.nodeList.forEach(subItem => {
        let obj = {
          ...commonAttr,
          ...subItem,
          planStartDate: subItem.startDate,
          planEndDate: subItem.nodeDate,
          productOrNodeName: subItem.nodeName
        }
        children.push(obj)
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

const handleChangeDateType = dateTypeItem=>{
  dateTypeDesc.value = dateTypeItem.locationDesc;
  ganttListRef.value.handleChangeDateType(dateTypeItem);
}

const initChildComponent = params => {
  productListRef.value.init(deepClone(list.value));
  ganttListRef.value.init(deepClone(list.value), [params.strDate, params.endDate]);
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

