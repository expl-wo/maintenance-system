<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy ">
        <el-form-item label="设备编号：" v-if="needShow"  size="small">
          <el-input v-model="searchParam.eqpId" placeholder="设备编号" style="width: 180px;" class="filter-item"  size="small"
                    clearable />
        </el-form-item>
        <el-form-item label="设备名称：" v-if="needShow"  size="small">
          <el-input v-model="searchParam.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item"  size="small"
                    clearable />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-search" @click="loadData()">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-plus" @click="onAdd()">新增</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onExport"><svg-icon icon-class="qrcode" /> 导出</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-upload2" @click="uploadDialogVisible = true">导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表组件 -->
    <el-table stripe  highlight-current-row  :data="tableData"
              border width="90%" height="90%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column label="序号" type="index" :width="50"></el-table-column>
      <el-table-column label="设备名称及型号规格" prop="eqpName"></el-table-column>
      <el-table-column label="制造厂家" prop="manufacturer"></el-table-column>
      <el-table-column label="购买年月" prop="purchaseDate"></el-table-column>
      <el-table-column label="启用年月" prop="purchaseDate"></el-table-column>
      <el-table-column label="设备编号" prop="eqpId"></el-table-column>
      <el-table-column label="使用部门" prop="departmentName">
      </el-table-column>
      <el-table-column label="安装地点" prop="location"></el-table-column>
      <el-table-column label="在用" prop="inUse">
        <template  #default="scope">
          <el-tag type="danger" v-if="scope.row.inUse ==0 ">否</el-tag>
          <el-tag v-else-if="scope.row.inUse ==1 ">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="检测日期" prop="plannedInspectDate"></el-table-column>
      <el-table-column label="下次检测日期" prop="nextInspectDate"></el-table-column>
      <el-table-column label="检测周期" prop="inspectCycle"></el-table-column>
      <el-table-column label="检测周期单位" prop="inspectCycleUnit">
        <template  #default="scope">
          <el-tag v-if="scope.row.inspectCycleUnit ==0 ">天</el-tag>
          <el-tag v-else-if="scope.row.inspectCycleUnit ==1 ">月</el-tag>
          <el-tag v-else-if="scope.row.inspectCycleUnit ==2 ">年</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提前提醒周期(天)" prop="remindCycle"></el-table-column>
      <el-table-column label="提前提醒日期" prop="remindDate"></el-table-column>
      <el-table-column label="提醒人" prop="remindPersonName"></el-table-column>
      <el-table-column label="查看">
        <template  #default="scope">
            <el-button type="text"  size="small" @click="showFile(scope.row)">技术文件</el-button>
            <el-button type="text"  size="small" @click="showPicture(scope.row)">图片</el-button>
            <el-button type="text"  size="small" @click="showInspectionPlanFile(scope.row)">检测记录</el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark">

      </el-table-column>
      <!-- ...其他列 -->
      <el-table-column label="操作">
        <template  #default="scope">
          <el-button type="primary"  size="small" @click="onEdit(scope.row)">编辑</el-button>
          <el-button type="danger"  size="small" @click="onDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page="pageNum" :limit="pageSize" :page-sizes="[10, 20, 30, 50,100,200]" @pagination="handlePagination" class="searchCon wp"/>

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

    <!-- 新增/编辑模态框组件 -->
    <el-dialog :visible="dialogVisible" title="新增/编辑" @close="dialogVisible=false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" label-position="right" :rules="submitRules"  :model="form" label-width="180px">
        <el-form-item prop="eqpName" label="设备名称及型号规格:"  size="small">
          <el-input v-model="form.eqpName" style="width: 250px;" class="filter-item" ></el-input>
          <el-button  size="small" type="primary" style="width: 80px;" @click="onSelectEquip">选择设备</el-button>
        </el-form-item>
        <el-form-item prop="manufacturer" label="制造厂家:"  size="small">
          <el-input v-model="form.manufacturer" style="width: 250px;" class="filter-item" ></el-input>
        </el-form-item>
        <el-form-item prop="purchaseDate" label="购买年月:"  size="small">
          <el-date-picker
                v-model="form.purchaseDate"
                style="width: 250px;"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
        </el-form-item>
        <el-form-item prop="startDate" label="启用年月:"  size="small">
          <el-date-picker
                v-model="form.startDate"
                style="width: 250px;"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
        </el-form-item>
        <el-form-item prop="departmentName" label="使用部门:"  size="small">
          <el-select v-model="form.departmentName"  @change="departmentChange($event)" filterable placeholder="使用部门" style="width: 250px;" class="filter-item">
            <el-option v-for="item in departments" :value="item" :key="item.k" :label="item.v"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="location" label="安装地点:"  size="small">
          <el-input v-model="form.location" style="width: 250px;" class="filter-item" ></el-input>
        </el-form-item>
        <el-form-item prop="inUse" label="是否在用:"  size="small">
          <el-radio-group v-model="form.inUse">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="plannedInspectDate" label="上次检测日期:"  size="small">
          <el-date-picker
                v-model="form.plannedInspectDate"
                style="width: 250px;"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
        </el-form-item>
        <el-form-item prop="inspectCycle" label="检测周期:"  size="small">
          <el-input-number :controls="false" :min="1" v-model="form.inspectCycle" style="width: 250px;" class="filter-item" ></el-input-number>
        </el-form-item>
        <el-form-item prop="inspectCycleUnit" label="检测周期单位:"  size="small">
          <el-radio-group v-model="form.inspectCycleUnit">
            <el-radio :label="0">天</el-radio>
            <el-radio :label="1">月</el-radio>
            <el-radio :label="2">年</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="remindCycle" label="提前提醒周期(天 ):"  size="small">
          <el-input-number :controls="false" :min="0" v-model="form.remindCycle" style="width: 250px;" class="filter-item" ></el-input-number>
        </el-form-item>
        <el-form-item prop="remindPersonName" label="提醒人:"  size="small">
          <el-input  v-model="form.remindPersonName" placeholder="提醒人" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" style="width: 80px;" @click="onSelectCheck">选择提醒人</el-button>
        </el-form-item>
        <el-form-item label="备注:"  size="small">
          <el-input v-model="form.remark" style="width: 250px;" class="filter-item" ></el-input>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogVisible = false">取消</el-button>
        <el-button  size="small" type="primary" @click="onSubmit('')">提交</el-button>
      </div>
    </el-dialog>
    <!--选择人员-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="选择负责人"  v-model="dialogPeopleFormVisible"  class="roleDialog800">
      <div class="filter-container">
        <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
          <el-form-item label="" prop="name"  size="small">
            <el-input v-model="listPeopleQuery.name" placeholder="用户姓名" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.userid" placeholder="员工编号" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="el-icon-search" @click="onPeopleQuery">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe  highlight-current-row  :data="peopleData"
          border style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          @selection-change="selectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column width="70px" type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="员工姓名"></el-table-column>
          <el-table-column prop="userid" label="员工编号"></el-table-column>
          <el-table-column prop ="gsbmName" label="归属部门"></el-table-column>
      </el-table>
       <pagination :total="totalPeople" :page="listPeopleQuery.pg_pagenum" :limit="listPeopleQuery.pg_pagesize" class="searchCon" @pagination="onPeopleQuery" />
      <div   class="dialog-footer">
        <el-button @click="dialogPeopleFormVisible = false"  size="small">关 闭</el-button>
        <el-button @click="checkPeople()"  size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看文件或图片-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="查看"  v-model="dialogFileFormVisible" class="roleDialog">
      <span style = "width: 150px">
        <el-button style="margin-left: -20px;"  size="small" type="primary" class="el-icon-upload" ></el-button>
        <input name="file" type="file" class="fileCls"  @change="changeUploadFile($event, currentRow)"/>
      </span>

       <table-simple
         :height-table="heightTable"
         :data="tableFileData"
         :row-header="roweFileHeader"
         :total="totalFile"
         :hide-page="true"
       />
       <div   class="dialog-footer">
         <el-button  size="small" @click="dialogFileFormVisible = false;this.isInspectionFile=false">关闭</el-button>
       </div>
     </el-dialog>
    <!--选择设备-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="选择设备"  v-model="dialogEquipFormVisible" :append-to-body="true" class="roleDialog800">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listEquipQuery" class="demo-form-inline demo-form-zdy">
          <el-form-item label="设备编号"  size="small">
            <el-input v-model="listEquipQuery.eqpId" placeholder="设备编号" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="设备名称"  size="small">
            <el-input v-model="listEquipQuery.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="el-icon-search" @click="onBtnEqpQuery">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tree
        ref="dataTreeNo"
        class="otherCon wp"
        :data="equipData"
        :props="props"
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        style=" height: 350px; overflow: scroll;"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogEquipFormVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getPicUpdate,
    getFileUpdate,
    getFileList,
    deleteFile,
    getPicList,
    deletePic
  } from '@/api/em/eqpLedger'
