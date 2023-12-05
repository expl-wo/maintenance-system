<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="物料简称"  size="small">
          <el-input v-model="listQuery.abbreviation" placeholder="输入物料简称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="生产号"  size="small">
          <el-input v-model="listQuery.productionNo" placeholder="输入生产号" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="宽"  size="small">
          <el-input v-model="listQuery.width" placeholder="输入物料宽" style="width: 180px;" type="number" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="状态"  size="small" >
          <el-select v-model="listQuery.status" placeholder="请选择" style="width: 140px;">
            <el-option label="已入库" value="0" />
            <el-option label="已生成出库任务" value="1" />
            <el-option label="已出库" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Upload" @click="sendTask()">生成出库任务</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Printer" @click="handlePrint()">二维码打印</el-button>
        </el-form-item>
      </el-form>
    </div>

    <table-check-all class="otherCon wp" :data="tableData" :row-header="rowHeader" :total="total"
                     :check-all-fun="checkAllFun" :checkbox-change="checkboxChange"
                     :page="listQuery.pageNum" :limit="listQuery.pageSize" @pagination="getList" />

    <!-- 新增/修改节点弹窗 -->
    <el-dialog draggable :close-on-click-modal="false" :title=title  v-model="addDialogVisible" class="roleDialog">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQueryDe" class="demo-form-inline demo-form-zdy">
          <el-form-item label="库位编码"  size="small">
            <el-input v-model="listQueryDe.warehouseCode" placeholder="库位编码" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="Search" @click="onRuleConfigQuery">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <table-simple  :heightTable="heightTable" :data="tableRuleConfigData" :row-header="rowRuleConfigHeader"
                    :total="totalDe"
                    :page="listQueryDe.pageNum"
                    :limit="listQueryDe.pageSize"
                    @pagination="getListDe"/>
      <div   class="dialog-footer">
        <el-button  size="small" @click="addDialogVisible = false">取 消</el-button>
        <!--<el-button type="primary"  size="small" @click="addOrUpdateDe('listQueryDe')">-->
          <!--保存-->
        <!--</el-button>-->
      </div>
    </el-dialog>

    <el-dialog draggable :close-on-click-modal="false" title="查看二维码"  v-model="dialogQRCodeFormVisible" class="roleDialog">
      <el-card shadow="hover" class="wp qrcode app-containerC cc">
        <div id="qrcode" class="wp hp" />
      </el-card>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogQRCodeFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ElButton,ElButtonGroup} from "element-plus";

  import TableSimple from '@/components/Table/index'
  import TableCheckAll from '@/components/Table/tableCheckAll'
  import reactorCapacity from '@/api/reactorCapacity'
  import emWarehouse from '@/api/em/emWarehouse'
  import QRCode from 'qrcodejs2'
  export default {
    name: 'emReceiptIndex',
    components: { TableSimple,TableCheckAll },
    data() {
      return {
        heightTable: '300px',
        total: 0, // 角色列表表格总条数
        totalDe:0,
        listQuery: { // 查询条件
          pageNum: 1, // 每页显示多少条数据，默认为10条 pageNum
          pageSize: 10, // 查询第几页数据，默认第一页 pageSize
          abbreviation: '',
          productionNo: '',
          width: '',
          status:''
        },
        checkboxData:[],
        tableRuleConfigData:[],
        rowRuleConfigHeader:[],
        dialogQRCodeFormVisible:false,
        listQueryDe:{
          warehouseCode:'',
          length:'',
          width:'',
          id:'',
          receiptId:'',
          pageNum: 1, // 每页显示多少条数据，默认为10条 pageNum
          pageSize: 10, // 查询第几页数据，默认第一页 pageSize
        },
        addDialogVisible:false,
        tableData: [], // 角色分类列表表格数据
        rowHeader: [],
        deRules: {
          voltageLevel: [{required: true, message: '请填写电压等级', trigger: 'change'}],
          monthlyCapacity: [{required: true, message: '请填写月产能', trigger: 'change'}],
        },
        title:null
      }
    },
    mounted() {
      this.onload()
    },
    methods: {
      onload() {
        const self = this
        self.rowHeader = [
          // 未做任何格式化处理的数据
          {
            prop: 'check',
            width: 50,
            align: 'center',
            type: 'selection'
          },
          {
            prop: 'index',
            width: 50,
            align: 'center',
            label: '序号'
          },
          {
            prop: 'matterShort',
            align: 'center',
            label: '物料简称'
          },
          {
            prop: 'matterCode',
            align: 'center',
            label: '物料编码'
          },
          {
            prop: 'matterName',
            width: 220,
            align: 'center',
            label: '物料名称'
          },
          {
            prop: 'productionNo',
            align: 'center',
            label: '生产号'
          },
          {
            prop: 'meters',
            align: 'center',
            label: '米数'
          },
          {
            prop: 'width',
            align: 'center',
            label: '宽(单位:mm)'
          },
          {
            prop: 'weight',
            align: 'center',
            label: '重量(单位:kg)'
          },
          {
            prop: 'longitudinal',
            align: 'center',
            label: '外径(单位:mm)'
          },
          {
            prop: 'warehouseCode',
            align: 'center',
            label: '库位编码'
          },
          {
            prop: 'internal',
            align: 'center',
            label: '内径(单位:mm)'
          },
          {
            prop: 'thickness',
            align: 'center',
            label: '厚度(单位:mm)'
          },
          {
            prop: 'status',
            align: 'center',
            width: '110',
            label: '状态',
            render: (h, params) => {
              var statusHtml = ''
              switch (params.row.status) {
                case 0:
                  statusHtml = '已入库'
                  break
                case 1:
                  statusHtml = '已生成出库任务'
                  break
                case 2:
                  statusHtml = '已出库'
                  break
              }
              return h('div', [
                statusHtml
              ])
            }
          },
          {
            prop: '',
            align: 'center',
            label: '查看',
            width: 140,
            render: (h, params) => {
              return h(ElButtonGroup, ()=>[
                h(ElButton, {
                  props:function(){
                  return { type: 'text', size: 'small' }
                },
                  on: {
                   onClick: function() {
                      self.dialogQRCodeFormVisible = true
                      self.$nextTick(function() {
                        document.getElementById('qrcode').innerHTML = ''
                        const qrcode = new QRCode('qrcode', {
                          width: 300,
                          height: 300,
                          text: params.row.id,
                          colorDark: '#000000', // 前景色
                          colorLight: '#ffffff', // 背景色
                          correctLevel: QRCode.CorrectLevel.H// 降低容错级别
                        })
                      })
                    }
                  }
                }, '二维码'),
              ])
            }
          },
          {
            prop: '',
            align: 'center',
            label: '操作',
            width: 120,
            fixed: 'right',
            render: (h, params) => {
              var status = 'none'
              if (params.row.status === 0) {
                status = 'block'
              }
              return h(ElButtonGroup, ()=>[
                h(ElButton, {
                  type: 'danger', size: 'small',
                  style: { display: status },
                  on: {
                   onClick: function() {
                      self.handleItemAddDict()
                      self.listQueryDe.receiptId = params.row.id;
                    }
                  }
                }, '转库')
              ])
            }
          }
        ]
        self.onQuery() // 查询
      },
      onRuleConfigload() {
        const self = this
        self.rowRuleConfigHeader = [
          {
            prop: 'warehouseCode',
            align: 'center',
            label: '库存编码'
          },
          {
            prop: 'length',
            align: 'center',
            label: '长'
          },
          {
            prop: 'width',
            align: 'center',
            label: '宽'
          },
          // 添加操作按钮
          {
            prop: '',
            label: '操作',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h(ElButtonGroup, ()=>[
                h(ElButton, {
                  type: 'primary', size: 'small',
                  on: {
                   onClick: function() {
                      self.$confirm('此操作将转移库存到'+params.row.warehouseCode+', 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        self.addDialogVisible = false;
                        self.createItemData(params.row);
                      }).catch(() => {
                        self.$message({
                          type: 'info',
                          message: '已取消转库'
                        });
                      });
                    }
                  }
                }, '选择'),
              ])
            }
          }
        ]
      },
      // 查询
      onBtnQuery() {
        this.listQuery.pageNum = 1
        this.onQuery()
      },
      // 查询
      onQuery() {
        this.tableData = []
        emWarehouse.getReceiptEm(this.listQuery).then(response => {
          this.tableData = response.data.list
          this.total = response.data.total
        })
        this.checkboxData = []
      },
      // 分页数据发生变化
      getList(val) {
        this.listQuery.pageNum = val.page
        if (val.limit) {
          this.listQuery.pageSize = val.limit
        }
        this.onQuery() // 查询
      },
      getListDe(val) {
        this.listQueryDe.pageNum = val.page
        if (val.limit) {
          this.listQueryDe.pageSize = val.limit
        }
        this.onRuleConfigQuery() // 查询
      },
      handleItemAddDict() {
        this.onRuleConfigload();
        this.addDialogVisible = true;
        this.onRuleConfigQuery(); // 查询所有物料分类
      },
      onRuleConfigQuery() {
        this.tableRuleConfigData = [];
        emWarehouse.getWarehouse(this.listQueryDe).then(response => {
          this.tableRuleConfigData = response.data
          this.totalDe = response.total_count
        })
      },
      handlePrint() {
        if (this.checkboxData.length < 1) {
          this.$message.error("请选择要打印的数据");
        } else {
          this.$router.push({
            name: "emReceiptPrint",
            query: { row: JSON.stringify(this.checkboxData) },
          });
        }
      },
      checkAllFun(checkAllVal) {
        if (checkAllVal && checkAllVal.length > 0) {
          this.checkboxData = checkAllVal
        } else {
          this.checkboxData = []
        }
      },
      checkboxChange(event, item) {
        if (event) {
          this.checkboxData.push(item)
        } else if (item) {
          const items = this.checkboxData
          if (items && items.length > 0) {
            this.checkboxData = []
            items.forEach(oldi => {
              if (item.id !== oldi.id) {
                this.checkboxData.push(oldi)
              }
            })
          }
        }
      },
      createItemData(row){
        let params = {
          id:this.listQueryDe.receiptId,
          emWarehouseId:row.id,
        }
        emWarehouse.exchangeEmWarehouse(params).then(response => {
          this.$message({
            message: "转库成功",
            type: 'success'
          })
          this.clearAll()
          this.onBtnQuery();
        })
      },
      clearAll(){
        this.listQueryDe.id = null;
        this.listQueryDe.locationArea = null;
        this.listQueryDe.abscissa= null;
        this.listQueryDe.ordinate = null;
        this.listQueryDe.length = null;
        this.listQueryDe.width = null;
      },
      sendTask(){
        this.getSelectedData().then(selectedData=>{
          if(selectedData.length === 0){
            return;
          }
          const ids = []
          selectedData.forEach(item => {
            ids.push(item.id)
          })
          emWarehouse.sendIssueTask({ids:ids}).then(res => {
            this.$message({
              message: '成功生成任务',
              type: 'success'
            })
            this.checkboxData = []
            this.onQuery()
          })
        })
      },
      getSelectedData(){
        let legalStatus = ['0'], desc = '已入库';
        return new Promise((resolve, reject)=>{
          let selectedData = this.checkboxData
          if(!selectedData || selectedData.length === 0){
            this.$message({ message: '请选择要处理的数据', type: 'warning' })
            return resolve([]);
          }
          //刷选出符合条件的数据和错误的数据
          let rightData = [], errorData= [];
          selectedData.forEach(item=>{
            if(legalStatus.indexOf(item.status.toString())>=0){
              rightData.push(item);
            }else{
              errorData.push(item);
            }
          })
          if(rightData.length === 0){
            this.$message({ message: `请选择状态为${desc}的数据`, type: 'warning' })
            return resolve(rightData);
          }else if(errorData.length > 0){
            this.$confirm(`您选择了状态不为${desc}的数据，是否剔除错误数据后继续操作？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              return resolve(rightData);
            }).catch(() => {
              return resolve([]);
            });
          }else{
            return resolve(rightData);
          }
        })
      },
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }

  .el-form-item {
    margin-bottom: 10px;
  }
</style>
