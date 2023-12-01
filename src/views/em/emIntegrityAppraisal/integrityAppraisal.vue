<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="鉴定名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="鉴定名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-plus" @click="addOrUpdate()">新增</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-upload2" @click="excelDialogVisible = true">导入</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-upload2" @click="exportExcel('forExportExcelFile','鉴定配置')">导出</el-button>
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
            <el-table-column prop="project" align="center" width="250" label="项目" />
            <el-table-column prop="method" align="center" label="检测设备及器具" />
            <el-table-column prop="standardValue" align="center" label="标准值" />
            <el-table-column header-align="center" align="center" width="120" label="操作">
              <template  #default="scope">
                <el-button-group>
                  <el-button  size="small" title="编辑" type="primary" icon="el-icon-edit" @click="addOrUpdateDe(scope.row,false)" />
                  <el-button  size="small" title="删除" type="danger" icon="el-icon-delete" @click="deleteDe(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" width="250" label="设备完好性鉴定名称" />
      <el-table-column prop="cycle" align="center" label="鉴定周期" />
      <el-table-column prop="cycleUnit" align="center" width="200" label="周期单位" />
      <el-table-column prop="remindDay" align="center" label="鉴定提前提醒日">
        <template  #default="scope">
          <span>{{scope.row.remindDay}}天</span>
        </template>
      </el-table-column>
      <el-table-column prop="waringDay" align="center" label="鉴定滞后报警日">
        <template  #default="scope">
            <span>{{scope.row.waringDay}}天</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="260" label="操作">
        <template  #default="scope">
          <el-button-group>
            <el-button  size="small" title="编辑" type="primary" icon="el-icon-edit" @click="addOrUpdate(scope.row)"></el-button>
            <el-button  size="small" title="删除" type="danger" icon="el-icon-delete" @click="deleteMain(scope.row)" />
            <el-button  size="small" title="添加鉴定项" type="primary" icon="el-icon-plus" @click="addOrUpdateDe(scope.row,true)">添加鉴定项</el-button>
            <el-button  size="small" title="选择设备" type="primary" icon="el-icon-plus" @click="selectEquipment(scope.row)">选择设备</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getList" />

    <!-- 新增/修改鉴定类别弹窗 -->
    <el-dialog draggable :close-on-click-modal="false" :title="title"  v-model="dialogMainFormVisible" @close="resetForm()" class="roleDialog">
      <el-form ref="mainForm" label-position="right" label-width="110px" :rules="rules" :model="mainForm">
        <el-form-item label="鉴定名称:" prop="name"  size="small">
          <el-input v-model="mainForm.name" placeholder="鉴定名称" style="width: 320px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="鉴定周期:" prop="cycle"  size="small">
          <el-input v-model="mainForm.cycle" placeholder="鉴定周期" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="鉴定周期单位:" prop="cycleUnit"  size="small">
          <el-input v-model="mainForm.cycleUnit" placeholder="鉴定周期单位" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="鉴定前提醒日:" prop="remindDay"  size="small">
