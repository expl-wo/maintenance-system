<template>
  <div class="app-container app-containerC ">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="月" >
          <el-date-picker
              v-model="listQuery.month"
              type="month"
              placeholder="选择月"
              size="small"
              value-format="YYYY-MM"
              style="width: 100px"
              :default-value="new Date()"
              @change="monthChange"
          />
        </el-form-item>
        <el-form-item label="周">
          <el-select v-model="listQuery.week" style="width: 210px" placeholder="选择周" @change="weekChange">
            <el-option v-for="(item,index) in weekData" :key="index" :label="item.v" :value="item.k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点">
          <el-select multiple v-model="listQuery.nodeId" style="width: 210px" placeholder="筛选节点" clearable>
            <el-option v-for="(item,index) in nodeData" :key="index" :label="item.k" :value="item.v"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="Download" @click="onExport">结果导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-affix :offset="116"  style="width: 100%;">
        <el-table
            border
            :data="dataModel"
            class="otherCon wp  myTable headerTable"
            :header-cell-class-name="headerClassName"
            stripe
            id="TableHeader"
            :cell-class-name="cellClassName"
            lazy
        >
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" label="生产号" prop="productNo"></el-table-column>
          <el-table-column align="center" label="型号"   prop="pcModel"></el-table-column>
          <el-table-column align="center" label="台数"   prop="">1</el-table-column>
          <el-table-column align="center" label="状态" width="200"  prop="status">
            <template #default="scope">
              <span v-if="scope.row.status == -100">已取消</span>
              <span v-if="scope.row.status == -50">冻结</span>
              <span v-if="scope.row.status == -5">返工</span>
              <span v-if="scope.row.status ==  0">待排产</span>
              <span v-if="scope.row.status ==  5">仅拆解计划</span>
              <span v-if="scope.row.status ==  10">预排节点计划</span>
              <span v-if="scope.row.status ==  15">已下发计划</span>
              <span v-if="scope.row.status ==  20">开工中</span>
              <span v-if="scope.row.status ==  25">已完工</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="计划产值" prop="noTaxAmount"></el-table-column>
          <el-table-column align="center" label="实际产值" prop="">
            <template #default="scope">
          <span v-if="scope.row.status == 25  ">
            {{scope.row.noTaxAmount}}
          </span>
              <span v-else}}>
            0.00
          </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="计划产量" prop="outPut"></el-table-column>
          <el-table-column align="center" label="实际产量" prop="">
            <template #default="scope">
          <span v-if="scope.row.status == 25  ">
            {{scope.row.outPut}}
          </span>
              <span v-else}}>
            0.00
          </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="计划开工" prop="planStartDate"></el-table-column>
          <el-table-column align="center" label="计划完工" prop="planCompletime"></el-table-column>
          <el-table-column align="center" label="实际完工" prop="finishDate"></el-table-column>
        </el-table>
      </el-affix>
      <el-table
          border
          :data="item"
          :key="index"
          class="otherCon wp myTable"
          v-for="(item,index) in tableData"
          :show-header="false"
          show-summary
          stripe
          :id="'TableRef'+index"
          :summary-method="getSummaries"
          :cell-class-name="cellClassName"
          lazy
      >
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" label="生产号" prop="productNo"></el-table-column>
        <el-table-column align="center" label="型号"   prop="pcModel"></el-table-column>
        <el-table-column align="center" label="台数"   prop="">1</el-table-column>
        <el-table-column align="center" label="状态" width="200"  prop="status">
          <template #default="scope">
            <span v-if="scope.row.status == -100">已取消</span>
            <span v-if="scope.row.status == -50">冻结</span>
            <span v-if="scope.row.status == -5">返工</span>
            <span v-if="scope.row.status ==  0">待排产</span>
            <span v-if="scope.row.status ==  5">仅拆解计划</span>
            <span v-if="scope.row.status ==  10">预排节点计划</span>
            <span v-if="scope.row.status ==  15">已下发计划</span>
            <span v-if="scope.row.status ==  20">开工中</span>
            <span v-if="scope.row.status ==  25">已完工</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="计划产值" prop="noTaxAmount"></el-table-column>
        <el-table-column align="center" label="实际产值" prop="">
          <template #default="scope">
          <span v-if="scope.row.status == 25  ">
            {{scope.row.noTaxAmount}}
          </span>
            <span v-else}}>
            0.00
          </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="计划产量" prop="outPut"></el-table-column>
        <el-table-column align="center" label="实际产量" prop="">
          <template #default="scope">
          <span v-if="scope.row.status == 25  ">
            {{scope.row.outPut}}
          </span>
            <span v-else}}>
            0.00
          </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="计划开工" prop="planStartDate"></el-table-column>
        <el-table-column align="center" label="计划完工" prop="planCompletime"></el-table-column>
        <el-table-column align="center" label="实际完工" prop="finishDate"></el-table-column>
      </el-table>
      <div v-show="tableData.length === 0" >
        <el-empty  description="暂无数据" />
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
import {onMounted, reactive} from "vue";
import planWeek from '@/api/plan/planWeek'
import dayjs from "dayjs";
import {transformDictDetail} from "@/components/xui/dictionary";
import constants from "@/utils/constants";
import {exportData} from "@/utils";
import XLSX from "xlsx";
const dataModel = reactive([])
const nodeData = reactive([])
const listQuery = reactive({
  pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
  pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
  month:dayjs(new Date()).format("YYYY-MM"),
  week:'',
  nodeId:[]
});
onMounted(() => {
  getWeek();
})
const cellClassName = ({row, column, rowIndex, columnIndex}) => {
  if (column.property === 'status') {
    //从字典中获取数据
    return transformDictDetail('mainPlanStatus', row.status, 'remark')
  } else if(column.type ==='selection' && row.dataType === constants.productOrGx.gx){
    return 'hidden-checkbox';
  }else{
    return ''
  }
}
const weekData = reactive([])
const tableData = reactive([]);

