<template>
  <div class="left" :style="{ width: rightLineX + 'px' }" :class="{'is-active':true}">
    <div class="tableMneu">
      <el-table
          ref="tableRef"
          :data="dataList"
          border stripe
          size="medium"
          class="el-table__row-pointer"
          height="100%"
          default-expand-all
          highlight-current-row
          row-key="id"
          @row-click="handlerRowClick"
          @expand-change="handlerExpand"
          :cell-class-name="cellClassName"
          scrollbar-always-on
      >
        <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
        </el-table-column>
        <el-table-column
            header-align="center"
            align="left"
            label="生产号/工序"
            property="productOrNodeName"
            width="160">
        </el-table-column>
        <el-table-column
            align="center"
            label="计划开始"
            property="planStartDate"
            width="90">
          <template #default="{row}">
            {{ $filters.formatSimpleDate(row.planStartDate) }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="计划结束"
            property="planEndDate"
            width="90">
          <template #default="{row}">
            {{ $filters.formatSimpleDate(row.planEndDate) }}
          </template>
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="审批状态"
            property="approvalName"
            width="100">
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="生产进度"
            property="processStatus"
            width="110">
          <template #default="{row}">
            <xui-dictionary itemCode="processStatus" :code="row.processStatus"></xui-dictionary>
          </template>
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="型号"
            property="pcModel"
            show-overflow-tooltip
            width="155">
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="产值"
            property="noTaxAmount"
            width="120"
        >
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            label="产量"
            property="outPut"
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
import {ElMessage} from "element-plus";

const props = defineProps({
  list: Array,
  BGScrollTop: Number
})
const emits = defineEmits(["handlerRowClick", "tableScrollTop", "handlerExpandRow"])

const dataList = ref([]);
const rightLineX = ref(600);

const currentRow = ref({});
const tableRef = ref();

watch(() => props.BGScrollTop, () => {
  if (tableRef.value) {
    tableRef.value.setScrollTop(props.BGScrollTop);
  }
})

const handlerWatchScroll = () => {
  let tableScrollBarRef = tableRef.value.$refs.scrollBarRef.wrapRef;
  tableScrollBarRef.addEventListener("scroll", e => {
    emits("tableScrollTop", e.srcElement.scrollTop);
  });
}

const handleScroll = position => {
  debugger
  emits("tableScrollTop", position);
}

const handlerExpand = (row, expand) => {
  emits("handlerExpandRow", row, expand);
}

const cellClassName = ({row, column, rowIndex, columnIndex}) => {
  if (column.property === 'processStatus') {
    //从字典中获取数据
    return transformDictDetail('processStatus', row.processStatus, 'remark')
  } else {
    return ''
  }
}

const toggleRowExpansion = (isExpansion) => {
  toggleRowExpansion_forAll(dataList.value, isExpansion);
}

const toggleRowExpansion_forAll = (data, isExpansion) => {
  data.forEach(item => {
    tableRef.value.toggleRowExpansion(item, isExpansion);
    if (item.children != undefined && item.children != null) {
      toggleRowExpansion_forAll(item.children, isExpansion);
    }
  })
}

const handlerSelect = (row) => {
  tableRef.value.setCurrentRow(row);
}

const handlerRowClick = (row, column) => {
  emits("handlerRowClick", row);
}

const setScroll = (scrollTop) => {
  const divData = tableRef.value.$refs.bodyWrapper;
  divData.scrollTop = scrollTop;
}
const setFirstRowSelected = () => {
  if (dataList.value.length > 0) {
    tableRef.value.setCurrentRow(props.list[0])
    emits('handlerRowClick', props.list[0]);
  }
}

const handleToggleExpandAll = expand => {
  toggleRowExpansion(expand);
}

const init = tempDataList => {
  dataList.value = tempDataList;
  nextTick(() => {
    setScroll(0);
  });
}

//获取选中的行
const getSelectedData = ()=>{
  let selectRows = tableRef.value.getSelectionRows();
  if(selectRows.length <= 0){
    ElMessage.warning("请勾选数据后再提交审批");
    return [];
  }
  return selectRows;
}

const setCurrentRow = row => {
  if (!row) {
    tableRef.value.setCurrentRow();
  } else {
    dataList.value.some(item => {
      if (item.id === row.id) {
        tableRef.value.setCurrentRow(item);
        return true;
      }
      if (item.children && item.children.length > 0) {
        item.children.some(subItem => {
          if (subItem.id === row.id) {
            tableRef.value.setCurrentRow(subItem);
          }
        })
      }
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    handlerWatchScroll();
  }, 1000)
})

defineExpose({
  init,
  handleToggleExpandAll,
  setCurrentRow,
  getSelectedData
})
</script>

