<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="设备名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="设备名称" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item label="OA流程审批状态"  size="small" >
          <xui-dict-select multiple item-code="OverHaulOaStatus"  size="small"  includeAll v-model="listQuery.oaStatus"
                           style="width:200px;" class="filter-item" :clearable="false"></xui-dict-select>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-upload2" @click="turnToOA()">转OA审批</el-button>
        </el-form-item>
      </el-form>
    </div>

    <table-check-all
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      :check-all-fun="checkAllFun"
      :checkbox-change="checkboxChange"
      @pagination="getList"
      @changeUploadFile="changeUploadFile"
    />

    <!--弹窗新增或修改角色定义-->
    <el-dialog v-draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]"  v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="130px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="设备名称:" prop="eqpName"  size="small">
          <el-input v-model="listUpdate.eqpName" placeholder="请选择设备名称" style="width: 245px;" class="filter-item" disabled />
          <el-button type="primary" @click="onSelectEquip">请选择</el-button>
        </el-form-item>
        <el-form-item label="设备编号:" prop="eqpNumber"  size="small">
          <el-input v-model="listUpdate.eqpNumber" style="width: 245px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="使用部门:" prop="usingDepName"  size="small">
          <el-input v-model="listUpdate.usingDepName" style="width: 245px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="设备现状:" prop="situation" >
          <el-input v-model="listUpdate.situation" type="textarea" :rows="3"  style="width: 245px;" class="filter-item"  />
        </el-form-item>
        <el-form-item label="技术要求:" prop="requirement" >
          <el-input v-model="listUpdate.requirement" type="textarea" :rows="3" style="width: 245px;" class="filter-item"  />
        </el-form-item>
        <el-form-item label="计划开始时间:" prop="planStarttime"  size="small">
          <el-date-picker v-model="listUpdate.planStarttime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="计划开始时间" style="width: 245px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="计划结束时间:" prop="planEndtime"  size="small">
          <el-date-picker v-model="listUpdate.planEndtime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="计划结束时间" style="width: 245px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="实际开始时间:"  size="small">
          <el-date-picker v-model="listUpdate.starttime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="实际开始时间" style="width: 245px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="实际结束时间:"  size="small">
          <el-date-picker v-model="listUpdate.endtime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="实际结束时间" style="width: 245px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="申请提交部门:" prop="subDepName"  size="small">
          <el-input v-model="listUpdate.subDepName" style="width: 245px;" class="filter-item"  disabled/>
          <el-button type="primary" @click="onSelectOrg">请选择</el-button>
        </el-form-item>
        <!--<el-form-item label="大修状态:" prop="status"  size="small">-->
          <!--<el-select v-model="listUpdate.status" placeholder="请选择" style="width: 245px;">-->
            <!--<el-option label="计划" value="0" />-->
            <!--<el-option label="维修中" value="1" />-->
            <!--<el-option label="完成" value="2" />-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData('listUpdate', '添加成功'):updateData('listUpdate', '修改成功')"  size="small">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--选择设备-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="请选择设备"  v-model="dialogEquipFormVisible" class="roleDialog800">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listEquipQuery" class="demo-form-inline demo-form-zdy">
          <el-form-item label="设备名称"  size="small">
            <el-input v-model="listEquipQuery.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item"  size="small" clearable/>
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="el-icon-search" @click="getEquipList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <table-simple
        :heightTable="heightTable"
        :data="tableEquipData"
        :row-header="rowEquipHeader"
        :total="totalEquip"
        :page="listEquipQuery.pg_pagenum"
        :limit="listEquipQuery.pg_pagesize"
        @pagination="getEquipList"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogEquipFormVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog v-draggable  :close-on-click-modal="false" title="请选择组织"  v-model="dialogOrgFormVisible" class="roleDialog800">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listOrgQuery" class="demo-form-inline demo-form-zdy">
          <el-form-item label="组织名称"  size="small">
            <el-input v-model="listOrgQuery.orgName" placeholder="组织名称" style="width: 180px;" class="filter-item"  size="small" clearable/>
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="el-icon-search" @click="getOrgList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <table-simple
        :heightTable="heightTable"
        :data="tableOrgData"
        :row-header="rowOrgHeader"
        :total="totalOrg"
        :page="listOrgQuery.pg_pagenum"
        :limit="listOrgQuery.pg_pagesize"
        @pagination="getOrgList"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogOrgFormVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>
    <apply-overhaul-dialog ref="applyOverhaulDialogRef" @refresh="onQuery"></apply-overhaul-dialog>
  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'
