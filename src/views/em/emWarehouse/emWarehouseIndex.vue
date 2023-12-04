<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="库存编码"  size="small">
          <el-input v-model="listQuery.warehouseCode" placeholder="输入库存编码" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="addOrEdit(true)">{{ $t('button.add') }}</el-button>
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
      <el-form label-position="right" label-width="160px" :model="listQueryDe" :rules="deRules" ref="listQueryDe" >
        <el-form-item label="库位区:"  size="small" prop="locationArea">
          <el-input v-model="listQueryDe.locationArea" typt="number" placeholder="库位区" style="width: 180px;" class="filter-item"  size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="横坐标:"  size="small" prop="abscissa">
          <el-input v-model="listQueryDe.abscissa" typt="number" placeholder="横坐标" style="width: 180px;" class="filter-item"  size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="纵坐标:"  size="small" prop="ordinate">
          <el-input v-model="listQueryDe.ordinate" typt="number" placeholder="纵坐标" style="width: 180px;" class="filter-item"  size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="长:"  size="small" prop="length">
          <el-input v-model="listQueryDe.length" typt="number" placeholder="长" style="width: 180px;" class="filter-item"  size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="宽:"  size="small" prop="width">
          <el-input v-model="listQueryDe.width" typt="number" placeholder="宽" style="width: 180px;" class="filter-item"  size="small">
          </el-input>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"  size="small" @click="addOrUpdateDe('listQueryDe')">
          保存
        </el-button>
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
    name: 'emWarehouseIndex',
    components: { TableCheckAll },
    data() {
      return {
        total: 0, // 角色列表表格总条数
        listQuery: { // 查询条件
          pageNum: 1, // 每页显示多少条数据，默认为10条 pageNum
          pageSize: 10, // 查询第几页数据，默认第一页 pageSize
          warehouseCode: ''
        },
        checkboxData:[],
        dialogQRCodeFormVisible:false,
        listQueryDe:{
          locationArea:'',
          abscissa:'',
          ordinate:'',
          length:'',
          width:'',
          id:''
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
            prop: 'warehouseCode',
            align: 'center',
            label: '库位编码'
          },
          {
            prop: 'length',
            align: 'center',
            label: '长(单位:mm)'
          },
          {
            prop: 'width',
            align: 'center',
            label: '宽(单位:mm)'
          },
          {
            prop: '',
            align: 'center',
            label: '查看',
            width: 170,
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
            width: 140,
            fixed: 'right',
            render: (h, params) => {
              return h(ElButtonGroup, ()=>[
                h(ElButton, {
                  type: 'danger', size: 'small',
                  on: {
                   onClick: function() {
                      self.addOrEdit(false)
                      self.listQueryDe.id = params.row.id;
                      self.listQueryDe.locationArea = params.row.locationArea;
                      self.listQueryDe.abscissa = params.row.abscissa;
                      self.listQueryDe.ordinate = params.row.ordinate;
                      self.listQueryDe.length = params.row.length;
                      self.listQueryDe.width = params.row.width;
                    }
                  }
                }, '编辑'),
                h(ElButton, {
                  type: 'danger', size: 'small',
                  on: {
                   onClick: function() {
                      self.deleteReactor(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
        self.onQuery() // 查询
      },
      // 查询
      onBtnQuery() {
        this.listQuery.pageNum = 1
        this.onQuery()
      },
      // 查询
      onQuery() {
        this.tableData = []
        emWarehouse.getWarehouse(this.listQuery).then(response => {
          this.tableData = response.data
          this.total = response.total_count
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
      addOrEdit(isAdd){
        this.addDialogVisible = true;
        if(isAdd) {
          this.title = "新增库存";
          this.listQueryDe.id = null;
          this.listQueryDe.locationArea = null;
          this.listQueryDe.abscissa= null;
          this.listQueryDe.ordinate = null;
          this.listQueryDe.length = null;
          this.listQueryDe.width = null;
        }else this.title = "编辑库存";
      },
      addOrUpdateDe(listQueryDe){
        this.$refs[listQueryDe].validate((valid) => {
          if (valid){
            emWarehouse.addUptWarehouse(this.listQueryDe).then(res=>{
              if(res.err_code===10000){
                if(this.listQueryDe.id == null) {
                  this.addDialogVisible = false;
                  this.$message.success("新增成功！");
                } else {
                  this.addDialogVisible = false;
                  this.$message.success("修改成功！");
                }
                this.onQuery();
              } else {
                this.addDialogVisible = false;
                this.$message.error("操作失败"+res.err_msg);
              }
              this.listQueryDe.id = null;
              this.listQueryDe.locationArea = null;
              this.listQueryDe.abscissa= null;
              this.listQueryDe.ordinate = null;
              this.listQueryDe.length = null;
              this.listQueryDe.width = null;
            })
          }else {
            this.$message({ message: '请填写必填项', type: 'warning' })
            return false
          }
        })
      },
      deleteReactor(row){
        this.$confirm('是否删除此数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          emWarehouse.deleteWarehouse({
            id: row.id
          }).then(response=>{
            if (response.err_code === this.$constants.status.success) {
              this.$message.success('数据删除成功')
              this.onQuery();
            } else {
              this.$message.error(response.err_msg)
            }
          })
        })
      },
      handlePrint() {
        if (this.checkboxData.length < 1) {
          this.$message.error("请选择要打印的数据");
        } else {
          this.$router.push({
            name: "emWarehousePrint",
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
