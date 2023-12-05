<template>
  <div class="app-container app-containerC">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
          <el-form-item label="鉴定单号/名称"  size="small" v-if="needShow">
            <el-input v-model="listQuery.search" placeholder="" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="设备名字/编号"  size="small" v-if="needShow">
            <el-input v-model="listQuery.eqpName" placeholder="" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="设备分类"  size="small" v-if="needShow">
            <el-select v-model="listQuery.eqpClazz"  size="small" placeholder="设备分类" style="width: 120px;" filterable default-first-option>
              <el-option v-for="items in eqCateData" :key="items.id" :label="items.name" :value="items.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="使用部门"  size="small" v-if="needShow">
            <el-select v-model="listQuery.usingDepId"  size="small" placeholder="使用部门" style="width: 120px;" filterable default-first-option>
              <el-option v-for="items in usingDepData" :key="items.k" :label="items.v" :value="items.k" />
            </el-select>
          </el-form-item>
          <el-form-item label="鉴定状态"  size="small">
            <el-select v-model="listQuery.status"  size="small" placeholder="鉴定状态" style="width: 120px;" filterable default-first-option>
              <el-option v-for="items in orderStatus" :key="items.id" :label="items.name" :value="items.id" />
            </el-select>
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary"  @click="onExport()"><svg-icon icon-class="qrcode" /> 导出</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table highlight-current-row 
       id="forExportExcelFile"
        :data="tableData"
        class="otherCon wp"
        stripe
        style="width: 100%;font-size:0.7rem;"
        row-key="id"
        border
      >
        <el-table-column type="expand" width="60" align="center" >
          <template #default="props">
            <!--第二层表格-->
            <el-table highlight-current-row  :data="props.row.details" stripe style="font-size:0.7rem;">
              <el-table-column prop="step" align="center" label="步骤" />
              <el-table-column prop="project" align="center" label="项目" />
              <el-table-column prop="method" align="center" label="检测方法" />
              <el-table-column prop="standardValue" align="center" label="标准值" />
              <el-table-column prop="actualValue" align="center" label="实际值" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="billNum" align="center" label="鉴定单号" />
        <el-table-column prop="name" align="center" label="鉴定名称" />
        <el-table-column prop="eNumber" align="center" label="设备编号" />
        <el-table-column prop="eName" align="center" label="设备名称" />
        <el-table-column prop="usingDepName" align="center" label="设备使用部门" />
        <el-table-column prop="createDt" align="center" width="160" label="任务生成时间" />
        <el-table-column prop="appraisalDate" align="center" label="鉴定日期" />
        <el-table-column prop="equipmentPersonName" align="center" label="设备部验收人" />
        <el-table-column prop="userDepartmentName" align="center" label="使用部门验收人" />
        <el-table-column prop="technologyPersonName" align="center" label="工艺部验收人" />
        <el-table-column prop="personLiableName" align="center" label="责任人" />
        <el-table-column prop="conclusion" align="center" label="鉴定结论">
          <template  #default="scope">
            {{(scope.row.conclusion !=null && scope.row.status===3) ? '经检测设备参数符合标准，确认完好' : scope.row.conclusion}}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" align="center" label="实际开始时间" />
        <el-table-column prop="endDate" align="center" label="实际结束时间" />
        <el-table-column prop="finishDate" align="center" label="验收日期" />
        <el-table-column align="center" label="操作">
          <template  #default="scope">
            <el-button @click="onDelete(scope.row.id)" type="danger"  size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getList" />
    </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import {findTaskList, deleteTask, integrityRecordExport, integrityExport} from '@/api/em/eqp'
import file from '@/api/file/file'
import { $exportExcel} from '@/utils/common'
import Pagination from '@/components/Pagination'
import { getEqCateList, finEqpDep } from '@/api/em/eqpLedger'
import qualificationEquipmentDialog from '@/views/em/emIntegrityAppraisal/qualificationEquipmentDialog'
import {exportData} from "@/utils";
export default {
  name: 'appraiaslTask',
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
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        pg_pagenum: 1,
        pg_pagesize: 10,
        name: '',
        status: null,
        usingDepId: null,
        eqpName: '', // 模糊匹配，点检设备名称
        eqpClazz: '',
      },
      tableData: [],
      childrenData: [],
      usingDepData: [],
      eqCateData: [],
      orderStatus:[
        {
          name:'初始化',
          id:0
        },
        {
          name:'鉴定中',
          id:1
        },
        {
          name:'已鉴定',
          id:2
        },
        {
          name:'已验收',
          id:3
        },
        {
          name:'全部',
          id: -1
        },

      ],
    }
  },
  mounted() {
    this.listQuery.eqpName = this.eqpId
    this.onEqCateQuery()
    this.getEqpDpt()
    this.onQuery()
  },
  methods: {
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
    onDelete(id){
      deleteTask(id).then(res =>{
        if(res.err_code == 10000){
          this.$message({ message: '删除成功', type: 'success' })
          this.onQuery()
        }
      })
    },
    onQuery() {
      findTaskList(this.listQuery).then(res => {
        res.data.forEach(data=>{
          if(data.details!=null) {
            data.details.forEach(item=>{
              if(item.pictures!=null) {
                item.pictures = item.pictures.split(",");
                item.pictures.forEach((i,index)=>{
                  item.pictures[index] = this.$constants.imageUrl + i;
                })
              }
            })
          }
        })
        this.tableData = res.data
        this.total = res.total_count
      })
    },
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery()
    },
    exportExcel(id, name) {
      $exportExcel(id, name)
    },
    onExport() {
      integrityRecordExport([]).then(res=>{
        exportData(res, `设备鉴定记录.xls`)
      })
      // window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/appraisalrc'
    },
  }
}
</script>

<style>
</style>