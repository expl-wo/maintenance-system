<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label=""  size="small" v-if="needShow">
          <el-input v-model="listQuery.eqpName" placeholder="设备名称/编号" style="width: 180px;" class="filter-item"  size="small" clearable />
        </el-form-item>
        <el-form-item label="保养名称"  size="small" v-if="needShow">
          <el-input v-model="listQuery.name" placeholder="保养名称" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="周期保养类型:"  size="small">
          <el-radio-group v-model="listQuery.cycleType">
            <el-radio :label="99">全部</el-radio>
            <el-radio :label="2">日常保养</el-radio>
            <el-radio :label="1">定期保养</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="保养状态"  size="small">
          <el-select v-model="listQuery.status"  size="small" placeholder="保养状态" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in orderStatus" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备分类"  size="small" v-if="needShow">
          <el-select v-model="listQuery.eqpClazz"  size="small" placeholder="设备分类" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in eqCateData" :key="items.id" :label="items.ecName" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间:"  size="small" prop="dateCount">
          <el-date-picker v-model="listQuery.dateGroup" style="width: 240px;" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange" />
        </el-form-item>
        <el-form-item label="使用部门"  size="small" v-if="needShow">
          <el-select v-model="listQuery.usingDepId"  size="small" placeholder="使用部门" clearable style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in usingDepData" :key="items.k" :label="items.v" :value="items.k" />
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
      style="height:100%; width: 100%;font-size:12px;"
      row-key="id"
      border
      :expand-row-keys="expands"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @expand-change="handleExpendRow"
    >
      <el-table-column
        type="expand"
        prop="name"
        width="60"
        align="center"
        label=""
      >
        <template #default="props">

          <!--第二层表格 开始-->
          <el-table stripe  highlight-current-row
            :data="props.row.dicts"
            style="font-size:0.2em;"
          >
            <el-table-column prop="step" width="60" align="center" label="步骤" />
            <el-table-column prop="itemName" align="center"  width="400" label="保养项名称" />
            <el-table-column prop="itemDesc"  align="center" width="400" label="保养项内容" />
            <el-table-column prop="record"  align="center" width="400" label="保养记录" />
            <el-table-column align="center" label="保养照片" width="150">
              <template  #default="scope">
                <el-image class="imgIcon" :src="scope.row.photoPath" style="width: 100px; height: 100px" :preview-src-list="[scope.row.photoPath]"></el-image>
              </template>
            </el-table-column>
          </el-table>
          <!--第二层表格 结束-->

        </template>
      </el-table-column>
      <el-table-column prop="dspNumber" align="center" width="150" label="保养派工单号" />
      <el-table-column prop="usingDepName" align="center" label="设备使用部门" />
      <el-table-column prop="name" align="center" width="150" label="保养名称" />
      <el-table-column prop="eqpId" align="center" label="设备编号" />
      <el-table-column prop="eqpName" align="center" width="150" label="设备名称" />
      <el-table-column prop="mtcDt" align="center" width="100" label="保养日期" />
      <el-table-column prop="mterName" align="center" label="保养责任人" />
      <el-table-column prop="participantNames" align="center" label="保养人员" />
      <el-table-column prop="status" align="center" label="保养状态">
        <template  #default="scope">
          <span v-if="scope.row.status==0">未派工</span>
          <span v-if="scope.row.status==1">已派工</span>
          <span v-if="scope.row.status==2">开始保养</span>
          <span v-if="scope.row.status==3">结束保养</span>
          <span v-if="scope.row.status==4">已验收</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDt" align="center" width="150" label="任务生成时间" />
      <el-table-column prop="starttime" align="center" width="150" label="实际开始时间" />
      <el-table-column prop="endtime" align="center" width="150" label="实际结束时间" />
      <el-table-column prop="mtcDuration" align="center" label="保养时长（分钟）" />
      <el-table-column prop="acceptorName" align="center" label="验收人" />
      <el-table-column prop="acceptTime" align="center" width="150" label="验收时间" />
      <el-table-column  align="center" width="150" label="验收记录" >
        <template  #default="scope">
          <div>风险:{{scope.row.haveRisk==1 ? scope.row.riskDescription : '无'}}</div>
          <div>保养评价：{{scope.row.evaluate == null ? "无" : scope.row.evaluate}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="departmentUserName" align="center" label="使用部门验收人" />
      <el-table-column prop="departmentTime" align="center" width="150" label="使用部门验收时间" />
      <el-table-column prop="eqpDepartmentUserName" align="center" label="设备部门验收人" />
      <el-table-column prop="eqpDepartmentTime" align="center" width="150" label="设备部门验收时间" />
      <el-table-column align="center" width="135" label="查看备件使用情况">
        <template  #default="scope">
          <el-button-group>
            <el-button
               size="small"
              title="查看"
              type="text"
              @click="handleSelect(scope.row)"
            >
              查看
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getList" />

    <!--查看备件-->
    <el-dialog draggable :close-on-click-modal="false" title="查看备件"  v-model="dialogTablePcVisible" class="roleDialog800">
      <table-simple
        :height-table="heightTable"
        :data="tablePcData"
        :row-header="rowPcHeader"
        :total="totalPc"
        :page="listSpQuery.pg_pagenum"
        :limit="listSpQuery.pg_pagesize"
        @pagination="getPcList"
      />
      <div  class="dialog-footer">
        <el-button  size="small" @click="dialogTablePcVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 点检记录查询,点检记录查询,设备保养使用备件记录查询
import { getMainRecList, getItemRecList, getMtcSpList,exportMtcRecord } from '@/api/em/eqpMtc'
import { $exportExcel, timeTranslate } from '@/utils/common.js'
import { finEqpDep, getEqCateList } from '@/api/em/eqpLedger'
import {exportData} from "@/utils";
export default {
  name: 'Table',
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
  components: { Pagination, TableSimple },
  data() {
    return {
      eqCateData: [], // 设备分类下拉列表
      total: 0, // 总个数
      listQuery: {
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        eqpName: '', // 模糊匹配，点检设备名称
        eqpClazz: '', // 设备分类
        strDate: '', // 开始查询日期 yyyy-MM-dd
        endDate: '', // 截止查询日期 yyyy-MM-dd
        dateGroup: [],
        cycleType:99,
        usingDepId: null,
        name:'',
        status:null,
      },
      orderStatus:[
        {
          name: "未派工",
          id:0
        },
        {
          name: "已派工",
          id:1
        },
        {
          name: "开始保养",
          id:2
        },
        {
          name: "结束保养",
          id:3
        },
        {
          name: "已验收",
          id:4
        },
        {
          name: "全部",
          id: -1
        }
      ],
      tableData: [], // 点检配置查询（第一层）
      expands: [], // 控制表格左侧伸缩箭头打开关闭
      expandedRowData: [], // 控制点击向下箭头,展开时有数据，不展开没有数据
      listSpQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        dspNumber: '' // 查询的保养记录保养单号
      },
      heightTable: '300px', // 查看备件弹窗表格高度
      tablePcData: [], // 备件表格
      rowPcHeader: [], // 备件表头
      totalPc: 0, // 备件条数
      dialogTablePcVisible: false, // 查看备件弹窗显示隐藏
      usingDepData: [],
    }
  },
  mounted() {
    this.listQuery.eqpName= this.eqpId
    this.onQuery()
    this.onPcload() // 备件表头
    this.onEqCateQuery()
    this.getEqpDpt()
  },
  methods: {
    // 按时间倒序分页查询工序计划列表的简单信息，主用于在下拉列表中显示
    onEqCateQuery() {
      this.eqCateData = [{ 'id': '', 'ecName': '全部' }]
      getEqCateList().then(response => {
        response.data.forEach((dd) => {
          this.eqCateData.push(dd)
        })
      })
    },
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 备件表头
    onPcload() {
      const self = this
      self.rowPcHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'spName',
          align: 'center',
          label: '备件名称'
        },
        {
          prop: 'spNumber',
          align: 'center',
          label: '备件编号'
        },
        {
          prop: 'spUseQty',
          align: 'center',
          label: '使用数量'
        },
        {
          prop: 'spUnit',
          align: 'center',
          label: '单位'
        }
      ]
    },
    // 点检配置查询（第一层）
    onQuery() {
      getMainRecList(this.listQuery).then(response => {
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
      getItemRecList({ id: row.id }).then(response => {
        const index = this.tableData.findIndex(data => data.id === row.id)
        this.tableData[index].dicts = response.data
      })
    },
    // 查看备件使用情况
    handleSelect(row) {
      this.dialogTablePcVisible = true
      this.listSpQuery.dspNumber = row.dspNumber // 查询的保养记录保养单号
      // getMtcSpList(this.listSpQuery).then(response => {
      //   this.tablePcData = response.data
      //   this.totalPc = response.total_count
      // })
    },
    getPcList(val) {
      this.listSpQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listSpQuery.pg_pagesize = val.limit
      }
      this.onSpQuery() // 查询
    },
    onSpQuery(){

    },
    exportExcel(id, name) {
      $exportExcel(id, name)
    },
    dateChange(event) {
      if (event) {
        this.listQuery.strDate = timeTranslate(this.listQuery.dateGroup[0]) // 开始日期
        this.listQuery.endDate = timeTranslate(this.listQuery.dateGroup[1]) // 结束日期
      } else {
        this.listQuery.strDate = '' // 开始日期
        this.listQuery.endDate = '' // 结束日期
      }
      this.onQuery()
    },
    getEqpDpt() {
      finEqpDep().then(res=>{
        this.usingDepData = res.data
      })
    },
    onExport() {
      exportMtcRecord().then(res =>{
        exportData(res, `设备保养记录.xls`)
      })
    },
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