const handleSearch = () => {
  listQuery.pg_pagenum = 1
  getDataList();
}
const getDataList = () => {
  let data = []
  planWeek.weekPlanList(listQuery).then(res =>{
    if ((res as any).err_code === 10000){
      data = res.data
      tableData.length = 0;
      Object.assign(tableData, data);
    }
  })
}

const getWeek = () =>{
  weekData.length = 0;
  let data = []
  planWeek.getWeekList(listQuery).then(res =>{
    if ((res as any).err_code === 10000){
      data = res.data
      Object.assign(weekData, data);
    }
  })

}
const monthChange = () =>{
  listQuery.week = ''
  listQuery.nodeId = []
  getWeek()
}
const weekChange = () => {
  nodeData.length = 0
  listQuery.nodeId = []
  let data = []
  planWeek.getNodeData(listQuery).then(res =>{
    if ((res as any).err_code === 10000){
      data = res.data
      Object.assign(nodeData, data);
    }
  })
}
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = data[0].name
      return
    }
    if (index === 2) {
      sums[index] = '合计'
      return
    }
    if (index === 3) {
      sums[index] = data.length
      return
    }
    if (index === 6){
      const values = data.map(item =>{
        if(item.status == 25 ){
          return Number(item.noTaxAmount);
        }else {
          return 0;
        }
      })
      sums[index] =`${values.reduce(
          (prev, curr) => {
            const value = Number(curr)
            if (!Number.isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)}`
      return
    }
    if (index === 8){
      const values = data.map(item =>{
        if(item.status == 25 ){
          return Number(item.outPut);
        }else {
          return 0;
        }
      })
      sums[index] =`${values.reduce(
          (prev, curr) => {
            const value = Number(curr)
            if (!Number.isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)}`
      return
    }
    if (index === 11){
      return;
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value)&&value != null)) {

      sums[index] = `${values.reduce(
          (prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })
  sums[4] = "产值完成:"+Number(sums[6])/Number(sums[5])+"%" +"，产量完成:"+Number(sums[8])/Number(sums[7])+"%"
  return sums
}

const headerClassName = () => {
  return 'header-fixed';
}
const onExport = () =>{
  const workbook = XLSX.utils.book_new();
  const wsHeader = XLSX.utils.table_to_sheet(document.querySelector('#TableHeader'));//对应要导出的表格id
  let colInfo = []
  tableData.forEach( (item,index) =>{
    const wsBody = XLSX.utils.table_to_sheet(document.querySelector('#TableRef'+index));//对应要导出的表格id
    const range =  XLSX.utils.decode_range(wsBody["!ref"]);
    console.log(wsBody)
    for (let i = 0; i <= range.e.r; i++) {
      let colData = {};
      // console.log(wsBody)
      for (let j = 0; j < range.e.c; j++) {
        const col = XLSX.utils.encode_col(j);
        const colName =  wsHeader[''+col+'1'].v
        colData[""+colName]=wsBody[''+col+(i+1)].v
      }
      // console.log(colData)
      colInfo.push(colData)
    }

  })
  const ws = XLSX.utils.sheet_add_json({},colInfo)
  XLSX.utils.book_append_sheet(workbook, ws, "sheet1");
  /* get binary string as output */
  const wbOut = XLSX.write(workbook, {
    bookType: "xls",
    bookSST: true,
    type: "array"
  });
  try {
    exportData(wbOut,"生产周计划.xls")
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbOut);
  }
  return wbOut;
}

</script>
<style lang="scss" scoped>
:deep(.el-table .el-table__row){
  height:3vh !important;
}

:deep(.el-table tfoot td.el-table__cell){
  background: #89adff !important;
  color: #000000;
}
:deep(.el-table .el-table__header-wrapper){
  width: 100%;
  font-size: 12px;
}
:deep(.headerTable .el-table__body-wrapper){
  width: 100%;
  display: none;
}
:deep(.el-table .header-fixed){
  background: #7292cc;
  color: black;
  height: 4vh;
  font-size: 15px;
}
:deep(.el-table thead .cell){
  color: #ffffff;
}
.myTable{
  min-width: 1200px;
}
.table-container {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  overflow-x: scroll;
}
</style>

