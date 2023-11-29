<template>
  <div>
    <el-dialog v-draggable  appendToBody title="鉴定设备" width="70%" :visible.sync="dialogVisible" @close="dialogClose" modal>
      <div class="filter-container searchCon">
        <el-form :inline="true" class="demo-form-inline demo-form-zdy">
          <el-form-item size="mini">
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdate()">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table highlight-current-row
        :data="tableData"
        class="otherCon wp"
        stripe
        style="width: 100%;font-size:0.7rem;"
        row-key="id"
        border
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="name" align="center" label="设备名称" />
        <el-table-column prop="number" align="center" label="设备编号" />
        <el-table-column prop="lastTime" align="center" label="上次鉴定时间" />
        <el-table-column prop="nextTime" align="center" label="下次鉴定时间" />
        <el-table-column prop="remindTime" align="center" label="派工提醒时间" />
        <el-table-column prop="personName" align="center" label="鉴定责任人" />
        <el-table-column header-align="center" align="center" width="120" label="操作">
          <template  #default="scope">
            <el-button-group>
              <el-button size="mini" title="编辑" type="primary" icon="el-icon-edit" @click="addOrUpdate(scope.row,false)" />
              <el-button size="mini" title="删除" type="danger" icon="el-icon-delete" @click="deleteEquipment(scope.row)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--新增/修改鉴定设备弹窗-->
    <el-dialog v-draggable  :close-on-click-modal="false" :title="title" :visible.sync="dialogFormVisible" @close="resetForm()" class="roleDialog">
      <el-form ref="addOrUpdateForm" label-position="right" label-width="110px"  :rules="rules" :model="addOrUpdateForm" >
        <el-form-item size="mini" prop="name" label="设备名称">
          <el-input readonly v-model="addOrUpdateForm.name" style="width: 300px;"><el-button type="primary" size="mini" slot="append" @click="dialogTableEquipmentVisible = true">选择设备</el-button></el-input>
        </el-form-item>
        <el-form-item size="mini" prop="number" label="设备编码">
          <el-input readonly v-model="addOrUpdateForm.number" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item size="mini" prop="nextTime" label="下次鉴定时间">
          <el-date-picker v-model="addOrUpdateForm.nextTime" style="width: 300px;" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
<!--        <el-form-item size="mini" prop="remindTime" label="派工提醒时间">
          <el-date-picker v-model="addOrUpdateForm.remindTime" style="width: 300px;" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item> -->
        <el-form-item size="mini" prop="personLiable" label="鉴定责任人">
          <el-input readonly v-model="addOrUpdateForm.personName" style="width: 300px;"><el-button type="primary" size="mini" slot="append" @click="dialogTablePeopleVisible = true">选择责任人</el-button></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 0;">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('addOrUpdateForm')">保存</el-button>
      </div>
    </el-dialog>

    <!--选择设备-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="设备选择" :visible.sync="dialogTableEquipmentVisible" class="roleDialog800">
      <el-form label-position="right" label-width="110px" :model="listTableEquipmentUpdate" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="设备名称:" prop="name" size="mini">
          <el-input v-model="listTableEquipmentUpdate.name" placeholder="设备名称" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="设备编码:" prop="name" size="mini">
          <el-input v-model="listTableEquipmentUpdate.number" placeholder="设备编码" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="绑定其他配置" size="mini">
          <el-radio-group v-model="listTableEquipmentUpdate.isLinked">
            <el-radio :label="-1">全部</el-radio>
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onEquipmenQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table stripe  highlight-current-row  :data="equipmenData" border class="otherCon wp" :stripe=true style="width: 100%;font-size:0.7rem;" row-key="id">
        <el-table-column type="index" align="center" width="50" />
        <el-table-column prop="number" align="center" label="设备编号" />
        <el-table-column prop="name" align="center" label="设备名称" />
        <el-table-column prop="" align="center" label="操作">
          <template  #default="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="selectEquipment(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="totalEquipment" :page="listTableEquipmentUpdate.pageNum" :limit="listTableEquipmentUpdate.pageSize" class="searchCon" @pagination="getEquipmentList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableEquipmentVisible = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>

    <!--选择人员-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="人员选择" :visible.sync="dialogTablePeopleVisible" class="roleDialog800">
      <el-form label-position="right" label-width="110px" :model="listTablePeopleUpdate" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="员工姓名:" prop="name" size="mini">
          <el-input v-model="listTablePeopleUpdate.name" placeholder="员工姓名" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onPeopleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table stripe  highlight-current-row  :data="userData" border class="otherCon wp" :stripe=true style="width: 100%;font-size:0.7rem;" row-key="id">
        <el-table-column type="index" align="center" width="50" />
        <el-table-column prop="userid" align="center" label="工号" />
        <el-table-column prop="name" align="center" label="用户姓名" />
        <el-table-column prop="gsbmName" align="center" label="归属部门" />
        <el-table-column prop="" align="center" label="操作">
          <template  #default="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="selectUser(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="totalPeople" :page="listTablePeopleUpdate.pg_pagenum" :limit="listTablePeopleUpdate.pg_pagesize" class="searchCon" @pagination="getList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTablePeopleVisible = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findQualificationEquipmentList,addOrUpdateEquipment,deleteEquipment,equipList } from '@/api/em/eqp'