import { plan, queryTreeEqp, addOrUpdate, deleteData, eqpInfo ,importPlan,getInspectionFileList,getInspectionUpdate,deleteInspectionFile } from '@/api/em/inspectionPlan.js'
import Pagination from '@/components/Pagination'
import { getUser } from '@/api/user'
import { finEqpDep } from '@/api/em/eqpLedger'
import { $rooturl, $confirm } from '@/utils/common.js'
import TableSimple from '@/components/Table/index'
import { getSingleUpload } from '@/api/endpoint'
export default {
  props: {
    eqpId: {
      required: true,
      type: String
    },
    needShow: {
      type: Boolean,
      default: true
    }
  },
  components: {Pagination,TableSimple},
  data() {
    return {
      tableData: [], // 表格数据
      dialogVisible: false, // 模态框是否可见
      form: {}, // 新增/编辑表单数据
      props: {
        value: 'id',
        label: 'name',
        children: 'sub'
      },
      rooturl:'',
      heightTable: '300px',
      uploadDialogVisible:false,
      submitRules: {
        eqpName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        departmentName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        plannedInspectDate: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        inspectCycle: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        inspectCycleUnit: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        remindPersonName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        remindCycle: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      selectPeople:[],
      roweFileHeader:[],
      totalFile: 0,
      tableFileData:[],
      fileList: [],
      dialogFileFormVisible:false,
      currentRow: {},
      totalPeople: 0,
      equipData:[],
      peopleData:[],
      departments:[],
      isInspectionFile:false,
      dialogEquipFormVisible : false,
      dialogPeopleFormVisible: false,
      listPeopleQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        name: '', // 模糊匹配，用户姓名
        userid: '', // 模糊匹配，员工编号
        gsbmName: '', // 模糊匹配，归属部门名称
      },
      listEquipQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        eqpName: '', // 设备名称
        id:''
      },
      editRowIndex: -1, // 当前编辑的行的索引,
      searchParam:{
        eqpId:'',
        eqpName:''
      },
      total: 0,
      pageNum: 1,
      pageSize: 10,
    }
  },

  mounted() {
    $rooturl().then(response => {
      this.rooturl = response.data
    })
    this.searchParam.eqpId = this.eqpId
    // 获取列表数据
    this.loadData()
    this.formInit()
    this.getEqpDpt()
  },
  methods: {
    handlePagination({ page, limit }) {
      this.pageNum = page
      this.pageSize = limit
      this.loadData()
    },
    loadData() {
      plan({eqpId:this.searchParam.eqpId,eqpName:this.searchParam.eqpName,pageSize:this.pageSize,pageNum:this.pageNum}).then(res => {
        if (res.err_code == 10000) {
          this.total = res.total_count
          this.tableData = res.data
        }
      }).catch(err => {
          console.error(err)
      })
    },
    showFile(row){
      this.onFileload()
      this.onFileQuery(row)
      this.dialogFileFormVisible = true
    },
    showPicture(row){
      this.onPictureload()
      this.onPictureQuery(row)
      this.dialogFileFormVisible = true
    },
    showInspectionPlanFile(row){
      this.onInspectionFileload()
      this.onInspectionFileQuery(row)
      this.isInspectionFile=true,
      this.dialogFileFormVisible = true
    },
    onInspectionFileload(){
      const self = this
      self.roweFileHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'updateTime',
          align: 'center',
          label: '上传时间'
        },
        {
          prop: 'fileName',
          align: 'center',
          label: '文件名称'
        },
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 120,
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini' },
                on: {
                  click: function() {
                    window.location.href = self.rooturl + params.row.filePath
                  }
                }
              }, '查看'),
              h('el-button', {
                props: { type: 'danger', size: 'mini', icon: 'el-icon-delete' },
                on: {
                  click: function() {
                    $confirm('确定删除, 是否继续?', '取消').then(response => {
                      deleteInspectionFile({ id: params.row.id }).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onInspectionFileQuery(self.currentRow)
                      })
                    })
                  }
                }
              }, '')

            ])
          }
        }
      ]
    },
    onFileload() {
      const self = this
      self.roweFileHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'fileName',
          align: 'center',
          label: '文件名称'
        },
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 120,
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini' },
                on: {
                  click: function() {
                    window.location.href = self.rooturl + params.row.filePath
                  }
                }
              }, '查看'),
              h('el-button', {
                props: { type: 'danger', size: 'mini', icon: 'el-icon-delete' },
                on: {
                  click: function() {
                    $confirm('确定删除, 是否继续?', '取消').then(response => {
                      deleteFile({ id: params.row.id }).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onFileQuery(self.currentRow)
                      })
                    })
                  }
                }
              }, '')

            ])
          }
        }
      ]
    },
    onPictureload() {
      this.previewList = []
      const self = this
      self.roweFileHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'picPath',
          align: 'center',
          label: '图片',
          render: (h, params) => {
            return h('el-image', {
              style: 'width: 100%; height: 50px',
              props: { src: params.row.picPath, 'preview-src-list': [params.row.picPath] }
            })
          }
        },
        {
          prop: 'picDesc',
          align: 'center',
          label: '图片描述'
        },
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 80,
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'danger', size: 'mini', icon: 'el-icon-delete' },
                on: {
                  click: function() {
                    $confirm('确定删除, 是否继续?', '取消').then(response => {
                      deletePic({ id: params.row.id }).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onPictureQuery(self.currentRow)
                      })
                    })
                  }
                }
              }, '')

            ])
          }
        }
      ]
    },
    onFileQuery(row) {
      this.currentRow = row
      this.tableFileData = []
      getFileList({ id: row.eqpId }).then(response => {
        this.tableFileData = response.data
      })
    },
    onPictureQuery(row) {
      this.currentRow = row
      this.tableFileData = []
      getPicList({ id: row.eqpId }).then(response => {
        const rData = response.data
        for (let i = 0; i < rData.length; i++) {
          rData[i].picPath = this.rooturl + rData[i].picPath
        }
        this.tableFileData = rData
      })
    },
    onInspectionFileQuery(row) {
      this.currentRow = row
      this.tableFileData = []
      getInspectionFileList({ id: row.eqpId }).then(response => {
        const rData = response.data
        for (let i = 0; i < rData.length; i++) {
          rData[i].picPath = this.rooturl + rData[i].picPath
        }
        this.tableFileData = rData
      })
    },
    handleChange(file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
    },
    handleRemove() {
      this.fileList = [];
    },
    // 上传文档
    changeUploadFile(e,row) {
      // const e = val.e
      // const row = val.row
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      param.append('appid', 'mesupload') // 添加form表单中其他数据
      // 上传图标
      this.$prompt('请输入文件描述：', '上传文件内容描述', { confirmButtonText: '确定',
        inputPattern: /^.{1,}$/,
        closeOnClickModal: false,
        type: 'info' }).then(value => {
        getSingleUpload(param).then(response => {
          const path = response.path
          const index = path.lastIndexOf('.')
          const pathNew = path.substring(index + 1, path.length).toLowerCase()
          const picname = 'jpeg|jpg|png|bmp|gif|'
          if (picname.indexOf(pathNew) > -1) {

            getPicUpdate({ eqpId: row.eqpId, picPath: response.path, picDesc: value.value }).then(responseUp => {
              this.$message({ message: '更新成功', type: 'success' })
              this.loadData()
            })
          } else {
            if ( this.isInspectionFile == true) {
              getInspectionUpdate({ eqpId: row.eqpId, filePath: response.path, fileName: value.value }).then(responseUp => {
                this.$message({ message: '更新成功', type: 'success' })
                this.loadData()
              })
            } else{
              getFileUpdate({ eqpId: row.eqpId, filePath: response.path, fileName: value.value }).then(responseUp => {
                this.$message({ message: '更新成功', type: 'success' })
                this.loadData()
              })
            }

          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    selectionChange(val){
      this.selectPeople=val
    },
    departmentChange(value){
      this.form.departmentId=value.k
      this.form.departmentName=value.v
    },
    getEqpDpt() {
      finEqpDep().then(res=>{
        this.departments = res.data
      })
    },
    formInit(){
      this.form = {
        id: null,
        eqpName: null,
        manufacturer: null,
        purchaseDate: '',
        startDate: '',
        eqpId:'',
        departmentId:'',
        departmentName:'',
        location:'',
        inUse: 1,
        plannedInspectDate:null,
        inspectCycle:'',
        inspectCycleUnit: 0,
        remindCycle:null,
        remark:'',
        remindPersonId:'',
        remindPersonName:'',
      }
    },
    onBtnEqpQuery(){
      this.equipData = []
      queryTreeEqp(this.listEquipQuery).then(res=>{
        this.equipData = res.data
      })
    },
    onPeopleQuery(val){
      if(val){
        this.listPeopleQuery.pg_pagenum = val.page
        if (val.limit) {
          this.listPeopleQuery.pg_pagesize = val.limit
        }
      }

      this.peopleData = []
      getUser(this.listPeopleQuery).then(response => {
        this.peopleData = response.data
        this.totalPeople = response.total_count
      })
    },
    onSelectEquip(){
      this.dialogEquipFormVisible = true
      this.onBtnEqpQuery()
    },
    onSelectCheck(){
      this.dialogPeopleFormVisible= true
      this.onPeopleQuery()
    },
    handleNodeClick(data) {
      if (data.sub ==null) {
        this.$confirm('确定选择设备'+data.name+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          eqpInfo({id:data.id}).then(res=>{
            var eqpData = res.data
            this.form.eqpName=eqpData.name,
            this.form.manufacturer=eqpData.manufactor,
            this.form.purchaseDate= eqpData.purchaseDate,
            this.form.startDate= eqpData.enableDate,
            this.form.eqpId=eqpData.id,
            this.form.departmentId=eqpData.usingDepId,
            this.departments.forEach(item=>{
              if(this.form.departmentId === item.k){
                this.form.departmentName = item.v
              }
            })
            this.form.location=eqpData.installSite,
            this.form.inUse= eqpData.status
            this.dialogEquipFormVisible = false
          })
        })
      }
    },
    peopleClick(data){
      this.form.remindPersonId=data.userid
      this.form.remindPersonName=data.name
      this.dialogPeopleFormVisible = false
    },
    onAdd(){
      this.formInit()
      this.dialogVisible = true // 显示模态框
    },
    // 点击编辑按钮触发
    onEdit(row) {
      this.form = { ...row } // 将当前行数据赋值给表单
      this.editRowIndex = this.tableData.indexOf(row) // 记录当前行的索引
      this.dialogVisible = true // 显示模态框
    },
    // 提交表单数据
    onSubmit() {
      this.$refs.form.validate((valid) =>{
        if(valid) {
        addOrUpdate(this.form).then(res => {
          if(res.err_code === 10000){
            this.$message.success("保存成功");
            this.dialogVisible = false
            this.loadData()
          }else{
            this.$message.error("保存失败");
          }
        })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    onExport() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/inspectionPlanExport?eqpNumber='+this.searchParam.eqpId+'&eqpName='+this.searchParam.eqpName
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
    handleClose() {
      this.fileList = [];
      this.onBtnQuery();
      this.uploadDialogVisible = false;
    },
    checkPeople(){

      this.form.remindPersonId=''
      this.form.remindPersonName=''
      var ids = []
      var names = []
      this.selectPeople.forEach( item =>{
        ids.push(item.userid)
        names.push(item.name)
      })
      this.form.remindPersonId= ids.join(",")
      this.form.remindPersonName= names.join(",")
      console.log(this.selectPeople);
      console.log(this.form );
      this.dialogPeopleFormVisible = false
    },
    // 点击删除按钮触发
    onDelete(row) {
      deleteData({ id: row.id }).then(res =>{
        if(res.err_code === 10000){
          this.$message.success("删除成功");
          this.loadData()
        }else{
          this.$message.error("删除失败");
        }
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
.fileCls {
  height: 26px;
  width: 30px;
  position: absolute;
  filter: alpha(opacity = 0);
 -moz-opacity: 0;
  opacity: 0;
  z-index: 110;
  cursor: pointer;
  float: left;
  /* margin-top: -26px; */
  position: relative;
  left: 10px;
}

</style>