<!--          <el-date-picker v-model="mainForm.remindDay" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker> -->
          <el-input v-model="mainForm.remindDay" placeholder="鉴定前提醒日" style="width: 320px;" class="filter-item"><template v-slot:append>天</template></el-input>
        </el-form-item>
        <el-form-item label="鉴定滞后提醒日:" prop="waringDay"  size="small">
          <!-- <el-date-picker v-model="mainForm.waringDay" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker> -->
          <el-input v-model="mainForm.waringDay" placeholder="鉴定滞后提醒日" style="width: 320px;" class="filter-item"><template v-slot:append>天</template></el-input>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogMainFormVisible = false">取 消</el-button>
        <el-button type="primary"  size="small" @click="submitForm('mainForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 新增/修改鉴定内容弹窗 -->
    <el-dialog draggable :close-on-click-modal="false" :title="title"  v-model="dialogDeFormVisible" @close="resetForm()" class="roleDialog">
      <el-form ref="deForm" label-position="right" label-width="110px" :rules="rules" :model="deForm">
        <el-form-item label="步骤:" prop="step"  size="small">
          <el-input v-model="deForm.step" placeholder="鉴定名称" style="width: 320px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="项目:" prop="project"  size="small">
          <el-input v-model="deForm.project" placeholder="项目" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="检测设备及器具:" prop="method"  size="small">
          <el-input v-model="deForm.method" placeholder="检测设备及器具" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="标准值:" prop="standardValue"  size="small">
          <el-input v-model="deForm.standardValue" placeholder="标准值" style="width: 320px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogDeFormVisible = false">取 消</el-button>
        <el-button type="primary"  size="small" @click="submitForm('deForm')">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图片上传"  v-model="uploadDialogVisible" width="30%" @close="handleClose">
      <el-row>
        <el-col>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
            accept=".jpg,.png"
            list-type="picture"
            :auto-upload="false">
            <el-button  size="small" type="primary">选择图片</el-button>
            <el-button size="medium" type="success" @click="submitUpload">上传</el-button>
            <div   class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
      title="导入"
       v-model="excelDialogVisible"
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
              @click="download"
              style="margin-left: 20px;"
              >模板下载
            </el-button>
            <el-button
              size="medium"
              type="success"
              @click="excelUpload"
              style="margin-left: 20px;"
              >上传
            </el-button>
            <div   class="el-upload__tip">只能选取xls/xlsx文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>

    <qualificationEquipmentDialog v-if="dialogEquipmentVisible" :emId="mainId" @close="dialogEquipmentVisible = false"></qualificationEquipmentDialog>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { findIntegrityAppraisalList,addOrUpdateIntegrityAppraisal,deleteIntegrityAppraisal,addOrUpdateIntegrityAppraisalDe,deleteIntegrityAppraisalDe,imageUpload,integrityImport } from '@/api/em/eqp'
