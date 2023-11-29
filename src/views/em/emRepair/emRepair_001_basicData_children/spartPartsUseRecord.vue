<template>
  <div class="app-container">
    <div class="filter-container searchCon">

    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
      <el-tab-pane label="机械备件" name="first" >
        <el-table stripe  highlight-current-row
        :data="tableData.filter(data => data.spType==1)"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :row-style="{height:'50px'}">
          <el-table-column type="index"       label="序号"></el-table-column>
          <el-table-column prop="materialCode" label="配件编码"></el-table-column>
          <el-table-column prop="materialName" label="配件名称"></el-table-column>
          <el-table-column prop="unit"      label="单位"></el-table-column>
          <el-table-column prop="quantity"  label="使用数量"></el-table-column>
          <el-table-column prop="repairNum" label="维修单号"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="电气备件" name="second" >
        <el-table stripe  highlight-current-row
        :data="tableData.filter(data => data.spType==0)"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :row-style="{height:'50px'}">
          <el-table-column type="index"        label="序号"></el-table-column>
          <el-table-column prop="materialCode" label="配件编码"></el-table-column>
          <el-table-column prop="materialName" label="配件名称"></el-table-column>
          <el-table-column prop="unit"      label="单位"></el-table-column>
          <el-table-column prop="quantity"  label="使用数量"></el-table-column>
          <el-table-column prop="repairNum" label="维修单号"></el-table-column>
        </el-table>
      </el-tab-pane>
      <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getList" />
    </el-tabs>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { getEqpRepairRecList, getRepSpList ,getRepPicture,getRepWaitRec} from '@/api/em/eqpRepair'
  export default{
    components: { Pagination },
    data(){
      return{
        listQuery:{
          orderNum:'',
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        },
        total: 0, // 总个数
        tableData: [],
        activeName: 'first',
      }
    },
    methods:{
      onQuery(){
        getRepSpList(this.listQuery).then(res =>{
          this.tableData = res.data
        })
      },
      init(e){
        this.listQuery.orderNum = e
        this.onQuery()
      },
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      // 分页数据发生变化
      getList(val) {
        this.listQuery.pg_pagenum = val.page
        if (val.limit) {
          this.listQuery.pg_pagesize = val.limit
        }
        this.onQuery() // 查询
      },
    }
  }
</script>

<style scoped>
</style>
