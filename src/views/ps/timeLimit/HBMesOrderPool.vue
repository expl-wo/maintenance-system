<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="关键字" size="mini">
          <el-input v-model="listQuery.keyWord" placeholder="生产号/图号/项目名称" style="width: 180px;" class="filter-item" size="mini" clearable/>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-edit" @click="handSyn" >手动同步</el-button>
        </el-form-item>
      </el-form>
    </div>

  <table-simple
      v-if="mesOrderShow"
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      @pagination="getList"
    />

  <el-dialog v-dialogDrag  :close-on-click-modal="false" title="手动同步" :visible.sync="dialogVisible" @close="dialogClose" width="70%">
    <el-form :inline="true" :model="handQuery" class="demo-form-inline demo-form-zdy">
      <el-form-item label="数据来源:" size="mini" prop="nodeType">
        <el-select v-model="handQuery.isOrder" placeholder="请选择节点类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="生产号" size="mini">
        <el-input v-model="handQuery.productNo" placeholder="生产号" style="width: 180px;" class="filter-item" size="mini" clearable/>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" icon="el-icon-search" @click="getToMesOrder">{{ $t('button.query') }}</el-button>
      </el-form-item>
      <el-form-item size="mini">
      </el-form-item>
    </el-form>

    <table-simple
        v-if="toMesOrderShow"
        :data="toMesOrderData"
        :row-header="toMesRowHeader"
        :total="toMesOrderTotal"
        :page="handQuery.pagenum"
        :limit="handQuery.pagesize"
        heightTable="600px"
        @pagination="getToMesOrderList"
      />
  </el-dialog>
  </div>
</template>

<script>
  import TableSimple from '@/components/Table/index';
  import { timeTranslate } from '@/utils/common';
  import { ElMessage } from "element-plus";
  import { queryHBMesOrderList, queryHandToMesOrder, toMesOrder } from '@/api/timeLimit';
  import { getAdaptWidth} from '@/utils/index'
export default {
  name: 'HBMesOrderPool',
  components: { TableSimple },
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        keyWord: null
      },
      tableData: [],
      loadingData: true,
      rowHeader: [],
      toMesRowHeader: [],
      dialogVisible: false,
      productNo: null,
      handQuery: { // 查询条件
        pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        productNo: null,
        isOrder: true,
      },
      toMesOrderData: [],
      toMesOrderTotal: 0,
      options: [{
        value: true,
        label: 'ERP工单'
       }, {
        value: false,
        label: 'ERP销售合同'
       }],
       mesOrderShow: true,
       toMesOrderShow: false,
    }
  },
  mounted() {
    this.onload();
  },
  computed:{
      isOrder(){
          return this.handQuery.isOrder
      }
  },
  watch:{
    isOrder:function(newValue, oldValue){
      this.getToMesOrder();
    }
  },
  methods: {
    onload() {
      const self = this
      self.rowHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号',
          fixed:true,
        },
        {
          prop: 'productNo',
          align: 'center',
          label: '生产号',
          fixed:true,
        },
        {
          prop: 'productModel',
          align: 'center',
          label: '型号',
          fixed:true,
        },
        {
          prop: 'drawingNo',
          align: 'center',
          label: '图号'
        },
        {
          prop: 'quantity',
          align: 'center',
          label: '台量',
          width: 60
        },
        {
          prop: 'customerName',
          align: 'center',
          label: '用户单位'
        },
        {
          prop: 'noTaxAmount',
          align: 'center',
          label: '不含税产值',
          fixed:true,
          render: (h, params) => {
            var tempVal = parseFloat(params.row.noTaxAmount).toFixed(3);
            var realVal = tempVal.substring(0, tempVal.length - 1);
            return h('div', [
              realVal
            ])
          }
        },
        {
          prop: 'outPut',
          align: 'center',
          label: '产量',
          fixed:true
        },
        {
          prop: 'delivery',
          align: 'center',
          label: '交货期',
          width: 150,
          render: (h, params) => {
            var statusHtml = timeTranslate(params.row.delivery)
            return h('div', [
              statusHtml
            ])
          }
        },
        {
          prop: 'factoryStorageDate',
          align: 'center',
          label: '厂内完成时间',
          width: 150,
          render: (h, params) => {
            var statusHtml = timeTranslate(params.row.factoryStorageDate)
            return h('div', [
              statusHtml
            ])
          }
        },
        {
          prop: 'limitName',
          align: 'center',
          label: '期量'
        }
      ];

      self.toMesRowHeader = [
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'PRODUCTNO',
          align: 'center',
          label: '生产号'
        },
        {
          prop: 'PRODUCTMODEL',
          align: 'center',
          label: '型号'
        },
        {
          prop: 'DRAWINGNO',
          align: 'center',
          label: '图号'
        },
        {
          prop: 'QUANTITY',
          align: 'center',
          label: '台量'
        },
        {
          prop: 'CUSTOMERNAME',
          align: 'center',
          label: '用户单位'
        },
        {
          prop: 'NOTAXAMOUNT',
          align: 'center',
          label: '不含税产值',
          render: (h, params) => {
            var tempVal = parseFloat(params.row.NOTAXAMOUNT).toFixed(3);
            var realVal = tempVal.substring(0, tempVal.length - 1);
            return h('div', [
              realVal
            ])
          }
        },
        {
          prop: 'OUTPUT',
          align: 'center',
          label: '产量'
        },
        {
          prop: 'PROJECTNAME',
          align: 'center',
          label: '项目名称'
        },
        {
          prop: 'LIMITNAME',
          align: 'center',
          label: '期量'
        },
        {
          prop: 'REMARKS',
          align: 'center',
          label: '备注'
        },
        {
          prop: 'options',
          align: 'center',
          label: '操作',
          render: (h, params) => {
            return h('div', [
              h('el-button', {
                props: { type: 'warning', size: 'mini'},
                on: {
                  click: function() {
                    self.toMesOrder(params.row);
                  }
                }
              }, '同步')
            ])
          }
        }
      ];
      self.toMesRowHeader.forEach(row=>{
        if(row.prop != 'index') row.prop = row.prop.toUpperCase();
      })
      self.onQuery(); // 查询
    },
    onQuery(){
      queryHBMesOrderList(this.listQuery).then(res=>{
        this.rowHeader[4].width = getAdaptWidth(res.data, 'projectName', 200);
        this.tableData = res.data;
        this.total = res.total_count;
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
    getToMesOrder(){
      queryHandToMesOrder(this.handQuery).then(res=>{
          this.toMesOrderData = res.data;
          this.toMesOrderTotal = res.total_count;
      })
    },
    handSyn(){
      this.dialogVisible = true;
      this.mesOrderShow = false;
      this.toMesOrderShow = true;
      this.getToMesOrder();
    },
    getToMesOrderList(val){
      this.handQuery.pagenum = val.page
      if (val.limit) {
        this.handQuery.pagesize = val.limit
      }
      this.getToMesOrder() // 查询
    },
    dialogClose(){
      this.mesOrderShow = true;
      this.toMesOrderShow = false;
      this.onQuery();
    },
    toMesOrder(row){
      toMesOrder({"productNo": row.PRODUCTNO,"isOrder":this.handQuery.isOrder}).then(res=>{
        if(res.err_code===10000){
          this.$message.success("同步成功！");
          this.getToMesOrder();
        } else this.$message.error("同步失败"+res.err_msg);
      })
    }
  },
}
</script>

<style lang="scss">
.line{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}

</style>
