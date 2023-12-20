<template>
  <div class="wp hp app-containerC">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="干燥罐" size="small">
          <el-select v-model="listQuery.tankCodeId" @change="getRecord()" clearable placeholder="请选择">
            <el-option
              v-for="item in tankData"
              :key="item.id"
              :label="item.dryingTankCode"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产号" size="small">
          <el-input v-model="listQuery.productNo" placeholder="生产号" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="入炉时间" size="small">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" icon="el-icon-search" @click="getRecord()">{{ $t('button.query') }}</el-button>
          <el-button type="primary" size="small" @click="recordExport()">记录导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table highlight-current-row
              :data="tableData"
              class="otherCon wp"
              stripe
              row-key="id"
              border
              :row-style="{height: '54px'}"
              :cell-style="{borderColor:'#538bea',borderStyle:'double'}"
    >
      <el-table-column prop="dryingTankCode" align="center" width="160" label="干燥罐"/>
      <el-table-column prop="dryingProcessCode" align="center" width="115" label="工艺方案" />
      <el-table-column prop="processMode" align="center" width="80" label="工艺方式" />
      <el-table-column prop="dryingProducts" align="center" width="200"  label="生产号"/>
      <el-table-column prop="putDate" align="center" width="150" label="入炉时间"/>
      <el-table-column prop="dryingDate" align="center" width="80" label="干燥时间(h)"/>
      <el-table-column prop="planOutDate" align="center" width="150" label="预计出炉时间"/>
      <el-table-column prop="outDate" align="center" width="150" label="车间实际出炉时间"/>
      <el-table-column prop="delayDate" align="center" width="80" label="延迟时间(h)"/>
      <el-table-column prop="reason" align="center" width="120" label="原因"/>
      <el-table-column prop="remarks" align="center" width="120" label="备注"/>
      <el-table-column prop="creatorName" align="center" width="80" label="登记人"/>
      <el-table-column prop="createDt" align="center" width="90" label="登记时间"/>
      <el-table-column prop="insulationWeight" align="center" width="100" label="绝缘重量统计"/>
      <el-table-column prop="putCheck" align="center" width="120" label="检查情况(入炉)"/>
      <el-table-column prop="outCheck" align="center" width="120" label="检查情况(出炉)"/>
    </el-table>

    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getPageList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import dryingManage from "@/api/plan/dryingManage";
import {timeTranslate} from "@/utils/common";

export default {
  name: 'dryingRecord',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      tankData: [],
      dateRange: null,
      total: 0,
      listQuery:{
        pg_pagenum: 1,
        pg_pagesize: 20,
        tankCodeId:'',
        productNo:'',
        putInStart: null,
        putInEnd: null,
      }
    }
  },
  mounted() {
    let date = new Date();
    let startDate = new Date(date.getTime() - 7 * 24 * 3600 * 1000);
    let endDate = new Date(date.getTime() + 7 * 24 * 3600 * 1000);
    this.dateRange = [];
    this.dateRange[0] = timeTranslate(startDate) // 开始日期
    this.dateRange[1] = timeTranslate(endDate) // 结束日期
    this.getRecord()
    this.getTankData()
  },
  methods: {
    getPageList(val){
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.getRecord()
    },
    getRecord(){
      if(this.dateRange){
        this.listQuery.putInStart = this.dateRange[0]
        this.listQuery.putInEnd = this.dateRange[1]
      }else {
        this.listQuery.putInStart = null
        this.listQuery.putInEnd = null
      }
      dryingManage.dryingRecord(this.listQuery).then(res=>{
        this.total = res.total_count
        this.tableData = res.data
      })
    },
    getTankData() {
      dryingManage.findAllDryingTank({'dryingTankCode': ''}).then(res=>{
        this.tankData = res.data;
      })
    },
    recordExport(){
      window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/inoutRecExport'
    }
  }
}
</script>
