<template>
  <div class="app-container app-containerC">
    <!-- 新增原因-->
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
				<el-form-item label="备品备件编号："  size="small">
				  <el-input v-model="listQuery.materialCode" placeholder="备品备件编号" style="width: 180px;" class="filter-item"  size="small" clearable/>
				</el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    

    <table-simple
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      @pagination="getList"
    />


  </div>
</template>

<script>
  import TreeTable from '@/components/Table/tree-table'
  /**
   * 1.产品分类查询
   * 2.产品分类的新增与编辑的操作
   * 3.产品分类删除
   */
  import {getSparePartsList} from '@/api/em/sparePart'
  import TableSimple from '@/components/Table/index'
  import { getPlanCateDelete } from '@/api/plan'

  export default {
    name: 'Table',
    components: { TableSimple },
    data() {
      return {
        dialogStatus: '', // 新增或者修改状态控制
        textMap: { // 控制弹窗提示字
          update: '修改备品备件编号',
          create: '添加备品备件编号'
        },
        textSmallMap: { // 控制弹窗提示字
          update: '修改备品备件名称',
          create: '添加备品备件名称'
        },
        dialogFormVisible: false, // 备品备件名称新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
        listUpdate: {
          id:'',
          reason: '', // 备品备件名称
        },
        tableData: [], // 产品分类列表表格数据
        total: 0,
        rowHeader: [],
        submitRules: {
          reason: [
            { required: true, trigger: 'change', message: '该项为必填项' }
          ],
        },
        listQuery: { // 查询条件
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条
          pg_pagesize: 10, // 查询第几页数据，默认第一页
          materialCode:null,
        },
        nodeType: [{
          'id': null,
          'name': '全部'
        }, {
          'id': 0,
          'name': '正常'
        }, {
          'id': 1,
          'name': '异常'
        }],
      }
    },
    mounted() {
      this.onload()
    },
    methods: {
      onload(){
        const self = this
        self.rowHeader = [
          // 未做任何格式化处理的数据
          {
            prop: 'index',
            width: 50,
            align: 'center',
            label: '序号'
          },
          {
            prop: 'materialCode',
            width: 250,
            align: 'center',
            label: '备品备件编号'
          },
          {
            prop: 'materialName',
            width: 120,
            align: 'center',
            label: '备品备件名称',
		},
		{
			prop: 'spInventory',
			width: 160,
			align: 'center',
			label: '库存',
          },
         
        ]
        self.onQuery() // 查询
      },
      // 查询
      onBtnQuery() {
        this.listQuery.pg_pagenum = 1
        this.onQuery()
      },
      // 查询备品备件
      onQuery(){
        this.tableData = []
        getSparePartsList(this.listQuery).then(response => {
          this.tableData = response.data
          this.total = response.total_count
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
    }
  }
</script>

<style scoped>

</style>
