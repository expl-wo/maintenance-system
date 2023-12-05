<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label=""  size="small" v-if="needShow">
          <el-input v-model="listQuery.creatorName" placeholder="点检人" style="width: 130px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="点检类型:"  size="small">
          <el-radio-group v-model="listQuery.checkType">
            <el-radio :label="100">全部</el-radio>
            <el-radio :label="0">日常点检</el-radio>
            <el-radio :label="1">专业点检</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否完成:"  size="small">
          <el-radio-group v-model="listQuery.status">
            <el-radio :label="100">全部</el-radio>
            <el-radio :label="0">未完成</el-radio>
            <el-radio :label="1">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=""  size="small" v-if="needShow">
          <el-input v-model="listQuery.eqpName" placeholder="设备名称/编号" style="width: 130px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="设备分类"  size="small" v-if="needShow">
          <el-select v-model="listQuery.eqpClazz"  size="small" placeholder="设备分类" style="width: 120px;" filterable default-first-option>
            <el-option v-for="(items,index) in eqCateData" :key="index" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间:"  size="small" prop="dateCount">
          <el-date-picker v-model="listQuery.dateGroup" type="daterange" style="width: 230px;" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange" />
        </el-form-item>
        <el-form-item label="使用部门"  size="small" v-if="needShow">
          <el-select v-model="listQuery.usingDepId"  size="small" placeholder="使用部门" style="width: 120px;" filterable default-first-option>
            <el-option v-for="(items,index) in usingDepData" :key="index" :label="items.v" :value="items.k" />
          </el-select>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Download" @click="onExport">结果导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe  highlight-current-row
      id="forExportExcelFile"
      :data="tableData"
      class="otherCon wp"
      style="width: 100%;font-size:0.7rem;"
      row-key="id"
      border
      :expand-row-keys="expands"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @expand-change="handleExpendRow"
    >
      <el-table-column type="expand" prop="name" width="60" align="center" label="">
        <template #default="props">
          <!--第二层表格 开始-->
          <el-table stripe  highlight-current-row  :data="props.row.dicts"  style="font-size:0.7rem;">
            <el-table-column prop="step" width="60" align="center" label="步骤" />
            <el-table-column prop="itemName" align="center" width="300" label="点检项名称" />
            <el-table-column prop="itemDesc" align="center" label="点检内容" />
            <el-table-column prop="value" align="center" width="100" label="点检值">
              <template  #default="scope">
                {{ scope.row.value }} {{ scope.row.unit==null?'':('【'+scope.row.unit+'】') }}
              </template>
            </el-table-column>
            <el-table-column prop="result" width="70" align="center" label="点检结果">
              <template  #default="scope">
                {{ scope.row.result == 1 ? '通过' : '不通过' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="点检照片" width="150">
              <template  #default="scope">
                <el-image class="imgIcon" :src="scope.row.photoPath" style="width: 100px; height: 100px" :preview-src-list="[scope.row.photoPath]"></el-image>
              </template>
            </el-table-column>
          </el-table>
          <!--第二层表格 结束-->

        </template>
      </el-table-column>
      <el-table-column prop="eqpNumber" align="center" width="160" label="设备编码" />
      <el-table-column prop="eqpName" align="center" label="设备名称" />
      <el-table-column prop="usingDepName" align="center" label="设备使用部门" />
      <el-table-column prop="managerName" align="center" label="责任人" />
      <el-table-column prop="type" align="center" label="点检类型">
        <template  #default="scope">
          <div v-if="scope.row.type == 0">日常点检</div>
          <div v-if="scope.row.type == 1">专业点检</div>
        </template>
      </el-table-column>
      <el-table-column prop="createDt" align="center" width="160" label="任务生成时间" />
      <el-table-column prop="starttime" align="center" width="160" label="开始时间" />
      <el-table-column prop="endtime" align="center" width="160" label="结束时间" />
      <el-table-column prop="duration" align="center" width="160" label="点检时长" />
      <el-table-column prop="opMan" align="center" width="130" label="操作人" />
    </el-table>
    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 点检记录查询,点检记录查询
import { getMainRec, getItemRec,exportCheckRecord } from '@/api/em/eqpCheck'
import { $exportExcel, timeTranslate } from '@/utils/common'
import {getEqCateList, finEqpDep, equipExport} from '@/api/em/eqpLedger'
import {exportData} from "@/utils";
export default {
  name: 'Table',
  components: { Pagination },
  props: {
    eqpId: {
      required: false,
      type: String
    },
    needShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      eqCateData: [], // 设备分类下拉列表
      total: 0, // 总个数
      listQuery: {
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        creatorName: '', // 模糊匹配，点检人
        eqpName: '', // 模糊匹配，点检设备名称
        eqpClazz: '', // 设备分类
        strDate: '', // 开始查询日期 yyyy-MM-dd
        endDate: '', // 截止查询日期 yyyy-MM-dd
        dateGroup: [],
        usingDepId: null,
        checkType:100,
        status:100
      },
      tableData: [], // 点检配置查询（第一层）
      expands: [], // 控制表格左侧伸缩箭头打开关闭
      expandedRowData: [], // 控制点击向下箭头,展开时有数据，不展开没有数据
      usingDepData: [],
    }
  },
  mounted() {
    this.listQuery.eqpName = this.eqpId
    this.onEqCateQuery()
    this.getEqpDpt()
    this.onQuery()
  },
  methods: {
    init(id){
      console.log("eqp:"+id)
      this.listQuery.eqpName=id
      this.onBtnQuery()
    },
    // 按时间倒序分页查询工序计划列表的简单信息，主用于在下拉列表中显示
    onEqCateQuery() {
      this.eqCateData = [{ 'id': '', 'name': '全部' }]
      getEqCateList().then(response => {
        response.data.forEach((dd) => {
          this.eqCateData.push(dd)
        })
        this.eqCateData.push({ 'id': '-1', 'name': '未分类' })
      })
    },
    getEqpDpt() {
      finEqpDep().then(res=>{
        this.usingDepData = res.data
      })
    },
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 点检配置查询（第一层）
    onQuery() {
      getMainRec(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
        this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
      })
    },
    // 分页数据发生变化
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },
    // 判断有没有展开的下拉项，有的话重新查找
    isDropItem() {
      if (this.expandedRowData.length > 0) {
        this.handleExpendRow(this.expandedRowData[0], this.expandedRowData)
      }
    },
    // 点击向下箭头
    handleExpendRow(row, expandedRows) {
      // 判断有没有展开的点检项
      var checkInt = 0
      expandedRows.forEach(item => {
        if (item.id == row.id) {
          checkInt++
          this.expandedRowData = [item]
        }
      })
      checkInt == 0 ? this.expandedRowData = [] : this.expandedRowData
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
      } else {
        this.expands = []
      }
      this.queryDictData(row, row.labelType) // 关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息
    },
    queryDictData(row, labelType) {
      getItemRec({ mainRecId: row.id }).then(response => {
        const index = this.tableData.findIndex(data => data.id === row.id) // 首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
        this.$set(this.tableData[index], 'dicts', response.data) // 这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
      })
    },
    exportExcel(id, name) {
      $exportExcel(id, name)
    },
    onExport() {
      exportCheckRecord(this.listQuery).then(res => {
        exportData(res, `设备点检记录.xls`)
      })

    },
    dateChange(event) {
      this.listQuery.pg_pagenum = 1
      if (event) {
        this.listQuery.strDate = timeTranslate(this.listQuery.dateGroup[0]) // 开始日期
        this.listQuery.endDate = timeTranslate(this.listQuery.dateGroup[1]) // 结束日期
      } else {
        this.listQuery.strDate = '' // 开始日期
        this.listQuery.endDate = '' // 结束日期
      }
      this.onQuery()
    }
  }
}
</script>

<style scoped>
.imgIcon{
  width:40px;
  height:40px;
  border-radius: 3px;
}
</style>
