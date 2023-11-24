<template>
  <div class="app-container app-containerC ">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="关键字">
          <el-input v-model="listQuery.search" placeholder="项目名、生产号、图号"
                    style="width:170px;" @keyup.enter.native="handleSearch" @clear="handleSearch" class="filter-item"
                    clearable/>
        </el-form-item>
        <el-form-item label="状态">
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
          <el-button icon="Check" @click="handleApproval">提交审批</el-button>
          <el-button icon="Switch" @click="handleToggleExpand">展开/折叠</el-button>
        </el-form-item>
      </el-form>
    </div>
    <number-statistical :data-list="list"></number-statistical>
    <div class="app-container app-containerC preview-chart-wrapper" style="height: calc(100% - 33px)">
      <div class="preview-gant-chart">
        <product-list
            ref="productListRef"
            :BGScrollTop="BGScrollTop"
            @TableScrollTop="tableScrollTop"
            @handlerRowClick="handlerRowClick"
        ></product-list>
        <gantt-list ref="ganttListRef"></gantt-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ps_031_mainArrange',
}
</script>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, nextTick, defineEmits} from "vue";
import dayjs from 'dayjs'
import slider from "./components/slider";
import leftMenu from "./components/productList";
import {mapWeeksOfyear} from './util/mapWeeksOfyear'
import planMain from '@/api/plan/planMain'
import {getDictListByKey} from '@/components/xui/dictionary'
import {deepClone} from '@/utils'

import ganttList from './components/ganttList.vue'
import productList from './components/productList.vue'
import {formatMonthStartDate, formatMonthEndDate} from '@/utils/dateUtil'

const ganttListRef = ref();
const productListRef = ref();
const intervalDay = 2;
const list = ref([]);
const BGScrollTop = ref(0);
const expand = ref(true);

const listQuery = reactive({
  search: '',
  dateGroup: [dayjs().format('YYYY-MM-DD'),
    dayjs().add(intervalDay, 'months').format('YYYY-MM-DD')],
  status: [],
  op: "",
  opStatus: [],
  workShop: "",
  workShopProduct: "",
  voltage: []
});

const TableScrollTop = () => {

}

const handleToggleExpand = () => {
  expand.value = !expand.value;
  productListRef.value.handleToggleExpandAll(expand.value);
  ganttListRef.value.handleToggleExpandAll(expand.value);
}

const handleApproval = () => {

}

const getParams = () => {
  let params = {
    ...listQuery
  }
  delete params.dateGroup;
  params.strDate = formatMonthStartDate(listQuery.dateGroup[0]) // 开始日期
  params.endDate = formatMonthEndDate(listQuery.dateGroup[1]) // 结束日期
  /*  params.status = [1];
    params.opStatus = [1];
    params.voltage = [""];*/
  return params;
}

const getDataList = async () => {
  let commonAttr = {
    productOrNodeName: '',
    planStartDate: '',
    planEndDate: '',
    approvalName: '',
    stateName: '',
    itemNm: '',
  };
  let params = getParams();
  let response = await planMain.planListWithNodes(params);
  let resultList = [];
  response.data.forEach(item => {
    let productItem = {
      ...commonAttr,
      ...item,
      productOrNodeName: item.contractNo,
      planStartDate: item.dateEnd,
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

const initChildComponent = params => {
  productListRef.value.init(deepClone(list.value));
  ganttListRef.value.init(deepClone(list.value), [params.strDate, params.endDate]);
}

onMounted(() => {
  handleSearch();
})

</script>