import { getInfoList } from '@/api/em/eqpLedger'
import { getUser } from '@/api/user'
import Pagination from '@/components/Pagination'
export default {
  name: 'qualificationEquipmentDialog',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      dialogVisible: true,
      dialogFormVisible: false,
      title: '',
      addOrUpdateForm: {
        id: null,
        em31id: null,
        name: null,
        number: null,
        lastTime: null,
        nextTime: null,
        remindTime: null,
        personLiable: null,
        personName: null,
      },
      dialogTablePeopleVisible: false,
      userData: [],
      listTablePeopleUpdate: {
        pg_pagesize: 10,
        pg_pagenum: 1,
        name: ''
      },
      totalPeople: 0,
      rules: {
        name: [{required: true, message: '请输入鉴定名称', trigger: 'blur'}],
        number: [{required: true, message: '请输入鉴定周期', trigger: 'blur'}],
        nextTime: [{required: true, message: '请选择日期', trigger: 'change' }],
        // remindTime: [{required: true, message: '请选择日期', trigger: 'change' }],
        personLiable: [{required: true, message: '请选择责任人', trigger: 'blur'}],
      },
      dialogTableEquipmentVisible: false,
      listTableEquipmentUpdate: {
        pageSize: 10,
        pageNum: 1,
        name: null,
        number: null,
        isLimit: false,
        isLinked:0,
        mainId:''
      },
      equipmenData: [],
      totalEquipment: 0,
    }
  },
  props:{
    emId: {
      type: String,
      default: null
    },
  },
  mounted() {
    this.onQuery();
    this.onPeopleQuery();
    this.onEquipmenQuery();
  },
  methods: {
    onQuery() {
      findQualificationEquipmentList({em31Id: this.emId}).then(res => {
        this.tableData = res.data;
      })
    },
    addOrUpdate(row) {
      this.dialogFormVisible = true;
      this.title = '新增';
      this.addOrUpdateForm.em31id = this.emId;
      if(row!=null && row.id) {
        this.title = '修改';
        this.addOrUpdateForm.id = row.id;
        this.addOrUpdateForm.em31Id = row.em31id;
        this.addOrUpdateForm.name = row.name;
        this.addOrUpdateForm.number = row.number;
        this.addOrUpdateForm.lastTime = row.lastTime;
        this.addOrUpdateForm.nextTime = row.nextTime;
        this.addOrUpdateForm.remindTime = row.remindTime;
        this.addOrUpdateForm.personLiable = row.personLiable;
      }
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        try{
          if (valid) {
            addOrUpdateEquipment(this.addOrUpdateForm).then(res=>{
              if(res.err_code == 10000) {
                this.$message.success(this.title+"成功！")
                this.dialogFormVisible = false;
                this.onQuery();
                this.resetForm();
              } else this.$message.error(res.err_msg)
            })
          } else {
            return false;
          }
        }catch(e){
          this.$message.error(this.title+"失败")
        }
      });
    },
    resetForm(){
      this.addOrUpdateForm.id = null;
      this.addOrUpdateForm.em31Id = null;
      this.addOrUpdateForm.name = null;
      this.addOrUpdateForm.number = null;
      this.addOrUpdateForm.lastTime = null;
      this.addOrUpdateForm.nextTime = null;
      this.addOrUpdateForm.remindTime = null;
      this.addOrUpdateForm.personLiable = null;
      this.addOrUpdateForm.personName = null;
    },
    deleteEquipment(row){
      this.$confirm('此操作将删除该鉴定设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteEquipment({id: row.id}).then(res=>{
          if(res.err_code == 10000) {
            this.$message.success("删除成功！")
            this.onQuery();
          } else this.$message.error(res.err_msg)
        })
      }).catch(() => {
        this.$message({type: 'info',message: '已取消操作'});
      });
    },
    dialogClose(){
      this.$emit('close', {})
    },
    onPeopleQuery() {
      this.userData = []
      getUser(this.listTablePeopleUpdate).then(response => {
        this.userData = response.data
        this.totalPeople = response.total_count
      })
    },
    selectUser(row){
      this.dialogTablePeopleVisible = false;
      this.addOrUpdateForm.personLiable = row.id;
      this.addOrUpdateForm.personName = row.name;
    },
    getList(val) {
      this.listTablePeopleUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listTablePeopleUpdate.pg_pagesize = val.limit
      }
      this.onPeopleQuery() // 查询
    },
    onEquipmenQuery() {
      this.equipmenData = []
      this.listTableEquipmentUpdate.mainId = this.emId
      equipList(this.listTableEquipmentUpdate).then(response => {
        this.equipmenData = response.data
        this.totalEquipment = response.total_count
      })
    },
    getEquipmentList(val) {
      this.listTableEquipmentUpdate.pageNum = val.page
      if (val.limit) {
        this.listTableEquipmentUpdate.pageSize = val.limit
      }
      this.onEquipmenQuery() // 查询
    },
    selectEquipment(row){
      this.dialogTableEquipmentVisible = false;
      this.addOrUpdateForm.name = row.name;
      this.addOrUpdateForm.number = row.number;
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
    background-color: #1890ff;
    color: #fff;
  }
</style>