import applyOverhaulDialog from  './emMaintenance_005_children/applyOverhaulDialog'
import TableCheckAll from '@/components/Table/tableCheckAll'

/**
 * 1.大修计划查询
 * 2.大修计划修改添加
 * 3.大修计划删除
 * 4.保养项图示保存
 */
import { getOverHaulTopList, getOverHaulTopUpdate, deleteOverHaulTop, getUploadFileUpdate } from '@/api/em/overHaul'
// 设备查询(所有)
import { getEqpInitList,getOrgInitList } from '@/api/em/eqpCommon'
// 单文件上传操作
import { getSingleUpload } from '@/api/endpoint'
import { $rooturl } from '@/utils/common.js'
export default {
  name: 'Table',
  components: { TableSimple ,applyOverhaulDialog,TableCheckAll},
  data() {
    return {
      heightTable: '300px',
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '', // 设备名称
        oaStatus: []
      },
      listUpdate: { // 弹窗
        eqpId: '', // 大修计划设备id
        eqpName: '', // 大修计划设备名称
        eqpNumber:'',
        situation:'',
        requirement:'',
        subDepName:'',
        subDepId:'',
        usingDepId:'',
        usingDepName:'',
        proClass:'', //项目分类
        planStarttime: '', // 大修计划开始时间
        status: '0',// 大修状态 枚举
        oaStatus:'0'
      },
      tableOrgData:[],
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      // 检验规则
      submitRules: {
        eqpName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        planStarttime: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        planEndtime: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        // starttime: [
        //   { required: true, trigger: 'change', message: '该项为必填项' }
        // ],
        // endtime: [
        //   { required: true, trigger: 'change', message: '该项为必填项' }
        // ],
        status: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      rooturl: '', // 路径
      dialogEquipFormVisible: false, // 选择设备弹窗显示隐藏
      dialogOrgFormVisible:false,
      tableEquipData: [], // 设备表格
      rowEquipHeader: [], // 设备表格表头
      totalEquip: 0, // 设备表格总条数
      totalOrg:0,
      listEquipQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        id:''//
      },
      listOrgQuery:{
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        orgName:''//
      },
      checkboxData:[]
    }
  },
  mounted() {
    $rooturl().then(response =>{
      this.rooturl = response.data
    })
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
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'eqpName',
          align: 'center',
          label: '设备名称'
        },
        {
          prop: 'eqpNumber',
          align: 'center',
          label: '设备编号'
        },
        {
          prop: 'planStarttime',
          align: 'center',
          label: '计划开始时间'
        },
        {
          prop: 'situation',
          align: 'center',
          label: '设备现状'
        },
        {
          prop: 'requirement',
          align: 'center',
          label: '技术要求'
        },
        {
          prop: 'proClass',
          align: 'center',
          label: '项目分类'
        },
        {
          prop: 'planEndtime',
          align: 'center',
          label: '计划结束时间',
          width:140
        },
        {
          prop: 'starttime',
          align: 'center',
          label: '实际开始时间',
          width:140
        },
        {
          prop: 'endtime',
          align: 'center',
          label: '实际结束时间',
          width:140
        },
        {
          prop: 'status',
          align: 'center',
          label: '大修状态',
          width: 75,
          render: (h, params) => {
            var statusHtml = ''
            switch (params.row.status) {
              case 0:
                statusHtml = '计划'
                break
              case 1:
                statusHtml = '维修中'
                break
              case 2:
                statusHtml = '完成'
            }
            return h('div', [
              statusHtml
            ])
          }
        },
        {
          prop: 'oaStatus',
          align: 'center',
          label: '大修OA状态',
          width: 140,
          render: (h, params) => {
            var statusHtml = ''
            switch (params.row.oaStatus) {
              case 0:
                statusHtml = '默认';
                break;
              case 1:
                statusHtml = '计划申请审批'
                break;
              case 2:
                statusHtml = '计划申请通过';
                break;
              case 3:
                statusHtml = '预验收审批';
                break;
              case 4:
                statusHtml = '预验收通过';
                break;
              case 5:
                statusHtml = '二次验收审批';
                break;
              case 6:
                statusHtml = '二次验收通过';
                break;
              case 7:
                statusHtml = '计划申请驳回';
                break;
              case 8:
                statusHtml = '预验收驳回';
                break;
              case 9:
                statusHtml = '二次验收驳回'
                break;
            }
            return h('div', [
              statusHtml
            ])
          }
        },
        // {
        //   prop: 'status',
        //   align: 'center',
        //   label: '大修文档',
        //   width: 75,
        //   render: (h, params) => {
        //     let self=this;
        //     if (params.row.filePath){
        //       return h('el-button', {
        //         props: { type: 'primary', size: 'mini'},
        //         on: {
        //           click: function() {
        //             window.location.href = self.rooturl + params.row.filePath
        //           }
        //         }
        //       }, '查看')
        //     }
        //     return h('i', {
        //       class: 'el-icon-more'
        //     })
        //   }
        // },
        // {
        //   prop: 'upload',
        //   align: 'center',
        //   label: '上传文档',
        //   width: 75
        // },
        // 添加操作按钮
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 140,
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini', icon: 'el-icon-edit' },
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.dialogFormVisible = true
                    self.dialogStatus = 'update'
                    self.listUpdate = { // 弹窗
                      id: params.row.id,
                      eqpId: params.row.eqpId, // 大修计划设备id
                      eqpName: params.row.eqpName, // 大修计划设备名称
                      eqpNumber: params.row.eqpNumber, // 大修计划开始时间
                      situation: params.row.situation, // 大修计划结束时间
                      requirement: params.row.requirement, // 实际开始时间
                      subDepName: params.row.subDepName, // 实际结束时间
                      subDepId: params.row.subDepId, // 实际结束时间
                      usingDepId: params.row.usingDepId, // 实际结束时间
                      usingDepName: params.row.usingDepName, // 实际结束时间
                      proClass: params.row.proClass, // 实际结束时间
                      planStarttime: params.row.planStarttime, // 实际结束时间
                      // status: params.row.status.toString(), // 大修状态 枚举
                      // oaStatus:params.row.oaStatus.toString()
                    }
                  }
                }
              }, ''),
              h('el-button', {
                props: { type: 'danger', size: 'mini', icon: 'el-icon-delete' },
                on: {
                  click: function() {
                    self.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      deleteOverHaulTop({ids: [params.row.id]}).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onQuery() // 查询
                      })
                    }).catch(() => {
                      self.$message({ type: 'info', message: '已取消删除' })
                    })
                  }
                }
              }, ''),
              // h('el-button', {
              //   props: { type: 'primary', size: 'mini', icon: 'el-icon-upload2' },
              //   on: {
              //     click: function() {
              //       self.applyOverhaul(params.row)
              //     }
              //   }
              // }, '转OA审批')
            ])
          }
        }
      ]
      self.onQuery() // 查询
      self.onQueryEquip() // 设备表格表头
      self.onQueryOrg()
    },
    // 设备表格表头
    onQueryEquip() {
      const self = this
      self.rowEquipHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'number',
          align: 'center',
          label: '设备编号'
        },
        {
          prop: 'name',
          align: 'center',
          label: '设备名称'
        },
        {
          prop: 'usingDepName',
          align: 'center',
          label: '使用部门'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 110,
          align: 'center',
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini'},
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.listUpdate.eqpId = params.row.id // 大修计划设备id
                    self.listUpdate.eqpName = params.row.name // 大修计划设备名称
                    self.listUpdate.eqpNumber = params.row.number // 大修计划设备编号
                    self.listUpdate.usingDepName = params.row.usingDepName
                    self.dialogEquipFormVisible = false
                  }
                }
              }, '确认选择')
            ])
          }
        }
      ]
    },
    // 设备表格表头
    onQueryOrg() {
      const self = this
      self.rowOrgHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'v',
          align: 'center',
          label: '部门名'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 110,
          align: 'center',
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini'},
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.listUpdate.subDepId = params.row.k // 大修计划设备id
                    self.listUpdate.subDepName = params.row.v // 大修计划设备名称
                    self.dialogOrgFormVisible = false
                  }
                }
              }, '确认选择')
            ])
          }
        }
      ]
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getOverHaulTopList(this.getParams()).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    getParams() {
      let status = this.listQuery.oaStatus;
      let intStatus = [];
      status.forEach(item=>{
        intStatus.push(parseInt(item))
      })
      // let intStatus2 = [];
      // this.listQuery.statusModel.forEach(item=>{
      //   intStatus2.push(parseInt(item))
      // })
      return {
        eqpName:this.listQuery.name,
        oaStatusList: intStatus,
        status:[0],
        pageNum: this.listQuery.pg_pagenum,
        pageSize: this.listQuery.pg_pagesize,
      }
    },
    // 分页数据发生变化
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },
    // 添加 角色新增与编辑的保存操作
    onAdd() {
      this.clearData() // 清空添加的数据
      this.listUpdate.subDepId = this.$store.state.my.roleslogin.roles[0].deptId;
      this.listUpdate.subDepName = this.$store.state.my.roleslogin.roles[0].deptName;
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        eqpId: '', // 大修计划设备id
        eqpName: '', // 大修计划设备名称
        eqpNumber:'',
        situation:'',
        requirement:'',
        subDepName:'',
        subDepId:'',
        usingDepId:'',
        usingDepName:'',
        proClass:'', //项目分类
        planStarttime: '', // 大修计划开始时间
        status: '0',// 大修状态 枚举
        oaStatus:'0'
      }
    },
    // 角色新增保存数据
    createData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    // 角色修改保存数据
    updateData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    saveData(listUpdate, message) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.listUpdate }
          console.log(req,this.listUpdate)
          getOverHaulTopUpdate(req).then(response => {
            this.dialogFormVisible = false
            this.$message({ message: message, type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 选择设备
    onSelectEquip() {
      this.onEquipQuery() // 查询设备
      this.dialogEquipFormVisible = true
    },
    onSelectOrg(){
      this.onOrgQuery()
      this.dialogOrgFormVisible = true
    },
    // 查询设备
    onEquipQuery() {
      this.tableEquipData = []
      getEqpInitList(this.listEquipQuery).then(response => {
        this.tableEquipData = response.data
        this.totalEquip = response.total_count
      })
    },
    // 查询设备
    onOrgQuery() {
      this.tableOrgData = []
      getOrgInitList(this.listOrgQuery).then(response => {
        this.tableOrgData = response.data
        this.totalOrg = response.total_count
      })
    },
    getOrgList(val){
      this.listOrgQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listOrgQuery.pg_pagesize = val.limit
      }
      this.onOrgQuery() // 查询
    },
    getEquipList(val) {
      this.listEquipQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listEquipQuery.pg_pagesize = val.limit
      }
      this.onEquipQuery() // 查询
    },
    checkAllFun(checkAllVal) {
      if (checkAllVal && checkAllVal.length > 0) {
        this.checkboxData = checkAllVal
      } else {
        this.checkboxData = []
      }
    },
    checkboxChange(event, item) {
      console.log(event, item)
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
    getSelectedData(){
      let legalStatus = ['0','7'], desc = '默认或计划申请驳回';
      return new Promise((resolve, reject)=>{
        let selectedData = this.checkboxData
        if(!selectedData || selectedData.length === 0){
          this.$message({ message: '请选择要处理的数据', type: 'warning' })
          return resolve([]);
        }
        //刷选出符合条件的数据和错误的数据
        let rightData = [], errorData= [];
        selectedData.forEach(item=>{
          if(legalStatus.indexOf(item.oaStatus.toString())>=0){
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
    // 上传文档
    changeUploadFile(val) {
      const e = val.e
      const row = val.row
      const file = e.target.files[0]
      const param = new FormData()  // 创建form对象
      param.append('file', file)  // 通过append向form对象添加数据
      param.append('appid', 'mesupload') // 添加form表单中其他数据
      // 上传图标
      getSingleUpload(param).then(response => {
        // 点检项图示更新 id:上传的大修计划id  filePath:文件上传后地址
        getUploadFileUpdate({ id: row.id, filePath: response.path}).then(responseUp => {
          this.$message({ message: '更新成功', type: 'success' })
          this.onQuery()
        })
      })
    },
    // applyOverhaul(row){
    //   this.$refs.applyOverhaulDialogRef.init(row)
    // },
    turnToOA(){
      this.getSelectedData().then(selectedData=>{
        if(selectedData.length === 0){
          return;
        }
        this.$refs.applyOverhaulDialogRef.init(selectedData)
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}
</style>

