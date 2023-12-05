<template>
  <div class="app-container">
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item  size="small">
          <el-button type="primary" icon="Plus" @click="showAdd()">新增</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Upload" @click="uploadDialogVisible = false">导入</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Download" @click="onExport">导出</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="ShoppingCart" @click="showApply()">请购</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
      <el-tab-pane label="机械备件" name="first" >
        <el-table stripe  highlight-current-row
        :data="tableData.filter(data => data.spType==1).filter(data => !search1 || search(data,search1)) "
        @selection-change="handleSelectionChange"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :row-style="{height:'50px'}">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="materialCode" label="配件编码"></el-table-column>
          <el-table-column prop="spName" label="配件名称"></el-table-column>
          <el-table-column prop="spModel" label="配件型号"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="quantity" label="配件数量"></el-table-column>
          <el-table-column prop="cycle" label="更换周期"></el-table-column>
          <el-table-column prop="price" label="金额(单价)"></el-table-column>
          <el-table-column>
           <template #header>
              <el-input v-model="search1"  size="small" placeholder="输入关键字搜索" />
            </template>
            <template  #default="scope">
              <el-button type="primary"  size="small"  icon="Edit" @click="editOne(scope.row)"></el-button>
              <el-button type="danger"  size="small"  icon="Delete" @click="deleteOne(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="电气备件" name="second" >
        <el-table stripe  highlight-current-row  :data="tableData.filter(data => data.spType==0).filter(data => !search2 || search(data,search2))"
        @selection-change="handleSelectionChange"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :row-style="{height:'50px'}">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="materialCode" label="配件编码"></el-table-column>
          <el-table-column prop="spName" label="配件名称"></el-table-column>
          <el-table-column prop="spModel" label="配件型号"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="quantity" label="配件数量"></el-table-column>
          <el-table-column prop="cycle" label="更换周期"></el-table-column>
          <el-table-column prop="price" label="金额(单价)"></el-table-column>
          <el-table-column >
          <template #header>
              <el-input v-model="search2"  size="small" placeholder="输入关键字搜索" />
            </template>
            <template  #default="scope"  >
              <el-button type="primary"  size="small"  icon="Edit" @click="editOne(scope.row)"></el-button>
              <el-button type="danger"  size="small"  icon="Delete" @click="deleteOne(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <Pagination :total="total" :page="listEqp.pg_pagenum" :limit="listEqp.pg_pagesize" class="searchCon" @pagination="getList"></Pagination>
    </el-tabs>

    <el-dialog title="设备备件数据导入"  v-model="uploadDialogVisible" width="400px" @close="handleClose" append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <el-row>
        <el-col>
          <el-upload class="upload-demo" ref="upload" action="#" :on-change="handleChange" :on-remove="handleRemove"
            :file-list="fileList" :auto-upload="false" accept=".xls,.xlsx">
            <el-button  size="medium" type="primary">选取文件</el-button>
            <el-button size="medium" type="success" @click="download" style="margin-left: 20px;">模板下载</el-button>
            <el-button size="medium" type="success" @click="submitUpload" style="margin-left: 20px;">上传</el-button>
            <div   class="el-upload__tip">只能选取xls/xlsx文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog draggable title="设备备件请购"  v-model="dialogSparePartsApplyFormVisible"  width="70%" append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <sparePartsApply ref="sparePartsApply" @closeApply="closeApply()"></sparePartsApply>
      <div   class="dialog-footer">
        <el-button  size="small" @click="applySubmit()">提交</el-button>
        <el-button  size="small" @click="dialogSparePartsApplyFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog draggable title="设备备件添加"  v-model="dialogSparePartsAddFormVisible"  width="60%"   append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <el-form label-position="right" label-width="70px" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item  size="small" >
          <el-button type="primary" icon="Plus" @click="addColumn()">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table stripe  highlight-current-row  :data="addTableData" border>
        <el-table-column  label="配件编码" style="width: 150px;">
          <template  #default="scope">
            <el-input v-model="scope.row.materialCode"  size="small" ></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="配件名称" style="width: 150px;">
          <template  #default="scope" >
            <el-input v-model="scope.row.spName"  size="small" ></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="配件型号" style="width: 150px;">
          <template  #default="scope" >
            <el-input v-model="scope.row.spModel"  size="small" ></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="配件类型" style="width: 300px;">
          <template  #default="scope">
            <el-select v-model="scope.row.spType"  size="small" placeholder="配件类型"  filterable default-first-option>
              <el-option v-for="items in spType" :key="items.id" :label="items.name" :value="items.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单位" style="width: 70px;">
          <template  #default="scope" >
            <el-input v-model="scope.row.unit"  size="small"  ></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="配件数量"  style="width: 100px;">
          <template  #default="scope">
            <el-input-number v-model="scope.row.quantity" :controls="false" :min="1"  size="small" style="width: 70px;"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column  label="更换周期(天)"  style="width: 100px;">
          <template  #default="scope">
            <el-input-number v-model="scope.row.cycle" :controls="false" :min="0"  size="small" style="width: 70px;"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="金额(单价)"  style="width: 100px;">
          <template  #default="scope">
            <el-input v-model="scope.row.price"  size="small" ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template  #default="scope">
            <el-button type="danger" icon="Delete" @click.prevent="deleteRow(scope.$index, addTableData)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div   class="dialog-footer">
        <el-button  size="small" @click="onAdd()">提交</el-button>
        <el-button  size="small" @click="dialogSparePartsAddFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog draggable title="设备备件修改"  v-model="dialogSparePartsEditFormVisible"  class="roleDialog" append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <el-form v-model="editItem" label-width="80px">
        <el-form-item label="配件编码">
          <el-input v-model="editItem.materialCode"  ></el-input>
        </el-form-item>
        <el-form-item label="配件名称">
          <el-input v-model="editItem.spName"  ></el-input>
        </el-form-item>
        <el-form-item label="配件型号">
          <el-input v-model="editItem.spModel"  ></el-input>
        </el-form-item>
        <el-form-item label="配件类型">
          <el-select v-model="editItem.spType"  placeholder="配件类型"  filterable default-first-option>
            <el-option v-for="items in spType" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="editItem.unit"></el-input>
        </el-form-item>
        <el-form-item label="配件数量">
          <el-input v-model="editItem.quantity"></el-input>
        </el-form-item>
        <el-form-item label="更换周期">
          <el-input v-model="editItem.cycle" ></el-input>
        </el-form-item>
        <el-form-item label="金额(单价)">
          <el-input v-model="editItem.price" ></el-input>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="editSubmit()">提交</el-button>
        <el-button  size="small" @click="dialogSparePartsEditFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import sparePartsApply from "./sparePartsApply.vue"
  import Pagination from '@/components/Pagination'
  import { getSparePartsBom,addSparePartsBom,deleteSparePartsBom,editSparePartsBom} from '@/api/em/sparePart'
  export default {
    components: { sparePartsApply,Pagination },
    data() {
      return {
        listEqp:{
          eqpId:'',
          eqpName:'',
          usingDep:'',
          type:1,
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10 // 查询第几页数据，默认第一页 pg_pagesize
        },
        total:0,
        activeName: 'first',
        uploadDialogVisible: false,
        dialogSparePartsApplyFormVisible:false,
        dialogSparePartsEditFormVisible: false,
        dialogSparePartsAddFormVisible:false,
        fileList: [],
        tableData: [],
        addTableData:[],
        multipleSelection: [],
        selectSpareParts:[],
        editItem:{},
        spType:[
          {
            id:'0',
            name:"电气配件"
          },
          {
            id:'1',
            name:"机械配件"
          }
        ],
        search1:'',
        search2:'',
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.label == '电气备件') {
          this.listEqp.type = 0
        } else{
          this.listEqp.type = 1
        }
        this.onBtnQuery()
      },
      getList(val) {
        this.listEqp.pg_pagenum = val.page
        if (val.limit) {
          this.listEqp.pg_pagesize = val.limit
        }
        this.onQuery() // 查询
      },
      showAdd(){
        this.addTableData=[]
        let item = {}
        this.addTableData.push(item)
        this.dialogSparePartsAddFormVisible=true
      },
      showApply(){
        this.dialogSparePartsApplyFormVisible = true
        var list = this.selectSpareParts
        this.$nextTick(()=>{
          this.$refs.sparePartsApply.init(this.listEqp,list);
        })
      },
      onAdd() {
        addSparePartsBom({
          dataList: this.addTableData,
          eqpId:this.listEqp.eqpId
        }).then(res =>{
          if(res.err_code == 10000){
            this.$message.success("添加成功！");
            this.onQuery()
            this.dialogSparePartsAddFormVisible=false
          }else{
            this.$message.error(res.err_msg);
          }
        })
      },
      onBtnQuery(){
        this.tableData = []
        this.listEqp.pg_pagenum = 1 // 每页显示多少条数据，默认为10条 pg_pagenum
        this.onQuery()
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      onExport() {
        // window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/eqpqr'
      },
      search(data,param){
        if(data.spName.toLowerCase().includes(param.toLowerCase())){
          return true
        }
        if(data.materialCode.toLowerCase().includes(param.toLowerCase())){
          return true
        }
        if(data.spModel.toLowerCase().includes(param.toLowerCase())){
          return true
        }
        return false
      },
      closeApply(){
        this.dialogSparePartsApplyFormVisible=false
      },
      // 查询
      onQuery() {
        getSparePartsBom(this.listEqp).then( res =>{
          this.tableData=res.data;
          this.total = res.total_count
        })
      },
      editOne(item){
        this.dialogSparePartsEditFormVisible=true
        this.editItem=item
      },
      editSubmit(){
        editSparePartsBom({
          data:this.editItem
        }).then( res =>{
          if(res.err_code == 10000){
            this.$message.success("修改成功！");
            this.onQuery()
            this.dialogSparePartsEditFormVisible=false
          }else{
            this.$message.error(res.err_msg);
          }
        })
      },
      applySubmit(){
        this.$nextTick(()=>{
          this.$refs.sparePartsApply.submit();
        })
      },
      deleteOne(item){
        deleteSparePartsBom(item.id).then(res =>{
          if(res.err_code == 10000){
            this.$message.success("删除成功！");
            this.onQuery()
          }else{
            this.$message.error(res.err_msg);
          }
        })
      },
      handleChange(file, fileList) {
        this.fileList = [fileList[fileList.length - 1]]
      },
      handleRemove() {
        this.fileList = [];
      },
      download() {
        // window.location.href = "http://10.16.9.107/reso_mes/设备责任人.xlsx"
      },
      addColumn(){
        let item = {}
        this.addTableData.push(item);
      },
      async submitUpload() {
        if (this.fileList.length > 0) {
          let file = new FormData();
          file.append("file", this.fileList[0].raw);
          //上传方法
          // importManager(file).then(res=>{
          //   if (res.err_code === 10000) {
          //       this.$message.success("上传成功！");
          //       this.handleClose();
          //   } else this.$message.error("上传失败"+res.err_msg)
          // })
        } else {
          this.$message.error("请选取一个文件！");
        }
      },
      handleSelectionChange(val) {
        this.selectSpareParts = val;
      },
      handleClose() {
        this.fileList = [];
        this.onQuery();
        this.uploadDialogVisible = false;
      },
      init(params){
        this.listEqp.eqpId =params.eqpId
        this.listEqp.eqpName =params.eqpName
        this.listEqp.usingDep =params.usingDep
        this.onBtnQuery()
      }
    }
  };
</script>

<style scoped>
</style>