import file from '@/api/file/file'
import { $exportExcel} from '@/utils/common'
import Pagination from '@/components/Pagination'
import qualificationEquipmentDialog from '@/views/em/emIntegrityAppraisal/qualificationEquipmentDialog'
export default {
  name: 'integrityAppraiasl',
  components: { qualificationEquipmentDialog,Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        pg_pagenum: 1,
        pg_pagesize: 10,
        name: ''
      },
      tableData: [],
      childrenData: [],
      title: '',
      dialogMainFormVisible: false,
      dialogDeFormVisible: false,
      mainForm:{
        id:null,
        name: null,
        cycle: null,
        cycleUnit: null,
        remindDay: null,
        waringDay: null
      },
      deForm:{
        id:null,
        em31id:null,
        step:null,
        project:null,
        method:null,
        standardValue:null,
      },
      rules: {
        name: [{required: true, message: '请输入鉴定名称', trigger: 'blur'}],
        cycle: [{required: true, message: '请输入鉴定周期', trigger: 'blur'}],
        cycleUnit: [{required: true, message: '请输入鉴定周期单位', trigger: 'blur'}],
        remindDay: [{required: true, message: '请选择日期', trigger: 'change' }],
        waringDay: [{required: true, message: '请选择日期', trigger: 'change' }],
        step: [{required: true, message: '请输入步骤', trigger: 'blur'}],
        project: [{required: true, message: '请输入项目', trigger: 'blur'}],
        method: [{required: true, message: '请输入检测方法', trigger: 'blur'}],
        standardValue: [{required: true, message: '请输入标准值', trigger: 'blur'}],
      },
      uploadDialogVisible: false,
      fileList: [],
      detailData: null,
      dialogEquipmentVisible: false,
      mainId: null,
      excelDialogVisible: false,

    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    onQuery() {
      findIntegrityAppraisalList(this.listQuery).then(res => {
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
    addOrUpdate(row) {
      this.dialogMainFormVisible = true;
      this.title = '新增';
      if(row!=null && row.id) {
        this.title = '修改';
        this.mainForm.id = row.id;
        this.mainForm.name = row.name;
        this.mainForm.cycle = row.cycle;
        this.mainForm.cycleUnit = row.cycleUnit;
        this.mainForm.remindDay = row.remindDay;
        this.mainForm.waringDay = row.waringDay;
      }
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        try{
          if (valid) {
            if(formName=='mainForm') {
              addOrUpdateIntegrityAppraisal(this.mainForm).then(res=>{
                if(res.err_code == 10000) {
                  this.$message.success(this.title+"成功！")
                  this.dialogMainFormVisible = false;
                  this.onQuery();
                  this.resetForm();
                } else this.$message.error(res.err_msg)
              })
            }
            if(formName=='deForm') {
              addOrUpdateIntegrityAppraisalDe(this.deForm).then(res=>{
                if(res.err_code == 10000) {
                  this.$message.success(this.title+"成功！")
                  this.dialogDeFormVisible = false;
                  this.onQuery();
                  this.resetForm();
                } else this.$message.error(res.err_msg)
              })
            }
          } else {
            return false;
          }
        }catch(e){
          this.$message.error(this.title+"失败")
        }
      });
    },
    resetForm(){
      this.mainForm.id = null;
      this.mainForm.name = null;
      this.mainForm.cycle = null;
      this.mainForm.cycleUnit = null;
      this.mainForm.remindDay = null;
      this.mainForm.waringDay = null;
      this.deForm.id = null;
      this.deForm.step = null;
      this.deForm.method = null;
      this.deForm.project = null;
      this.deForm.standardValue = null;
    },
    deleteMain(row){
      this.$confirm('此操作将删除该鉴定类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteIntegrityAppraisal({id: row.id}).then(res=>{
          if(res.err_code == 10000) {
            this.$message.success("删除成功！")
            this.onQuery();
          } else this.$message.error(res.err_msg)
        })
      }).catch(() => {
        this.$message({type: 'info',message: '已取消操作'});
      });
    },
    addOrUpdateDe(row,isAdd) {
      this.dialogDeFormVisible = true;
      this.title = '新增';
      if(isAdd) this.deForm.em31id = row.id;
      else {
        this.title = '修改';
        this.deForm.id = row.id;
        this.deForm.em31id = row.em31id;
        this.deForm.step = row.step;
        this.deForm.project = row.project;
        this.deForm.method = row.method;
        this.deForm.standardValue = row.standardValue;
      }
    },
    deleteDe(row){
      this.$confirm('此操作将删除该条鉴定内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteIntegrityAppraisalDe({id: row.id}).then(res=>{
          if(res.err_code == 10000) {
            this.$message.success("删除成功！")
            this.onQuery();
          } else this.$message.error(res.err_msg)
        })
      }).catch(() => {
        this.$message({type: 'info',message: '已取消操作'});
      });
    },
    uploadImages(row){
      this.uploadDialogVisible = true;
      this.detailData = row;
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file) {
      this.fileList.splice(this.fileList.indexOf(file),1);
    },
    submitUpload() {
      if (this.fileList.length > 0) {
        let form = new FormData();
        this.fileList.forEach(item=>{
          form.append("file",item.raw);
        })
        form.append("appid", "mesupload");
        file.uploadMultiple(form).then(res=>{
          if (res.err_code === 10000) {
            imageUpload({id:this.detailData.id,pictures:res.data.map(item=>item.path).toString()}).then(response=>{
              if (response.err_code === 10000) {
                this.$message.success("上传成功！");
                this.uploadDialogVisible = false;
                this.onQuery();
              } else this.$message.error("上传失败"+response.err_msg);
            })
          } else this.$message.error("上传失败"+res.err_msg);
        });
      } else {
        this.$message.error("请选取一张图片！");
      }
    },
    selectEquipment(row) {
      this.dialogEquipmentVisible = true;
      this.mainId = row.id;
    },
    async excelUpload() {
      if (this.fileList.length > 0) {
        let file = new FormData();
        file.append("file", this.fileList[0].raw);
        integrityImport(file).then(res=>{
          if (res.err_code === 10000) {
              this.$message.success("上传成功！");
              this.handleClose();
          } else this.$message.error("上传失败"+res.err_msg)
        })
      } else {
        this.$message.error("请选取一个文件！");
      }
    },
    handleClose() {
      this.fileList = [];
      this.onBtnQuery();
      this.excelDialogVisible = false;
    },
    download(){
      window.location.href = "http://10.16.9.107/reso_mes/设备鉴定.xlsx"
    },
    exportExcel(id, name) {
      $exportExcel(id, name)
    },
  }
}
</script>

<style scoped>
.imgIcon{
  width:30px;
  height:30px;
  border-radius: 3px;
}
.fileCls {
  height: 26px;
  width: 30px;
  position: absolute;
  filter: alpha(opacity = 0);
  -moz-opacity: 0;
  opacity: 0;
  z-index: 110;
  cursor: pointer;
  float: right;
  margin-top: -26px;
  position: relative;
  left: 0;
}
.qrcode{
  height:320px;
}
</style>