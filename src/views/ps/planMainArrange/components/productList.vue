<template>
  <div class="left" :style="{ width: rightLineX + 'px' }" :class="{'is-active':true}">
    <div class="tableMneu">
      <el-table
          ref="tableRef"
          :data="dataList"
          border stripe
          style="width: 100%;font-size: 0.7rem"
          height="100%"
          default-expand-all
          highlight-current-row
          @row-click="handlerRowClick"
          @expand-change="handlerExpand"
          :cell-class-name="cellClassName"
      >
        <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="生产号/工序"
            property="productNo"
            width="120">
        </el-table-column>
        <el-table-column
            align="center"
            label="计划开始"
            property="planStartDate"
            width="100">
          <template #default="{row}">
            {{ $filters.formatSimpleDate(row.planStartDate) }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="计划结束"
            property="planEndDate"
            width="100">
          <template #default="{row}">
            {{ $filters.formatSimpleDate(row.planEndDate) }}
          </template>
        </el-table-column>

        <el-table-column
            header-align="center"
            align="center"
            label="审批状态"
            property="stateName"
            width="110">
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="生产状态"
            property="stateName"
            width="110">
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="型号"
            property=""
            show-overflow-tooltip
            width="155">
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="产值"
            property="processStatus"
            width="120"
        >
          <template #default="{row}">
            <xui-dictionary itemCode="processStatus" :code="scope.row.processStatus"></xui-dictionary>
          </template>
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="产量"
            property="stateName"
            show-overflow-tooltip
            width="110">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, watch, reactive, nextTick, defineEmits} from "vue";
import {transformDictDetail} from '@/components/xui/dictionary'

const props = defineProps({
  list: Array,
  BGScrollTop: Number
})
const emits = defineEmits(["handlerRowClick", "tableScrollTop"])

const dataList = ref([]);
const rightLineX = ref(560);

const currentRow = ref({});
const tableRef = ref();

watch(() => props.BGScrollTop, () => {
  if (tableRef.value) {
    let tableWrapper = tableRef.value.bodyWrapper;
    tableWrapper.scrollTo(0, props.BGScrollTop);
  }
})

const handlerWatchScroll = () => {
  let table = tableRef.value.bodyWrapper;
  table.addEventListener("scroll", e => {
    emits("tableScrollTop", e.srcElement.scrollTop);
  });
}

const cellClassName = ({row, column, rowIndex, columnIndex}) => {
  if (column.property === 'processStatus') {
    //从字典中获取数据
    return transformDictDetail(column.property, row[column.property], 'remark')
  } else {
    return ''
  }
}

const toggleRowExpansion = (isExpansion) => {
  this.toggleRowExpansion_forAll(dataList.value, isExpansion);
}

const toggleRowExpansion_forAll = (data, isExpansion) => {
  data.forEach(item => {
    tableRef.value.toggleRowExpansion(item, isExpansion);
    if (item.children != undefined && item.children != null) {
      this.toggleRowExpansion_forAll(item.children, isExpansion);
    }
  })
}

const handlerSelect = (row) => {
  tableRef.value.setCurrentRow(row);
}

const handlerRowClick = (row, column) => {
  if (row.type != 3) {
    emits("handlerRowClick", row);
  }
}

const setScroll = (scrollTop) => {
  let table = tableRef.value;
  const divData = table.bodyWrapper;
  divData.scrollTop = scrollTop;
}
const setFirstRowSelected = () => {
  if (props.list.length > 0) {
    tableRef.value.setCurrentRow(props.list[0])
    emits('handlerRowClick', props.list[0]);
  }
}

const handleToggleExpandAll = expand =>{
  toggleRowExpansion(expand);
}

const init = tempDataList => {
  dataList.value = tempDataList;
  nextTick(() => {
    setScroll(0);
  });
}

defineExpose({
  init,
  handleToggleExpandAll
})
</script>

