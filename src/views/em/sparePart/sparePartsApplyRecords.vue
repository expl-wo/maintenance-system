<template>
  <div class="app-container app-containerC">
    <!-- 搜索框-->
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy ">
        <el-form-item label="设备编号："  size="small">
          <el-input v-model="keyWords.eqpId" placeholder="设备编号" style="width: 180px;" class="filter-item"  size="small"
            clearable />
        </el-form-item>
        <el-form-item label="设备名称："  size="small">
          <el-input v-model="keyWords.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item"  size="small"
            clearable />
        </el-form-item>
        <el-form-item label="备品备件名称："  size="small">
          <el-input v-model="keyWords.spName" placeholder="备品备件名称" style="width: 180px;" class="filter-item"  size="small"
            clearable />
        </el-form-item>
        <el-form-item  size="small">
          <el-date-picker v-model="keyWords.dataTime" type="daterange" align="right" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="OA审批状态"  size="small">
          <el-select v-model="keyWords.status"  size="small" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in orderStatus" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onQuery()">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Plus" @click="onAdd()">新增</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onExport"><svg-icon icon-class="qrcode" /> 导出</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-upload2" @click="uploadDialogVisible = true">导入</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onGotoOA()"  size="small">转OA审批</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="ensureStock()"  size="small">确认入库</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:calc(100% - 20px);">
      <el-table stripe class="table-fixed" height="100%"  highlight-current-row  :data="dataList" border
        :header-cell-style="{'text-align':'center'}"
        @selection-change="handleSelectionChange"
        :cell-style="{'text-align':'center'}">
        <el-table-column type="selection" fixed></el-table-column>
        <el-table-column label="序号" type="index" fixed></el-table-column>
        <el-table-column label="配件名称" prop="spName" fixed></el-table-column>
        <el-table-column label="物料编码" prop="materialCode" fixed></el-table-column>
        <el-table-column label="型号规格" prop="spModel" fixed></el-table-column>
        <el-table-column label="配件类型" prop="spType" >
          <template  #default="scope">
            <span v-if="scope.row.spType == 1">机械配件</span>
            <span v-if="scope.row.spType == 0">电气配件</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column label="数量" prop="quantity"></el-table-column>
        <el-table-column label="OA审批状态" :width="100" prop="status" :formatter="stateFormat"></el-table-column>
        <el-table-column label="设备编号" prop="eqpId"></el-table-column>
        <el-table-column label="设备名称" prop="eqpName"></el-table-column>
        <el-table-column label="使用部门" prop="usingDepName"></el-table-column>
        <el-table-column label="指定厂家" prop="factory"></el-table-column>
        <el-table-column label="期望到货时间" :width="100" prop="expectedArrivalTime"></el-table-column>
        <el-table-column label="单价"  :width="80" >
          <template  #default="scope">
            <el-input-number @change="saveData(scope.row)" :controls="false"  size="small" :min="0" v-model="scope.row.price" style=" width: 60px;"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="上次采购时间" :width="100" prop="lastPurchaseTime"></el-table-column>
        <el-table-column label="使用时间" prop="usingTime"></el-table-column>
        <el-table-column label="入库时间" prop="warehousingTime"></el-table-column>
        <el-table-column label="更换周期" prop="cycle"></el-table-column>
        <el-table-column label="协议序号" prop="orderNumber"></el-table-column>
        <el-table-column label="操作" :width="100" fixed="right">
          <template  #default="scope">
            <el-button type="primary" icon="Edit" @click="edit(scope.row)"  size="small"></el-button>
            <el-button type="danger" icon="Delete" @click="deleteApply(scope.row)"  size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination :total="total" :page="pg_pagenum" :limit="pg_pagesize" class="searchCon" @pagination="getList" />

    <!-- 导入 -->
    <el-dialog
      title="导入"
       v-model="uploadDialogVisible"
      width="400px"
      @close="handleClose"
    >
      <el-row>
        <el-col>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            accept=".xls,.xlsx"
          >
            <el-button  size="medium" type="primary">
              选取文件
            </el-button>
            <el-button
              size="medium"
              type="success"
              @click="submitUpload"
              style="margin-left: 70px;"
              >上传
            </el-button>
            <div   class="el-upload__tip">只能选取xls/xlsx文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
    draggabletitle="设备备件请购"
     v-model="dialogSparePartsApplyFormVisible"
    width="70%" append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <sparePartsApply ref="child" @closeApply="closeApply()"></sparePartsApply>
      <div   class="dialog-footer">
        <el-button  size="small" @click="onSubmit()">提交</el-button>
        <el-button  size="small" @click="dialogSparePartsApplyFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>


    <el-dialog draggabletitle="备件请购修改"  v-model="dialogEditFormVisible" class="roleDialog700" append-to-body>
      <div style="height: 230px;">
        <el-form label-width="90px"  :inline="true" v-model="selectItem" class="centered-label demo-form-inline demo-form-zdy">
          <el-col :span="12">
            <el-form-item label="配件名称">
              <el-input  size="small" v-model="selectItem.spName" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="物料编码">
              <el-input  size="small" v-model="selectItem.materialCode" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="型号规格">
              <el-input  size="small" v-model="selectItem.spModel" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="单位">
              <el-input  size="small" v-model="selectItem.unit" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="数量">
              <el-input-number  size="small" :min="1" v-model="selectItem.quantity" style=" width: 165px;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号">
              <el-input  size="small" disabled v-model="selectItem.eqpId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称">
              <el-input  size="small" disabled v-model="selectItem.eqpName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用部门">
              <el-input  size="small" disabled v-model="selectItem.usingDepName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指定厂家">
              <el-input  size="small" v-model="selectItem.factory"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望到货时间">
              <el-date-picker v-model="selectItem.expectedArrivalTime" style=" width: 165px;"  size="small" align="right"
                type="date" placeholder="选择日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="配件类型">
              <el-radio-group v-model="selectItem.spType"   size="small">
                <el-radio :label="0">机械配件</el-radio>
                <el-radio :label="1">电气配件</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div   class="dialog-footer">
        <el-button  size="small" @click="onEditApply()">提交</el-button>
        <el-button  size="small" @click="dialogEditFormVisible=false">关闭</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {
    $rooturl,
    $deepCopy,
    timeTranslate
  } from '@/utils/common.js'
  import {
    getSparePartsApplyRecord,editApply,deleteApply,applyToOA,importApplyRecord,applyEnsure
  } from '@/api/em/sparePart'
  import { getSingleUpload } from '@/api/endpoint'
  import sparePartsApply from "../emBasicData/equipParamete_childrem/sparePartsApply"
  export default {
    components: {
      sparePartsApply,Pagination
    },
    data() {
      return {
        dialogSparePartsApplyFormVisible: false,
        dialogEditFormVisible: false,
        keyWords: {
          eqpId: '',
          eqpName: '',
          spName: '',
          materialName: '',
          startTime:'',
          endTime:'',
          dataTime: '',
          status:''
        },
        rooturl:"",
        fileList: [],
        uploadDialogVisible:false,
        orderStatus:[
          {
            id:-1,
            name:"驳回",
          },
          {
            id:0,
            name:"待转OA",
          },
          {
            id:1,
            name:"审批中",
          },
          {
            id:2,
            name:"审批通过",
          },
          {
            id:null,
            name:"全部",
          }
        ],
        pg_pagenum:1,
        pg_pagesize:10,
        total:0,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]

        },
        dataList: [],
        pickerOptions2: {
          disabledDate(time) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return time.getTime() < date;
          }
        },
        selectItem: {},
        selectList:[],
      }
    },

    methods: {
      getList(val) {
        this.pg_pagenum = val.page
        if (val.limit) {
          this.pg_pagesize = val.limit
        }
        this.onQuery() // 查询
      },
      onQuery() {
        this.dataList = []
        getSparePartsApplyRecord({
          spName:  this.keyWords.spName, //设备编号
          eqpId:   this.keyWords.eqpId,
          eqpName: this.keyWords.eqpName,
          startTime: this.keyWords.startTime,
          endTime: this.keyWords.endTime,
          pageSize:this.pg_pagesize,
          pageNum: this.pg_pagenum,
          status:  this.keyWords.status
        }).then(response => {
          this.dataList = response.data
          this.total=response.total_count
        })
      },
      onAdd(){
        this.dialogSparePartsApplyFormVisible  = true
        this.$nextTick(() => {
          this.$refs.child.init2();
        })
      },
      dateChange(event) {
        if(event) {
          this.keyWords.dataTime[1].setTime(this.keyWords.dataTime[1].getTime()+ 3600 * 1000 * 24 * 1)
          this.keyWords.startTime = timeTranslate(this.keyWords.dataTime[0]) // 开始日期
          this.keyWords.endTime = timeTranslate(this.keyWords.dataTime[1]) // 结束日期
        }else{
          this.keyWords.startTime = '' // 开始日期
          this.keyWords.endTime = '' // 结束日期
        }
        this.onQuery()
      },
      edit(item) {
        this.dialogEditFormVisible = true
        this.selectItem = item
      },
      closeApply(){
        this.dialogSparePartsApplyFormVisible=false
        this.onQuery()
      },
      onSubmit() {
        this.$nextTick(() => {
          this.$refs.child.submit();
        })
      },
      stateFormat(row,column){
        if(row.status===0){
          return '待转审批'
        }
        if(row.status===-1){
          return '驳回'
        }
        if(row.status===1){
          return '审批中'
        }
        if(row.status===2){
          return '审批通过'
        }
      },
      onGotoOA(){
        if(this.selectList)
        applyToOA({data:this.selectList}).then(res =>{
          if(res.err_code == 10000){
            this.$message.success("提交OA审批成功！");
            this.onQuery()
          }else{
            this.$message.error(res.err_msg);
          }
        })
      },
      //确认入库
      ensureStock(){
        applyEnsure({data:this.selectList}).then( res =>{
          if(res.err_code==10000){
            this.$message.success("入库成功！");
            this.onQuery()
          }else{
            this.$message.error(res.err_msg);
          }
        })
      },
      onEditApply(){
        editApply({data:this.selectItem}).then(res =>{
          if(res.err_code==10000){
            this.$message.success("修改成功！");
            this.onQuery()
            this.dialogEditFormVisible=false
          }else{
            this.$message.error(res.err_msg);
          }
        })
      },
      saveData(item){
        editApply({data:item}).then(res =>{
          if(res.err_code==10000){
            this.$message.success("修改成功！");
          }else{
            this.$message.error(res.err_msg);
          }
        })
      },
      onExport() {
        window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/applySparePartsRecordExport?eqpId='
        +this.keyWords.eqpId+'&eqpName='+this.keyWords.eqpName+'&spName='+this.keyWords.spName+'&startTime='+this.keyWords.startTime
        +'&endTime='+this.keyWords.endTime+'&status='+this.keyWords.status
      },
      handleChange(file, fileList) {
        this.fileList = [fileList[fileList.length - 1]]
      },
      handleRemove() {
        this.fileList = [];
      },
      handleClose() {
        this.fileList = [];
        this.onBtnQuery();
        this.uploadDialogVisible = false;
      },
      async submitUpload() {
        if (this.fileList.length > 0) {
          let file = new FormData();
          file.append("file", this.fileList[0].raw);
          importPlan(file).then(res=>{
            if (res.err_code === 10000) {
                this.$message.success("上传成功！");
                this.handleClose();
            } else this.$message.error("上传失败"+res.err_msg)
          })
        } else {
          this.$message.error("请选取一个文件！");
        }
      },
      handleSelectionChange(val) {
        this.selectList = val;
      },
      deleteApply(row){
        this.$confirm('确定要删除这条记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteApply(row.id).then(res =>{
            if(res.err_code==10000){
              this.$message.success("删除成功！");
              this.onQuery()
            }else{
              this.$message.error(res.err_msg);
            }
          })
        })
      }
    },

    mounted() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      this.keyWords.dataTime = [start, end]
      this.onQuery();
      $rooturl().then(response => {
        this.rooturl = response.data
      })
    }
  }
</script>

<style scoped>
  :deep(.centered-label .el-form-item__label){
      width: 50%;
      line-height: 38px;
  }
  :deep(.centered-label .el-form-item__content){
      line-height: 38px;
      padding: 0px;
      margin-top: 2.5%;
  }
</style>
